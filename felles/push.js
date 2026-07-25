// ── push.js ──────────────────────────────────────────────────
// Klientside for push-varsler (Firebase Cloud Messaging).
// Registrerer service worker, ber om tillatelse, henter et token og
// lagrer det på husstanden. Selve SENDINGEN gjøres av en GitHub Action
// (scripts/send-push.mjs) – her handler vi bare om enheten skal motta.
import { app } from './firebase-init.js';
import { db } from './auth.js';
import { getMessaging, getToken, isSupported } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging.js';
import { ref, set, remove } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js';

// Offentlig VAPID-nøkkel (Web Push-sertifikat). Hentes i Firebase Console →
// Project settings → Cloud Messaging → «Web configuration» → Generate key pair.
// Lim inn den offentlige nøkkelen her (den er offentlig, trygt i koden).
export const VAPID_KEY = 'BNXHHXkP2WatdU9dS3I7UmvP80yjZjIRSP0pwmEXBFs89MDq-sCmFliCyv-SnY85jfOHRKZPCqtsmUc1jR1tD1Y';

// RTDB-nøkler tåler ikke . # $ [ ] / – token lagres derfor under en «trygg»
// nøkkel, mens det ekte tokenet ligger i verdien (som senderen bruker).
function tokenNokkel(token) { return token.replace(/[.#$/[\]]/g, '_'); }

export async function varslerStottet() {
  try { return 'serviceWorker' in navigator && 'Notification' in window && await isSupported(); }
  catch { return false; }
}

export function varslerTillatt() {
  return typeof Notification !== 'undefined' && Notification.permission === 'granted';
}

// Slår på varsler på DENNE enheten. Kaster med en forklarende feilmelding.
export async function aktiverVarsler(familieId, uid, navn) {
  if (!await varslerStottet()) throw new Error('Varsler støttes ikke i denne nettleseren. På iPhone må appen først legges til på Hjem-skjermen.');
  if (VAPID_KEY.startsWith('DIN_')) throw new Error('Push er ikke ferdig satt opp ennå (mangler VAPID-nøkkel).');
  const reg = await navigator.serviceWorker.register('firebase-messaging-sw.js');
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') throw new Error('Du må tillate varsler i nettleseren.');
  const token = await getToken(getMessaging(app), { vapidKey: VAPID_KEY, serviceWorkerRegistration: reg });
  if (!token) throw new Error('Fikk ikke varslingstoken – prøv igjen.');
  await set(ref(db, 'familier/' + familieId + '/pushTokens/' + tokenNokkel(token)),
    { token, uid, navn: navn || '', ts: Date.now() });
  return token;
}

// Slår av på denne enheten (fjerner tokenet fra husstanden).
export async function deaktiverVarsler(familieId, token) {
  if (!token) return;
  await remove(ref(db, 'familier/' + familieId + '/pushTokens/' + tokenNokkel(token))).catch(() => {});
}
