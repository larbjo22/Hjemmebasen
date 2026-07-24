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
  if (b) b.textContent = t === 'dark' ? '☀️' : '🌙';
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
