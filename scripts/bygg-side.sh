#!/bin/sh
# Bygger mappa som Cloudflare Pages publiserer (dist/).
# Ingen kompilering – bare en kopi av filene appen faktisk bruker, slik at notater,
# dokumentasjon, skript og .claude/ ikke ligger åpent på hjemmebasen.no.
# Cloudflare Pages: Build command «sh scripts/bygg-side.sh», Build output directory «dist».
# Ny fil eller mappe som appen laster? Legg den til i lista under.
set -eu
cd "$(dirname "$0")/.."
rm -rf dist
mkdir -p dist
cp ./*.html dist/
cp -R felles ikoner dist/
cp manifest.webmanifest firebase-messaging-sw.js dist/
# Sikkerhetsnett: stopp hvis noe som ikke skal ut, likevel havnet i dist/
for f in dist/*.md dist/database.rules.json dist/scripts dist/docs dist/.claude dist/.github; do
  if [ -e "$f" ]; then echo "Feil: $f skal ikke publiseres" >&2; exit 1; fi
done
echo "dist/ klar: $(find dist -type f | wc -l | tr -d ' ') filer"
