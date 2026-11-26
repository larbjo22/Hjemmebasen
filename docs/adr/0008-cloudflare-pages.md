# Cloudflare Pages i stedet for GitHub Pages – privat repo

Repoet skal være privat: koden, notatene, PR-historikken og `docs/` er ikke ment for alle.
GitHub Pages publiserer bare fra offentlige repoer på gratisplanen, så hostingen flyttes til
Cloudflare Pages, som publiserer gratis fra private repoer. Domenet `hjemmebasen.no` er det samme,
så innlogging, hjemskjerm-appen og push-varsler (alt knyttet til adressen) virker som før.

GitHub Pages-workflowen lastet opp hele repoet, så også `docs/`, `scripts/`, `*.md`, `.claude/` og
`database.rules.json` lå åpent på nettsiden. Cloudflare kjører `scripts/bygg-side.sh`, som kopierer
bare filene appen bruker (`*.html`, `felles/`, `ikoner/`, manifest og service worker) til `dist/`.
Det er en kopi, ikke kompilering – ADR-0004 (ingen build) gjelder fortsatt.

## Consequences

- Ny fil eller mappe som appen laster, må legges til i `scripts/bygg-side.sh`, ellers mangler den på siden.
- De planlagte jobbene (push, kalendersynk, backup) kjører fortsatt i GitHub Actions, men teller nå mot
  2 000 gratis minutter i måneden. Anslått forbruk er ca. 500.
- Cloudflare serverer filene med `max-age=0` og ETag, så endringer når brukerne uten `?v=`-triks.
- Gjør vi repoet offentlig igjen, kan Cloudflare fortsatt publisere – ingenting må tilbake til GitHub Pages.
