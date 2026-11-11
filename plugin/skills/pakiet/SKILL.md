---
name: pakiet
description: Pakiety wiedzy programu „AI w biznesie i marketingu” – pokazuje, które są otwarte, zamknięte albo w przygotowaniu, i włącza dostępny pakiet. Użyj, gdy kursant pisze „włącz pakiet Reklama”, „jakie mam pakiety”, „co jest w pakiecie…”, albo gdy narzędzie bazy odpowiedziało, że temat jest w zamkniętym pakiecie.
---

# Pakiety wiedzy

Baza wiedzy programu jest podzielona na pakiety. **Strategia firmy** (rdzeń) jest zawsze otwarta. Pozostałe (Marketing i treści, Reklama, Sprzedaż, Finanse i liczby, Zespół i zadania, Prawo i dane, E-commerce) otwierają się **po ukończeniu strategii**, gdy prowadzący oznaczy pakiet jako gotowy. Niczego się nie instaluje – wiedza pojawia się w tej samej wtyczce. Wyjątek: notatki, których Strateg potrzebuje przy strategii sklepu internetowego (rentowność zamówienia, wskaźniki e-commerce, marketplace), są otwarte od początku, razem ze strategią – nie trzeba czekać na Pakiet E-commerce.

Zamknięty pakiet nie zatrzymuje pracy: agent robi, co się da, z otwartą wiedzą, oznacza niską pewność i dopisuje brak do `do_uzupelnienia`.

Osobno są **Dodatki** – umiejętności niezależne od strategii (dziś: Networking i Pulpit firmy; w przygotowaniu: Rozmowa rekrutacyjna i CV, Wizytówki po wydarzeniu). Dodatek ma wiedzę w bazie albo narzędzie i swój skill (np. `networking`, `pulpit`), a uczestnik może go włączyć od razu, bez ukończonej strategii.

1. Wywołaj `pakiety` z `akcja: "lista"` (serwer `baza`) i pokaż kursantowi krótko, w dwóch grupach – „Strategia i wdrożenie” oraz „Dodatki”: otwarte · polecane po quizie · zamknięte (z powodem: „po strategii” albo „w przygotowaniu”).
2. Kursant prosi o włączenie → `pakiety` z `akcja: "wlacz"` i `pakiet` (id albo nazwa). Gdy serwer odpowie, że pakiet jest zamknięty, wyjaśnij dlaczego i wskaż, ile zostało do ukończenia strategii (`co_dalej`) – potem zaproponuj następny krok ze Strategiem.
3. **Nie włączaj pakietów sam** – tylko na wyraźną prośbę kursanta.
4. Temat spoza otwartych pakietów: powiedz to wprost i nie udawaj, że odpowiedź pochodzi z bazy kursu. Możesz zaproponować wpisanie tematu w panelu programu w polu „Czego Ci brakuje?” – prowadzący dopisuje brakującą wiedzę.
5. Odpowiedź „to konto ma dostęp do całej bazy” (kupujący etap 2 bez grupy) – pakiety go nie dotyczą, pracuj normalnie.
