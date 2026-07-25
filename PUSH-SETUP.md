# Oppsett av push-varsler

Push krever litt engangsoppsett fra deg (koden er ferdig). Alt er gratis på
Spark-planen.

## 1. Hent VAPID-nøkkelen (Web Push-sertifikat)
1. Firebase Console → **Project settings** (tannhjulet) → fanen **Cloud Messaging**.
2. Under **Web configuration / Web Push certificates**: klikk **Generate key pair**.
3. Kopier nøkkelen (en lang streng som begynner på `B...`).
4. Lim den inn i **`felles/push.js`**, erstatt `DIN_VAPID_NØKKEL_HER`:
   ```js
   export const VAPID_KEY = 'B....din-nøkkel....';
   ```
   (Nøkkelen er offentlig – trygg å ha i koden.) Commit endringen.

## 2. Lag en service account (til senderen)
1. Firebase Console → **Project settings** → fanen **Service accounts**.
2. Klikk **Generate new private key** → en JSON-fil lastes ned.
3. GitHub → repoets **Settings → Secrets and variables → Actions → New repository secret**:
   - Navn: `FCM_SERVICE_ACCOUNT`
   - Verdi: **hele innholdet** i JSON-fila (lim inn alt).
4. Sjekk at `FIREBASE_DB_URL` alt finnes som secret (samme som backup-jobben bruker).
   Hvis ikke: legg den til = `https://hjemmebasen-12fc3-default-rtdb.europe-west1.firebasedatabase.app`

## 3. Slå på varsler på enhetene
- Åpne appen → meny → **Min profil & bilder** → **Slå på varsler på denne enheten**.
- Hver enhet/nettleser må gjøre dette selv (tokenet er per enhet).
- **iPhone/iPad:** web-push funker KUN når appen er lagt til på **Hjem-skjermen**
  (iOS 16.4+). Legg den til der først, åpne den derfra, og slå så på varsler.

## Hvordan det virker
- **`firebase-messaging-sw.js`** (service worker) mottar varsler når appen er lukket.
- **`felles/push.js`** ber om tillatelse og lagrer enhetens token under
  `familier/<id>/pushTokens`.
- **`.github/workflows/push.yml`** kjører hver morgen (06:00 UTC ≈ 07–08 norsk),
  leser databasen og sender én morgen-oppsummering per husstand (dagens oppgaver,
  middag, kalenderhendelser) til alle enhetene. Døde tokens ryddes automatisk.
- Vil du teste med en gang: Actions-fanen → **Daglig push-varsel** → **Run workflow**.

## Endre tidspunkt eller innhold
- Tidspunkt: endre `cron` i `.github/workflows/push.yml`.
- Hva som varsles: rediger `byggDigest()` i `scripts/send-push.mjs`.
