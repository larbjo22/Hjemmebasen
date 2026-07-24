# Hjemmebasen

Husholdningsapper (handleliste, middag, oppgaver, fryser, plikter, søvn, helse)
som PWA for flere husstander, med Firebase som backend og en admin-side der
administratoren administrerer tilgang. Avlegger av `ha-apper` (Home Assistant-versjonen),
men uten HA-avhengigheter.

## Language

**Husstand**:
Én tilgangsenhet med eget, isolert dataområde. Kalles `familie` i kode/datamodell
og «husstand» i admin-UI.
_Avoid_: hjem, gruppe, konto

**Medlem**:
En innlogget person (Firebase-uid) knyttet til nøyaktig én husstand.
_Avoid_: bruker (tvetydig mot admin), profil

**Admin**:
administratoren. Kan administrere alle husstander og medlemmer. Definert i `admins`-noden.
_Avoid_: superbruker, eier

**Launcher**:
Hjemsiden (`index.html`) med app-brettet. Viser kun husstandens aktiverte apper.
_Avoid_: dashboard, forside, oversikt

**Onboarding**:
Veiviseren et medlem møter første gang husstanden logger inn: familienavn,
voksne, barn med fødselsdato, sted og appvalg.
_Avoid_: oppsett, wizard

**Personregisteret**:
Husstandens voksne og barn (med fødselsdato). Fylles i onboarding og er kilden
til sannhet for alle appene; barn refereres med id, aldri navnestreng.
_Avoid_: medlemsliste (det er innloggings-medlemmer), people

**App-brytere**:
Per-husstand av/på for hver av de 7 appene. Styres i admin og onboarding.
_Avoid_: features, moduler

**Seed-data**:
Norske standarddata (kategorier, maler, medisiner, eksempel-ideer) som en ny
husstand fødes med, slik at ingen app starter tom.
_Avoid_: demo-data, defaults

**Datatap-vernet**:
Regelen om at en app aldri skriver til en node før den har hatt én vellykket
lesning av samme node. Arvet fra ha-apper etter et reelt datatap.
_Avoid_: write guard

**De 7 appene**:
handleliste, middag, oppgaver, fryser, plikter, sovn, helse.
_Avoid_: chores (heter plikter her), og de gamle appnavnene fra ha-apper

**HA-versjonen**:
Opphavet: `ha-apper`-repoet som kjører hjemme hos eieren på Home Assistant.
Lever videre uavhengig; forbedringer porteres manuelt ved behov.
_Avoid_: gamle versjonen, originalen
