// ── angre.js ─────────────────────────────────────────────────
// «Angre»-stripe nederst på skjermen etter en sletting. Brukes som
//   visAngre('«Melk» slettet', () => { …legg tilbake…; save(); render(); });
// Stripa forsvinner etter noen sekunder. Bare én stripe om gangen – en ny
// sletting erstatter den forrige (den forrige kan da ikke lenger angres).
// Stilen bruker appens tema-variabler, så den følger dark/light.

const STIL = `
.angre-stripe{position:fixed;left:50%;bottom:calc(14px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:300;
  display:flex;align-items:center;gap:12px;max-width:calc(100vw - 24px);padding:10px 10px 10px 14px;border-radius:12px;
  background:var(--text,#222);color:var(--bg,#fff);font-size:13px;box-shadow:0 8px 28px rgba(0,0,0,.25)}
.angre-stripe span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.angre-stripe button{flex-shrink:0;font-size:13px;font-weight:700;padding:8px 12px;min-height:36px;border-radius:8px;border:none;
  background:rgba(127,127,127,.25);color:inherit;cursor:pointer}
@media (prefers-reduced-motion:no-preference){.angre-stripe{animation:angre-inn .18s ease-out}}
@keyframes angre-inn{from{opacity:0;transform:translate(-50%,8px)}to{opacity:1;transform:translate(-50%,0)}}
`;

let aktiv = null;

export function visAngre(tekst, angre, ms = 7000) {
  if (!document.getElementById('angre-stil')) {
    const st = document.createElement('style');
    st.id = 'angre-stil';
    st.textContent = STIL;
    document.head.appendChild(st);
  }
  lukk();
  const el = document.createElement('div');
  el.className = 'angre-stripe';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  const t = document.createElement('span');
  t.textContent = tekst;
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = 'Angre';
  b.addEventListener('click', () => { lukk(); try { angre(); } catch (e) { console.error(e); } });
  el.append(t, b);
  document.body.appendChild(el);
  aktiv = { el, timer: setTimeout(lukk, ms) };
}

function lukk() {
  if (!aktiv) return;
  clearTimeout(aktiv.timer);
  aktiv.el.remove();
  aktiv = null;
}
