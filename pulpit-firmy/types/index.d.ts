export type StatusElementu = 'gotowy' | 'szkic' | 'brak'
export type Element = { id: string; nazwa: string; status: StatusElementu }
export type Kafelek = { nazwa: string; wartosc: string; opis?: string }
export type Zadanie = { tytul: string; kropka?: 'po_terminie' | 'wspiera_cel' | 'odloz'; termin?: string }
export type Cel = { nazwa: string; od: number; do: number; teraz: number; termin: string; start?: string; jednostka?: string }
// Co pulpit pokazuje w tej sesji: przeliczone z .postep.json, .pulpit.json i folderów drugiego mózgu.
export type Widok = {
  folder: string
  firma: string
  strategia: Element[]
  gotowe: number
  pokazuj: string[] | null
  cel: (Cel & { planDzis: number | null }) | null
  kafelki: Kafelek[]
  zadania: Zadanie[]
  zrodloZadan: string
  skrzynka: number
  brief: boolean
  sprawozdanie: boolean
  dzis: string
  blad?: string
}

declare module 'claude-code' {
  interface PluginState {
    'pulpit-firmy': { widoki: Shaped<Record<string, Widok | null>> }
  }
}
