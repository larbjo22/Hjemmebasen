# Firebase Realtime Database + Auth som backend

Appene trenger delt lagring og innlogging for flere husstander uten at vi
drifter en server. Vi valgte Firebase RTDB (én JSON-blob per app per husstand –
samme form som MQTT-payloadene i ha-apper) og Firebase Auth med e-post/passord,
lastet som CDN-moduler. Gratisplanen (Spark) dekker 20–30 husstander med god
margin, og sanntidslyttere erstatter polling.

## Considered Options

- **Supabase**: admin-API krever server-nøkkel (dvs. en server) – forkastet
- **PocketBase/egen server**: drift, backup og oppetid blir vårt problem – forkastet
- **Familiekode uten ekte auth**: forkastet av eieren – vil ha ekte innlogging og admin-kontroll

## Consequences

Google-lock-in aksepteres: datamodellen er ren JSON og eksport er triviell,
så exit-kostnaden er lav. Cloud Functions unngås bevisst (krever betalingsplan) –
se ADR-0002.
