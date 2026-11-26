# Hjemmebasen

Husholdningsapper for flere husstander – handleliste, middagsplanlegger,
oppgaver, fryseroversikt, plikter for barn, søvnsporing og helse – som
mobiltilpasset PWA. Vanilla HTML/CSS/JS uten build-steg, Firebase som backend,
og en admin-side der tilgang administreres per husstand.

Avlegger av [ha-apper](https://github.com/larbjo22/ha-apper)
(Home Assistant-versjonen), men helt uten HA-avhengigheter.
Se `DESIGN.md` for arkitekturen, `CONTEXT.md` for vokabularet og `docs/adr/`
for beslutningsloggen.

## Struktur

```
index.html        Offentlig forside – appene, bli-med-flyt og kontaktskjema
hjem.html         Dashbord/launcher – status per aktiv app, responsiv (mobil + PC)
om.html           Videresending til forsiden (gamle lenker)
login.html        Innlogging (e-post/passord, opprettes av admin)
nytt-passord.html Velg nytt passord fra e-postlenken; utløpt lenke → send ny
onboarding.html   Veiviser ved første innlogging: navn, voksne, barn, sted, appvalg
admin.html        Admin: husstander, medlemmer, app-brytere
handleliste.html  Butikkliste + «Diverse» + statistikk
middag.html       Ukesplanlegger, idébank, rulett, uke→handleliste
oppgaver.html     Oppgaver + hus-vedlikehold + gamification
fryser.html       Fryseroversikt («bruk opp»-logikk)
plikter.html      Pliktsporing for barn (poeng/belønninger)
gaver.html        Gavebanken: idébank per person, anledninger med budsjett, status per gave
levering.html     Hvem leverer og henter: fast ukemønster + unntak per dato
klaer.html        Klær og utstyr per barn og størrelse, sesongliste (størrelse fra Vekst)
barnevakt.html    Overleveringsark til barnevakt (leser Søvn, Middag og Helse)
intervju.html     Bursdagsintervju (samme ti spørsmål hvert år) og tidskapsel-brev
felles/imorgen.js «I morgen»-oppsummeringen – brukes av Hjem og kveldsvarselet (Node)
nyheter.html      «Nytt i Hjemmebasen» – release notes for brukerne (innhold i felles/nyheter.js)
felles/           Delte moduler: firebase-init, auth, storage, seed, ui + stil.css
database.rules.json  Security rules (limes inn i Firebase Console)
docs/adr/         Arkitekturbeslutninger (ADR-er)
```

## Release notes

Ved en ny utgave som brukerne merker: legg en ny oppføring **øverst** i `NYHETER` i
`felles/nyheter.js` med ny `id` (f.eks. dato). Hjem viser da banneret «Nytt i Hjemmebasen»
til brukeren har åpnet `nyheter.html`. Skriv for brukere – hva de ser og kan gjøre, ikke kode.

## Kjøre lokalt

Ingen build – bare en statisk server (ESM-moduler krever http, ikke file://):

```bash
python3 -m http.server 8000
# → http://localhost:8000/login.html
```

## Deploy (Cloudflare Pages)

Repoet er privat, og siden publiseres av Cloudflare Pages (se `docs/adr/0008-cloudflare-pages.md`).
Hver push til `main` deployer automatisk. Andre grener får en forhåndsvisning på `<gren>.<prosjekt>.pages.dev`.

- **Build command:** `sh scripts/bygg-side.sh` – kopierer bare appfilene til `dist/` (ingen kompilering)
- **Build output directory:** `dist`
- **Ny fil eller mappe som appen laster** (utenfor `*.html`, `felles/`, `ikoner/`)? Legg den til i `scripts/bygg-side.sh`.

### Flytte fra GitHub Pages til Cloudflare Pages (én gang)

Rekkefølgen holder siden oppe hele veien – GitHub Pages serverer til Cloudflare har tatt over.

1. **Cloudflare → Workers & Pages → Create → Pages → Connect to Git.** Gi Cloudflare-appen tilgang
   til bare `Hjemmebasen`. Framework: *None*, build command og output som over. Deploy.
2. **Firebase → Authentication → Settings → Authorized domains:** legg til `<prosjekt>.pages.dev`.
   Logg inn der og sjekk at appene virker.
3. **Cloudflare → Add a domain → `hjemmebasen.no`** (Free). Sjekk at de importerte DNS-postene er med
   (særlig MX/TXT hvis domenet har e-post). Bytt navnetjenere hos registraren til de to Cloudflare oppgir,
   og vent til domenet står som *Active*. Imens peker de importerte postene fortsatt til GitHub.
4. **Pages-prosjektet → Custom domains → `hjemmebasen.no`** (og `www.hjemmebasen.no` om den brukes).
   Cloudflare bytter selv postene over til Pages. Sjekk siden, innlogging og et push-varsel.
5. **GitHub → Settings → Pages:** fjern det egne domenet og slå av Pages.
   **Actions:** slå av «Deploy static content to Pages» og «Deploy Jekyll with GitHub Pages dependencies preinstalled».
6. **GitHub → Settings → General → Change visibility → Private.**
7. **Actions → «Daglig push-digest» → Run workflow** for å sjekke at de planlagte jobbene
   (push, kalendersynk, backup) fortsatt kjører. I et privat repo teller de mot 2 000 gratis minutter i måneden;
   forbruket er anslått til ca. 500.

## Førstegangsoppsett (Firebase)

1. Firebase-prosjekt med **Authentication** (Email/Password) og
   **Realtime Database** (europe-west1, locked mode)
2. Lim web-appens config inn i `felles/firebase-init.js` (gjort)
3. **Security rules:** kopier innholdet i `database.rules.json` inn i
   Realtime Database → Rules → Publish
4. **Admin-bruker:** Authentication → Users → Add user (din e-post/passord).
   Kopier UID-en, og legg inn i databasen (Realtime Database → Data):
   opprett noden `admins/<UID>` med verdien `true`.
   (Denne noden kan med vilje ikke skrives fra klienten.)
5. Logg inn på `admin.html` og opprett første husstand + medlemmer
6. **Passordlenker:** Authentication → Templates → Password reset → blyanten →
   «Customize action URL» → `https://hjemmebasen.no/nytt-passord.html`.
   (Gjelder alle e-postmalene. Uten dette brukes Firebases egen side, der en
   utløpt lenke er en blindvei.)

## Backup

`.github/workflows/backup.yml` tar kryptert nattlig dump av hele databasen
(artifact, 30 dagers oppbevaring). Krever tre Actions-secrets — se kommentaren
øverst i workflow-fila: `FIREBASE_DB_URL`, `FIREBASE_DB_SECRET`, `BACKUP_PASSORD`.
Enkelthusstander kan i tillegg eksporteres som JSON fra admin-siden.

## Regler for koden

- Vanilla HTML/CSS/JS – ingen rammeverk, npm eller build (ADR-0004)
- Norsk i UI, kommentarer og commit-meldinger
- `esc()` på all brukerdata som settes inn i `innerHTML`
- Datatap-vernet: aldri skriv til en node før én vellykket lesning av den
- Tema via CSS custom properties i `felles/stil.css`
