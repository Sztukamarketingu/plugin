# Plugin „AI w biznesie i marketingu”

Plugin do Claude (Claude Code i Claude Desktop / Cowork) dla kursantów kursu „AI w biznesie i marketingu” (Sztuka Marketingu). Etap 1: budujesz z agentem **fundament firmy** (klient, konkurencja, oferta, strategia) i **plan marketingowy**, korzystając z bazy wiedzy kursu. Kolejne role (treści, reklamy, finanse) dojdą w następnych modułach.

## Instalacja (raz)

1. Zaktualizuj Claude Code do wersji 2.1.271 lub nowszej (w Claude Desktop aktualizacja jest automatyczna).
2. Dodaj marketplace kursu i zainstaluj plugin. W Claude Code wpisz:
   ```
   /plugin marketplace add Sztukamarketingu/plugin
   /plugin install sztuka-marketingu@sztuka-marketingu
   ```
   W Claude Desktop / claude.ai: Dostosuj → Pluginy → Dodaj marketplace → `Sztukamarketingu/plugin`, potem zainstaluj „AI w biznesie i marketingu”.
3. Podaj **klucz kursanta** (zaczyna się od `skm_`; znajdziesz go w materiałach kursu):
   - **Claude Desktop / Cowork / claude.ai**: w ustawieniach pluginu przy serwerze `baza` kliknij **Connect**. Otworzy się strona logowania kursu, wklej klucz i kliknij „Połącz”. Wrócisz do Claude już połączony / połączona.
   - **Claude Code**: Claude pyta o klucz przy włączaniu pluginu. Jeśli przegapisz pytanie: `/plugin configure sztuka-marketingu`.
   Klucz nie jest nigdzie zapisywany w przeglądarce; dostęp można w każdej chwili cofnąć.

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

## Narzędzia do researchu (opcjonalnie)

Agent bada konkurencję na prawdziwych przykładach (strony, opinie, reklamy). Działa bez dodatków, ale więcej zobaczy z:
- **Apify** – z katalogu konektorów Claude (Ustawienia → Konektory → Apify → Połącz; darmowe konto),
- **You.com** – własny konektor: `https://api.you.com/mcp?profile=free` (bez konta).

Agent sam sprawdzi, co masz, i podpowie, co warto dodać. Nigdy nie prosi o hasła w rozmowie.

## Gdy coś nie działa

- „Baza wiedzy niedostępna” lub błąd 401 → w Claude Desktop / Coworku kliknij „Connect” przy serwerze `baza` i zaloguj się ponownie; w Claude Code sprawdź klucz: `/plugin configure sztuka-marketingu`.
- Plugin nie widzi folderu firmy → upewnij się, że otworzyłeś / otworzyłaś folder firmy, a nie katalog domowy.
- Inne problemy → napisz na kontakt@sztukamarketingu.pl.
