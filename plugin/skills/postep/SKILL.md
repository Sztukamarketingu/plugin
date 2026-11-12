---
name: postep
description: Pokazuje postęp budowy fundamentu firmy – które pliki są gotowe, które są szkicem, czego brakuje, co zrobić dalej. Użyj, gdy kursant pyta „co już mam”, „ile zostało”, „pokaż postęp”, „czego brakuje”.
---

# Postęp: co już mamy, co dalej

1. Przeczytaj `.postep.json` (jeśli jest) i sprawdź faktyczny stan plików w `<strategia>/` oraz `plan-marketingowy.md` i `CLAUDE.md`. Faktyczny stan plików ma pierwszeństwo przed zapisem w `.postep.json`; jeśli się różnią, popraw `.postep.json`.
2. Status pliku (te same wartości co pole `pliki` w `.postep.json`): ✅ `gotowy` (brak pól `[…]` i `status: szkic`), 🟡 `szkic` (są pola `[…]`, `[DO UZUPEŁNIENIA…]` albo `status: szkic`, albo treść jest tylko częściowo w plikach z etapu 1), ⬜ `brak`.
3. Nad tabelą jedna linia profilu, jeśli jest w `.postep.json` (np. „Profil: sklep internetowy · firma klienta”). Pokaż tabelę **12 elementów** dokumentu strategicznego (lista i klucze z tabeli w skillu `start`: firma, konkurencja, liczby-firmy, klient-i-pozycjonowanie, strategia, eksperymenty, cele, oferta-i-dowody, glos-marki, plan-marketingowy, CLAUDE, dokument-strategiczny), ze źródłem każdego elementu:

| # | Plik | Status | Czego brakuje (1 zdanie) |
|---|---|---|---|

4. **Wyślij statusy do panelu programu:** narzędzie `zapisz_postep` (serwer `baza`) z polem `elementy` = `pliki` z `.postep.json`. Tylko statusy – nigdy treści plików. Gdy `.postep.json` ma `"panel": "wstrzymany"`, nie wysyłaj; pod tabelą dodaj jedno zdanie, że panel pokazuje postęp z innego folderu, i zapytaj, czy przełączyć go na ten (tak → `"panel": "wysylaj"` i wyślij). Brak narzędzia albo błąd → pomiń bez komentarza; odpowiedź o końcu okresu próbnego przekaż kursantowi.
   **Moduł Zadania** (gdy jest `zadania` w `.postep.json`): w tym samym wywołaniu dodaj pole `zadania` – tylko statusy i liczby, **bez imion, treści zadań, nazw klientów i kwot**:
   ```json
   { "status": "uruchomione", "wstrzymany": false, "seria": 3, "tryb": "regularny", "tablica": "miary",
     "fundament_otwarte": 1,
     "tygodnie": [ { "tydzien": "2026-W47", "rozliczony": true, "wziete": 2, "dotrzymane": 1, "miary_90": true, "wynik_na_sciezce": false } ],
     "zespol": { "ludzie": true, "kto_korzysta": "wlasciciel", "osob": 3, "wziete": 9, "dotrzymane": 7 } }
   ```
   `tygodnie` – najwyżej 6 ostatnich; w zespole `wziete` / `dotrzymane` to sumy zespołu z ostatniego tygodnia. Starszy serwer odrzuci pole `zadania` → wyślij same `elementy` i nie komentuj.
5. **Linia modułu Zadania** pod tabelą (gdy jest `zadania`): „Zadania: <status> · seria N tyg. · tryb <tryb> · tablica <miary/kamienie>”; w zespole dopisz „· zespół: dotrzymane 7/9 w ostatnim tygodniu” (suma, bez imion). Lista `do_uzupelnienia` (punkt 6) ma wtedy też kolumny „Rodzaj” i „Przesunięcia”.
   Pod tabelą: „Gotowe X z 12” (ta sama liczba, którą kursant widzi w panelu), data ostatniej aktualizacji i jeden proponowany następny krok (zwykle pierwszy niegotowy plik → skill `strateg`). Jeśli `co_dalej` zwraca następny krok z planu nauki (lekcja), dodaj go jednym zdaniem.
6. **Do uzupełnienia:** pod tabelą pokaż listę `do_uzupelnienia` z `.postep.json` (gdy nie jest pusta):

| Co | Moduł / kto | Zgłosił | Od | Termin |
|---|---|---|---|---|

   Schemat wpisu (jeden dla wszystkich agentów):
   ```json
   { "co": "marka – archetyp i obietnica", "modul": "Marka i marketing mix", "komenda": null,
     "zglosil": "tresci", "dlaczego": "posty bez ustalonej osobowości marki – pewność niska",
     "od": "RRRR-MM-DD", "zadanie": null, "termin": null, "rodzaj": "brak", "przesuniecia": 0 }
   ```
   `komenda` – polecenie do wpisania, gdy moduł już istnieje (inaczej `null`); `zadanie` – identyfikator zadania w narzędziu do zadań albo `null`; `termin` – data albo `null`; `rodzaj` – `fundament` (praca nad fundamentem planowana w module Zadania) albo `brak` (zwykły brak danych); `przesuniecia` – ile razy termin zadania fundamentu przesunięto (skill `zadania`, reguła fundamentu). Przy roli „klient” brak, który zna tylko klient, ma `modul: "pytanie do klienta"`.
   **Gdy brak jest już uzupełniony** (plik ma status `gotowy`, kursant mówi „zrobione”, klient odpowiedział) – usuń wpis i powiedz, który agent na niego czekał, np. „Masz już markę – agent Treści może poprawić posty z ostatniego tygodnia. Zrobić to?”. Wpis bez terminu starszy niż 2 tygodnie → zapytaj raz, czy zaplanować, czy brak przestał być ważny.
7. Jeśli jakiś gotowy plik ma `aktualizacja` starszą niż 3 miesiące, zaproponuj krótki przegląd: „Czy to nadal aktualne?”.
8. **Drugi mózg** (gdy jest `index.md` + `warsztat/` albo `drugi_mozg` w `.postep.json`): pod tabelą strategii pokaż krótką tabelę – data założenia · ostatni brief (`raporty/brief-*`) · ostatnie sprawozdanie (`raporty/dzien-*`) · ostatni raport tygodnia · pliki w `warsztat/wejscie/` · rozmowy `status: omówione` czekające na `/awansuj` · narzędzie do zadań (ClickUp / Bitrix24 / brak). Zaproponuj jedną rzecz z rytmu (`/rano`, `/wieczor`, `/tydzien`, `/porzadki`).
9. **Zarząd** (gdy `.postep.json` ma `zarzad.otwarty`): pod tabelą jedna krótka tabela – członek zarządu (polecenie) · ostatnia sesja (z „Historii sesji” w `zarzad/<rola>.md`) · pewność z teczki · liczba braków w `do_uzupelnienia` z jego `zglosil`. Gdy zarządu nie ma, a warunek otwarcia jest spełniony (skill `start`, sytuacja F) – jedno zdanie z propozycją `/zarzad`.
