---
name: postep
description: Pokazuje postęp budowy fundamentu firmy – które pliki są gotowe, które są szkicem, czego brakuje, co zrobić dalej. Użyj, gdy kursant pyta „co już mam”, „ile zostało”, „pokaż postęp”, „czego brakuje”.
---

# Postęp: co już mamy, co dalej

1. Przeczytaj `.postep.json` (jeśli jest) i sprawdź faktyczny stan plików w `<strategia>/` oraz `plan-marketingowy.md` i `CLAUDE.md`. Faktyczny stan plików ma pierwszeństwo przed zapisem w `.postep.json`; jeśli się różnią, popraw `.postep.json`.
2. Status pliku (te same wartości co pole `pliki` w `.postep.json`): ✅ `gotowy` (brak pól `[…]` i `status: szkic`), 🟡 `szkic` (są pola `[…]`, `[DO UZUPEŁNIENIA…]` albo `status: szkic`, albo treść jest tylko częściowo w plikach z etapu 1), ⬜ `brak`.
3. Pokaż tabelę **12 elementów** dokumentu strategicznego (lista i klucze z tabeli w skillu `start`: firma, konkurencja, liczby-firmy, klient-i-pozycjonowanie, strategia, eksperymenty, cele, oferta-i-dowody, glos-marki, plan-marketingowy, CLAUDE, dokument-strategiczny), ze źródłem każdego elementu:

| # | Plik | Status | Czego brakuje (1 zdanie) |
|---|---|---|---|

4. **Wyślij statusy do panelu programu:** narzędzie `zapisz_postep` (serwer `baza`) z polem `elementy` = `pliki` z `.postep.json`. Tylko statusy – nigdy treści plików. Brak narzędzia albo błąd → pomiń bez komentarza; odpowiedź o końcu okresu próbnego przekaż kursantowi.
5. Pod tabelą: „Gotowe X z 12” (ta sama liczba, którą kursant widzi w panelu), data ostatniej aktualizacji i jeden proponowany następny krok (zwykle pierwszy niegotowy plik → skill `strateg`). Jeśli `co_dalej` zwraca następny krok z planu nauki (lekcja), dodaj go jednym zdaniem.
6. Jeśli jakiś gotowy plik ma `aktualizacja` starszą niż 3 miesiące, zaproponuj krótki przegląd: „Czy to nadal aktualne?”.
7. **Drugi mózg** (gdy jest `index.md` + `warsztat/` albo `drugi_mozg` w `.postep.json`): pod tabelą strategii pokaż krótką tabelę – data założenia · ostatni brief (`raporty/brief-*`) · ostatnie sprawozdanie (`raporty/dzien-*`) · ostatni raport tygodnia · pliki w `warsztat/wejscie/` · rozmowy `status: omówione` czekające na `/awansuj` · narzędzie do zadań (ClickUp / Bitrix24 / brak). Zaproponuj jedną rzecz z rytmu (`/rano`, `/wieczor`, `/tydzien`, `/porzadki`).
