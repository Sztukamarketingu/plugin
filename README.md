# Plugin „AI w biznesie i marketingu”

Plugin do Claude (Claude Code i Claude Desktop / Cowork) dla kursantów kursu „AI w biznesie i marketingu” (Sztuka Marketingu). Etap 1: budujesz z agentem **fundament firmy** (klient, konkurencja, oferta, strategia) i **plan marketingowy**, korzystając z bazy wiedzy kursu. Etap 2: **drugi mózg firmy** – Obsidian i codzienny rytm realizacji strategii. Kolejne role (treści, reklamy, finanse) dojdą w następnych modułach.

## Instalacja (raz)

1. Zaktualizuj Claude Code do wersji 2.1.271 lub nowszej (w Claude Desktop aktualizacja jest automatyczna).
2. Dodaj marketplace kursu i zainstaluj plugin. W Claude Code wpisz:
   ```
   /plugin marketplace add Sztukamarketingu/plugin
   /plugin install sztuka-marketingu@sztuka-marketingu
   ```
   W Claude Desktop / claude.ai: Dostosuj → Pluginy → Dodaj marketplace → `Sztukamarketingu/plugin`, potem zainstaluj „AI w biznesie i marketingu”.
3. Połącz plugin z bazą wiedzy kursu (tak samo w każdej aplikacji Claude):
   - **Claude Desktop / Cowork / claude.ai**: w ustawieniach pluginu, zakładka Connectors, przy serwerze `baza` kliknij **Connect**.
   - **Claude Code**: wpisz `/mcp`, wybierz `baza` i uruchom logowanie.
   Otworzy się **panel programu** (`panel.sztukamarketingu.pl`). Jeśli jesteś w nim zalogowany / zalogowana, wystarczy kliknąć **„Zezwól”**. Jeśli nie – wpisz **adres e-mail z zapisu**, dostaniesz mail z **6-cyfrowym kodem** (działa 15 minut), wpisz go i kliknij „Zezwól”. Wrócisz do Claude już połączony / połączona. Dostęp można w każdej chwili cofnąć.

## Pierwsze uruchomienie

1. Utwórz **pusty folder** dla swojej firmy (np. `Moja-firma`) i otwórz go w Claude Code albo jako projekt w Coworku. Jeśli masz materiały (oferta, cennik, notatki), wrzuć je do podfolderu `materialy/`.
2. Napisz **„zaczynamy”**. Agent przywita Cię, obejrzy folder i zaproponuje pierwszy krok.
3. Przy pierwszym użyciu bazy wiedzy Claude zapyta o zgodę na narzędzia serwera `baza`. Wybierz „zawsze zezwalaj”.

## Co powstanie w folderze

- `firma/` – krótkie pliki fundamentu: `firma.md`, `konkurencja.md`, `klient-i-pozycjonowanie.md`, `strategia.md`, `cele.md`, `oferta-i-dowody.md`, `glos-marki.md`, `liczby-firmy.md`, `eksperymenty.md`
- `research/` – raporty z badania konkurencji ze źródłami
- `plan-marketingowy.md` – finał etapu 1
- `CLAUDE.md` – mapa dla agentów kolejnych modułów
- `.postep.json` – zapis, gdzie skończyliście (możesz przerwać w każdej chwili)

## Panel programu (od wersji 0.3.0)

Plugin współpracuje z **panelem programu** (`https://panel.sztukamarketingu.pl/panel`): quiz startowy, plan nauki na 4 tygodnie, postęp, pakiety wiedzy i spotkania grupy.
- Na początku rozmowy agent pyta serwer, **co dalej** (wynik quizu, następny krok).
- Po każdym kroku strategii wysyła do panelu **same statusy** elementów (gotowe / w trakcie / brak) – treść plików firmy zostaje u Ciebie.
- **Pakiety wiedzy:** strategia jest otwarta od razu; kolejne pakiety otwierają się po jej ukończeniu. **Dodatki** (od 0.3.1: Networking, Pulpit firmy) to osobne umiejętności – wiedza i skill – włączane w panelu niezależnie od strategii. `/pakiet` pokazuje, co masz.

## Moduł: drugi mózg firmy (od wersji 0.2.0)

