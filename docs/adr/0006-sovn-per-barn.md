# Søvnsporing per barn fra start

ha-appers søvnapp sporer ett barn (én state/since og én øktliste). Flere av
målfamiliene har mer enn ett lite barn, og å ettermontere per-barn-tilstand i
en enkelt-barn-modell er dyrere enn å bygge det inn nå. Datamodellen er derfor
`sovn/<barnId>` med egen state, økter og innstillinger per barn; appen får
barnevelger-chips (skjult når huset har ett barn).

Fødselsdato fra personregisteret gir aldersbaserte våkenvindu-anbefalinger
per barn. Kostnad: ~1 ekstra dag i etappe 3. Akseptert.
