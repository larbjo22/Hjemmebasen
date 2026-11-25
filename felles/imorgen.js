// ── imorgen.js ───────────────────────────────────────────────
// «I morgen»: det familien må vite kvelden før. Brukes av Hjem (kortet fra kl. 17) og av
// kveldsvarselet (scripts/send-push.mjs, kjøres i Node). Derfor ingen nettleser-avhengigheter
// her – bare rene funksjoner på husstandens data (familier/<id>).
import { ingCore, navnTreff } from './vare.js';

const UKEDAG = ['son', 'man', 'tir', 'ons', 'tor', 'fre', 'lor'];
const pad = n => String(n).padStart(2, '0');

export function datoPluss(ds, n) {
  const d = new Date(ds + 'T12:00:00'); d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

// Hvem leverer og henter (levering.html): unntak for datoen vinner over fast ukemønster.
// '-' = ingen (fri/stengt). Returnerer null når ingenting er satt for dagen.
export function leveringFor(fam, ds) {
  const l = fam && fam.levering; if (!l) return null;
  const f = (l.fast || {})[UKEDAG[new Date(ds + 'T12:00:00').getDay()]] || {};
  const u = (l.unntak || {})[ds] || {};
  const levere = u.levere ?? f.levere ?? '', hente = u.hente ?? f.hente ?? '';
  if (!levere && !hente) return null;
  return { levere, hente };
}
export function leveringTekst(v) {
  if (!v) return '';
  if (v.levere === '-' && v.hente === '-') return 'Ingen levering (fri/stengt)';
  const del = [];
  if (v.levere && v.levere !== '-') del.push(v.levere + ' leverer');
  if (v.hente && v.hente !== '-') del.push(v.hente + ' henter');
  return del.join(' · ');
}

// Fryservarer som passer retten (eller ingrediensene i idébanken) – på hele ord
export function fryserTreff(fam, rett) {
  const items = (fam.fryser && fam.fryser.items) || [];
  if (!rett || !items.length) return [];
  const ide = ((fam.middag && fam.middag.ideas) || []).find(i => i && i.name && i.name.toLowerCase().trim() === String(rett).toLowerCase().trim());
  const ings = (ide && Array.isArray(ide.ingredienser) ? ide.ingredienser : []).map(ingCore).filter(Boolean);
  return items.filter(i => {
    if (!i || !i.name || (i.qty != null && !(i.qty > 0))) return false;
    const rest = /^rester:/i.test(i.name);
    const nm = rest ? i.name.replace(/^rester:\s*/i, '') : i.name;
    if (navnTreff(nm, rett)) return true;
    return !rest && ings.some(g => navnTreff(nm, g));
  });
}

// Linjene for datoen ds (vanligvis i morgen). apper = meta.apper (av = false).
// Hver linje: { ikon (Tabler-klasse), tekst, href, viktig? }
export function imorgenLinjer(fam, ds) {
  if (!fam) return [];
  const apper = (fam.meta && fam.meta.apper) || {};
  const pa = a => apper[a] !== false;
  const ut = [];
  try {
    if (pa('levering')) {
      const t = leveringTekst(leveringFor(fam, ds));
      if (t) ut.push({ ikon: 'ti-car', tekst: t, href: 'levering.html' });
    }
    if (pa('kalender')) {
      const h = ((fam.kalender && fam.kalender.hendelser) || []).filter(x => x && x.dato === ds)
        .concat(Object.values(fam.kalender_eksterne || {}).flat().filter(x => x && x.dato === ds))
        .sort((a, b) => (a.tid || '99').localeCompare(b.tid || '99'));
      h.slice(0, 4).forEach(x => ut.push({ ikon: 'ti-calendar', tekst: (x.tid ? x.tid + ' ' : '') + x.tittel + (x.hvem ? ' (' + x.hvem + ')' : ''), href: 'kalender.html', viktig: true }));
      if (h.length > 4) ut.push({ ikon: 'ti-calendar', tekst: '+ ' + (h.length - 4) + ' til i kalenderen', href: 'kalender.html' });
    }
    if (pa('middag')) {
      const m = ((fam.middag && fam.middag.meals) || []).find(x => x && x.date === ds && x.meal);
      if (m) {
        ut.push({ ikon: 'ti-tools-kitchen-2', tekst: 'Middag: ' + m.meal + (m.cook ? ' (' + m.cook + ' lager)' : ''), href: 'middag.html' });
        if (pa('fryser')) {
          const navn = [...new Set(fryserTreff(fam, m.meal).map(i => i.name))];
          if (navn.length) ut.push({ ikon: 'ti-snowflake', tekst: 'Ta ut av fryseren i kveld: ' + navn.slice(0, 3).join(', ') + (navn.length > 3 ? ' …' : ''), href: 'fryser.html', viktig: true });
        }
      }
    }
    if (pa('oppgaver')) {
      const t = ((fam.oppgaver && fam.oppgaver.tasks) || []).filter(x => x && !x.done && x.date === ds);
      if (t.length) ut.push({ ikon: 'ti-checkbox', tekst: t.length === 1 ? 'Oppgave: ' + t[0].title + (t[0].who ? ' (' + t[0].who + ')' : '') : t.length + ' oppgaver: ' + t.slice(0, 2).map(x => x.title).join(', ') + (t.length > 2 ? ' …' : ''), href: 'oppgaver.html' });
    }
    // Bursdager blant barna (fødselsdato i personregisteret)
    ((fam.personer && fam.personer.barn) || []).forEach(b => {
      if (!b || !b.fodt || b.fodt.slice(5) !== ds.slice(5)) return;
      const ar = Number(ds.slice(0, 4)) - Number(b.fodt.slice(0, 4));
      ut.push({ ikon: 'ti-cake', tekst: b.navn + ' fyller ' + ar + ' år! 🎉', href: pa('intervju') ? 'intervju.html' : 'hjem.html', viktig: true });
    });
    if (pa('gaver')) {
      ((fam.gaver && fam.gaver.anledninger) || []).filter(a => a && a.dato === ds && !a.avsluttet).forEach(a => {
        const igjen = ((fam.gaver.gaver) || []).filter(g => g && g.anledning === a.id && g.status !== 'pakket' && g.status !== 'gitt').length;
        ut.push({ ikon: 'ti-gift', tekst: a.navn + (igjen ? ': ' + igjen + ' gave' + (igjen === 1 ? '' : 'r') + ' ikke pakket' : ' – alt er pakket ✓'), href: 'gaver.html', viktig: igjen > 0 });
      });
    }
  } catch (e) { /* defensivt: én app med rare data skal ikke ta ned resten */ }
  return ut;
}
