# Schnelltest-Rechner
Diese Website hilft beim Einschätzen der a-priori Wahrscheinlichkeit, mit Covid-19 infiziert zu sein, und darauf basierend, die Ergebnisse von Schnell- bzw. Selbsttests zu interpretieren.

## Quellen

Die Daten über verfügbare Schnelltests kommen von des Listen des BfArM:
 * [Liste der Tests zur Eigenanwendung durch Laien](https://www.bfarm.de/DE/Medizinprodukte/Antigentests/_node.html)
 * [Liste der Antigen-Tests zum direkten Erregernachweis des Coronavirus SARS-CoV-2](https://antigentest.bfarm.de/ords/f?p=ANTIGENTESTS-AUF-SARS-COV-2)

Die Einschätzung der a-priori Wahrscheinlichkeit basier auf:
 * den Inzidenzen gemäß [corona-zahlen.org](https://api.corona-zahlen.org/docs/)
 * einer Extrapolation der Inzidenz durch das Wachstum seit der Vor-Woche
 * einer Abschätzung des Underreporting-Faktors von 4-6 durch das [RKI](https://www.rki.de/DE/Content/Infekt/EpidBull/Archiv/2020/Ausgaben/50_20.pdf?__blob=publicationFile)
 * Faktoren für das private Infektionsrisiko die an [Microcovid](https://www.microcovid.org) angelehnt sind
 * Faktoren für das berufliche Risiko die beispielhaft aus Grafiken von [www.addendum.org](https://www.addendum.org/coronavirus/berufe-ansteckungsrisiko/) entnommen wurden

Die Berechnung der Bayes-Faktoren und der A-Posteriori-Wahrscheinlichkeiten folgt der Berechnung des Videos [The medical test paradox: Can redesigning Bayes rule help?](https://www.youtube.com/watch?v=lG4VkPoG3ko&t) von 3Blue1Brown.

__Dies ist eine sehr frühe, ungestestete Version der Website. Sie ersetzt keinen ärztlichen Rat!__