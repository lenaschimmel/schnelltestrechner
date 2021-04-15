# Schnelltest-Rechner
Diese Website hilft beim Einschätzen der a-priori Wahrscheinlichkeit, mit Covid-19 infiziert zu sein, und darauf basierend, die Ergebnisse von Schnell- bzw. Selbsttests zu interpretieren.

**Die Seite ist unter [SchnellTestRechner.de](https://schnelltestrechner.de/) online erreichbar.**

Die verwendeten Quellen und Berechnungsweisen sind auf der Seite selbst dokumentiert.

Die Seite kann prinzipbedingt nur Wahrscheinlichkeiten aufzeigen. Diese Wahrscheinlichkeiten sind eine Abschätzung. Diese Abschätzung ist nicht die absolut genauste, die theoretisch möglich wäre, aber sollte für die Praxis nah genug dran sein und um Größenordnungen besser als eine intuitive Abschätzung ohne Berechnung. Bekannte Probleme und Ungenauigkeiten sind sowohl auf der Seite selbst auch in den [Issues](https://github.com/lenaschimmel/schnelltestrechner/issues) beschrieben. Dabei ist nicht jeder Aspekt zwingend an beiden Stellen beschrieben.

## Technologie
 * HTML, CSS, JS
 * Vue.js
 * Vuetify.js
 * Mathjax (für die Darstellung Mathematischer Formeln im Tab "Weitere Infos")
 * Ein paar Node.js-Skripte, die Daten vorverarbeiten, damit diese von der Website leichter eingelesen werden können

## Hinweise für Entwickler_innen
Im Code sind im Wesentlichen zwei Projekte enthalten, die jeweils ihre eigenen Abhändigkeiten haben: `tools` und `site`.

Das Script `up.sh` führt alle nötigen Schritte durch, die im Deployment nötig sind. Aber auch für das lokale Testen ist es ratsam, es einmal auszuführen und/oder sich die einzelnen Schritte im Script anzuschauen und sie manuell auszuführen.

## Betrieb und Wartung
Ein cronjob o.Ä. sollte regelmäßig `tools/updateIncidence.sh` aufrufen. Für schnelltestrechner.de passiert das alle sechs Stunden.

Die Daten in `src_data` müssen derzeit von Hand gepflegt werden. Nach jeder Änderung muss `tools/updateLists.sh` aufgerufen werden, damit die verarbeiteten Daten in  `site/public/data` landen.

## Kontakt
 * Über Twitter: [@Testrechner](https://twitter.com/Testrechner) oder direkt an [LenaSchimmel](https://twitter.com/LenaSchimmel)
 * Per Mail: an [mail@schnelltestrechner.de](mailto:mail@schnelltestrechner.de)
