// ── flett.js ─────────────────────────────────────────────────
// Samtidig lagring uten at andres endringer forsvinner.
//
// Problemet: appene lagrer hele datablokken sin (f.eks. hele handlelista) med set().
// Har en annen telefon endret noe siden vi sist leste, skrives det over – siste lagring
// vinner. Typisk: to voksne registrerer søvn for samme barn, eller legger varer på lista
// samtidig, eller én redigerer mens en annen krysser av.
//
// Løsningen (samme som merge3/mqttStore i ha-apper, men på Firebase):
//   base   – det vi sist fikk fra databasen
//   local  – det appen har nå (base + egne endringer)
//   remote – det som ligger i databasen nå (base + andres endringer)
// Lagring skjer med runTransaction(): Firebase gir oss det som faktisk ligger der, vi slår
// sammen, og Firebase skriver bare hvis ingen andre har skrevet i mellomtiden (ellers
// kjøres sammenslåingen på nytt med de nye dataene). Det som bare er endret ett sted
// beholdes. Er samme verdi endret begge steder, vinner den lokale. Lister med id/date/d/name
// slås sammen per oppføring, så nye OG slettede oppføringer fra begge sider tas med.
// Slettinger trenger ingen «gravsteiner»: noe som finnes i base, men mangler lokalt, er
// slettet her; noe som finnes i base, men mangler i databasen, er slettet der.
//
// Datatap-vernet: lagre() nekter til første vellykkede lesning er tatt i mot (mottatt()).
import { db } from './auth.js';
import { ref, runTransaction } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js';

