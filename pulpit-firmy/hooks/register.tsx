import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Cel, Element, Kafelek, StatusElementu, Widok, Zadanie } from '../types'

// Pulpit firmy: pasek nad polem wpisywania i panel obok rozmowy, tylko w folderze firmy (z .postep.json).
// Dopóki strategia nie ma 12 z 12 albo nie wybrano danych – pokazuje postęp strategii.
// Potem pokazuje to, co skill `pulpit` zapisał w .pulpit.json (pole „pokazuj”).
// Tylko odczyt: mod nie zapisuje plików i nie wysyła poleceń. Kliknięcie wpisuje polecenie w pole rozmowy,
// Enter naciska człowiek.

const PANEL = 'pulpit-firmy'
// Aplikacja desktop trzyma jedną kopię moda dla wszystkich otwartych sesji, więc widok jest per folder sesji
// (klucz = $.session.root()); inaczej pulpit jednej firmy pokazywałby się w każdym projekcie.
// Zmiana pól Widoku = nowy znacznik: odrzuca to, co zapisała poprzednia wersja (przeżywa przeładowanie).
const widoki = atom({ plugin: 'pulpit-firmy', key: 'widoki' } as const, {}, { shape: 'widoki-1' })
// Akcent marki kursu (clay); reszta kolorów to klucze motywu, żeby pasek był czytelny w jasnym i ciemnym.
const AKCENT = '#c96442'


// Te same klucze i nazwy co w panelu programu (serwer/src/program.ts) i w skillu `postep`.
const ELEMENTY: [string, string][] = [
  ['firma', 'Opis firmy'],
  ['konkurencja', 'Konkurencja'],
  ['liczby-firmy', 'Liczby firmy'],
  ['klient-i-pozycjonowanie', 'Klient i pozycjonowanie'],
  ['strategia', 'Strategia'],
  ['eksperymenty', 'Eksperymenty'],
  ['cele', 'Cele'],
  ['oferta-i-dowody', 'Oferta i dowody'],
  ['glos-marki', 'Głos marki'],
  ['plan-marketingowy', 'Plan marketingowy'],
  ['CLAUDE', 'Instrukcja dla Claude'],
  ['dokument-strategiczny', 'Dokument strategiczny'],
]
const GRUPY_KAFELKOW = ['liczby', 'marketing', 'reklamy', 'sprzedaz']

const dwa = (n: number) => String(n).padStart(2, '0')
const iso = (ms: number) => {
  const d = new Date(ms)
  return `${d.getFullYear()}-${dwa(d.getMonth() + 1)}-${dwa(d.getDate())}`
}
const krotko = (data: string) => `${data.slice(8, 10)}.${data.slice(5, 7)}`
const pasekZnakow = (czesc: number, szer = 12) => {
  const pelne = Math.round(Math.max(0, Math.min(1, czesc)) * szer)
  return '▰'.repeat(pelne) + '▱'.repeat(szer - pelne)
}
const liczba = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null)
const tekst = (v: unknown, max = 80): string => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '')

// Folder firmy: najbliższy folder z .postep.json od folderu sesji w górę (najwyżej 3 poziomy).
async function folderFirmy($: any, root: string): Promise<string | null> {
  let dir = root
  for (let i = 0; i < 4 && dir; i++) {
    if (await $.fs.exists(`${dir}/.postep.json`)) return dir
    const wyzej = dir.replace(/\/[^/]+$/, '')
    if (wyzej === dir) break
    dir = wyzej
  }
  return null
}

async function json($: any, plik: string): Promise<Record<string, unknown> | null> {
  if (!(await $.fs.exists(plik))) return null
  const v = JSON.parse(await $.fs.read(plik))
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null
}

// Plan na dziś przy równym tempie od daty startu do terminu.
function planNaDzis(c: Cel, dzis: string): number | null {
  if (!c.start) return null
  const od = Date.parse(c.start), doK = Date.parse(c.termin), teraz = Date.parse(dzis)
  if (!(doK > od) || Number.isNaN(teraz)) return null
  const czesc = Math.max(0, Math.min(1, (teraz - od) / (doK - od)))
  return Math.round(c.od + (c.do - c.od) * czesc)
}

