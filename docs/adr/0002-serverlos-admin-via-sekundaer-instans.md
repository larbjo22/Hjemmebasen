# Serverløs admin: brukere opprettes via sekundær Firebase-instans

Å opprette brukere fra klienten med `createUserWithEmailAndPassword` logger
normalt inn som den nye brukeren og kaster admin ut. Standardsvaret er Cloud
Functions med Admin SDK, men Functions krever Blaze-plan (betalingskort).
Admin-siden bruker i stedet en sekundær Firebase-app-instans for selve
opprettelsen, skriver medlemskapet via primær-instansen, og kaster den
sekundære etterpå.

## Consequences

- Full sletting av auth-kontoer og deaktivering på auth-nivå kan ikke gjøres
  fra klienten – «fjern tilgang» sletter medlemskapet, og security rules
  stenger all datatilgang umiddelbart. Endelig opprydding gjøres i Firebase
  Console ved behov.
- Admin ser aldri passord; kun «send tilbakestillings-e-post».
