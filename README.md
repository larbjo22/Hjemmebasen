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
index.html        Dashbord/launcher – status per aktiv app, responsiv (mobil + PC)
login.html        Innlogging (e-post/passord, opprettes av admin)
onboarding.html   Veiviser ved første innlogging: navn, voksne, barn, sted, appvalg
admin.html        Admin: husstander, medlemmer, app-brytere
handleliste.html  Butikkliste + «Diverse» + statistikk
middag.html       Ukesplanlegger, idébank, rulett, uke→handleliste
oppgaver.html     Oppgaver + hus-vedlikehold + gamification
fryser.html       Fryseroversikt («bruk opp»-logikk)
plikter.html      Pliktsporing for barn (poeng/belønninger)
felles/           Delte moduler: firebase-init, auth, storage, seed, ui + stil.css
database.rules.json  Security rules (limes inn i Firebase Console)
docs/adr/         Arkitekturbeslutninger (ADR-er)
```

## Kjøre lokalt

Ingen build – bare en statisk server (ESM-moduler krever http, ikke file://):

```bash
python3 -m http.server 8000
# → http://localhost:8000/login.html
```

## Deploy (GitHub Pages)

Settings → Pages → «Deploy from a branch» → `main` / rot (`/`) → Save.
Siden blir liggende på `https://larbjo22.github.io/hjemmebasen/`.
Hver push til `main` deployer automatisk.

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

## Regler for koden

- Vanilla HTML/CSS/JS – ingen rammeverk, npm eller build (ADR-0004)
- Norsk i UI, kommentarer og commit-meldinger
- `esc()` på all brukerdata som settes inn i `innerHTML`
- Datatap-vernet: aldri skriv til en node før én vellykket lesning av den
- Tema via CSS custom properties i `felles/stil.css`