function celZPliku(v: unknown): Cel | null {
  if (!v || typeof v !== 'object') return null
  const o = v as Record<string, unknown>
  const od = liczba(o.od), doc = liczba(o.do), teraz = liczba(o.teraz)
  const termin = tekst(o.termin, 10)
  if (od === null || doc === null || teraz === null || !/^\d{4}-\d{2}-\d{2}$/.test(termin)) return null
  const start = tekst(o.start, 10)
  return { nazwa: tekst(o.nazwa) || 'Cel', od, do: doc, teraz, termin, start: /^\d{4}-\d{2}-\d{2}$/.test(start) ? start : undefined, jednostka: tekst(o.jednostka, 30) || undefined }
}

function kafelki(v: unknown): Kafelek[] {
  if (!Array.isArray(v)) return []
  return v
    .filter((k): k is Record<string, unknown> => Boolean(k) && typeof k === 'object')
    .map(k => ({ nazwa: tekst(k.nazwa, 40), wartosc: tekst(k.wartosc, 20), opis: tekst(k.opis, 40) || undefined }))
    .filter(k => k.nazwa && k.wartosc)
}

function zadania(v: unknown): Zadanie[] {
  if (!Array.isArray(v)) return []
  const kropki = ['po_terminie', 'wspiera_cel', 'odloz']
  return v
    .filter((z): z is Record<string, unknown> => Boolean(z) && typeof z === 'object')
    .map(z => ({ tytul: tekst(z.tytul, 120), kropka: kropki.includes(String(z.kropka)) ? (z.kropka as Zadanie['kropka']) : undefined, termin: tekst(z.termin, 10) || undefined }))
    .filter(z => z.tytul)
    .slice(0, 8)
}

async function ileWejsc($: any, folder: string): Promise<number> {
  const wejscie = `${folder}/warsztat/wejscie`
  if (!(await $.fs.exists(wejscie))) return 0
  let n = 0
  for (const w of await $.fs.list(wejscie)) {
    if (w.name.startsWith('.')) continue
    if (w.kind === 'file') n++
    else if (w.kind === 'dir') n += (await $.fs.list(`${wejscie}/${w.name}`)).filter((x: any) => x.kind === 'file' && !x.name.startsWith('.')).length
  }
  return n
}

async function policz($: any, root: string): Promise<Widok | null> {
  const folder = await folderFirmy($, root)
  if (!folder) return null
  const dzis = iso(await $.clock.now())
  const postep = (await json($, `${folder}/.postep.json`).catch(() => null)) ?? {}
  const pliki = (postep.pliki && typeof postep.pliki === 'object' ? postep.pliki : {}) as Record<string, unknown>
  const strategia: Element[] = ELEMENTY.map(([id, nazwa]) => {
    const s = pliki[id]
    const status: StatusElementu = s === 'gotowy' || s === 'szkic' ? s : 'brak'
    return { id, nazwa, status }
  })
  const w: Widok = {
    folder,
    firma: tekst(postep.firma, 40) || folder.split('/').pop() || '',
    strategia,
    gotowe: strategia.filter(e => e.status === 'gotowy').length,
    pokazuj: null, cel: null, kafelki: [], zadania: [], zrodloZadan: '',
    skrzynka: 0, brief: false, sprawozdanie: false, dzis,
  }
  let pulpit: Record<string, unknown> | null = null
  try {
    pulpit = await json($, `${folder}/.pulpit.json`)
  } catch {
    w.blad = 'Nie mogę odczytać .pulpit.json – napisz /pulpit, a Claude go naprawi.'
  }
  if (pulpit && Array.isArray(pulpit.pokazuj)) {
    w.pokazuj = pulpit.pokazuj.filter((x): x is string => typeof x === 'string')
    const cel = celZPliku(pulpit.cel)
    w.cel = cel ? { ...cel, planDzis: planNaDzis(cel, dzis) } : null
    const k = (pulpit.kafelki ?? {}) as Record<string, unknown>
    w.kafelki = GRUPY_KAFELKOW.filter(g => w.pokazuj!.includes(g)).flatMap(g => kafelki(k[g])).slice(0, 6)
    w.zadania = zadania(pulpit.zadania)
    w.zrodloZadan = tekst(pulpit.zrodlo_zadan, 30)
  }
  w.skrzynka = await ileWejsc($, folder).catch(() => 0)
  if (await $.fs.exists(`${folder}/raporty`)) {
    const wczoraj = iso(Date.parse(dzis) - 86_400_000)
    const nazwy: string[] = (await $.fs.list(`${folder}/raporty`)).map((x: any) => x.name)
    w.brief = nazwy.some(n => n.startsWith(`brief-${dzis}`))
    w.sprawozdanie = nazwy.some(n => n.startsWith(`dzien-${dzis}`) || n.startsWith(`dzien-${wczoraj}`))
  }
  return w
}

