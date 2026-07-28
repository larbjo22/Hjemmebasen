// Henter eksterne iCal-kalendere (Google/Spond/barnehage …) og skriver
// hendelsene inn i Firebase, slik at Hjemmebasen kan vise dem read-only.
// Kjøres av GitHub Action (.github/workflows/ics-sync.yml).
//
// Løser CORS ved å hente server-side. Skriver til
//   familier/<fid>/kalender_eksterne/<feedId> = [{tittel, dato, tid}]
// Leser abonnementene fra familier/<fid>/kalender_abonnement (satt i appen).
//
// Secret: FCM_SERVICE_ACCOUNT (samme som push). DB-URL er offentlig (default).
import admin from 'firebase-admin';
import ical from 'node-ical';

const svcRaw = process.env.FCM_SERVICE_ACCOUNT;
const dbUrl = process.env.FIREBASE_DB_URL
  || 'https://hjemmebasen-12fc3-default-rtdb.europe-west1.firebasedatabase.app';
if (!svcRaw) { console.error('::error::FCM_SERVICE_ACCOUNT mangler.'); process.exit(1); }

admin.initializeApp({ credential: admin.credential.cert(JSON.parse(svcRaw)), databaseURL: dbUrl });
const db = admin.database();

// Datoer i norsk tidssone (uavhengig av UTC-runneren)
const fDato = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Oslo', year: 'numeric', month: '2-digit', day: '2-digit' });
const fTid = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Oslo', hour: '2-digit', minute: '2-digit', hour12: false });

const now = new Date();
const vindStart = new Date(now.getTime() - 7 * 86400000);    // 1 uke tilbake
const vindSlutt = new Date(now.getTime() + 120 * 86400000);  // 120 dager fram
const MAKS = 300;                                            // tak per feed

function tilRad(ev, occStart) {
  const start = occStart || new Date(ev.start);
  const allDag = ev.datetype === 'date';
  return {
    tittel: String(ev.summary || '(uten tittel)').slice(0, 80),
    dato: fDato.format(start),
    tid: allDag ? '' : fTid.format(start),
  };
}

const root = (await db.ref('familier').once('value')).val() || {};
let husst = 0, feeds = 0, hendelser = 0;

for (const [fid, fam] of Object.entries(root)) {
  const ab = fam.kalender_abonnement;
  if (!Array.isArray(ab) || !ab.length) continue;
  husst++;
  const eksMap = {};
  for (const a of ab) {
    if (!a || !a.url) continue;
    feeds++;
    const ut = [];
    try {
      const data = await ical.async.fromURL(a.url);
      for (const k in data) {
        const ev = data[k];
        if (!ev || ev.type !== 'VEVENT') continue;
        if (ev.rrule) {
          // Gjentakende: ekspander innenfor vinduet
          for (const o of ev.rrule.between(vindStart, vindSlutt, true)) {
            ut.push(tilRad(ev, o));
            if (ut.length >= MAKS) break;
          }
        } else if (ev.start) {
          const st = new Date(ev.start);
          if (st >= vindStart && st <= vindSlutt) ut.push(tilRad(ev));
        }
        if (ut.length >= MAKS) break;
      }
    } catch (e) {
      console.log('Feil for feed «' + (a.navn || a.id) + '»: ' + e.message);
      continue; // behold evt. tidligere data for denne feeden urørt? nei – hopp
    }
    eksMap[a.id] = ut;
    hendelser += ut.length;
  }
  await db.ref('familier/' + fid + '/kalender_eksterne').set(eksMap);
}

console.log(`Synket ${feeds} feed(er) i ${husst} husstand(er) – ${hendelser} hendelser.`);
process.exit(0);
