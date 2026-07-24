// ── nav.js ───────────────────────────────────────────────────
// Felles app-meny øverst i alle appene: tydelig Hjem-knapp + direktehopp
// til husstandens aktiverte apper, uten å gå via forsiden. Stilen
// injiseres herfra siden appene har sin egen innebygde CSS (bruker
// appens tema-variabler, så menyen følger appens farger og dark/light).
import { db } from './auth.js';
import { ref, get } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js';
import { APP_NAVN, APP_IKON } from './seed.js';

const NAV_STIL = `
.app-nav{position:sticky;top:0;z-index:90;display:flex;align-items:center;gap:6px;padding:8px 10px;padding-top:calc(8px + env(safe-area-inset-top));background:var(--surface);border-bottom:1px solid var(--border);overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.app-nav::-webkit-scrollbar{display:none}
.nav-hjem{display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:700;padding:7px 14px;border-radius:18px;background:var(--accent,var(--orange,#f97316));color:#fff;text-decoration:none;flex-shrink:0}
.nav-app{font-size:19px;padding:5px 9px;border-radius:12px;text-decoration:none;flex-shrink:0;line-height:1;border:1px solid transparent;color:var(--text3);display:inline-flex}
.nav-app.on{background:var(--accent-bg,var(--surface2));border-color:var(--accent-border,var(--border));color:var(--accent-text,var(--accent))}
@media(min-width:700px){.app-nav{justify-content:center}}
`;

export async function monterNav(familieId, aktivApp) {
  if (document.querySelector('.app-nav')) return; // allerede montert
  if (!document.getElementById('app-nav-stil')) {
    const st = document.createElement('style');
    st.id = 'app-nav-stil';
    st.textContent = NAV_STIL;
    document.head.appendChild(st);
  }
  let apper = {};
  try {
    const meta = (await get(ref(db, 'familier/' + familieId + '/meta'))).val() || {};
    apper = meta.apper || {};
  } catch (e) { /* uten meta vises alle appene */ }
  const aktive = Object.keys(APP_NAVN).filter(a => apper[a] !== false);

  const bar = document.createElement('nav');
  bar.className = 'app-nav';
  bar.setAttribute('aria-label', 'Apper');
  bar.innerHTML = '<a class="nav-hjem" href="index.html"><i class="ti ti-home"></i> Hjem</a>'
    + aktive.map(a =>
        '<a class="nav-app' + (a === aktivApp ? ' on' : '') + '" href="' + a + '.html" title="' + APP_NAVN[a] + '" aria-label="' + APP_NAVN[a] + '">'
        + '<i class="ti ' + APP_IKON[a] + '"></i></a>').join('');
  document.body.prepend(bar);
}