async function odswiez($: any) {
  try {
    const root: string = await $.session.root()
    const w = await policz($, root)
    await update($, widoki, (wszystkie: Record<string, Widok | null>) => ({ ...wszystkie, [root]: w }))
    // Pasek mógł zostać narysowany, zanim mod się wczytał (np. po /reload-plugins): prośba o ponowne rysowanie.
    $.ui.invalidate('ui.render')
  } catch (err) {
    $.ui.log(`pulpit-firmy: nie odczytałem plików: ${err}`, { to: 'debug' })
  }
}

// Widok sesji, która rysuje albo wywołała hook.
async function moj($: any): Promise<Widok | null> {
  const root: string = await $.session.root()
  return ((await read($, widoki)) as Record<string, Widok | null>)[root] ?? null
}
const otworz = ($: any) => $.ui.open({ id: PANEL, title: 'Pulpit firmy' })
const wpisz = ($: any, text: string) => void $.prompt.fill({ text, mode: 'replace' })
const trybDanych = (w: Widok) => Boolean(w.pokazuj && w.pokazuj.length)
const nastepny = (w: Widok) => w.strategia.find(e => e.status !== 'gotowy') ?? null
const polecenieElementu = (e: Element) =>
  e.status === 'gotowy' ? `/strateg pokaż, co mamy w „${e.nazwa}”, i czy coś wymaga aktualizacji` : `/strateg zajmijmy się elementem „${e.nazwa}”`
