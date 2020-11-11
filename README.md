# Incidentkartan

## Specifikation

Syftet med applikationen är att visa information om aktuella händelser relaterade till brott eller olyckor. Dessutom ska information om brottsstatisktik i Sveriges kommuner visas.

Användaren ska kunna se kommuner och händelser på en karta. Det ska gå att klicka på en kommun eller händelse för att visa mer information.

Man ska kunna visa händelser från ett län och man ska kunna välja hur många händelser som visas.

## Datakällor

Information om aktuella incidenter hämtas från [Brottsplatskartans API](https://brottsplatskartan.se/sida/api).

Query-strängen ser ut så här:

 `
`https://brottsplatskartan.se/api/events/?limit=
${Settings.numEvents}${Settings.county.query}&app=krimsokpina`
`
Variablerna för strängen hämtas från modulen `Settings`.

`${Settings.numEvents}` representerar antal händelser som ska hämtas. `${Settings.county.query}` representerar det län för vilket information ska hämtas.

Information om brottsstatistik i kommunerna hämtas från [Kolada API](https://github.com/Hypergene/kolada).

Query-strängen ser ut enligt följande, men med fler kommunkoder:

`
`https://api.kolada.se/v2/data
/kpi/N07403,N02905,N07402,U07417,U07452,U07418
/municipality/1440,1489,0764,0604,1984,2506,2505,
/year/` + Places.year
`

Värdena efter `kpi/` representerar Key performance indicators, i detta fallet olika former av brott.

Värdena efter `municipality/` representerar kommunkoder.

Det sista värdet, efter `year/` representerar det år för vilket statistik ska hämtas. Det är definierat som nuvarande år minus två, då det tar ett tag för statistiken att bli tillgänglig.

## Arkitektur

### Teknik

Följande verktyg har använts för att lösa uppgiften.

Appen är byggd med ramverket [Mithril JS](https://mithril.js.org/) och använder biblioteket [Leaflet JS](https://leafletjs.com/) för att skapa en karta.

Tillägget [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) används för att samla ikoner i kluster så att det inte blir för många ikoner på skärmen samtidigt.

[Webpack](https://webpack.js.org/) används för att samla ihop de olika tillgångarna.

För att ge stöd för Android har [Apache Cordova](https://cordova.apache.org/docs/en/latest/guide/overview/index.html) använts.

Tillägget [cordova-plugin-file](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/index.html) används för att skriva till och läsa ifrån fil i syfte att cacha data.

[Cordova-plugin-geolocation](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-geolocation/index.html) används för att få tillång till användarens position.

[Cordova-plugin-splashscreen](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/index.html) används för att kunna visa en splash screen när appen körs på Android.

### Struktur

Hela appen samlas genom Webpack till filen `www/app.js`. 

I `www/src` finns javascript-filerna som ligger till grund för appen.

`www/src/index.js` definierar appens rutter.

#### Vyer

I `src/views` finns filer för vyer.

`Layout.js` strukturerar upp den övergripande layouten som används genomgående i appen.

`MapView.js` visar upp kartan.

`SettingsView.js` visar inställningar som användaren kan göra.

`AboutView.js` innehåller information om appen.

#### Moduler

I katalogen `src/models` finns moduler med funktionalitet för olika delar av appen.

`MapModel.js` har funktionalitet för att skapa kartan.

`Settings.js` lagrar de aktuella inställningarna för vad som ska visas på kartan.

`Places.js` innehåller funktionalitet för att hämta och rendera data om kommuner. Data hämtas från [Kolada API](https://github.com/Hypergene/kolada).

`Events.js` innehåller funktionalitet för att hämta och rendera data om händelser. Här hämtas data från [Brottsplatskartans API](https://brottsplatskartan.se/sida/api).

`Positon.js` använder sig av pluginen [Cordova-plugin-geolocation](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-geolocation/index.html) för att hämta användarens nuvarande position.

`FileModel.js` innehåller funktionalitet för att skriva till och läsa ifrån fil.

`counties.js` och `kommuns.js` innehåller hårdkodad information om län respektive kommuner.