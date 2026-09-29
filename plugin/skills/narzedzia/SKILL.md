---
name: narzedzia
description: Sprawdza, jakie narzędzia do researchu ma kursant (wyszukiwarka, przeglądarka, Apify, Meta Ads, Semrush, Firecrawl…), pokazuje, co agent zbada, a czego nie, i podpowiada krok po kroku, co warto dodać. Użyj przed badaniem konkurencji lub firmy kursanta, gdy research się nie udaje (strona się nie wczytuje, Facebook zablokowany), albo gdy kursant pyta „jakie narzędzia powinienem mieć”.
---

# Narzędzia do researchu: co mamy, co warto dodać

Agent bada konkurencję na **prawdziwych przykładach**: ich strony, profile, reklamy, opinie klientów. Do tego potrzebuje narzędzi. Nie każdy kursant ma wszystkie – Twoja praca to sprawdzić, co jest, powiedzieć prosto, co z tego wynika, i zaproponować brakujące.

## 1. Sprawdź, co jest dostępne

Przejrzyj listę swoich narzędzi (nie pytaj kursanta o rzeczy, które możesz sprawdzić sam / sama). Szukaj po nazwach:

| Możliwość | Po czym poznasz, że jest | Co daje |
|---|---|---|
| Wyszukiwarka | WebSearch | znalezienie konkurentów po frazie („przeprowadzki Kraków”) |
| Pobieranie stron | WebFetch | treść prostych stron www (bez stron wymagających JavaScriptu) |
| Przeglądarka | narzędzia z „Browser”, „claude-in-chrome”, „computer” w nazwie | strony nowoczesne (JS), publiczne profile Facebook / Instagram, Biblioteka reklam Meta, wizytówki Google Maps, TikTok, YouTube – oglądanie jak człowiek |
| Apify | „apify” w nazwie narzędzia | hurtowo i szybko: reklamy z Biblioteki reklam Meta, opinie z Google Maps, posty FB / IG / TikTok, strony JS |
| Meta Ads | narzędzie `ads_library_search` | oficjalne wyszukiwanie w Bibliotece reklam Meta (wymaga konta reklamowego) |
| Firecrawl / Bright Data | „firecrawl” / „brightdata” w nazwie | pewne czytanie całych stron konkurentów, także z JS i zabezpieczeniami |
| Tavily / You.com | „tavily” / „you” w nazwie narzędzia | lepsze wyszukiwanie i **czytanie całych stron konkurentów** (oferta, cennik, „dlaczego my”) – podstawa analizy, jak się komunikują; raporty z cytatami |
| SEO: OpenSEO / Semrush / Ahrefs | „openseo” / „semrush” / „ahrefs” w nazwie | na jakie frazy konkurent jest widoczny w Google, szacowany ruch, konkurenci w wynikach wyszukiwania |

Wynik zapisz w `.narzedzia.json` w folderze firmy (lista dostępnych możliwości + data), żeby nie sprawdzać przy każdej rozmowie. Sprawdź ponownie, gdy kursant powie, że coś dodał, albo gdy zapis ma ponad miesiąc.

## 2. Pokaż kursantowi, co z tego wynika – i zapytaj o decyzję

To kursant decyduje, czy podłącza narzędzia. Twoja rola: powiedzieć jasno, co zbadamy teraz, czego nie, co da każde narzędzie, ile kosztuje (i jaki ma darmowy limit), a potem zadać jedno pytanie: „Podłączyć teraz czy robimy na tym, co jest?”. Obie odpowiedzi są w porządku. Nie rób analizy „po cichu na mniej” – jeśli czegoś brakuje, ma to być nazwane.

Tabela zadań z listy badania (skill `strateg`, etap konkurencji / subagent `badacz-konkurencji`) i czy je zrobimy:

| Co zbadamy | Status | Czym |
|---|---|---|
| Znalezienie konkurentów | ✅ / ⚠️ / ❌ | … |
| Strony www konkurentów (oferta, ceny, obietnice) | | |
| Opinie klientów konkurencji (Google Maps) | | |
| Profile FB / IG / TikTok (o czym piszą, co działa) | | |
| Aktywne reklamy (Biblioteka reklam Meta) | | |
| Widoczność w Google (frazy) – opcjonalnie | | |

✅ zrobimy automatycznie · ⚠️ zrobimy wolniej / częściowo (np. przez przeglądarkę, po kilka profili) · ❌ nie zrobimy bez dodatkowego narzędzia albo pomocy kursanta.

## 3. Gdy kursant chce podłączyć – prowadź krok po kroku

Jedno narzędzie naraz. Dla każdego: (1) co da w tej analizie, (2) cena i darmowy limit, (3) kroki: gdzie kliknąć w Claude (Ustawienia → Konektory), gdzie się zalogować lub założyć konto (link), co zaakceptować, (4) „napisz »gotowe«, sprawdzę połączenie”. Po „gotowe” sprawdź listę narzędzi ponownie i potwierdź kursantowi, co doszło. Jeśli coś nie działa – jedna próba naprawy (wylogować i połączyć ponownie), potem jedziemy dalej bez tego narzędzia i mówimy to wprost.

