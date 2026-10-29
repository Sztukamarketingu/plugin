import { expect, mock, test } from 'claude-code/testing'

const ROOT = '/firma'
const PASEK = {
  plugin: 'pulpit-firmy',
  component: 'AbovePrompt',
  props: { hasSurvey: false, isWorking: false, maxRows: 3, bodyColumns: 100, scroll: { offset: 0, bodyRows: 3 }, view: {} },
} as const
const PANEL = {
  plugin: 'pulpit-firmy',
  component: 'Pane',
  requestId: 'pulpit-firmy',
  props: { title: 'Pulpit firmy', isFocused: false, bodyColumns: 50, placement: 'dock', scroll: { offset: 0, bodyRows: 40 }, view: {} },
} as const

const POSTEP_6 = {
  firma: 'Na walizkach',
  pliki: { firma: 'gotowy', konkurencja: 'gotowy', 'liczby-firmy': 'szkic', 'klient-i-pozycjonowanie': 'gotowy', strategia: 'gotowy', eksperymenty: 'gotowy', cele: 'gotowy' },
}
const POSTEP_12 = {
  firma: 'Na walizkach',
  pliki: Object.fromEntries(['firma', 'konkurencja', 'liczby-firmy', 'klient-i-pozycjonowanie', 'strategia', 'eksperymenty', 'cele', 'oferta-i-dowody', 'glos-marki', 'plan-marketingowy', 'CLAUDE', 'dokument-strategiczny'].map(k => [k, 'gotowy'])),
}
const PULPIT = {
  pokazuj: ['cel', 'liczby', 'reklamy', 'zadania', 'rytm'],
  cel: { nazwa: 'Nowi klienci', od: 30, do: 50, teraz: 38, start: '2026-10-01', termin: '2026-12-31' },
  kafelki: {
    liczby: [{ nazwa: 'Oferty otwarte', wartosc: '7', opis: 'za 48 tys. zł' }],
    reklamy: [{ nazwa: 'Koszt zapytania', wartosc: '41 zł' }],
    marketing: [{ nazwa: 'Nie pokazuj mnie', wartosc: '1' }],
  },
  zadania: [
    { tytul: 'Oferta dla hotelu Pod Lipami', kropka: 'po_terminie' },
    { tytul: 'Porządek w fakturach', kropka: 'odloz' },
  ],
  zrodlo_zadan: 'ClickUp',
}

// Świat pod modem: pliki w pamięci, folder sesji, zegar 2.11.2026, pole wpisywania zapamiętuje polecenie.
// Folder sesji, który zwraca session.root; test może go zmienić (aplikacja: jedna kopia moda dla wielu sesji).
let korzen = ROOT
const otwarte: string[] = []
function swiat(on: any, pliki: Record<string, string>, katalogi: Record<string, { name: string; kind: string }[]> = {}) {
  const wpisane: string[] = []
  korzen = ROOT
  otwarte.length = 0
  mock.clock(on, { now: Date.UTC(2026, 10, 2, 9, 40) })
  on('session.start', () => ({ cwd: ROOT }))
  on('session.root', () => ({ value: korzen }))
  on('fs.exists', ($: any, e: any) => ({ value: e.path in pliki || e.path in katalogi }))
  on('fs.read', ($: any, e: any) => ({ value: pliki[e.path] ?? '' }))
  on('fs.list', ($: any, e: any) => ({ value: (katalogi[e.path] ?? []).map(x => ({ ...x, size: 1, mtimeMs: 0, isLink: false })) }))
  on('command.register', () => ({ value: { command: 'pulpit-firmy' } }))
  on('ui.open', ($: any, e: any) => {
    otwarte.push(e.id)
    return { value: { isPlaced: true } }
  })
  on('prompt.fill', ($: any, e: any) => {
    wpisane.push(e.text)
    return { isFilled: true }
  })
  return wpisane
}
const start = ($: any) => $.session.start({ cwd: ROOT, surface: 'desktop', isInteractive: true })

test('w trakcie strategii pasek pokazuje 6 z 12 i następny element; „Dalej” wpisuje polecenie dla Stratega', async ($, on) => {
  const wpisane = swiat(on, { [`${ROOT}/.postep.json`]: JSON.stringify(POSTEP_6) })
  await start($)
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...PASEK, surface })
    expect((await ui.find({ type: 'Text', text: /6 z 12/ }))?.text).toBe('6 z 12')
    expect((await ui.find({ type: 'Text', text: /następny/ }))?.text).toContain('Liczby firmy (szkic)')
    await ui.press({ key: 'dalej' })
    await ui.unmount()
  }
  expect(wpisane[0]).toBe('/strateg zajmijmy się elementem „Liczby firmy”')
})

test('panel w trybie strategii: 12 elementów, kliknięcie elementu wpisuje polecenie', async ($, on) => {
  const wpisane = swiat(on, { [`${ROOT}/.postep.json`]: JSON.stringify(POSTEP_6) })
  await start($)
  const ui = await $.ui.mount({ ...PANEL, surface: 'desktop' })
  expect((await ui.find({ type: 'Text', text: /Strategia firmy/ }))?.text).toBe('Strategia firmy: 6 z 12')
  await ui.press({ key: 'dokument-strategiczny' })
  await ui.press({ key: 'firma' })
  expect(wpisane).toEqual([
    '/strateg zajmijmy się elementem „Dokument strategiczny”',
    '/strateg pokaż, co mamy w „Opis firmy”, i czy coś wymaga aktualizacji',
  ])
  await ui.unmount()
})

