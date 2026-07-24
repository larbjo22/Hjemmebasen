# Personregisteret eier voksne og barn; appene refererer med id

Hver app i ha-apper har sin egen personliste (middag.people, chores.kids,
helse.barn, hardkodet barnenavn i leander). I Hjemmebasen eier
personregisteret (`familier/<id>/personer`) alle personene: onboarding fyller
det én gang, appene seedes derfra, og barn refereres med id – aldri
navnestreng.

Dette er en grensebeslutning: appene får ikke egne, divergerende kopier av
hvem som bor i huset. Navneendring på et barn slår gjennom i plikter, helse
og søvn samtidig.

## Consequences

- Sletting av en person må håndteres sentralt (hva skjer med historikk som
  peker på id-en – beholdes med «ukjent»-oppslag, som medisindoser i ha-apper).
- middag.people forblir en enkel navneliste i appdataene (seedes fra
  registeret) siden middag ikke trenger fødselsdato – bevisst unntak.
