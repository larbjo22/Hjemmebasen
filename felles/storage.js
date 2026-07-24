// ── storage.js ───────────────────────────────────────────────
// Lese/skrive/lytte på én app-node under husstanden. Erstatter mqttGet/
// mqttSet fra ha-apper. Datatap-vernet håndheves her: dbSet nekter å skrive
// til en node som ikke har hatt én vellykket lesning i denne sesjonen.
import { db } from './auth.js';
import {
  ref, get, set, onValue,
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js';

const lest = new Set(); // "familieId/appNavn" → trygt å skrive

function sti(familieId, appNavn) { return 'familier/' + familieId + '/' + appNavn; }

// Én lesning. null hvis noden er tom – men noden markeres uansett som lest,
// for en vellykket lesning av en tom node er et ekte svar (ny husstand).
export async function dbGet(familieId, appNavn) {
  const snap = await get(ref(db, sti(familieId, appNavn)));
  lest.add(familieId + '/' + appNavn);
  return snap.exists() ? snap.val() : null;
}

// Skriv hele app-bloben. Kaster ved brudd på datatap-vernet.
export async function dbSet(familieId, appNavn, data) {
  if (!lest.has(familieId + '/' + appNavn)) {
    throw new Error('Datatap-vern: «' + appNavn + '» er ikke lest ennå – nekter å skrive.');
  }
  await set(ref(db, sti(familieId, appNavn)), data);
}

// Skriv én undernøkkel i app-noden (f.eks. sovn/<barnId>) – kirurgisk
// skriving som ikke rører søsken-nøkler. Samme datatap-vern som dbSet.
export async function dbSetSub(familieId, appNavn, subKey, data) {
  if (!lest.has(familieId + '/' + appNavn)) {
    throw new Error('Datatap-vern: «' + appNavn + '» er ikke lest ennå – nekter å skrive.');
  }
  await set(ref(db, sti(familieId, appNavn) + '/' + subKey), data);
}

// Sanntidslytter. Første verdi markerer noden som lest (som dbGet).
// Returnerer en stopp-funksjon.
export function dbListen(familieId, appNavn, callback) {
  return onValue(ref(db, sti(familieId, appNavn)), snap => {
    lest.add(familieId + '/' + appNavn);
    callback(snap.exists() ? snap.val() : null);
  });
}