**To zawsze propozycja, nie wymóg.** Kursant decyduje, czy coś instaluje. Na start polecaj tylko darmowe narzędzia (nic nie płaci), a jako alternatywę przypomnij, że może poprosić o gotowy raport z systemu kursu zamiast instalować cokolwiek.

**Zawsze mów, po co:** który fragment dokumentu strategicznego dzięki temu narzędziu będzie oparty na faktach, np. „Apify pokaże, jakie reklamy puszczają Twoi konkurenci i od kiedy – to wejdzie do części »Konkurencja« i pomoże ustalić, czym się wyróżnisz”. Bez tego zdania nie proponuj instalacji.

Proponuj **tylko to, co zmieni wynik** dla tego kursanta (np. firma lokalna → opinie Google Maps są kluczowe; e-commerce → reklamy i strony). Zawsze powiedz: co to da, ile kosztuje, ile zajmie dodanie.

**Poziom 0 – nic nie instalujesz (płatny plan Claude):**
- Wbudowana przeglądarka w Claude Desktop albo rozszerzenie **Claude in Chrome**. Agent ogląda strony, profile i Bibliotekę reklam jak człowiek, po kilka naraz. Ważne: **najlepiej bez logowania do Facebooka / Instagrama** albo tylko w małej skali – masowe przeglądanie z Twojego konta może skończyć się blokadą konta.

**Poziom 1 – darmowe na start, jedno kliknięcie:**
- **Apify** (rekomendowany dla kursu): Ustawienia → Konektory → wyszukaj „Apify” → Połącz → zaloguj się (konto Apify jest darmowe, 5 USD kredytów co miesiąc, co zwykle wystarcza na research kilku konkurentów). Daje: reklamy konkurentów, opinie z Google Maps, posty FB / IG / TikTok.
- **Meta Ads** (oficjalny, darmowy w becie): tylko jeśli kursant ma konto reklamowe Meta. Ustawienia → Konektory → Dodaj własny konektor → adres `https://mcp.facebook.com/ads` → zaloguj się kontem Facebook.
- **You.com** (najprostsze, bez konta): lepsze wyszukiwanie dla agenta. Ustawienia → Konektory → Dodaj własny konektor → `https://api.you.com/mcp?profile=free` (100 zapytań dziennie za darmo).
- **Tavily** (1000 kredytów/mies. za darmo): wyszukiwanie + czytanie całych stron konkurentów. Własny konektor `https://mcp.tavily.com/mcp/`, logowanie przez przeglądarkę.
- Opcjonalnie **Firecrawl** (1000 stron miesięcznie za darmo): gdy strony konkurentów się nie wczytują. Własny konektor: `https://mcp.firecrawl.dev/v2/mcp-oauth`.
- Uwaga: na darmowym planie Claude można dodać tylko **jeden własny konektor** (You.com, Tavily, Meta Ads, Firecrawl, OpenSEO to własne konektory). Apify z katalogu się do tego limitu nie wlicza.

**Poziom 2 – płatne, gdy firma żyje z Google / e-commerce:**
- **OpenSEO** (tańsza alternatywa dla Semrush; ok. 10 USD/mies. + opłaty za dane): frazy, na które widoczny jest konkurent, pozycje, backlinki, dane z Google Search Console. Własny konektor: `https://app.openseo.so/mcp` → logowanie kontem OpenSEO. Proponuj tylko, gdy sprzedaż firmy zależy od wyszukiwarki.
- **Semrush / Ahrefs** (katalog konektorów): dokładniejsze dane dla Polski, ale znacznie drożej – tylko dla firm, które już je mają.

**Claude Code (użytkownicy techniczni):** dodatkowo można użyć Playwright MCP (lokalna przeglądarka). W Claude Desktop (Cowork) to nie zadziała – tam tylko narzędzia online.

## Zasady

- **Nigdy nie dodawaj narzędzi ani kont za kursanta** i nie proś o hasła czy klucze w rozmowie. Kursant dodaje konektor sam w ustawieniach; Ty dajesz instrukcję krok po kroku.
- **Płatne narzędzia tylko za zgodą** i z podaną ceną. Najpierw proponuj darmowe.
- Research działa także z samym Poziomem 0 – nie blokuj pracy, gdy kursant nie chce nic dodawać. Powiedz wtedy, czego nie sprawdziliśmy, i zapisz to jako `[DO UZUPEŁNIENIA]` w pliku firmy.
- Dane zbieramy **publiczne i bez logowania** tam, gdzie się da. Nie zbieramy danych osobowych (imion i nazwisk autorów opinii, zdjęć osób).
