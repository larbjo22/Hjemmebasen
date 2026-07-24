# DESIGN – Hjemmebasen

> Designdokument for **Hjemmebasen**: husholdningsappene som delbart,
> webbasert produkt (PWA) med innlogging, onboarding og admin-side.
> Vokabular: `CONTEXT.md` · Beslutningslogg: `docs/adr/`

Status: **godkjent design etter grilling 2026-07-23** · v2

---

## 0. Avklarte beslutninger (grilling)

| Spørsmål | Beslutning |
|---|---|
| Produktnavn | **Hjemmebasen** (repo `hjemmebasen`, app-navn på hjemskjerm og launcher) |
| Database/auth | Firebase Realtime Database + Firebase Auth (e-post/passord) |
| App-aktivering | **Per husstand** – admin (og familien i onboarding) velger hvilke apper huset ser |
| Onboarding | Familienavn + voksne, **barn med fødselsdato**, stedsnavn/posisjon (vær), velg apper |
| Søvnsporing | **Flere barn fra start** – state/økter per barn |
| Hosting | **Offentlig repo + GitHub Pages** (ingen hemmeligheter i koden) |
| Lars' familie | **Migreres ikke** – blir på HA-versjonen (ha-apper). Hjemmebasen er for venner/bekjente |
| Strøm-appen | Utgår i v1 (HA-bundet); spotpris-lite vurderes i v2 |
| Admin-drift | Uten server: sekundær app-instans for brukeropprettelse, gratisplan hele veien |

Konsekvens av «migreres ikke»: `ha-apper` og `hjemmebasen` lever parallelt.
Hjemmebasen får ingen HA/MQTT-kode i det hele tatt – ren Firebase.

---

## 1. Mål og rammer

**Mål:** Venner og bekjente uten Home Assistant bruker hele app-pakka på
mobilen med egne data per husstand. Lars administrerer tilgang.

**Rammer (arves fra ha-apper):**
- Vanilla HTML/CSS/JS – ingen rammeverk, npm eller build-steg (Firebase via CDN)
- Én HTML-fil per app, kompakt mobil-layout, norsk UI
- Tema via CSS custom properties, dark/light + accent-velger
- XSS-sikring med `esc()` på all brukerdata i `innerHTML`

---

## 2. Arkitektur

```
┌──────────────────┐     ┌──────────────────────────────┐
│ GitHub Pages      │     │ Firebase (gratis Spark-plan)  │
│ (offentlig repo)  │     │  Auth: e-post/passord         │
│                   │────▶│  Realtime DB: JSON per familie│
│ index.html (nav)  │     │  Security rules: familie-     │
│ login.html        │     │  isolasjon + admin-rolle      │
│ onboarding.html   │     └──────────────────────────────┘
│ admin.html        │     ┌──────────────────────────────┐
│ 7 apper           │────▶│ Met.no API (vær, gratis)      │
│ felles/*.js       │     └──────────────────────────────┘
└──────────────────┘
```

Ingen egen server. Firebase-config i fronten er offentlig by design –
all sikkerhet ligger i security rules (§7).

---

## 3. Datamodell (Realtime Database)

```jsonc
{
  "admins": { "<lars-uid>": true },   // settes i Console, kan ikke endres fra klient

  "brukere": {
    "<uid>": { "familieId": "fam_a1b2c3", "navn": "Kari",
               "epost": "kari@example.com", "opprettet": 0, "sistSett": 0 }
  },

  "familier": {
    "fam_a1b2c3": {
      "meta": {
        "navn": "Familien Hansen",
        "opprettet": 0, "opprettetAv": "<lars-uid>",
        "onboardet": false,                    // settes true av veiviseren
        "apper": {                             // per husstand (admin + onboarding)
          "handleliste": true, "middag": true, "oppgaver": true,
          "fryser": true, "plikter": true, "sovn": true, "helse": true
        },
        "sted": { "navn": "Oslo", "lat": 59.91, "lon": 10.75 }   // for vær
      },

      // FELLES PERSONREGISTER – fylles av onboarding, brukes av alle appene
      "personer": {
        "voksne": ["Kari", "Ola"],
        "barn": [ { "id": 1, "navn": "Emma", "fodt": "2024-03-12" } ]
      },

      // Appdata – samme JSON-former som ha-apper, med to endringer:
      "handleliste": { "items": [], "history": [], "categories": [], "templates": [], "other": [], "otherPlaces": [], "otherHistory": [] },
      "middag":      { "meals": [], "people": [], "ideas": [] },      // people seedes fra personer.voksne
      "fryser":      { "freezers": [], "categories": [], "history": [], "items": [] },
      "oppgaver":    { "tasks": [], "archive": [], "categories": [], "people": [], "maintenance": [] },
      "plikter":     { "kids": [], "chores": [], "log": [], "rewards": [], "spent": [] },  // kids seedes fra personer.barn

      // ENDRING 1: søvn per barn (flere barn fra start)
      "sovn": {
        "<barnId>": { "state": "awake", "since": 0, "sessions": [], "nextSid": 1, "settings": {} }
      },

      // ENDRING 2: helse.barn refererer personregisteret (id, ikke navn-streng)
      "helse": { "medisiner": [], "doser": [], "vaksiner": [], "syk": [], "nextHid": 10 }
    }
  }
}
```