function eq(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function erObj(x) { return x !== null && typeof x === 'object' && !Array.isArray(x); }
function klon(x) { return x == null ? x : JSON.parse(JSON.stringify(x)); }

export function merge3(base, local, remote) {
  if (eq(local, remote)) return local;
  if (eq(base, local)) return remote;
  if (eq(base, remote)) return local;
  if (Array.isArray(local) && Array.isArray(remote)) return flettListe(Array.isArray(base) ? base : [], local, remote);
  if (erObj(local) && erObj(remote)) {
    const b = erObj(base) ? base : {}, out = {};
    for (const k of new Set([...Object.keys(local), ...Object.keys(remote)])) {
      const v = merge3(b[k], local[k], remote[k]);
      if (v !== undefined) out[k] = v;
    }
    // Id-tellere (nextId, nextSid, nextHid …) må ligge over alle id-er etter sammenslåingen
    for (const k of Object.keys(out)) {
      if (!/^next/i.test(k) || typeof out[k] !== 'number') continue;
      let m = Math.max(out[k], typeof local[k] === 'number' ? local[k] : 0, typeof remote[k] === 'number' ? remote[k] : 0);
      for (const arr of Object.values(out)) {
        if (!Array.isArray(arr)) continue;
        for (const it of arr) if (erObj(it) && typeof it.id === 'number' && it.id >= m) m = it.id + 1;
      }
      out[k] = m;
    }
    return out;
  }
  return local;
}
function listeNokkel(arrs) {
  const all = [].concat(...arrs);
  if (!all.length) return null;
  if (all.every(x => x === null || typeof x !== 'object')) return { get: x => typeof x + ':' + x };
  if (!all.every(erObj)) return null;
  for (const f of ['id', 'date', 'd', 'name']) {
    if (all.every(x => x[f] !== undefined && x[f] !== null && typeof x[f] !== 'object')) return { get: x => String(x[f]), felt: f };
  }
  return null;
}
function flettListe(base, local, remote) {
  const key = listeNokkel([base, local, remote]);
  if (!key) return local;
  const index = a => { const m = new Map(); for (const x of a) m.set(key.get(x), x); return m; };
  const B = index(base), R = index(remote);
  if (B.size !== base.length || R.size !== remote.length || index(local).size !== local.length) return local; // like nøkler – ikke trygt
  // To telefoner har laget hver sin nye oppføring med samme id: gi den lokale en ny id
  if (key.felt === 'id') {
    let max = 0;
    for (const a of [base, local, remote]) for (const x of a) if (typeof x.id === 'number' && x.id > max) max = x.id;
    local = local.map(x => {
      const k = key.get(x);
      return (typeof x.id === 'number' && !B.has(k) && R.has(k) && !eq(x, R.get(k))) ? { ...x, id: ++max } : x;
    });
  }
  const L = index(local), out = [];
  for (const x of local) {
    const v = merge3(B.get(key.get(x)), x, R.get(key.get(x)));
    if (v !== undefined) out.push(v);
  }
  // Oppføringer som bare finnes i databasen: nye derfra tas med, de som er slettet her utelates
  remote.forEach((x, i) => {
    const k = key.get(x);
    if (L.has(k)) return;
    const v = merge3(B.get(k), undefined, x);
    if (v === undefined) return;
    let at = 0; // sett inn etter nærmeste foregående nabo fra databasen, så rekkefølgen bevares
    for (let j = i - 1; j >= 0; j--) {
      const pk = key.get(remote[j]);
      const p = out.findIndex(o => key.get(o) === pk);
      if (p >= 0) { at = p + 1; break; }
    }
    out.splice(at, 0, v);
  });
  return out;
}

// Endrer én node trygt: fn får det som ligger i databasen NÅ (normalisert) og returnerer
// den nye verdien (eller undefined for å avbryte). Brukes for engangsendringer fra andre
// sider, f.eks. «legg på handlelista» fra middag/fryser og avkryssing fra Hjem.
export async function endreTrygt(sti, fn, normaliser = x => x) {
  const r = await runTransaction(ref(db, sti), cur => fn(normaliser(klon(cur) ?? {})), { applyLocally: false });
  return r.committed;
}

// Lager for én node med sammenslåing.
//   const lager = flettLager('familier/'+F+'/handleliste', {
//     hent: () => data,                 // appens nåværende data
//     bruk: d => { data = d; render(); }, // ta i bruk sammenslåtte/andres data
//     normaliser                         // samme som appen bruker (Firebase dropper tomme lister)
//   });
//   lager.mottatt(fraDatabasen)  – etter lesning og i sanntidslytteren
//   await lager.lagre()          – etter hver endring
export function flettLager(sti, { hent, bruk, normaliser = x => x }) {
  let base = null, ulagret = false, venter = 0, kjede = Promise.resolve();
  const kjør = fn => { const p = kjede.then(fn, fn); kjede = p.catch(() => {}); return p; };
  const api = {
    get lastet() { return base !== null; },
    get ulagret() { return ulagret; },
    // Data fra databasen (første lesning eller sanntidslytteren). Tas i bruk bare når vi
    // ikke har ulagrede endringer – ellers slår neste lagring dem sammen. true = tatt i bruk.
    mottatt(raw, { brukDem = true } = {}) {
      const r = normaliser(klon(raw) ?? {});
      const rs = JSON.stringify(r);
      const lokal = JSON.stringify(hent());
      if (base === null || (!ulagret && lokal === base)) {
        base = rs;
        if (brukDem && lokal !== rs) bruk(r);
        return true;
      }
      if (lokal === rs) { base = rs; ulagret = false; return true; }
      return false;
    },
    // Er lokale data endret siden sist vi var i takt med databasen?
    endretLokalt() { return base !== null && JSON.stringify(hent()) !== base; },
    lagre() {
      ulagret = true; venter++;
      return kjør(async () => {
        venter--;
        if (base === null) throw new Error('Datatap-vern: noden er ikke lest ennå – nekter å skrive.');
        if (venter > 0) return true; // en nyere lagring står i kø og tar med seg denne endringen
        const snap = JSON.stringify(hent());
        const baseObj = JSON.parse(base), lokal = JSON.parse(snap);
        let flettet = null;
        const res = await runTransaction(ref(db, sti), cur => {
          // cur kan være null første gang (Firebase gjetter fra hurtigbufferen); ligger det
          // data der, avviser serveren skrivingen og kjører funksjonen på nytt med riktige data.
          if (cur == null) { flettet = lokal; return klon(lokal); }
          flettet = merge3(baseObj, klon(lokal), normaliser(klon(cur)));
          return klon(flettet);
        }, { applyLocally: false });
        if (!res.committed) return false;
        const fra = normaliser(klon(res.snapshot.val()) ?? {});
        const fs = JSON.stringify(fra);
        if (JSON.stringify(hent()) === snap) {
          // Ingen nye lokale endringer mens vi lagret: ta i bruk det sammenslåtte
          base = fs; ulagret = false;
          if (fs !== snap) bruk(fra);
        }
        return true;
      });
    },
  };
  return api;
}
