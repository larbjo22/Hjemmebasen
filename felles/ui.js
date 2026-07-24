// ── ui.js ────────────────────────────────────────────────────
// Delte UI-hjelpere: escaping, dato, statuslinje og tema.

export function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Lokal dato (ALDRI toISOString – gir UTC/feil dag i norsk tidssone)
export function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

export function setStatus(msg, type = '') {
  const s = document.getElementById('status-bar');
  if (!s) return;
  s.textContent = msg;
  s.className = 'status-bar' + (type ? ' ' + type : '');
  if (type === 'ok') setTimeout(() => { s.textContent = ''; s.className = 'status-bar'; }, 2500);
}

// ── Tema (delt nøkkel for hele Hjemmebasen) ──────────────────
const TEMA_KEY = 'hjemmebasen_theme';

export function initTheme() {
  const lagret = localStorage.getItem(TEMA_KEY);
  const dark = window.matchMedia('(prefers-color-scheme:dark)').matches;
  setTheme(lagret || (dark ? 'dark' : 'light'), false);
}

export function setTheme(t, lagre = true) {
  document.documentElement.setAttribute('data-theme', t);
  const b = document.getElementById('theme-btn');
  if (b) b.innerHTML = t === 'dark' ? '<i class="ti ti-sun"></i>' : '<i class="ti ti-moon-stars"></i>';
  if (lagre) localStorage.setItem(TEMA_KEY, t);
}

export function toggleTheme() {
  setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

// ── Profilfarge: deterministisk farge fra navn ───────────────
// Samme navn gir samme farge overalt (plikter, helse, søvn, middag).
const PERSONFARGER = ['#1a56db', '#c2185b', '#7b1fa2', '#2e7d32', '#e65100', '#00838f', '#5d4037', '#c62828'];
export function personFarge(navn) {
  let h = 0;
  for (let i = 0; i < (navn || '').length; i++) h = (h + navn.charCodeAt(i)) % PERSONFARGER.length;
  return PERSONFARGER[h];
}

// ── Avatarer ─────────────────────────────────────────────────
// Bildene ligger under familier/<id>/avatarer/<nøkkel> som base64
// (data-URL), delt i husstanden. Uten bilde vises initialer på
// personfargen. Nøkkelen utledes fra navnet (RTDB tåler ikke .#$[]/).
export function avatarKey(navn) {
  return (navn || '').trim().toLowerCase().replace(/[.#$/[\]\s]+/g, '_') || 'ukjent';
}

export function initialer(navn) {
  const deler = (navn || '').trim().split(/\s+/).filter(Boolean);
  if (!deler.length) return '?';
  if (deler.length === 1) return deler[0].slice(0, 2).toUpperCase();
  return (deler[0][0] + deler[deler.length - 1][0]).toUpperCase();
}

// Slår opp et avatarbilde tolerant: prøver fullt navn, så fornavn
// (sider viser dels fullt navn «Kari Hansen», dels bare «Kari»).
export function finnAvatar(avatarer, navn) {
  if (!avatarer || !navn) return null;
  return avatarer[avatarKey(navn)]
    || avatarer[avatarKey(navn.trim().split(/\s+/)[0])]
    || null;
}

// Én sirkel: bilde hvis det finnes, ellers initialer på personfargen.
export function avatarHtml(navn, foto, px = 32) {
  const stil = 'width:' + px + 'px;height:' + px + 'px;font-size:' + Math.round(px * 0.4) + 'px';
  if (foto) return '<span class="avatar" title="' + esc(navn) + '" style="' + stil + ';background-image:url(' + foto + ')"></span>';
  return '<span class="avatar" title="' + esc(navn) + '" style="' + stil + ';background:' + personFarge(navn) + '">' + esc(initialer(navn)) + '</span>';
}

// Les et bildefil-objekt, skaler til et lite kvadrat og gi en JPEG
// data-URL. Holder databasen liten (~8–15 kB) uten Firebase Storage.
export function bildeTilAvatar(file, maks = 160, kvalitet = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type)) { reject(new Error('Ikke et bilde')); return; }
    const fr = new FileReader();
    fr.onerror = () => reject(new Error('Kunne ikke lese fila'));
    fr.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Ugyldig bilde'));
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2, sy = (img.height - side) / 2;
        const c = document.createElement('canvas');
        c.width = c.height = maks;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, sx, sy, side, side, 0, 0, maks, maks);
        resolve(c.toDataURL('image/jpeg', kvalitet));
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}