**Nøkkelendringer fra ha-apper:**
- **Felles personregister** (`personer`) – onboarding fyller det én gang;
  middag/oppgaver/plikter/helse/søvn seedes derfra. Fødselsdato gir
  aldersbaserte våkenvindu-anbefalinger i søvnappen per barn.
- **Søvn per barn**: `sovn/<barnId>` med egen state/økter/innstillinger.
  Søvnappen får barnevelger-chips øverst (skjules ved ett barn).
- `chores` er omdøpt til `plikter` og `leander` til `sovn` (nodenavn og filnavn).

---

## 4. Skjermer og flyt

### 4.1 `login.html`
E-post/passord (`signInWithEmailAndPassword`), sesjon huskes per enhet.
Ingen selvregistrering – brukere opprettes av admin. «Glemt passord» →
reset-e-post. Etter innlogging: `brukere/<uid>` → har familie? → er
`meta.onboardet`? → `onboarding.html` eller `index.html`.

### 4.2 `onboarding.html` – veiviser ved første innlogging i huset
Steg (lagres samlet til slutt, med mulighet for å gå tilbake):
1. **Velkommen** – familienavn (forhåndsutfylt fra admin)
2. **Voksne** – navn på de voksne (chips, legg til/fjern)
3. **Barn** – navn + fødselsdato per barn (kan hoppes over)
4. **Sted** – stedsnavn-søk → lat/lon (Met.no geokoding), for påkledningsråd
5. **Apper** – slå av/på apper for huset (forhåndsvalgt: alle relevante –
   søvn foreslås kun hvis barn under 3 år)
6. **Ferdig** – seed-data skrives (§6), `meta.onboardet = true` → launcher

### 4.3 `index.html` – launcher/hjemside
- App-brett med kun **husets aktiverte apper**
- Topplinje: familienavn + ⚙️ (bytt passord, rediger personer/sted/apper
  – gjenbruker onboarding-stegene enkeltvis, logg ut)
- PWA-install-hint første gang på mobil
- (v1.5: små sammendrag per app – dagens middag, antall varer på lista)

### 4.4 Appene (7 stk)
handleliste, middag, oppgaver, fryser, plikter, sovn (m/ barnevelger + helse-fane
slik ha-apper har i dag – vurderes splittet), alle med:
- `auth.js`-vakt → login ved manglende sesjon, «← Hjem»-knapp til launcher
- `storage.js` med sanntidslyttere i stedet for MQTT/polling
- Deaktivert app åpnet direkte via URL → «Appen er slått av for husstanden» + lenke hjem

### 4.5 `admin.html` – kun Lars
- **Husstander**: opprett (navn → seed §6), se sist aktivitet
- **Apper per hus**: brytere for de 7 appene (speiler `meta.apper`)
- **Brukere per hus**: opprett (e-post + startpassord, via sekundær
  app-instans), send passord-reset, fjern tilgang
- **Re-kjør onboarding** for et hus (setter `meta.onboardet = false`)

Begrensninger (klient-SDK, akseptert i v1): auth-kontoer slettes helt kun
via Firebase Console; admin ser aldri passord (kun reset-e-post).

---

## 5. Felleskode

| Fil | Ansvar |
|---|---|
| `felles/firebase-init.js` | Config (offentlig) + app-init (CDN ESM) |
| `felles/auth.js` | Innloggingsvakt, `familieId()`, redirect, sistSett |
| `felles/storage.js` | `dbGet/dbSet/dbListen(app)` – med datatap-vern: skriv nektes før første vellykkede lesning |
| `felles/personer.js` | Lese/endre personregisteret + seed-hjelpere |
| `felles/ui.js` | `esc()`, `todayStr()`, tema/accent, felles topplinje |
| `felles/vaer.js` | Met.no locationforecast + geokoding |
| `manifest/` | Web-manifest + ikoner (192/512) per app + launcher |