const tempo = (c: Widok['cel']) => (c && c.planDzis !== null ? c.teraz - c.planDzis : null)
const zeZnakiem = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '0')

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const wynik = await next(e)
    await $.command.register({ name: 'pulpit-firmy', description: 'Otwórz pulpit firmy obok rozmowy' })
    await odswiez($)
    if (await moj($)) void otworz($)
    return wynik
  })

  // Claude mógł w tej turze zmienić pliki strategii albo .pulpit.json.
  on('turn.complete', async ($, e, next) => {
    const wynik = await next(e)
    await odswiez($)
    return wynik
  })

  on('command.run', { command: 'pulpit-firmy' }, async $ => {
    await odswiez($)
    if (!(await moj($))) return { text: 'Tu nie ma folderu firmy (brak .postep.json). Otwórz Claude w folderze firmy i napisz „start”.' }
    await otworz($)
    return { text: 'Pulpit firmy otwarty.' }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const w = await moj($)
    if (!w || e.props.hasSurvey) return next(e)
    const { Box, Text, Button } = $.ui.resolve(e)

    if (!trybDanych(w)) {
      const n = nastepny(w)
      return (
        <Box>
          <Text bold color={AKCENT}>Strategia </Text>
          <Text color={w.gotowe === 12 ? 'success' : AKCENT}>{pasekZnakow(w.gotowe / 12)} </Text>
          <Text bold>{w.gotowe} z 12</Text>
          {n ? (
            <Text> · następny: <Text color={n.status === 'szkic' ? 'warning' : undefined}>{n.nazwa}{n.status === 'szkic' ? ' (szkic)' : ''}</Text> </Text>
          ) : (
            <Text color="success"> · gotowa </Text>
          )}
          {n ? (
            <Button key="dalej" label="Dalej" onPress={() => wpisz($, polecenieElementu(n))} />
          ) : (
            <Button key="wybierz" label="Wybierz dane pulpitu" onPress={() => wpisz($, '/pulpit strategia gotowa – wybierzmy, co pokazywać na pulpicie')} />
          )}
          <Text> </Text>
          <Button key="pokaz" label="Pokaż pulpit" onPress={() => void otworz($)} />
        </Box>
      )
    }

    const c = w.cel
    const t = tempo(c)
    const poTerminie = w.zadania.filter(z => z.kropka === 'po_terminie').length
    const zadaniaPo = w.pokazuj!.includes('zadania') && poTerminie > 0
    const skrzynka = w.pokazuj!.includes('rytm') && w.skrzynka > 0
    return (
      <Box>
        {c && w.pokazuj!.includes('cel') ? (
          <Text>
            <Text bold color={AKCENT}>{c.nazwa}</Text>
            <Text dimColor>: {c.od} → {c.do} do {krotko(c.termin)} · </Text>
            <Text bold color={t === null ? undefined : t >= 0 ? 'success' : 'warning'}>
              {c.teraz}{t === null ? '' : ` (tempo ${zeZnakiem(t)})`}
            </Text>
          </Text>
        ) : (
          <Text bold color={AKCENT}>Pulpit firmy</Text>
        )}
        {zadaniaPo && <Text color="error"> · po terminie {poTerminie}</Text>}
        {skrzynka && <Text color="warning"> · skrzynka {w.skrzynka}</Text>}
        <Text> </Text>
        <Button key="pokaz" label="Pokaż pulpit" onPress={() => void otworz($)} />
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: PANEL }, async ($, e) => {
    const { Box, Text, Button } = $.ui.resolve(e)
    const w = await moj($)
    if (!w) return <Text dimColor>Tu nie ma folderu firmy. Otwórz Claude w folderze firmy i napisz „start”.</Text>

    const stopka = (
      <Box flexDirection="column" marginTop={1}>
        {w.blad && <Text color="warning">{w.blad}</Text>}
        <Box>
          <Button key="odswiez" label="Wczytaj ponownie" onPress={() => void odswiez($)} />
        </Box>
      </Box>
    )

    if (!trybDanych(w)) {
      return (
        <Box flexDirection="column">
          <Text bold>{w.firma}</Text>
          <Text>Strategia firmy: {w.gotowe} z 12</Text>
          <Text color={w.gotowe === 12 ? 'success' : undefined}>{pasekZnakow(w.gotowe / 12, 20)}</Text>
          <Box flexDirection="column" marginTop={1}>
            {w.strategia.map(el => (
              <Button key={el.id} onPress={() => wpisz($, polecenieElementu(el))}>
                <Text color={el.status === 'gotowy' ? 'success' : el.status === 'szkic' ? 'warning' : undefined} dimColor={el.status === 'brak'}>
                  {el.status === 'gotowy' ? '✓' : el.status === 'szkic' ? '◐' : '○'}
                </Text>{' '}{el.nazwa}
              </Button>
            ))}
          </Box>
          <Box marginTop={1}>
            {w.gotowe === 12 ? (
              <Button key="wybierz" label="Wybierz dane pulpitu" onPress={() => wpisz($, '/pulpit strategia gotowa – wybierzmy, co pokazywać na pulpicie')} />
            ) : (
              <Text dimColor>Po ukończeniu strategii wybierzesz, jakie dane firmy pokazywać tutaj na co dzień.</Text>
            )}
          </Box>
          {stopka}
        </Box>
      )
    }

    const p = w.pokazuj!
    const c = w.cel
    const t = tempo(c)
    return (
      <Box flexDirection="column">
        <Text bold>{w.firma}</Text>
        {p.includes('cel') &&
          (c ? (
            <Box flexDirection="column" marginTop={1}>
              <Button key="cel" onPress={() => wpisz($, `/postep jak idzie cel „${c.nazwa}” (${c.teraz} z ${c.do}) i co dziś najbardziej go przybliży?`)}>
                {c.nazwa}: <Text bold>{c.teraz} / {c.do}</Text>{c.jednostka ? ` ${c.jednostka}` : ''}
              </Button>
              <Text color={t === null ? undefined : t >= 0 ? 'success' : 'warning'}>{pasekZnakow((c.teraz - c.od) / Math.max(1, c.do - c.od), 20)}</Text>
              <Text dimColor>
                {c.planDzis === null ? `termin ${krotko(c.termin)}` : `Plan na dziś: ${c.planDzis}. ${t! >= 0 ? 'W tempie.' : `Brakuje ${-t!}.`} Termin ${krotko(c.termin)}.`}
              </Text>
            </Box>
          ) : (
            <Text dimColor>Cel bez liczby i terminu – napisz /pulpit, żeby go uzupełnić.</Text>
          ))}
        {w.kafelki.length > 0 && (
          <Box flexDirection="column" marginTop={1}>
            {w.kafelki.map((k, i) => (
              <Button key={`k${i}`} onPress={() => wpisz($, `Rozłóż mi „${k.nazwa}” (${k.wartosc}): skąd ta liczba, co się zmieniło i co z tym zrobić. Weź dane z plików firmy.`)}>
                {k.nazwa}: <Text bold>{k.wartosc}</Text>{k.opis ? <Text dimColor> · {k.opis}</Text> : ''}
              </Button>
            ))}
          </Box>
        )}
        {p.includes('zadania') && (
          <Box flexDirection="column" marginTop={1}>
            <Text dimColor>Dziś{w.zrodloZadan ? ` (z ${w.zrodloZadan})` : ''}</Text>
            {w.zadania.length === 0 && <Text dimColor>Brak listy na dziś – zrób brief na rano.</Text>}
            {w.zadania.map((z, i) =>
              z.kropka === 'odloz' ? (
                <Text key={`z${i}`} dimColor>● {z.tytul} · do odłożenia</Text>
              ) : (
                // Kropka i tytuł poza przyciskiem: aplikacja nie przenosi kolorów tekstu do wnętrza przycisku.
                <Box key={`w${i}`} flexDirection="column">
                  <Text>
                    <Text color={z.kropka === 'po_terminie' ? 'error' : z.kropka === 'wspiera_cel' ? 'success' : undefined}>●</Text> {z.tytul}
                    {z.kropka === 'po_terminie' ? <Text color="error"> · po terminie</Text> : ''}
                  </Text>
                  <Button key={`z${i}`} label="Zajmij się" onPress={() => wpisz($, `Zajmijmy się zadaniem „${z.tytul}”. Weź kontekst z plików firmy.`)} />
                </Box>
              ),
            )}
          </Box>
        )}
        {p.includes('rytm') && (
          <Box flexDirection="column" marginTop={1}>
            <Text dimColor>
              Brief dziś {w.brief ? '✓' : '—'} · sprawozdanie {w.sprawozdanie ? '✓' : '—'} · skrzynka {w.skrzynka}
            </Text>
            <Box>
              <Button key="rano" label="Brief na rano" onPress={() => wpisz($, '/rano')} />
              <Text> </Text>
              <Button key="wieczor" label="Sprawozdanie" onPress={() => wpisz($, '/wieczor')} />
            </Box>
          </Box>
        )}
        <Box marginTop={1}>
          <Button key="zmien" label="Zmień dane pulpitu" onPress={() => wpisz($, '/pulpit zmień, co pokazujesz na pulpicie')} />
          <Text> </Text>
          <Button key="aktualizuj" label="Zaktualizuj liczby" onPress={() => wpisz($, '/pulpit odśwież liczby na pulpicie z plików firmy')} />
        </Box>
        {stopka}
      </Box>
    )
  })
}
