---
name: postep
description: Pokazuje postęp budowy fundamentu firmy – które pliki są gotowe, które są szkicem, czego brakuje, co zrobić dalej. Użyj, gdy kursant pyta „co już mam”, „ile zostało”, „pokaż postęp”, „czego brakuje”.
---

# Postęp: co już mamy, co dalej

1. Przeczytaj `.postep.json` (jeśli jest) i sprawdź faktyczny stan plików w `<strategia>/` oraz `plan-marketingowy.md` i `CLAUDE.md`. Faktyczny stan plików ma pierwszeństwo przed zapisem w `.postep.json`; jeśli się różnią, popraw `.postep.json`.
2. Status pliku: ✅ gotowy (brak pól `[…]` i `status: szkic`), 📝 szkic (są pola `[…]`, `[DO UZUPEŁNIENIA…]` albo `status: szkic`), ⬜ brak.
3. Pokaż tabelę elementów dokumentu strategicznego (lista i statusy z inwentaryzacji w skillu `start` / `.postep.json`), ze źródłem każdego elementu:

| # | Plik | Status | Czego brakuje (1 zdanie) |
|---|---|---|---|

4. Pod tabelą: „Gotowe X z 12”, data ostatniej aktualizacji i jeden proponowany następny krok (zwykle pierwszy niegotowy plik → skill `strateg`).
5. Jeśli jakiś gotowy plik ma `aktualizacja` starszą niż 3 miesiące, zaproponuj krótki przegląd: „Czy to nadal aktualne?”.
