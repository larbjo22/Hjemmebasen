// ── vare.js ──────────────────────────────────────────────────
// Felles vare-regel for handleliste, middag, fryser og Hjem (overført fra ha-vare.js i ha-apper).
//
// Regelen: «samme vare» gir +1 (eller øker antall) i stedet for en ny rad.
// To navn er samme vare når vareKey() gir samme nøkkel:
//   • små bokstaver, mellomrom og tegnsetting på slutten jevnes ut
//   • enkel entall/flertall på siste ord («Tomat» = «Tomater», «Banan» = «Bananer»)
//   • mengde og enhet foran tas bort («400 g kjøttdeig» = «Kjøttdeig», «2 stk paprika» = «Paprika»)

// Konservativ stamme for norske endelser – kortere enn 3 tegn beholdes som de er
export function stemWord(w) { const s = w.replace(/(ene|er|et|en|e|a)$/, ''); return s.length >= 3 ? s : w; }
// Normalisering av et navn (stammer bare siste ord)
export function normKey(s) {
  const k = (s || '').toLowerCase().trim().replace(/[.,!?;:]+$/, '').replace(/\s+/g, ' ');
  if (!k) return '';
  const parts = k.split(' ');
  parts[parts.length - 1] = stemWord(parts[parts.length - 1]);
  return parts.join(' ');
}

// Enheter som kan stå etter en mengde foran varenavnet
const VARE_ENHETER = 'g|gram|kg|hg|mg|dl|cl|ml|l|liter|ss|ts|ms|krm|stk|pk|pakke|pakker|boks|bokser|glass|neve|klype|skive|skiver|fedd|bunt|beger|pose|poser|stilk|stilker|flaske|flasker';
// Enheter der tallet betyr «antall varer» (2 stk egg → 2). «400 g» betyr ikke 400 varer.
const VARE_ANTALL_ENHETER = new Set(['stk', 'pk', 'pakke', 'pakker', 'boks', 'bokser', 'glass', 'beger', 'pose', 'poser', 'flaske', 'flasker', 'bunt']);
const VARE_MENGDE_RE = new RegExp('^(ca\\.?\\s*)?([\\d½¼¾⅓⅔.,/\\-–\\s]*\\d[\\d½¼¾⅓⅔.,/\\-–\\s]*|[½¼¾⅓⅔]+)\\s*(' + VARE_ENHETER + ')?\\.?\\s+(?=\\S)', 'i');

// Tar bort mengde og enhet foran: «400 g kjøttdeig» → «kjøttdeig». Store/små bokstaver beholdes.
export function fjernMengde(s) {
  return (s || '').replace(/^[\s\-–•*]+/, '').replace(VARE_MENGDE_RE, '').trim();
}
// Kjernen i en ingredienslinje: uten mengde/enhet, parenteser og det som står etter komma.
// «2 stk løk (rød), finhakket» → «løk»
export function ingCore(s) {
  return fjernMengde(s).replace(/\(.*?\)/g, '').replace(/,.*$/, '').replace(/\s+/g, ' ').trim();
}
// Nøkkelen som avgjør «samme vare»
export function vareKey(s) { return normKey(fjernMengde(s)); }
// Første element i lista med samme vare som navnet (valgfritt filter, f.eks. i=>!i.checked)
export function finnVare(list, name, filter) {
  const k = vareKey(name);
  if (!k || !Array.isArray(list)) return null;
  return list.find(x => x && vareKey(x.name) === k && (!filter || filter(x))) || null;
}
// Stor forbokstav – til visning av navn hentet fra en ingredienslinje
export function storForbokstav(s) { s = (s || '').trim(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
// Tolker fritekst: «2 melk» → {navn:'Melk',antall:2,tall:true}, «2 stk egg» → antall 2,
// «400 g kjøttdeig» → {navn:'Kjøttdeig',antall:1,tall:false}. tall = teksten startet med et antall.
export function vareFraTekst(s) {
  const raw = (s || '').replace(/^[\s\-–•*]+/, '').trim();
  const m = VARE_MENGDE_RE.exec(raw);
  let antall = 1, tall = false;
  if (m) {
    const t = m[2].trim();
    const enhet = (m[3] || '').toLowerCase();
    if (/^\d{1,2}$/.test(t) && (!enhet || VARE_ANTALL_ENHETER.has(enhet))) { antall = Math.max(1, parseInt(t, 10)); tall = true; }
  }
  return { navn: storForbokstav(fjernMengde(raw)) || raw, antall, tall };
}
// Ordene i et navn, stammet – til å sammenligne hele ord («Hamburger» ≠ «Hamburgerbrød»)
export function vareOrd(s) { return (s || '').toLowerCase().split(/[^a-z0-9æøåäöüé]+/i).filter(Boolean).map(stemWord); }
// Er ordrekka del en sammenhengende del av ordrekka hel? (hele ord)
export function ordFolge(hel, del) {
  if (!del.length || del.length > hel.length) return false;
  for (let i = 0; i + del.length <= hel.length; i++) { if (del.every((w, j) => hel[i + j] === w)) return true; }
  return false;
}
// To navn handler om samme ting på HELE ord: «Kjøttdeig» treffer «Taco med kjøttdeig»,
// men «Kjøtt» treffer ikke «Kjøttdeig». Den korteste må være minst 4 tegn.
export function navnTreff(a, b) {
  if (vareKey(a) && vareKey(a) === vareKey(b)) return true;
  const A = vareOrd(a), B = vareOrd(b);
  if (!A.length || !B.length) return false;
  const lengde = o => o.join(' ').length;
  return (lengde(B) >= 4 && ordFolge(A, B)) || (lengde(A) >= 4 && ordFolge(B, A));
}
