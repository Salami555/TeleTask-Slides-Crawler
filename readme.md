TeleTask-Slides-Crawler
=======================

Für den Download der Folien einer TeleTask-Präsentation.

Installation
------------

 1. `git clone https://github.com/Salami555/TeleTask-Slides-Crawler.git`
 2. `npm install`

Nutzung
-------

 1. ganze Serie extrahieren
 	- in der Url der Serie die Serien-ID herausfinden (`https://www.tele-task.de/series/####/`)
	- mit `npm start fetch-series <series-id>` den Download starten

 2. einzelnes Video extrahieren
	- in der Url des Videos die Video-ID herausfinden (`https://www.tele-task.de/lecture/video/####/`)
	- mit `npm start fetch-video-slides <video-id>` den Download starten

*Hinweis:* Falls sich die Struktur der Webseite ändert, werden vermutlich die Regex nicht mehr matchen und das Tool nurnoch Fehler werfen. Da ich nicht wirklich Fehlerbehandlung eingebaut habe, müsst ihr das dann selbst fixen.

Einstellungen
-------------

Einstellbar unter `settings.js`.

 - `savePath` Speicherort für die Ausgabe der Folien

 - `skipExisting` Überschreiben von existierenden Dateien

 - `throttle` Crawl-Geschwindigkeit

	Zurzeit wird 1 Request alle 0,5 Sekunden gestellt. Man könnte dieses Limit bestimmt auch entfernen, aber ich weiß nicht, ob man dann vom Server gebannt wird ;)


FAQ
---

 - ### Warum ist die Qualität so schlecht?

    Aktuell werden anstatt die Folien aus den Videos zu extrahieren, nur die Video-Thumbnails runtergeladen. Diese sind standardmäßig nur in 400x300px Auflösung verfügbar.

	*Lösung*: Es ist möglich mit ffmpeg einzelne Frames aus dem Folien-Video zu extrahieren. Dies ist ein Todo für die Zukunft.

Todo
----

 - ### Extrahierung der Frames aus dem Folien-Video

	1. Es wird bereits die Video-Player-Konfiguration ausgelesen. In dieser findet sich ein Pfad zu einer `.../hls/desktop.m3u8`-Datei, in der Verweise zu verschiedenen Qualitätsstufen des Videos stehen. Wir wollen am besten die Datei `.../hls/hd/desktop.m3u8` haben.

	2. In dieser Datei ist eine Liste vieler einzelner `desktop#.ts`-Videos, die in der Abspielreihenfolge der Vorlesung vorliegen. Aus diesen sollte sich mit dem 1. Frame eine unbeschriftete Folie, bzw. mit dem letzen Frame die Folie mit Notation extrahieren lassen (bspw. mit `node-fluent-ffmpeg`).

	3. Zu guter Letzt wäre es nett die Folien auf die Themennamen zu mappen, die auch aktuell schon ausgelesen werden. Entweder ist das über die Frame-Nummer, Zeit oder den Index möglich (benötigt weitere Untersuchungen).
