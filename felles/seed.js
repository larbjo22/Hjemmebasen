// ── seed.js ──────────────────────────────────────────────────
// Seed-data: det en ny husstand fødes med, så ingen app starter tom.
// Standardene er hentet fra ha-appers DEFAULT_*-verdier (norsk husholdning).
// Onboarding (etappe 2) fyller personregisteret og re-seeder personlister.

export const APP_NAVN = {
  handleliste: 'Handleliste',
  middag: 'Middag',
  oppgaver: 'Oppgaver',
  fryser: 'Fryser',
  plikter: 'Plikter',
  sovn: 'Søvn',
  helse: 'Helse',
  beskjeder: 'Beskjeder',
  pakkelister: 'Pakkelister',
  vekst: 'Vekst',
};

export const APP_IKON = {
  handleliste: '🛒', middag: '🍽️', oppgaver: '✅', fryser: '🧊',
  plikter: '⭐', sovn: '😴', helse: '🩹',
  beskjeder: '📌', pakkelister: '🎒', vekst: '📏',
};

export function seedFamilie(navn, opprettetAv) {
  return {
    meta: {
      navn,
      opprettet: Date.now(),
      opprettetAv,
      onboardet: false,
      apper: { handleliste: true, middag: true, oppgaver: true, fryser: true, plikter: true, sovn: true, helse: true, beskjeder: true, pakkelister: true, vekst: true },
    },
    personer: { voksne: [], barn: [] },

    handleliste: {
      items: [],
      history: [],
      categories: ['Frukt & Grønt', 'Kjøtt & Fisk', 'Meieri & Egg', 'Brød & Bakevarer', 'Tørrvarer', 'Frysevarer', 'Drikke', 'Rengjøring', 'Personlig pleie', 'Annet'],
      templates: [
        { id: 1, name: 'Melk', cat: 'Meieri & Egg' },
        { id: 2, name: 'Egg', cat: 'Meieri & Egg' },
        { id: 3, name: 'Smør', cat: 'Meieri & Egg' },
        { id: 4, name: 'Brød', cat: 'Brød & Bakevarer' },
      ],
      other: [],
      otherPlaces: ['Bokhandel', 'Byggevare/Maling', 'Apotek', 'Nettbutikk', 'Klær', 'Annet'],
      otherHistory: [],
    },

    middag: {
      meals: [],
      people: ['Felles'], // utvides med voksne fra onboarding
      ideas: [
        { id: 1, name: 'Taco', url: '', tag: 'Barnevennlig', note: '', ingredienser: ['Kjøttdeig', 'Tacokrydder', 'Tortillalefser', 'Mais', 'Agurk', 'Tomat', 'Rømme', 'Revet ost'], freezer: false },
        { id: 2, name: 'Fiskegrateng', url: '', tag: 'Fisk', note: '', ingredienser: ['Fiskegrateng', 'Poteter', 'Gulrøtter'], freezer: true },
        { id: 3, name: 'Spagetti med kjøttsaus', url: '', tag: 'Barnevennlig', note: '', ingredienser: ['Kjøttdeig', 'Spagetti', 'Hakkede tomater', 'Løk'], freezer: false },
        { id: 4, name: 'Kyllingwok', url: '', tag: 'Kjapt', note: '', ingredienser: ['Kyllingfilet', 'Wokgrønnsaker', 'Nudler', 'Soyasaus'], freezer: false },
        { id: 5, name: 'Pannekaker', url: '', tag: 'Kos', note: '', ingredienser: ['Egg', 'Mel', 'Melk', 'Blåbærsyltetøy'], freezer: false },
        { id: 6, name: 'Laks med poteter', url: '', tag: 'Fisk', note: '', ingredienser: ['Laksefilet', 'Poteter', 'Brokkoli'], freezer: true },
      ],
    },

    oppgaver: {
      tasks: [], archive: [],
      categories: ['Hus', 'Ute', 'Barn', 'Innkjøp', 'Annet'],
      people: [], // fylles fra onboarding
      maintenance: [],
    },

    fryser: {
      freezers: [{ id: 1, name: 'Fryser' }],
      categories: ['Middag', 'Kjøtt', 'Fisk', 'Grønnsaker', 'Brød', 'Is/Dessert', 'Annet'],
      history: [], items: [],
    },

    plikter: {
      kids: [], // fylles fra personregisteret i onboarding
      chores: [], log: [], rewards: [], spent: [],
    },

    // sovn: node per barn (ADR-0006) – opprettes i onboarding for barn < 3 år
    sovn: {},

    helse: {
      medisiner: [
        { id: 1, name: 'Paracet', intervalH: 4, maxDay: 4 },
        { id: 2, name: 'Ibux', intervalH: 6, maxDay: 3 },
      ],
      doser: [], vaksiner: [], syk: [], nextHid: 10,
    },

    beskjeder: { lapper: [], nextId: 1 },
    vekst: { maalinger: [], nextId: 1 },
    pakkelister: {
      lister: [
        { id: 1, navn: 'Hytta', emoji: '🏔️', items: [
          { id: 10, navn: 'Ladere', pakket: false }, { id: 11, navn: 'Ullundertøy', pakket: false },
          { id: 12, navn: 'Turmat', pakket: false }, { id: 13, navn: 'Førstehjelpsskrin', pakket: false },
        ]},
        { id: 2, navn: 'Barnehagen', emoji: '🧸', items: [
          { id: 20, navn: 'Skiftetøy', pakket: false }, { id: 21, navn: 'Regntøy', pakket: false },
          { id: 22, navn: 'Innesko', pakket: false },
        ]},
      ],
      nextId: 30,
    },
  };
}
