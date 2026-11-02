# Passordlenker: 1 time, hjelp i husstanden og egen handler

Firebase setter fristen på reset-lenker til 1 time, og den kan ikke endres. En
lengre frist ville krevd egen server med Admin SDK (Blaze eller ekstern tjeneste)
med full nøkkel til prosjektet, og ville latt ett medlem overta et annet medlems
konto. Vi beholder derfor Firebases lenke og fjerner blindveien i stedet:

- `nytt-passord.html` er egen action-handler. Utløpt lenke gir «send ny lenke».
- Medlemmer kan sende hverandre ny lenke fra Min profil.

## Consequences

- Fristen er fortsatt 1 time. E-postteksten styres av Firebase.
- `familier/<id>/medlemKontakt/<uid>` = `{navn, epost}` gjør e-posten synlig for
  husstanden (og i husstandseksporten). Security rules er uendret. Admin rydder
  noden ved fjerning og flytting.
- Et medlem står i lista først etter neste innlogging; til da kan e-posten skrives inn.
- Å sende en lenke endrer ingenting før mottakeren selv velger passord. Det samme
  kan alle gjøre fra «Glemt passord» på innloggingssiden.
- Action URL settes for hånd i Firebase Console (se README).
