// ── auth.js ──────────────────────────────────────────────────
// Innloggingsvakt og auth-hjelpere. Alle sider (unntatt login.html) kaller
// requireAuth() først; den redirecter til login ved manglende sesjon.
import { app } from './firebase-init.js';
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  sendPasswordResetEmail, sendEmailVerification, signOut,
  setPersistence, browserLocalPersistence,
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {
  getDatabase, ref, get, update,
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js';

export const auth = getAuth(app);
auth.languageCode = 'nb'; // Firebase-e-poster (passord-reset) sendes på norsk
export const db = getDatabase(app);

// Venter på at Firebase har avgjort innloggingsstatus (én gang).
function ventPaaAuth() {
  return new Promise(resolve => {
    const stopp = onAuthStateChanged(auth, user => { stopp(); resolve(user); });
  });
}

// Krever innlogget bruker. Returnerer {user, medlem, erAdmin, familieId}.
// - Ikke innlogget → redirect til login.html
// - adminKreves og ikke admin → redirect til index.html
// - Innlogget men uten medlemskap (og ikke admin) → 'ingen-tilgang'-callback
export async function requireAuth({ adminKreves = false, utenTilgang = null } = {}) {
  const user = await ventPaaAuth();
  if (!user) { location.replace('login.html'); return new Promise(() => {}); }

  const [medlemSnap, adminSnap] = await Promise.all([
    get(ref(db, 'brukere/' + user.uid)).catch(() => null),
    get(ref(db, 'admins/' + user.uid)).catch(() => null),
  ]);
  const medlem = medlemSnap && medlemSnap.exists() ? medlemSnap.val() : null;
  const erAdmin = !!(adminSnap && adminSnap.val() === true);

  if (adminKreves && !erAdmin) { location.replace('index.html'); return new Promise(() => {}); }
  if (!medlem && !erAdmin) {
    if (typeof utenTilgang === 'function') { utenTilgang(user); return new Promise(() => {}); }
    location.replace('login.html?feil=ingen-tilgang');
    return new Promise(() => {});
  }
  // E-postverifisering kreves for vanlige medlemmer. Admin (eieren) unntas
  // så hen aldri kan låse seg selv ute. login-siden tilbyr «send på nytt».
  if (medlem && !erAdmin && !user.emailVerified) {
    location.replace('login.html?feil=ikke-verifisert');
    return new Promise(() => {});
  }

  // «Sist sett» – eneste feltet et medlem kan skrive på sin egen brukernode
  if (medlem) update(ref(db, 'brukere/' + user.uid), { sistSett: Date.now() }).catch(() => {});

  return { user, medlem, erAdmin, familieId: medlem ? medlem.familieId : null };
}

export async function loggInn(epost, passord) {
  await setPersistence(auth, browserLocalPersistence); // husk sesjonen på enheten
  return signInWithEmailAndPassword(auth, epost, passord);
}

export function loggUt() {
  return signOut(auth).then(() => location.replace('login.html'));
}

export function glemtPassord(epost) {
  return sendPasswordResetEmail(auth, epost);
}

// Sender (evt. på nytt) en e-post med bekreftelseslenke til brukeren.
export function sendVerifisering(bruker) {
  return sendEmailVerification(bruker || auth.currentUser);
}
