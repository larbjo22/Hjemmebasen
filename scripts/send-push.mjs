// Daglig push-digest. Kjøres av GitHub Action (.github/workflows/push.yml).
// Leser hele databasen via firebase-admin og sender ett varsel per husstand
// til alle registrerte enheter. Sender ingenting hvis det ikke er noe å melde.
//   MODUS=morgen (standard): dagens oppgaver, middag og kalenderhendelser
//   MODUS=kveld: «I morgen» – levering/henting, kalender, middag, ta ut av fryseren,
//                oppgaver og bursdager (felles/imorgen.js, samme som kortet på Hjem)
//
// Secrets (Settings → Secrets → Actions):
//   FCM_SERVICE_ACCOUNT = hele service-account-JSON-en (Firebase Console →
//                         Project settings → Service accounts → Generate new private key)
//   FIREBASE_DB_URL     = https://hjemmebasen-12fc3-default-rtdb.europe-west1.firebasedatabase.app
import admin from 'firebase-admin';

const MODUS = process.env.MODUS === 'kveld' ? 'kveld' : 'morgen';
// felles/imorgen.js er en ES-modul (samme kode som Hjem). Den lastes bare i kveldsmodus,
// og krever at workflowen har satt "type": "module" i package.json. Morgen-digesten
// fungerer derfor som før selv om workflowen ikke er oppdatert.
const { imorgenLinjer, datoPluss } = MODUS === 'kveld' ? await import('../felles/imorgen.js') : {};

const svcRaw = process.env.FCM_SERVICE_ACCOUNT;
// Databasens URL er OFFENTLIG (ligger i felles/firebase-init.js), så den er
// hardkodet som standard – kan overstyres med FIREBASE_DB_URL-secret om ønskelig.
const dbUrl = process.env.FIREBASE_DB_URL
  || 'https://hjemmebasen-12fc3-default-rtdb.europe-west1.firebasedatabase.app';
if (!svcRaw) {
  console.error('::error::FCM_SERVICE_ACCOUNT mangler – legg til som Actions-secret.');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(svcRaw)),
  databaseURL: dbUrl,
});

// Dagens dato (YYYY-MM-DD) i norsk tidssone – uavhengig av UTC-runneren.
function osloIdag() {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Oslo', year: 'numeric', month: '2-digit', day: '2-digit' });
  return f.format(new Date()); // en-CA gir YYYY-MM-DD
}

function byggDigest(fam, idag) {
  const meta = fam.meta || {};
  const apper = meta.apper || {};
  const av = a => apper[a] === false;
  const deler = [];

  if (!av('oppgaver')) {
    const aapne = (fam.oppgaver?.tasks || []).filter(t => !t.done && t.date);
    const forfalt = aapne.filter(t => t.date < idag).length;
    const idagO = aapne.filter(t => t.date === idag).length;
    if (forfalt) deler.push(forfalt + ' på overtid');
    if (idagO) deler.push(idagO + ' oppgave' + (idagO === 1 ? '' : 'r') + ' i dag');
  }
  if (!av('kalender')) {
    const k = (fam.kalender?.hendelser || []).filter(h => h.dato === idag);
    if (k.length) deler.push(k.length + ' i kalenderen');
  }
  let middagLinje = '';
  if (!av('middag')) {
    const m = (fam.middag?.meals || []).find(x => x.date === idag);
    if (m) middagLinje = 'Middag i dag: ' + m.meal;
  }

  if (!deler.length && !middagLinje) return null;
  const body = [deler.length ? deler.join(' · ') : '', middagLinje].filter(Boolean).join('. ');
  return { title: 'God morgen' + (meta.navn ? ' – ' + meta.navn : ''), body };
}

// Kveldsvarselet: de viktigste linjene for i morgen. Bare levering/henting alene er ikke
// nok til et varsel (det er likt hver uke) – det må være noe mer, eller et unntak.
function byggKveld(fam, idag) {
  const imorgen = datoPluss(idag, 1);
  const l = imorgenLinjer(fam, imorgen);
  const ekstra = l.filter(x => x.ikon !== 'ti-car');
  const unntak = !!(fam.levering?.unntak || {})[imorgen];
  if (!ekstra.length && !unntak) return null;
  const sortert = [...l.filter(x => x.viktig), ...l.filter(x => !x.viktig)];
  const body = sortert.slice(0, 4).map(x => x.tekst).join(' · ') + (sortert.length > 4 ? ' · +' + (sortert.length - 4) + ' til' : '');
  const dag = new Date(imorgen + 'T12:00:00').toLocaleDateString('nb-NO', { weekday: 'long' });
  return { title: 'I morgen, ' + dag, body };
}

const snap = await admin.database().ref('/').once('value');
const root = snap.val() || {};
const familier = root.familier || {};
const idag = osloIdag();
let sendt = 0, husstander = 0;

for (const [fid, fam] of Object.entries(familier)) {
  const tokensObj = fam.pushTokens || {};
  const oppf = Object.entries(tokensObj); // [nokkel, {token,...}]
  const tokens = oppf.map(([, v]) => v && v.token).filter(Boolean);
  if (!tokens.length) continue;
  const digest = MODUS === 'kveld' ? byggKveld(fam, idag) : byggDigest(fam, idag);
  if (!digest) continue;
  husstander++;

  const res = await admin.messaging().sendEachForMulticast({
    tokens,
    notification: { title: digest.title, body: digest.body },
    webpush: { fcmOptions: { link: 'https://hjemmebasen.no/' + (MODUS === 'kveld' ? 'hjem.html' : 'index.html') } },
  });
  sendt += res.successCount;

  // Rydd bort døde tokens (avinstallert / utløpt)
  await Promise.all(res.responses.map((r, i) => {
    const kode = r.error && r.error.code;
    if (kode === 'messaging/registration-token-not-registered' || kode === 'messaging/invalid-argument') {
      const [nokkel] = oppf[i];
      return admin.database().ref('familier/' + fid + '/pushTokens/' + nokkel).remove().catch(() => {});
    }
  }));
}

console.log(`[${MODUS}] Sendte ${sendt} varsler til ${husstander} husstand(er). Dato: ${idag}.`);
process.exit(0);
