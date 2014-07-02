tourlive
========

Dette er en simple statisk HTML side til visning af RSS feed fra feltet.dk.
Siden skal integreres i andre BT's websider (desktop og mobil) ved brug af <iframe>.
Siden skal også integreres i BT iOS App'en som *custom content*.

Dette er en simpel - dog lidt autonom - løsning, som

Siden er statisk og har dermed udelukkende client-side JS funktionalitet.

Det oprindelige feed ligger her: [http://www.feltet.dk/live/FeltetLive_rss.xml] (http://www.feltet.dk/live/FeltetLive_rss.xml).
Casper har set en regel op som henter feed'et ca. en gang i minuttet og placerer det her: [http://www.b.dk/helpers/feeds/FeltetLive_rss.xml] (http://www.b.dk/helpers/feeds/FeltetLive_rss.xml)

Feed'et er et RSS feed og består af en række *items* med **titel**, **dato** og **beskrivelse** af begivenheden.

Ved load af siden sker følgende:
1. Feed'et hentes og behandles.
2. Der sættes en progress-bar igang som løber uendeligt i 10 sekunders iterationer.
3. Hver gang progress-bar har fuldført en iteration, hentes feed'et og behandles.

Når feed'et behandles sker følgende:
1. Feed'et hentes.
2. Alle items fra dags dato findes.
  * Items indsættes efterhånden som de modtages i feed'et.
  * Items indsættes med ældste item nederst og nyeste øverst.
  * Nye items indsættes øverst med en lille "slide" animation.
  * Items som allerede ligger i feed'et ved *page load/refresh* bliver ikke animeret.
3. Findes der ingen items fra dags dato, indsættes items fra dagen forinden.

Teksten øverst på siden afhænger af forskellige parametre:
1. Hvis der er items fra dags dato, vises teksten *Live opdatering fra dagens etape*
2. Hvis der ikke er nogle items fra dags dato, vises teksten *Ingen live opdatering fra Tour de France på nuværende tidspunkt*.
  * Hvis dags dato **ikke** er første dag på Tour'en (eller tidligere), vises også *Live opdatering fra i går*

De tre filer `index.html`, `logic.js` og `styles.css` skal uploades til en webserver som serverer statisk indhold.
Dette kan være en S3 bucket eller www.b.dk/helpers/. Dette skal gøres af Casper Bruun eller Mark Nellemann.
Når dette er sket, modtages en URL fra dem.

Denne URL skal sendes til følgende personer:
* Kevin Walsh for inkludering i BT's desktop website
* Sergey Sokurenko for inkludering i BT's mobil website
* Mads Roland for inkludering i BT's iOS App.