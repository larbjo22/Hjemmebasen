# HANDOFF – Hjemmebasen

> Overleveringsdokument for å fortsette arbeidet i en ny session.
> Les dette først, deretter `README.md`, `DESIGN.md` (arkitektur),
> `CONTEXT.md` (vokabular) og `docs/adr/` (beslutninger). **Svar alltid på norsk.**

Sist oppdatert: 2026-07-25. Aktiv branch: `claude/hjemmebasis-website-jytrko`.

---

## 1. Hva denne økta handlet om

Bygde en **offentlig presentasjonsside** for Hjemmebasen og installerte et sett
**Claude Code-skills**. Ingen endringer i selve app-koden (handleliste, middag osv.).

---

## 2. Status – hva som er gjort

### 2a. `om.html` – presentasjonsside (LIVE på `main`)
Landingsside i Gran-designet (gjenbruker `felles/stil.css` + `gran.css`, tema-toggle
fra `felles/ui.js`). Seksjoner:
- **Hero** med personlig jeg-stemme + CSS-mockup av launcheren.
- **Ti apper** presentert med ikon/beskrivelse + skrollbar «telefon»-karusell (rene
  CSS-mockups, fiktive data – ingen ekte data eksponeres).
- **Slik blir dere med** (3 steg), **Trygt og privat** (personvern), **kontaktskjema**.
- Lenket fra `login.html` («Hva er Hjemmebasen?»).

Tekst er bevisst skrevet **mindre AI-preget** (jeg-stemme, få em-streker, ingen floskler).

**Kontaktskjema** poster til FormSubmit (`formsubmit.co/ajax/<base64-epost>`):
- Mottaker: `larspebj@gmail.com` (base64-kodet i JS, ikke klartekst).
- Spamvern uten tredjepart: obligatorisk «Hvor hørte du om Hjemmebasen?»-felt,
  «Jeg er ikke en robot»-avkryssing, usynlig tidsfelle (<2,5 s = bot), honningkrukke.

### 2b. Skills (PR #17 – ÅPEN)
Sju skills fra [emilkowalski/skills](https://github.com/emilkowalski/skills) (MIT)
lagt under `.claude/skills/`: `emil-design-eng`, `review-animations`,
`improve-animations`, `find-animation-opportunities`, `animation-vocabulary`,
`apple-design`, `pick-ui-library`. Med `README.md` + `LICENSE-emil-skills`.

### PR-historikk
- **PR #14** (om.html + tekst + skjema/spamvern): **merget** til `main`.
- **PR #17** (skills under `.claude/skills/`): **åpen** – inneholder også denne HANDOFF-fila.

---

## 3. Åpne punkter / neste steg

1. **Merge PR #17** for å ta i bruk skill-ene. De blir tilgjengelige som `/emil-design-eng`
   osv. i en **ny** Claude Code-økt (skills lastes ved oppstart).
2. **Aktiver FormSubmit:** første innsending av kontaktskjemaet utløser en aktiverings-
   e-post til `larspebj@gmail.com` som må bekreftes **én gang** før meldinger kommer inn.
   Send en testmelding selv etter deploy.
3. **DNS for `hjemmebasen.no`:** var under arbeid ved øktas slutt. Sjekk
   **Settings → Pages** for grønn hake. Rot-domenet trenger fire A-records mot GitHub:
   `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`. `CNAME`-fila (`hjemmebasen.no`)
   skal **ikke** fjernes. Til `main` er deployet, ligger siden også på
   `larbjo22.github.io/hjemmebasen/om.html` (men redirecter til domenet når CNAME er satt).

---

## 4. Veien videre (diskutert, ikke besluttet)

Eieren vil **ikke tjene penger** – målet er at folk faktisk bruker det. Landet på:
- **Fokus-produktet er kjøkken-trioen:** handleliste + fryser + middag. Tettest
  integrasjonssløyfe (planlegg middag → handleliste fylles → fryser sier hva du har),
  og null sensitive data (unngår GDPR-barnehelse-problematikk).
- **Neste egentlige byggejobb: selvbetjent onboarding.** I dag opprettes hver husstand
  for hånd av admin. For at det skal spre seg uten eier i loopen: la nye brukere
  registrere seg selv → egen husstand automatisk. Treffer security rules
  (`admins` er låst, husstander opprettes av admin i dag).
  - Tryggere mellomting: la **eksisterende brukere invitere** (viral loop) via den
    eksisterende invitasjonskode-mekanikken i `bli-med.html`.
- **Firebase-tak:** Spark-gratis holder til lave hundretalls lette husstander
  (~100 samtidige tilkoblinger, 1 GB). Vurder å kappe registrering, ev. Blaze hvis det tar av.
- **Ikke lag en tredje kodebase.** Behold én (`hjemmebasen`); la kjøkken-trioen være
  «inngangsdøra» utad, med de andre appene som valgfrie.

---

## 5. Fallgruver / regler (arvet)

- Vanilla HTML/CSS/JS – ingen rammeverk/npm/build. Valider JS med `node --check`.
- `esc()` på all brukerdata i `innerHTML`. Norsk i UI, kommentarer og commits.
- Datatap-vernet: aldri skriv til en node før én vellykket lesning.
- Fjernmiljøet er flyktig – alt som ikke committes/pushes forsvinner.
- `om.html` bruker Tabler-ikoner via CDN; ikoner vises ikke i sandkasse-forhåndsvisning,
  men fint i ekte nettleser.
