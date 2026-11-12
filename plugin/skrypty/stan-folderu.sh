#!/usr/bin/env bash
# Hook SessionStart: krótki obraz folderu firmy dla Opiekuna (trafia do kontekstu rozmowy).
# Nie ocenia treści – to robi Opiekun (inwentaryzacja w skillu start). Tu tylko fakty: co leży w folderze.
KATALOG="${CLAUDE_PROJECT_DIR:-$PWD}"
cd "$KATALOG" 2>/dev/null || exit 0

echo "[Plugin AI w biznesie i marketingu] Folder firmy: $(basename "$KATALOG")"
[[ -f CLAUDE.md ]] && echo "- Jest CLAUDE.md kursanta (przeczytaj przed pracą, nie nadpisuj)."
[[ -f README.md ]] && echo "- Jest README.md."

# foldery najwyższego poziomu z liczbą dokumentów (bez archiwów, ukrytych i wtyczek)
foldery=""
for d in */; do
  d="${d%/}"
  case "$d" in *archiwum*|prywatne|plugin*|node_modules) continue ;; esac
  n=$(find "$d" -type f \( -iname '*.md' -o -iname '*.pdf' -o -iname '*.docx' -o -iname '*.xlsx' -o -iname '*.html' -o -iname '*.txt' \) -not -path '*/.*' 2>/dev/null | wc -l | tr -d ' ')
  [[ "$n" -gt 0 ]] && foldery+="  - $d/: $n plików"$'\n'
done
luzem=$(find . -maxdepth 1 -type f \( -iname '*.md' -o -iname '*.pdf' -o -iname '*.docx' -o -iname '*.xlsx' -o -iname '*.txt' \) -not -name 'CLAUDE.md' -not -name 'README.md' -not -name '.*' | wc -l | tr -d ' ')
if [[ -n "$foldery" || "$luzem" -gt 0 ]]; then
  echo "- Zawartość:"; printf '%s' "$foldery"; [[ "$luzem" -gt 0 ]] && echo "  - pliki w głównym folderze: $luzem"
else
  echo "- Folder jest pusty (brak dokumentów o firmie)."
fi

if [[ -f .postep.json ]]; then
  echo "- Zapis postępu (.postep.json):"; head -c 2500 .postep.json; echo
else
  echo "- Brak .postep.json – potrzebna inwentaryzacja (skill start)."
fi
# drugi mózg: tylko fakty o rytmie (nazwy plików), bez czytania treści
if [[ -f index.md && -d warsztat ]]; then
  dzis=$(date +%Y-%m-%d)
  wczoraj=$(date -v-1d +%Y-%m-%d 2>/dev/null || date -d yesterday +%Y-%m-%d 2>/dev/null)
  echo "- Drugi mózg: założony (index.md + warsztat/)."
  if compgen -G "raporty/brief-${dzis}-*" >/dev/null; then echo "  - brief na dziś: jest"; else echo "  - brief na dziś: brak (/rano)"; fi
  if [[ -n "$wczoraj" ]]; then
    if compgen -G "raporty/dzien-${wczoraj}-*" >/dev/null; then echo "  - sprawozdanie z wczoraj: jest"; else echo "  - sprawozdanie z wczoraj: brak"; fi
  fi
  wejscie=$(find warsztat/wejscie -type f -not -name '.*' 2>/dev/null | wc -l | tr -d ' ')
  [[ "$wejscie" -gt 0 ]] && echo "  - w skrzynce warsztat/wejscie/: $wejscie plików (/zapisz)"
fi
# zarząd: tylko nazwy teczek, bez treści
if [[ -d zarzad ]]; then
  teczki=$(find zarzad -maxdepth 1 -name '*.md' -exec basename {} .md \; 2>/dev/null | sort | tr '\n' ' ')
  [[ -n "$teczki" ]] && echo "- Zarząd: teczki $teczki(/zarzad – narada, /<rola> – rozmowa z dyrektorem)"
fi
echo "Na początku rozmowy użyj skilla start (Opiekun): inwentaryzacja, co już jest, czego brakuje do dokumentu strategicznego, następny krok."
