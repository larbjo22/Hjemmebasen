// ── nyheter.js ───────────────────────────────────────────────
// Release notes for brukerne: vises på nyheter.html, og Hjem viser et lite
// «Nytt i Hjemmebasen»-banner til den nyeste utgaven er lest.
// Ny utgave: legg et nytt objekt ØVERST i NYHETER med en ny, unik id
// (f.eks. dagens dato – den vises ikke). Skriv for brukere – hva de ser og kan gjøre, ikke kode.

export const NYHETER = [
  {
    id: '2026-11-26',
    tittel: 'Hverdagen med småbarn – fire nye apper',
    ingress: 'Mindre å huske på, færre «tar du henting?»-meldinger, og noen ting dere kommer til å bli glade for om ti år.',
    deler: [
      {
        app: 'hjem', ikon: 'ti-moon-stars', navn: 'Hjem',
        punkter: [
          'Fra kl. 17 viser Hjem <b>«I morgen»</b>: hvem som leverer og henter, kalenderen, middagen, hva som må tas ut av fryseren, oppgaver og bursdager.',
          'Har dere slått på varsler, kommer det samme som et <b>kveldsvarsel</b> rundt kl. 19.',
          '<b>😮‍💨 Dårlig dag?</b> Ett trykk bytter dagens middag til en nødmiddag fra fryseren, skyver dagens oppgaver til i morgen og legger en lapp til de andre. Alt kan angres.'
        ]
      },
      {
        app: 'levering', ikon: 'ti-car', navn: 'Levering (ny)',
        punkter: [
          'Fast ukemønster for hvem som <b>leverer og henter</b> i barnehagen, og enkle endringer for enkeltdager.',
          '<b>Bytt</b> levering og henting med ett trykk, og se hvem som har gjort mest den siste måneden.'
        ]
      },
      {
        app: 'klaer', ikon: 'ti-shirt', navn: 'Klær (ny)',
        punkter: [
          'Hva barna har, i hvilken <b>størrelse</b>, og hva som ligger klart i neste størrelse.',
          'En <b>sesongliste</b> viser hva som mangler før vinteren i størrelsen barnet bruker nå (hentet fra Vekst).',
          'Det som trengs, legges i handlelista med ett trykk.'
        ]
      },
      {
        app: 'barnevakt', ikon: 'ti-heart-handshake', navn: 'Barnevakt (ny)',
        punkter: [
          'Ett <b>overleveringsark</b>: leggetid, kveldsrutine, middag, medisin gitt siste døgn, allergier, trøst og telefonnumre.',
          '«Gi til barnevakten» viser bare arket – uten menyer og redigering.'
        ]
      },
      {
        app: 'intervju', ikon: 'ti-cake', navn: 'Bursdagsintervju (ny)',
        punkter: [
          'De samme <b>ti spørsmålene</b> til barnet hvert år, med svarene side om side år for år.',
          '<b>Tidskapsel:</b> skriv brev som åpnes på 18-årsdagen.'
        ]
      },
      {
        app: 'helse', ikon: 'ti-first-aid-kit', navn: 'Helse',
        punkter: [
          'Sykedager har fått <b>«Hvem var hjemme?»</b>, og en teller viser dagene per voksen i år – og hvem sin tur det er neste gang.',
          'Registrer <b>flere sykedager</b> på én gang med «Til og med».'
        ]
      },
      {
        app: 'sovn', ikon: 'ti-moon', navn: 'Søvn',
        punkter: [
          'Fra kl. 15: <b>kveldsprognose</b> med når barnet legger seg – og når dere har kvelden for dere selv.'
        ]
      }
    ]
  },
  {
    id: '2026-11-25',
    tittel: 'Ny app: Gaver',
    ingress: 'Slutt på gavelister i notat-appen. Skriv ned ønsker og ideer hele året, og hold oversikt over hvem som har fått hva.',
    deler: [
      {
        app: 'gaver', ikon: 'ti-gift', navn: 'Gaver',
        punkter: [
          '<b>Idébank per person</b> (eller par og grupper): skriv ned ønsker når dere hører dem, og legg ved lenke til ønskelista deres.',
          '<b>Anledninger</b> som «Jul» og bursdager: hvem skal ha gave, hvem mangler idé, og hva er kjøpt.',
          'Hver gave har <b>status</b> (Idé → Kjøpt → Pakket → Gitt), pris, lenke til butikk, hvem som kjøper og notat.',
          '<b>Budsjett</b> per anledning, med brukt og planlagt.',
          '<b>Lim inn</b> et notat dere har fra før – én person per linje, med gaven i parentes.',
          'Avsluttede anledninger blir stående, så dere ser <b>hva alle fikk i fjor</b>.',
          'Appen kan slås av for husstanden under <b>Endre oppsett</b>.'
        ]
      }
    ]
  },
  {
    id: '2026-11-02',
    tittel: 'Lettere å komme inn igjen',
    ingress: 'Glemt passord skal ikke stoppe noen. Nå kan dere hjelpe hverandre, og en utløpt lenke er ikke lenger en blindvei.',
    deler: [
      {
        app: 'hjem', ikon: 'ti-key', navn: 'Innlogging',
        punkter: [
          'Under <b>Min profil</b> kan du <b>sende ny passordlenke</b> til andre i husstanden. Du ser aldri passordet deres.',
          'Er lenken i e-posten utløpt, kan du <b>få en ny rett fra siden</b> du havner på. Lenken virker i 1 time.',
        ]
      }
    ]
  },
  {
    id: '2026-11-01',
    tittel: 'Smartere søvn, Husfreden og tryggere lagring',
    ingress: 'Den største oppdateringen hittil. Søvn-appen lærer av barnets egne tider, flere kan bruke appene samtidig uten at noe forsvinner, og nesten alle appene har fått angre og små forbedringer.',
    deler: [
      {
        app: 'sovn', ikon: 'ti-moon', navn: 'Søvn',
        punkter: [
          '<b>Anbefalt neste søvn er nå et tidsrom</b>, f.eks. «Neste lur ca. 11:30–12:15», i stedet for ett klokkeslett.',
          'Anbefalingen <b>lærer av barnets egne tider</b> og følger med når barnet forandrer seg – de siste dagene teller mest.',
          'Under anbefalingen står det hva den bygger på. Har den for lite å gå på, står det «usikkert», og vanlige tall for alderen brukes.',
          'I innstillingene ser du <b>hvor ofte anbefalingen traff</b> de siste to ukene, og du kan skru den av.',
          '<b>Pause</b> når barnet er hos andre, og <b>«Nullstill fra nå»</b> når du har glemt å trykke. Tiden merkes som «ikke registrert» og holdes utenfor statistikken.',
          'Appen spør <b>«Glemt å trykke?»</b> når barnet har stått lenge i samme tilstand.',
          '<b>Barnehage-modus</b> (per barn, i innstillingene): «Levert i barnehagen» → «Hentet» → «Sov hun/han i barnehagen?».',
          'Appen forstår at det er normalt når barnet <b>slutter med lur</b>. Aldersreferansen går nå opp til 4 år.',
          'Dager med mye ikke registrert tid vises <b>skravert</b> og trekker ikke ned snittene. Sommertid gir ikke lenger rare søyler.'
        ]
      },
      {
        app: 'helse', ikon: 'ti-first-aid-kit', navn: 'Helse',
        punkter: [
          'Når maks antall doser per døgn er nådd, viser appen <b>når neste dose faktisk kan gis</b> – både i Helse og på Hjem.',
          'En dose kan ikke lenger føres <b>fram i tid</b>.',
          'Fører du en dose i ettertid, sjekkes avstanden til dosene <b>både før og etter</b>.',
          'Hjem viser «ukjent – sjekk Helse» i stedet for «kan gis nå» hvis appen har mistet forbindelsen en stund.'
        ]
      },
      {
        app: 'hjem', ikon: 'ti-home', navn: 'Hjem',
        punkter: [
          'Middagsflisa viser også <b>morgendagens middag</b> og hvem som lager den.',
          'Fra kl. 15 minner Hjem deg på å <b>ta ut av fryseren</b> hvis morgendagens middag ligger der.',
          'Krysser du av flere oppgaver, kan du <b>angre dem én etter én</b>.'
        ]
      },
      {
        app: 'oppgaver', ikon: 'ti-checkbox', navn: 'Oppgaver',
        punkter: [
          'Ukevisningen viser <b>oppgaver på overtid</b>, og du kan krysse dem av der.',
          '«Min dag» viser også <b>felles oppgaver</b>.',
          'Sletter du en person, flyttes de åpne oppgavene deres til Felles i stedet for å bli borte.',
          'Fullførte oppgaver eldre enn ett år flyttes til et eget arkiv – se dem med <b>«Vis eldre»</b>.',
          'Vedlikehold: «Avbryt» angrer nå endringene, og «Gjort nå» lukker den automatiske oppgaven.',
          '<b>Nytt: Husfreden 🕊️</b> – en valgfri fane der de voksne kan logge frustrasjon og ros, med poeng og ukesoppsummering. Slå den på i Oppgaver → Innstillinger. «Fikset» må bekreftes av den som skrev frustrasjonen.'
        ]
      },
      {
        app: 'handleliste', ikon: 'ti-shopping-cart', navn: 'Handleliste, middag og fryser',
        punkter: [
          '<b>Samme vare blir én rad</b>: legger du til «Tomater» når «Tomat» står der, blir det Tomat ×2.',
          'Skriv <b>«2 melk»</b>, så blir det Melk ×2.',
          'Fra middagsplanen blir «400 g kjøttdeig» til Kjøttdeig, og samme vare fra flere middager slås sammen.',
          'Sletting og «Fullfør handletur» kan <b>angres</b>.',
          'Fryseren tilbyr <b>«Øk eksisterende»</b> når du legger inn noe som finnes fra før, og viser varer uten kategori i egen gruppe.',
          'Fryseren spør før ulagrede endringer forkastes. «Fyll uka» i middag fyller bare fra i dag og framover.'
        ]
      },
      {
        app: 'pakkelister', ikon: 'ti-backpack', navn: 'Pakkelister og statistikk',
        punkter: [
          'Pakkelister: hakene vises med en gang, og fjernede ting kan <b>angres</b>.',
          'Statistikk sier tydelig fra hvis noe ikke kunne lastes, i stedet for å vise feil tall.',
          'Eksport til regneark følger valgt periode.'
        ]
      },
      {
        app: 'sikkerhet', ikon: 'ti-shield-check', navn: 'Trygghet og stabilitet',
        punkter: [
          '<b>Flere kan bruke appene samtidig</b>: i søvn, handleliste og oppgaver blir begges endringer tatt vare på når to telefoner lagrer på likt.',
          'Invitasjonskoder er lengre og <b>utløper etter 14 dager</b>.',
          'Strengere sikkerhet rundt profilbilder og husstandens data.'
        ]
      }
    ]
  }
];

export const SISTE_NYHET = NYHETER[0].id;
export const NYHET_LEST_KEY = 'hjemmebasen_nyheter_lest';

export function nyheterUlest() {
  try { return localStorage.getItem(NYHET_LEST_KEY) !== SISTE_NYHET; }
  catch (e) { return false; }
}
export function markerNyheterLest() {
  try { localStorage.setItem(NYHET_LEST_KEY, SISTE_NYHET); } catch (e) { /* privat modus */ }
}
