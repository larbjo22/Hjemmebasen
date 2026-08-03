// ── hjelp.js ─────────────────────────────────────────────────
// Felles (i)-knapp med bruksanvisning per app. Kalles som
// monterHjelp('handleliste') i hver side. Knappen settes automatisk
// inn ved siden av tema-knappen, og hjelpevinduet har egne stiler
// (uavhengig av appens innebygde CSS).

const HJELP = {
  hjem: {
    tittel: 'Hjem',
    hva: 'Hjem-siden er oversikten din: en hilsen, varsler om det som trenger deg nå, og en flis per app med live status.',
    punkter: [
      'Varslene øverst viser det som haster – oppgaver på overtid, hvem som sover, fryservarer som går ut, dagens middag, ferske beskjeder og neste medisindose.',
      'Trykk på en flis for å åpne appen. Flisene viser status uten at du åpner dem.',
      'Sirkelen ved siden av en oppgave eller handlevare huker den av rett fra forsiden.',
      'Tannhjulet: «Min profil» (bilde, passord, varsler), «Hvem gjør hva», invitasjon, tilpass forsiden og endre oppsett.',
    ],
    tips: 'Trykk × på et tavle-varsel for å skjule det bare for deg – lappen henger fortsatt på tavla for de andre.',
  },
  handleliste: {
    tittel: 'Handleliste',
    hva: 'Delt handleliste for husstanden. «Dagligvare» er matbutikken, «Diverse» er alt annet du skal huske å kjøpe.',
    punkter: [
      'Skriv varen og trykk +. Appen foreslår varer du har kjøpt før, og husker kategorien.',
      'Trykk på en vare for å hake den av. Alle ser endringen med én gang, og navnet ditt vises på det du haket av.',
      '«Fullfør handletur» tømmer de avhukede og legger dem i historikken (som driver forslag og statistikk).',
      'Diverse-fanen har sted, notat, lenke og prioritet – fint til gaver, klær og ting som skal bestilles.',
      'Kategori-rekkefølgen bestemmer rekkefølgen i lista – sett den slik du går gjennom butikken.',
    ],
    tips: 'Havnet noe i feil liste? Åpne varen og velg «Flytt til Diverse» – da holdes dagligvare-statistikken ren.',
  },
  middag: {
    tittel: 'Middag',
    hva: 'Ukesplan for middager, med en idébank og en rulett som foreslår hva dere skal spise.',
    punkter: [
      'Trykk på en dag i uka for å skrive inn middagen, og velg hvem som lager.',
      'Idébanken er faste favoritter. Legger du inn ingredienser, kan de sendes rett til handlelista.',
      '«Spinn» trekker en idé for deg – den vekter opp retter som bruker fryservarer som bør brukes opp.',
      '«Legg ukens ingredienser i handlelista» samler alt dere trenger for uka i én operasjon.',
    ],
    tips: 'Statistikken viser hvem som lager mest mat – grei å ha ved middagsbordet.',
  },
  oppgaver: {
    tittel: 'Oppgaver',
    hva: 'Husstandens oppgaveliste med frister, prioritet, gjentakelse og et eget register for husvedlikehold.',
    punkter: [
      'Skriv oppgaven, velg eventuelt frist, prioritet og hvem den er til.',
      'Trykk på oppgaven for å redigere – der ligger også notat, gjentakelse og kommentarer.',
      'Huk av for å fullføre. Den arkiveres med dato og hvem som gjorde den.',
      '«Min dag» filtrerer til dine oppgaver som skal gjøres i dag – den velger deg automatisk.',
      'Hus-vedlikehold: registrer ting som skal gjøres med jevne mellomrom, så lages oppgaven automatisk når det er på tide igjen.',
    ],
    tips: 'Dra i håndtaket til venstre for å endre rekkefølgen manuelt.',
  },
  fryser: {
    tittel: 'Fryser',
    hva: 'Oversikt over hva som ligger i fryseren, hvor lenge det har ligget, og hva som bør brukes opp.',
    punkter: [
      'Legg inn vare med antall, kategori og eventuell utløpsdato.',
      'Har du flere frysere, bytter du mellom dem i fanene øverst.',
      'Varer som nærmer seg utløp – eller har ligget over 90 dager – merkes «bruk opp».',
      'Tar du ut noe, senk antallet eller slett varen. Trykk «Legg på handleliste» hvis det skal etterfylles.',
    ],
    tips: 'Middagsruletten prioriterer retter som bruker opp gamle fryservarer – så hold lista oppdatert.',
  },
  plikter: {
    tittel: 'Plikter',
    hva: 'Pliktsporing for barna med poeng, belønninger og rekker (streaks).',
    punkter: [
      'Barna hentes automatisk fra husstandens oppsett – du trenger ikke legge dem inn på nytt.',
      'Lag plikter med poengverdi og hvilke dager de gjelder, og hvilke barn de er for.',
      'Barnet huker av selv. Er godkjenning slått på, må en voksen bekrefte før poengene teller.',
      'Belønninger kan «kjøpes» for opptjente poeng. Du kan også sette en kroneverdi per poeng.',
    ],
    tips: 'Foreldre-PIN i innstillingene hindrer at barna godkjenner sine egne plikter.',
  },
  sovn: {
    tittel: 'Søvn',
    hva: 'Søvnsporing for barna: når de sover, hvor lenge de har vært våkne, og anslag for neste søvn.',
    punkter: [
      'Trykk «Legg ned» når barnet sovner og «Våknet» når det våkner. Har flere barn? Velg barn øverst.',
      'Trykk «Justér tidspunkt» hvis du glemte å registrere med en gang.',
      'Anslaget for neste lur eller leggetid bygger på våkenvinduene du setter i innstillingene.',
      'Avviker dagen fra planen, bruk «Siste lur er tatt» eller «Én lur til i dag» – da regner appen riktig.',
      'På en kort luredag forkortes leggetid-anslaget automatisk, og du ser hvorfor i teksten.',
    ],
    tips: 'Statistikken viser typiske leggetider, våkenvinduer og trender – og kan lastes ned til legetimen.',
  },
  helse: {
    tittel: 'Helse',
    hva: 'Medisin, vaksiner og sykedager per barn – laget for å slippe å huske «når fikk hen sist?».',
    punkter: [
      'Logg en dose når du gir medisin. Appen viser når neste dose tidligst kan gis.',
      'Maks per døgn og minste intervall settes per medisin i innstillingene nederst.',
      'Vaksiner og sykedager føres per barn, med enkel oversikt over året.',
    ],
    tips: 'Intervall og maksdose er veiledende – følg alltid pakningsvedlegg eller lege.',
  },
  beskjeder: {
    tittel: 'Beskjeder',
    hva: 'Husstandens oppslagstavle – korte beskjeder til hverandre.',
    punkter: [
      'Skriv beskjeden og trykk «Heng opp». Navnet ditt og tidspunktet vises automatisk.',
      'Velg hvor lenge den skal henge (1 dag, 3 dager, 1 uke, eller til den tas ned).',
      'Trykk × for å ta ned en lapp for alle. De 50 nyeste beholdes.',
    ],
    tips: 'Ferske beskjeder dukker opp på forsiden – der kan du skjule dem bare for deg.',
  },
  pakkelister: {
    tittel: 'Pakkelister',
    hva: 'Gjenbrukbare pakkelister – hytta, barnehagen, ferie. Pakk etter lista i stedet for hukommelsen.',
    punkter: [
      'Lag en liste, legg inn tingene, og huk av mens du pakker.',
      'Lim inn-knappen lar deg legge inn mange ting på én gang – én per linje.',
      'Sett en tur-dato, så sorteres listene med nærmeste tur først.',
      '«Pakking ferdig» merker lista grønn. «Nullstill hakene» gjør den klar til neste tur.',
    ],
    tips: '«Lag kopi» gir deg en blank kopi av lista – fint når to skal pakke hver sin bag.',
  },
  vekst: {
    tittel: 'Vekst',
    hva: 'Høyde, vekt og skostørrelse over tid – pluss et tannkart for melketennene.',
    punkter: [
      'Fyll inn det du har målt (du trenger ikke fylle alle feltene) og trykk «Loggfør».',
      'Kortet øverst viser siste måling og endringen siden forrige gang.',
      'Tannkartet: sett datoen først, og trykk på tannen når den kommer. Trykk igjen for å fjerne.',
      'Under kartet ligger en logg over hvilke tenner som kom når – og hvor gammel barnet var da.',
    ],
    tips: 'Alderen regnes ut fra fødselsdatoen i husstandens oppsett.',
  },
  kalender: {
    tittel: 'Kalender',
    hva: 'Felles familiekalender – alles avtaler samlet, fargelagt per person.',
    punkter: [
      'Trykk på en dag for å se og legge til hendelser.',
      'Sett tittel, klokkeslett, hvem det gjelder og et notat. Uten navn gjelder det hele familien.',
      'Meldingsikonet på en hendelse åpner en kommentartråd – fint til «jeg henter».',
      'Kalenderikonet legger hendelsen i din egen Google-/Apple-kalender.',
      '«Eksterne kalendere»: lim inn iCal-lenken fra Google, Spond eller barnehagen, så vises de her (grått og skrivebeskyttet).',
    ],
    tips: 'Dagens hendelser dukker opp i varslene på forsiden.',
  },
  statistikk: {
    tittel: 'Statistikk',
    hva: 'Alt husstanden har registrert, framstilt med grafer – og mulighet for å laste ned dataene.',
    punkter: [
      'Velg periode øverst: 30 dager, 3 måneder, i år eller hele historikken.',
      '«Aktivitet per uke» viser fullførte oppgaver, godkjente plikter og planlagte middager side om side.',
      'Hvert barn får egne kurver for høyde og vekt, søvn per døgn og antall tenner.',
      'Eksport nederst: last ned per app som CSV (åpnes i Excel), alt som JSON, eller skriv ut / lagre som PDF.',
    ],
    tips: 'Handleliste og fryser lagrer ikke historikk over tid – de tallene er totaler og øyeblikksbilde, ikke periodefiltrert.',
  },
  admin: {
    tittel: 'Administrasjon',
    hva: 'Her oppretter og styrer du husstandene og medlemmene deres.',
    punkter: [
      'Opprett husstand: den får norsk standardoppsett og alle apper aktivert.',
      'App-bryterne slår apper av og på for den enkelte husstanden.',
      '«+ Nytt medlem» lager innlogging med et startpassord du deler med dem.',
      '«endre» lar deg bytte visningsnavn eller flytte medlemmet til en annen husstand.',
      '«eksport» laster ned all data for husstanden som JSON.',
    ],
    tips: 'Passord kan ikke settes herfra – medlemmet bytter selv under «Min profil», eller du sender «reset».',
  },
  onboarding: {
    tittel: 'Oppsett',
    hva: 'Her setter dere navn på husstanden, hvem som bor der, sted og hvilke apper dere vil bruke.',
    punkter: [
      'Voksne brukes i middagsplanen og oppgavelista. Barn brukes i plikter, søvn, helse og vekst.',
      'Fødselsdato på barn gir aldersbaserte anbefalinger, for eksempel våkenvinduer.',
      'Stedet brukes til værbaserte påkledningsråd. Kan hoppes over.',
      'Appvalget kan endres når som helst senere.',
    ],
    tips: 'Har dere alt satt opp, kan du hoppe rett til riktig del i menyen øverst.',
  },
};

