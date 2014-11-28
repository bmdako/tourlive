tourlive
========

Dette er en simple statisk HTML side til visning af RSS feeds fra feltet.dk.

# Udvikling

1. Lav en fork af dette repo.
2. Start en lokal HTTP server ved brug af `python -m SimpleHTTPServer`.
3. Åbn [http://localhost:8000/](http://localhost:8000/) i en browser.
4. Kod!

# Release

Upload alle hele *tourlive* folderen til S3 bucket *bem-wordpress-content* som er *statisk hostet*.

Dette giver en URL (http://bem-wordpress-content.s3.amazonaws.com/tourlive/index.html) som kan inkluderes i andre BT's websider (desktop og mobil) ved brug af \<iframe\> og i BT's iOS App som *custom content*.

Ansvarlige personer:
* Kevin Walsh for inkludering i BT's desktop website
* Sergey Sokurenko for inkludering i BT's mobil website
* Mads Roland for inkludering i BT's iOS App.

# Funktionalitet

Det oprindelige RSS feed ligger på [http://www.feltet.dk/live/FeltetLive_rss.xml](http://www.feltet.dk/live/FeltetLive_rss.xml).
Casper har set en regel op som henter feed'et ca. en gang i minuttet og placeret på [http://www.b.dk/helpers/feeds/FeltetLive_rss.xml](http://www.b.dk/helpers/feeds/FeltetLive_rss.xml)

Feed'et består af en række *items* med **titel**, **dato** og **beskrivelse** af begivenheden.

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

1. Hvis der er items fra dags dato, vises teksten *Live opdatering fra dagens etape*.
2. Hvis der ikke er nogle items fra dags dato, vises teksten *Ingen live opdatering fra Tour de France på nuværende tidspunkt*.
  * Hvis dags dato **ikke** er første dag på Tour'en (eller tidligere), vises også *Live opdatering fra i går*.