test('strategia 12 z 12 bez .pulpit.json: pasek proponuje wybór danych', async ($, on) => {
  const wpisane = swiat(on, { [`${ROOT}/.postep.json`]: JSON.stringify(POSTEP_12) })
  await start($)
  const ui = await $.ui.mount({ ...PASEK, surface: 'terminal' })
  expect((await ui.find({ type: 'Text', text: /12 z 12/ }))?.text).toBe('12 z 12')
  await ui.press({ key: 'wybierz' })
  expect(wpisane[0]).toContain('/pulpit')
  await ui.unmount()
})

test('tryb danych: cel z tempem, tylko wybrane grupy kafelków, zadania i rytm', async ($, on) => {
  const wpisane = swiat(
    on,
    { [`${ROOT}/.postep.json`]: JSON.stringify(POSTEP_12), [`${ROOT}/.pulpit.json`]: JSON.stringify(PULPIT) },
    { [`${ROOT}/raporty`]: [{ name: 'brief-2026-11-02-ola.md', kind: 'file' }], [`${ROOT}/warsztat/wejscie`]: [{ name: 'ola', kind: 'dir' }], [`${ROOT}/warsztat/wejscie/ola`]: [{ name: 'a.md', kind: 'file' }, { name: 'b.md', kind: 'file' }] },
  )
  await start($)
  // 2.11 to 34% drogi od 1.10 do 31.12 → plan 37, jest 38: w tempie
  const pasek = await $.ui.mount({ ...PASEK, surface: 'terminal' })
  expect((await pasek.find({ type: 'Text', text: /tempo/ }))?.text).toBe('Nowi klienci: 30 → 50 do 31.12 · 38 (tempo +1)')
  expect((await pasek.find({ type: 'Text', text: /po terminie/ }))?.text).toBe(' · po terminie 1')
  expect((await pasek.find({ type: 'Text', text: /skrzynka/ }))?.text).toBe(' · skrzynka 2')
  await pasek.unmount()

  const ui = await $.ui.mount({ ...PANEL, surface: 'desktop' })
  expect(await ui.find({ type: 'Text', text: /Plan na dziś: 37/ })).toBeDefined()
  expect(await ui.find({ key: 'k0' })).toBeDefined()
  expect(await ui.find({ key: 'k1' })).toBeDefined()
  expect(await ui.find({ key: 'k2' })).toBeUndefined() // marketing nie jest w „pokazuj”
  expect(await ui.find({ key: 'z1' })).toBeUndefined() // „do odłożenia” to tekst, nie przycisk
  expect((await ui.find({ type: 'Text', text: /Brief dziś/ }))?.text).toBe('Brief dziś ✓ · sprawozdanie — · skrzynka 2')
  await ui.press({ key: 'z0' })
  await ui.press({ key: 'k1' })
  await ui.press({ key: 'wieczor' })
  expect(wpisane).toEqual([
    'Zajmijmy się zadaniem „Oferta dla hotelu Pod Lipami”. Weź kontekst z plików firmy.',
    'Rozłóż mi „Koszt zapytania” (41 zł): skąd ta liczba, co się zmieniło i co z tym zrobić. Weź dane z plików firmy.',
    '/wieczor',
  ])
  await ui.unmount()
})

test('poza folderem firmy mod nic nie rysuje', async ($, on) => {
  swiat(on, {})
  on('ui.render', ($: any, e: any) => {
    const { Text } = $.ui.resolve(e)
    return <Text>silnik</Text>
  })
  await start($)
  const ui = await $.ui.mount({ ...PASEK, surface: 'terminal' })
  expect((await ui.find({ type: 'Text' }))?.text).toBe('silnik')
  await ui.unmount()
})

test('uszkodzony .pulpit.json: zostaje tryb strategii i komunikat zamiast błędu', async ($, on) => {
  swiat(on, { [`${ROOT}/.postep.json`]: JSON.stringify(POSTEP_12), [`${ROOT}/.pulpit.json`]: '{ zepsuty' })
  await start($)
  const ui = await $.ui.mount({ ...PANEL, surface: 'desktop' })
  expect((await ui.find({ type: 'Text', text: /\.pulpit\.json/ }))?.text).toContain('/pulpit')
  expect(await ui.find({ key: 'wybierz' })).toBeDefined()
  await ui.unmount()
})

test('sesja w innym folderze nie widzi pulpitu firmy z pierwszej sesji', async ($, on) => {
  swiat(on, { [`${ROOT}/.postep.json`]: JSON.stringify(POSTEP_6) })
  on('ui.render', ($: any, e: any) => {
    const { Text } = $.ui.resolve(e)
    return <Text>silnik</Text>
  })
  await start($)
  korzen = '/inny-projekt'
  await $.session.start({ cwd: korzen, surface: 'desktop', isInteractive: true })
  const ui = await $.ui.mount({ ...PASEK, surface: 'desktop' })
  expect((await ui.find({ type: 'Text' }))?.text).toBe('silnik')
  await ui.unmount()
  korzen = ROOT
  const wlasny = await $.ui.mount({ ...PASEK, surface: 'desktop' })
  expect((await wlasny.find({ type: 'Text', text: /6 z 12/ }))?.text).toBe('6 z 12')
  await wlasny.unmount()
})

test('„Pokaż pulpit” na pasku otwiera panel, w obu trybach', async ($, on) => {
  swiat(on, { [`${ROOT}/.postep.json`]: JSON.stringify(POSTEP_12), [`${ROOT}/.pulpit.json`]: JSON.stringify(PULPIT) })
  await start($)
  otwarte.length = 0
  const ui = await $.ui.mount({ ...PASEK, surface: 'desktop' })
  await ui.press({ key: 'pokaz' })
  expect(otwarte).toEqual(['pulpit-firmy'])
  await ui.unmount()
})