const STIL = `
.hjelp-bg{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:flex-start;justify-content:center;padding:6vh 12px 12px;z-index:200}
.hjelp-boks{background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:14px;max-width:440px;width:100%;max-height:82vh;overflow-y:auto;padding:16px 16px 12px;box-shadow:0 12px 40px rgba(0,0,0,.25)}
.hjelp-tittel{font-size:16px;font-weight:800;display:flex;align-items:center;gap:7px;margin-bottom:6px}
.hjelp-tittel i{color:var(--accent-text,var(--accent))}
.hjelp-hva{font-size:13px;line-height:1.55;color:var(--text2);margin-bottom:10px}
.hjelp-boks ul{margin:0 0 10px;padding-left:18px}
.hjelp-boks li{font-size:13px;line-height:1.55;margin-bottom:6px}
.hjelp-tips{font-size:12.5px;line-height:1.5;background:var(--accent-bg);border:1px solid var(--accent-border);color:var(--accent-text);border-radius:10px;padding:9px 11px;display:flex;gap:7px}
.hjelp-lukk{margin-top:12px;width:100%;padding:10px;font-size:13px;font-weight:600;border-radius:10px;border:1px solid var(--border);background:var(--surface2);color:var(--text2);cursor:pointer}
`;

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function visHjelp(h) {
  const bg = document.createElement('div');
  bg.className = 'hjelp-bg';
  bg.innerHTML = '<div class="hjelp-boks" role="dialog" aria-modal="true" aria-label="Hjelp">'
    + '<div class="hjelp-tittel"><i class="ti ti-info-circle"></i> ' + esc(h.tittel) + '</div>'
    + '<div class="hjelp-hva">' + esc(h.hva) + '</div>'
    + '<ul>' + h.punkter.map(p => '<li>' + esc(p) + '</li>').join('') + '</ul>'
    + (h.tips ? '<div class="hjelp-tips"><i class="ti ti-bulb"></i><span>' + esc(h.tips) + '</span></div>' : '')
    + '<button class="hjelp-lukk" type="button">Lukk</button></div>';
  const lukk = () => { bg.remove(); document.removeEventListener('keydown', esc27); };
  const esc27 = e => { if (e.key === 'Escape') lukk(); };
  bg.addEventListener('click', e => { if (e.target === bg) lukk(); });
  bg.querySelector('.hjelp-lukk').addEventListener('click', lukk);
  document.addEventListener('keydown', esc27);
  document.body.appendChild(bg);
  bg.querySelector('.hjelp-lukk').focus();
}

export function monterHjelp(appNavn) {
  const h = HJELP[appNavn];
  if (!h) return;
  const start = () => {
    if (document.getElementById('hjelp-btn')) return;
    const tema = document.getElementById('theme-btn');
    if (!tema || !tema.parentNode) return;
    if (!document.getElementById('hjelp-stil')) {
      const st = document.createElement('style');
      st.id = 'hjelp-stil';
      st.textContent = STIL;
      document.head.appendChild(st);
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'hjelp-btn';
    btn.title = 'Hvordan fungerer denne siden?';
    btn.setAttribute('aria-label', 'Hjelp – hvordan fungerer denne siden?');
    btn.innerHTML = '<i class="ti ti-info-circle"></i>';
    // Match tema-knappens utseende (klasse der den finnes, ellers samme inline-stil)
    if (tema.className) btn.className = tema.className;
    else btn.style.cssText = 'width:28px;height:28px;border-radius:50%;border:1px solid var(--border);background:var(--surface2);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;color:var(--text2)';
    btn.addEventListener('click', () => visHjelp(h));
    tema.parentNode.insertBefore(btn, tema);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
}
