# eierens husstand forblir på HA-versjonen – to kodebaser

Hjemmebasen kunne erstattet ha-apper også hjemme hos eieren (én kodebase for
alle). Vi valgte det motsatte: eierens husstand migreres ikke, og Hjemmebasen har
null HA/MQTT-arv i koden. HA-versjonen er dypt integrert hjemme (dashbord-
iframes, strømsensorer, Elvia) og fungerer; å flytte den gir risiko uten
gevinst for målgruppen (venner/bekjente uten HA).

## Consequences

Forbedringer må porteres manuelt mellom `ha-apper` og `hjemmebasen` når de er
relevante begge steder. Akseptert kostnad – revurderes hvis vedlikeholdet svir.
En fremtidig leser som lurer på hvorfor to nesten like kodebaser eksisterer:
dette er hvorfor.
