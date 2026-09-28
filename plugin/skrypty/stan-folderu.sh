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
  case "$d" in *archiwum*|plugin*|node_modules) continue ;; esac
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
echo "Na początku rozmowy użyj skilla start (Opiekun): inwentaryzacja, co już jest, czego brakuje do dokumentu strategicznego, następny krok."
