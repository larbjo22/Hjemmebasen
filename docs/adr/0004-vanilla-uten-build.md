# Vanilla HTML/CSS/JS uten build-steg – også med Firebase

For et produkt med 7 apper, innlogging og admin ville de fleste valgt et
rammeverk og en bundler. Vi viderefører ha-appers filosofi: én HTML-fil per
app, delte `felles/*.js`-moduler, ingen npm og ingen build. Firebase lastes
som ESM-moduler fra CDN (`type="module"`), som ikke krever toolchain.

Begrunnelsen er vedlikeholdskost over tid: prosjektet vedlikeholdes i
kveldsøkter, og en toolchain som må holdes i live er en større risiko enn
litt lengre HTML-filer. Deploy er `git push` til GitHub Pages.

## Consequences

- Ingen tree-shaking: CDN-modulene er større enn en bundlet build. Akseptert –
  lastes én gang og caches.
- Delt kode må være disiplinert (felles/-mappen), ellers dupliseres den som i
  ha-apper (jf. søvnappens (ha-apper) innebygde MQTT-kopi – feilen vi ikke gjentar).