Gdy masz już wybory strategiczne i cele, agent drugiego mózgu zamienia ten sam folder w **pamięć firmy z codziennym rytmem**: pomaga zainstalować **Obsidian** (darmowy), otwiera folder jako sejf, układa miejsce na plan dnia, spotkania, pomysły, decyzje i raporty, a potem codziennie porównuje dzień z celami.

Komendy:
- `/drugi-mozg` – założenie (raz, ok. 1 godziny): Obsidian, foldery, pulpit firmy, sekcja „Drugi mózg” w `CLAUDE.md`
- `/rano` – brief: co dziś najbardziej przybliży Cię do celu
- `/wieczor` – sprawozdanie i wytyczne na jutro
- `/zapisz` – „gdzie to zapisać?”: wrzutka trafia na swoje miejsce
- `/spotkanie` – nagranie lub notatka ze spotkania → ustalenia, decyzje, zadania (najpierw kontrola RODO)
- `/pomysl` i `/awansuj` – bank pomysłów i przeniesienie przemyśleń do decyzji firmy
- `/tydzien` – agenda spotkania tygodniowego i rozliczenie celu
- `/porzadki` – comiesięczny przegląd bazy
- `/zadania` – podłączenie **ClickUp albo Bitrix24**: tam zostają zadania i stamtąd agent bierze postęp prac
- `/encyklopedia` – opcjonalnie: wizualne podsumowanie dla wspólników w **Notion**

Co powstanie: `index.md`, `log.md`, `Pulpit firmy.md`, foldery `warsztat/`, `pomysly/`, `spotkania/`, `dziennik-decyzji/`, `raporty/`, `wiki/`, `prywatne/`, `archiwum/`. Twoje dotychczasowe pliki zostają na swoich miejscach.

## Zarząd firmy (od wersji 0.5.0)

Po strategii (gdy masz kierunek, liczby, klienta, wybory i cele) możesz otworzyć **zarząd**: agentów-dyrektorów, którzy znają Twoją strategię, pilnują swoich liczb, mówią, czego im brakuje, i przygotowują decyzje. Decydujesz Ty.

- `/zarzad` – otwarcie zarządu (skład dopasowany do firmy: usługi, sklep, B2B), narada przy ważnej decyzji (domyślnie metodą kapeluszy: najpierw Twoja intuicja, potem dyrektorzy, którzy jej nie znają), skład i potrzeby zarządu
- `/strateg` (prezes), `/finansowy`, `/marketing`, `/sprzedaz`, `/operacyjny`, `/produkt-zakupy` (sklep), `/ludzie` (gdy masz zespół) – rozmowa z jednym dyrektorem
- Treści i Reklamy to **pomocnicy** Dyrektora marketingu, nie członkowie zarządu

Co powstanie: folder `zarzad/` z teczką każdego dyrektora (jego pamięć o Twojej firmie) i pole `zarzad` w `.postep.json`. Braki, które zgłosi dyrektor, trafiają na listę „do uzupełnienia” i – po Twojej zgodzie – do zadań.

## Narzędzia do researchu (opcjonalnie)

Agent bada konkurencję na prawdziwych przykładach (strony, opinie, reklamy). Działa bez dodatków, ale więcej zobaczy z:
- **Apify** – z katalogu konektorów Claude (Ustawienia → Konektory → Apify → Połącz; darmowe konto),
- **You.com** – własny konektor: `https://api.you.com/mcp?profile=free` (bez konta).

Agent sam sprawdzi, co masz, i podpowie, co warto dodać. Nigdy nie prosi o hasła w rozmowie.

## Gdy coś nie działa

- „Baza wiedzy niedostępna” lub błąd 401 → kliknij „Connect” przy serwerze `baza` (w Claude Code: `/mcp`) i zaloguj się ponownie (e-mail → link z maila).
- Mail z kodem nie przyszedł → sprawdź spam; upewnij się, że to adres z zapisu na kurs; po 15 minutach poproś o nowy kod.
- „Kod wygasł albo wyczerpano próby” → podaj e-mail jeszcze raz, przyjdzie nowy kod.
- Plugin nie widzi folderu firmy → upewnij się, że otworzyłeś / otworzyłaś folder firmy, a nie katalog domowy.
- Inne problemy → napisz na kontakt@sztukamarketingu.pl.
