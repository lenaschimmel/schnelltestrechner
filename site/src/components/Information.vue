<template>
    <v-container class="fill-height">
    <v-row class="fill-height">
      <v-col cols="12" class="fill-height">
        <v-expansion-panels multiple class="mb-8" v-model="expandedPanelsInfo">
          <v-expansion-panel>
            <v-expansion-panel-header
              class="font-weight-bold text-uppercase"
              color="blue lighten-3"
            >
              Verwendete Quellen und Methoden
            </v-expansion-panel-header>
            <v-expansion-panel-content color="blue lighten-5">
              <p class="font-weight-bold mt-4">
                Die Daten über verfügbare Schnelltests kommen aus diesen Quellen:
              </p>
              <ul>
                <li>
                  <a
                    href="https://www.bfarm.de/DE/Medizinprodukte/Antigentests/_node.html"
                    target="_blank"
                    >Liste der Tests zur Eigenanwendung durch Laien</a
                  >
                  des BfArM
                </li>
                <li>
                  <a
                    href="https://antigentest.bfarm.de/ords/f?p=ANTIGENTESTS-AUF-SARS-COV-2"
                    target="_blank"
                    >Liste der Antigen-Tests zum direkten Erregernachweis des Coronavirus
                    SARS-CoV-2</a
                  >
                  des BfArM
                </li>
                <li>
                  <a
                    href="https://www.klinikum.uni-heidelberg.de/diagnostics-global-health"
                    target="_blank"
                    >Ergebnisse wissenschaftlicher Studien</a
                  >, zusammen getragen von der Uni Heidelberg
                </li>
              </ul>
              <p class="font-weight-bold mt-4">
                Die Einschätzung der a-priori Wahrscheinlichkeit basiert auf:
              </p>
              <ul>
                <li>
                  den Inzidenzen gemäß
                  <a href="https://api.corona-zahlen.org/docs/" target="_blank"
                    >corona-zahlen.org</a
                  >
                </li>
                <li>
                  einer Extrapolation der Inzidenz durch das Wachstum seit der Vor-Woche
                </li>
                <li>
                  einer Abschätzung des Underreporting-Faktors von 4-6 durch das
                  <a
                    href="https://www.rki.de/DE/Content/Infekt/EpidBull/Archiv/2020/Ausgaben/50_20.pdf?__blob=publicationFile"
                    target="_blank"
                    >RKI</a
                  >
                </li>
                <li>
                  Faktoren für das private Infektionsrisiko, die an
                  <a href="https://www.microcovid.org" target="_blank">Microcovid</a>
                  angelehnt sind
                </li>
                <li>
                  Faktoren für das berufliche Risiko, die beispielhaft aus Grafiken von
                  <a
                    href="https://www.addendum.org/coronavirus/berufe-ansteckungsrisiko/"
                    target="_blank"
                    >www.addendum.org</a
                  >
                  entnommen wurden
                </li>
              </ul>
              <p class="mt-4">
                Die Berechnung der Bayes-Faktoren und der
                A-Posteriori-Wahrscheinlichkeiten folgt der Berechnung des Videos
                <a href="https://www.youtube.com/watch?v=lG4VkPoG3ko" target="_blank"
                  >The medical test paradox: Can redesigning Bayes rule help?</a
                >
                von 3Blue1Brown.
              </p>
              <p>
                Der Einfluss von Symptomen auf die a-priori Wahrscheinlichkeit einer
                Infektion wurde nach der
                <a
                  href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7584484/"
                  target="_blank"
                  >Punkteregel nach Smith, Richey und Brunetto</a
                >
                implementiert. Die Punkteregel ist darauf ausgelegt, die a-priori
                Wahrscheinlichkeit eines symptomatischen Patienten (mit unklaren
                Symptomen, die grob auf Covid-19 hindeuten) anhand seiner spezifischen
                Symptome zu verfeinern. Dazu wird die Prävalenz um den Faktor 18,8
                angehoben, sobald Symptome vorhanden sind, um anschließend die Punkteregel
                anzuwenden.
                <strong
                  >Der Faktor 18,8 basiert auf sehr groben Abschätzungen und stellt
                  wahrscheinlich die größte Ungenauigkeit innerhalb der gesamten
                  Berechnung dar. Er sollte dringend durch einen wissenschaftlich
                  basierten Wert ersetzt werden.</strong
                >
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header
              class="font-weight-bold text-uppercase"
              color="blue lighten-3"
            >
              Weitere Informationsquellen
            </v-expansion-panel-header>
            <v-expansion-panel-content color="blue lighten-5">
              <p class="mt-4">
                Diese Seite hat nicht den Anspruch, sämtliche Informationen zu
                SARS-CoV-2-Tests vollständig und fehlerfrei anzubieten. Daher empfehlen
                wir ausdrücklich, auch weitere Informationsquellen zu Rate zu ziehen!
              </p>
              <ul>
                <li>
                  <a
                    href="https://www.zusammengegencorona.de/informieren/testen/"
                    target="_blank"
                    >Informationen zum Testen</a
                  >
                  vom Bundesministerium für Gesundheit
                </li>
                <li>
                  <a
                    href="https://www.infektionsschutz.de/coronavirus/tests-auf-sars-cov-2.html"
                    target="_blank"
                    >Tests auf das Coronavirus SARS-CoV-2</a
                  >
                  von der Bundeszentrale für gesundheitliche Aufklärung (BZgA)
                </li>
                <li>
                  Sämtliche Informationen des
                  <a
                    href="https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/nCoV.html"
                    target="_blank"
                    >Robert Koch Instituts (RKI)</a
                  >
                </li>

                <li>
                  Der
                  <a
                    href="https://diagnostics-global-health.github.io/rechner/"
                    target="_blank"
                  >
                    Schnelltest-Rechner der Uni-Heidelberg</a
                  >, von der auch die Studiendaten kommen. Schnell und einfach, aber ohne
                  individuelle Vortest-Wahrscheinlichkeit.
                </li>
                <li>
                  Der
                  <a href="https://rki-wiko.shinyapps.io/test_qual/" target="_blank">
                    Schnelltest-Rechner des Robert Koch Instituts (RKI)</a
                  >. Er ist zwar langsam und weniger mächtig als dieser hier, bietet aber
                  ein paar andere Darstellungsweisen der Ergebnisse.
                </li>
                <li>
                  Im
                  <a
                    href="https://www.ndr.de/nachrichten/info/Das-Glossar-zum-Corona-Podcast,podcastcoronavirus146.html#SARS"
                    target="_blank"
                    >Corona-Glossar</a
                  >
                  des
                  <a href="https://www.ndr.de/nachrichten/info/podcast4684.html"
                    >Coronavirus-Update von NDR Info</a
                  >
                  werden alle wichtigen Fachbegriffe erläutert. Generell ist der Podcast
                  sehr empfehlenswert und es gibt ein
                  <a
                    href="https://www.ndr.de/nachrichten/info/coronaskript174.pdf"
                    target="_blank"
                    >durchsuchbares Transkript aller Folgen als PDF</a
                  >.
                </li>
                <li>
                  Die Initiative
                  <a href="https://rapidtests.de/" target="_blank">RapidTests.de</a>
                  erläutert wichtige Konzepte, auch in ihren umfangreichen
                  <a href="https://rapidtests.de/faq" target="_blank">FAQ</a>.
                </li>
                <li>
                  Die
                  <a
                    href="https://www.cochrane.de/de/news/aktualisierter-cochrane-review-bewertet-zuverl%C3%A4ssigkeit-von-schnelltests-zum-nachweis-von-covid"
                    target="_blank"
                    >Zusammenfassung</a
                  >
                  und die
                  <a
                    href="https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD013705.pub2/full/de"
                    target="_blank"
                    >(wirklich lange) Langfassung</a
                  >
                  des Aktualisierten Cochrane Review bewertet Zuverlässigkeit von
                  Schnelltests zum Nachweis von COVID-19. Die Ergebnisse daraus sind
                  <i>noch nicht</i> in die Datenbasis dieses Rechners integriert.
                </li>
              </ul>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header
              class="font-weight-bold text-uppercase"
              color="blue lighten-3"
            >
              Evaluierung durch das Paul-Ehrlich-Institut
            </v-expansion-panel-header>
            <v-expansion-panel-content color="blue lighten-5">
              <p class="mt-4">
                In der Auswahlliste sind Test gekenntzeichnet, die durch das
                Paul-Ehrlich-Institut (PEI) evaluiert sind. Auch lässt sich die Liste nach
                diesem Kriterium filtern.
              </p>
              <p>
                <b
                  >Die Relevanz der PEI-Evaluation kann leicht überschätzt werden, da der
                  Anschein entsteht, die Tests würden unabhängig bzgl. Sensititvität
                  <i>und</i> Spezifität getestet werden. Das ist nicht der Fall.</b
                >
              </p>
              <p>
                Das PEI fragt u. A. die Sensitivität und Spezifität vom Hersteller ab, und
                legt daran Mindestkriterien an. Nur wenn ein Test laut Hersteller
                mindestens 80% Sensititvität und mindestens 97% Spezifität hat, kommt er
                für die Evaluierung überhaupt in Frage.
              </p>
              <p>
                Die Tests, die nicht bereits durch die Hersteller-Angaben ausscheiden,
                <i>können</i> dann vom PEI weiter betrachtet werden, worauf jedoch kein
                Anspruch besteht.
              </p>
              <p>
                Für die erfolgreiche Evaluierung ist ebenfalls eine Laboruntersuchung
                durch
                <i
                  >"verschiedene Institutionen in Deutschland (u.a. Robert-Koch-Institut;
                  Paul-Ehrlich-Institut; Konsiliarlabor für Coronaviren; Institut für
                  Mikrobiologie der Bundeswehr)"</i
                >
                nötig. In einem einheitlichen, analytischen (praxis-fernen, aber
                sinnvollem) Verfahren wird die Sensitivität des Tests geprüft.
                <b
                  >Der Labortest im Rahmen der PEI-Evaluation testet <i>nicht</i> die
                  Spezifität.</b
                >
              </p>
              <p>
                Der durchgeführte Test ist zwar geeignet, eine vage Aussage zur
                Sensititvität zu machen, jedoch wird dabei kein Wert Ermittelt, der direkt
                mit den Ergebnissen der Hersteller oder anderer unabhängiger Studien
                verglichen werden kann. Insbesondere wird vom PEI kein solcher Wert als
                Prozentangabe veröffentlicht, sondern nur die Liste der Tests, die als
                <i>"dem derzeitigen Stand der Technik entsprechend bewertet wurden"</i>.
              </p>
              <p>Die konkreten Verfahrensweise können bei PEI nachgelesen werden:</p>
              <ul>
                <li>
                  <a
                    href="https://www.pei.de/SharedDocs/Downloads/DE/newsroom/dossiers/mindestkriterien-sars-cov-2-antigentests-01-12-2020.pdf?__blob=publicationFile&v=6"
                    target="_blank"
                    >Mindestkriterien für SARS-CoV-2 Antigentests im Sinne von § 1 Abs. 1
                    Satz 1 TestVO: Antigenschnelltests</a
                  >
                </li>
                <li>
                  <a
                    href="https://www.pei.de/SharedDocs/Downloads/DE/newsroom/dossiers/evaluierung-sensitivitaet-sars-cov-2-antigentests-04-12-2020.pdf?__blob=publicationFile&v=36"
                    target="_blank"
                    >Vergleichende Evaluierung der Sensitivität von SARS-CoV-2
                    Antigenschnelltests
                  </a>
                </li>
              </ul>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Information",
  props: {
  },
  data: () => ({
    expandedPanelsInfo: [0, 1],
  }),
};
</script>
<style scoped>
</style>