---

## 6. Seed-data («ikke en tom versjon»)

Skrives ved onboarding (og ved admin-opprettelse som fallback):

| App | Seed |
|---|---|
| handleliste | 10 standardkategorier, 5 maler, standard «Diverse»-steder |
| middag | `people` = voksne fra onboarding + «Felles»; 6–8 eksempel-ideer med tags |
| fryser | 1 fryser, standardkategorier |
| oppgaver | Standardkategorier; `people` = voksne |
| plikter | `kids` = barn fra onboarding; 3 eksempel-plikter |
| helse | Paracet (4 t/maks 4) + Ibux (6 t/maks 3), barn fra registeret |
| sovn | Node per barn under ~3 år, aldersbaserte våkenvindu-forslag fra fødselsdato |

---

## 7. Security rules (leveres komplett i etappe 1)

Som v1-skissen: `admins` kun lesbar for admin og aldri skrivbar fra klient;
`brukere` skrives kun av admin (unntak: egen `sistSett`); `familier/$id`
les/skriv kun for medlemmer av $id eller admin.

**Testplan (kjøres før noen inviteres):**
1. Medlem av familie A: full tilgang A, «permission denied» på B
2. Bruker uten medlemskap: ingen lesetilgang
3. Ikke-admin kan ikke skrive `admins`/`brukere`/andres `meta`
4. Utlogget klient: ingen tilgang
5. Bruker kan ikke endre egen `familieId` (kun admin)

---

## 8. Etapper

| Etappe | Innhold |
|---|---|
| **1. Fundament** | Repo, GitHub Pages, firebase-init, auth.js + login, admin.html (hus/brukere/app-brytere/seed), security rules + testplan, launcher-skjelett |
| **2. Onboarding + kjerneapper** | onboarding.html (6 steg), personregister, handleliste + middag + oppgaver + fryser + plikter på storage.js med sanntid |
| **3. Søvn + helse** | sovn.html med flere barn (barnevelger, per-barn state/økter/innstillinger), helse mot personregisteret, vær via Met.no |
| **4. PWA + polish** | Manifest/ikoner, install-flyt, deaktivert-app-håndtering, tom-tilstander, dokumentasjon (README + drift for Lars) |

Estimat: **6–8 dager kalendertid** (flere-barn-søvn la på ~1 dag), koding i
økter med Lars' testrunder mellom. Hver etappe = egen PR i `hjemmebasen`.

**Lars' manuelle steg før etappe 1:** (guide levert)
1. Opprett offentlig repo `hjemmebasen` på GitHub + legg til i Claude-sesjonen
2. Firebase: prosjekt + Auth (e-post/passord) + Realtime DB (europe-west1,
   locked mode) → lim `firebaseConfig` til Claude
3. Opprett egen admin-bruker i Authentication → lim UID til Claude
4. (Etappe 1-leveranse) Lim inn security rules i Console

---

## 9. Risikoer og tiltak

| Risiko | Tiltak |
|---|---|
| Rules-feil → datalekkasje mellom familier | Testplan §7 før noen inviteres; rules reviewes som egen PR-del |
| Helsedata om barn hos bekjente | E-postinnlogging, familie-isolasjon, ingen sporing/analyse i appene |
| Lars blir «support» | Admin-side for alt vanlig; passord-reset er selvbetjent |
| Samtidig redigering (last-write-wins per blob) | Sanntidslyttere krymper vinduet til <1 s; per-felt-skriving i v2 |
| To kodebaser (ha-apper + hjemmebasen) | Bevisst valgt; forbedringer porteres manuelt ved behov. Revurderes hvis vedlikehold svir |
| Gratisgrenser | 20–30 familier < 1 % av Spark-grensene |
| iOS-quirks (PWA) | Lars tester på iPhone per etappe; web-push utsettes til v2 |

## 10. Veikart etter v1

- **v2:** strøm-lite (spotpris via hvakosterstrommen.no), offline (service
  worker), push-varsler (web push, iOS 16.4+), dataeksport i admin,
  launcher-sammendrag, per-felt-skriving
- **v3:** Capacitor → App Store / Google Play (Apple Developer $99/år + Mac;
  aktuelt først ved distribusjon utover bekjente)
