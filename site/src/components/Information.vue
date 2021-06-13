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
                  einer Abschätzung des Underreporting-Faktors von 1,8 durch das <a
                    href="https://www.rki.de/DE/Content/Gesundheitsmonitoring/Studien/lid/Ergebnisse.pdf?__blob=publicationFile"
                    target="_blank"
                    >RKI</a
                  > (bis zum 13.06.2021 wurde von einem deutlich höhreren Faktor (nämlich 5,5) ausgegangen, da die  <a
                    href="https://www.rki.de/DE/Content/Infekt/EpidBull/Archiv/2020/Ausgaben/50_20.pdf?__blob=publicationFile"
                    target="_blank"
                    >damaligen Werte des RKI</a
                  > diesen Schluss zuließen.)
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
              Berechnungsverfahren
            </v-expansion-panel-header>
            <v-expansion-panel-content color="blue lighten-5">
              <h2 class="mt-4">Überblick</h2>
              <p>
                Die Berechnungen auf dieser Seite bestehen im Wesentlichen aus drei
                Schritten:
              </p>
              <ol>
                <li>Berechnung der Bayes-Faktoren aus Sensitivität und Spezifität</li>
                <li>Berechnung der Vortestwahrscheinlichkeit</li>
                <li>
                  Berechnung der Nachtestwahrscheinlichkeiten für positive und negative
                  Ergebnisse
                </li>
              </ol>
              <p class="mt-4">
                Die Schritte 1 und 3 sind rein mathematischer Natur und lassen sich
                einfach darlegen und (objektiv) nachvollziehen. Für sie befindert sich
                unten eine Erläuterung.
              </p>
              <p>
                Im Gegensatz dazu ist Schritt 2 eine ungefähre Abschätzung, quasi ein
                vereinfachtes Modell der Realität.
              </p>
              <h2>1. Berechnung der Bayes-Faktoren</h2>
              <p>
                Ein Test ist entweder positiv ($T$) oder negativ ($\overline{T}$). Eine
                Person ist im leicht vereinfachten Modell binärer Tests entweder infiziert
                ($I$) oder nicht infiziert ($\overline{I}$). Es wird keine Unterscheidung
                zwischen <i>infiziert</i> und <i>infektiös</i> vorgenommen, und keine
                Betrachtung von z.B. verschiedenen Viruslasten.
              </p>

              <p>
                Die <b>Sensitivität</b> gibt die Wahrscheinlichkeit an, dass eine
                infizierte Person ein posives Testergebnis erhält: $P(T|I)$. Und die
                <b>Spezifität</b>, wie wahrscheinlich eine nicht infizierte ein negatives
                Testergebnis erhält: $P(\overline{T}|\overline{I})$.
              </p>

              <p>
                Für eine Person, deren tatsächlicher Infektionsstatus noch unbekannt ist,
                kann ein solcher medizinischer Test nicht sicher sagen, ob sie infiziert
                ist. Er kann nichtmal direkt bestimmen, mit welcher Wahrscheinlichkeit sie
                infiziert ist. Er kann lediglig die zuvor bekannte Chance, infiziert bzw.
                nicht infiziert zu sein, um gewisse Faktoren erhöhen. Dies sind die
                sogenannten Bayes-Faktoren bzw. Likelihood-Quotienten:
              </p>

              $$ {B}_{pos} = {P(T|I) \over P(T|\overline{I})} ; {B}_{neg} =
              {P(\overline{T}|I) \over P(\overline{T}|\overline{I})} $$

              <p>
                Der ${B}_{pos}$ gibt für ein positives Testergebnis an, wie viel
                wahrscheinlicher eine Infektion ist. Üblicherweise gilt ${B}_{pos} > 1$.
              </p>
              <p>
                Der ${B}_{neg}$ sagt entsprechend aus, wie viel wahrscheinlcher eine
                Infektion bei negativem Testergebnis ist. Ein negativer Test lässt
                effektiv die Chancen sinken, denn in aller Regel gilt: ${B}_{neg} &lt; 1$.
              </p>

              <p>
                <i
                  >Im "erweiterten Modus" werden die beiden Bayes-Faktoren unter dem
                  ausgewählten Test angezeigt. Sie sind unabhängig von der
                  Vortestwahrscheinlichkeit, also ein grundlegender Parameter eines
                  Tests.</i
                >
              </p>

              <h2>2. Berechnung der Vortestwahrscheinlichkeit</h2>
              <h3>2.1. Inzidenz und Prävalenz</h3>
              <p>
                In den meisten Fällen wird vom User eine Region $R$ (ganz Deutschland, ein
                Bundesland oder ein Landkreis) ausgewählt. Für diese wird die
                7-Tage-Inzidenz je 100.000 laut RKI ermittelt, wie sie vor 2 und vor 9
                Tagen gemeldet wurden. (Die Werte des aktuellen und des Vortages haben
                sich als oft fehlerträchtig gezeigt.)
              </p>

              <p>Daraus wird ein Wachstumsfaktor ermittelt, der auf 2 gedeckelt wird:</p>

              $$f_{g} = \min(2, I_{R,-2} / I_{R,-9})$$ Die Entwicklung wird um eine Woche
              in die Zukunft extrapoliert, um den Meldeverzug auszugleichen. Die Prävalenz
              der Region wird als das 1,8-fache der Inzidenz angenommen, um die nicht
              gemeldeten Infektionen einzubeziehen (Dunkelziffer). $$I_{R,+5} = I_{R,-2}
              \cdot f_{g}$$ $$P_R = 1,8 \cdot I_{R,+5}$$

              <h3>2.2. Persönliches Risiko</h3>
              <p>
                Angelehnt an die Werte von
                <a href="https://www.microcovid.org" target="_blank">Microcovid</a> werden
                für einige Beispielhafte private Lebenssituationen folgende Risikofaktoren
                $f_p$ angenommen:
              </p>

              <v-simple-table dense style="width: max-content" class="mb-4">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Privates Risikoprofil</th>
                      <th class="text-left">Risikofaktor $f_p$</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in riskProfilesPrivate" :key="item.name">
                      <td>{{ item.name }}</td>
                      <td>{{ item.val }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>

              <p>
                Berufliche Risikofaktoren $f_b$ wurden in Ahnlehnung an "Berufsgruppen mit
                dem höchsten SARS-CoV-2 Ansteckungsrisiko" auf
                <a
                  href="https://www.addendum.org/coronavirus/berufe-ansteckungsrisiko/"
                  target="_blank"
                  >www.addendum.org</a
                >
                wie folgt eingestuft, wobei "Büro" als durchschnittliches Risiko
                angenommen wurde:
              </p>

              <v-simple-table dense style="width: max-content" class="mb-4">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Berufliches Risikoprofil</th>
                      <th class="text-left">Risikofaktor $f_b$</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in riskProfilesProfessional" :key="item.name">
                      <td>{{ item.name }}</td>
                      <td>{{ item.val * 1 + 1 }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>

              <p>
                Der Gesamtrisiko-Faktor, der auf die lokale Prävalenz aufgerechnet wird,
                ergibt sich dann als:
              </p>

              $$f_g = {{f_p + f_b - 1} \over 1,8}$$

              <p>
                Zusätzliches situatives Risiko $r_+$ wird, falls vom User eingegeben,
                additiv behandelt, da dessen Berechnung (extern auf
                <a href="https://www.microcovid.org" target="_blank">microcovid.org</a>)
                bereits Rahmenbedingungen wie die Prävalenz beinhaltet.
              </p>

              Die Vortestwahrscheinlichkeit unabhängig jeglicher Symptome ist somit:
              $$p_{?} = P_R \cdot f_g + r_+$$

              <h3>2.2. Symptome</h3>
              <p>
                Es wird keine Unterscheidung zwischen "keine Symptome" und "Symptome
                unbekannt" gemacht, d.h. $p_- = p_?$. Dies soll in einer künftigen Version verbessert werden.
              </p>

              <p>
                Die Vortestwahrscheinlichkeit mit Symptomen $p_+$ errechnet sich aus $p_?$
                und einem Faktor $0,1 \leq f_s \leq 15,0$.
              </p>

              <p>
                Nach <a
                  href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7584484/"
                  target="_blank"
                  >Smith et al.</a
                > wird bestimmten Symptomkombinationen ein Punktewert zugeordnet:
              </p>

              <v-simple-table dense style="width: max-content" class="mb-4">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Symptome</th>
                      <th class="text-left">Punkte</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Geruchsverlust <b>oder</b> Geschmacksverlust</td>
                      <td>+2</td>
                    </tr>
                    <tr>
                      <td>Fieber <b>und</b> Husten</td>
                      <td>+1</td>
                    </tr>
                    <tr>
                      <td>Keuchen <b>oder</b> Engegefühl in der Brust</td>
                      <td>-1</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>

              <p>
                Die Punkte für alle zutreffenden Symptomkombinationen werden
                zusammengezählt und daraus der Faktor $f_s$ abgelesen. Zusätzlich zu den Werten von $f_s$ wie sie von Smith et al. angegeben werden wird ein Faktor von $18,8$ aufgerechnet. Die Begründung sowie die unsichere Herleitung dieses Faktors wurde an mehreren Stellen (z.B.  <a
                      href="https://github.com/lenaschimmel/schnelltestrechner/issues/9#issuecomment-805657593"
                      target="_blank"
                      >GitHub</a
                    >) thematisiert. Er sorgt u.A. dafür, dass das Vorliegen von Symptomen niemals die Vortestwahrscheinlichkeit unter den symptomfreien Fall $p_-$ senkt.
              </p>

              <v-simple-table dense style="width: max-content" class="mb-4">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Punkte-Summe</th>
                      <th class="text-left">Faktor $f_s$</th>
                      <th class="text-left">$f_s \cdot 18.8$</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>3</td>
                      <td>15,0</td>
                      <td>{{15.0 * 18.8 | formatNumber}}</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>4,2</td>
                      <td>{{4.2 * 18.8 | formatNumber}}</td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>1,2</td>
                     <td>{{1.2 * 18.8 | formatNumber}}</td>
                    </tr>
                    <tr>
                      <td>0</td>
                      <td>0,7</td>
                      <td>{{0.7 * 18.8 | formatNumber}}</td>
                    </tr>
                    <tr>
                      <td>-1</td>
                      <td>0,1</td>
                      <td>{{0.1 * 18.8 | formatNumber}}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>

              <p>
                Da der Symptomstatus selbst wie ein binärer medizinischer Test gewertet
                wird, der die Vortestwahrscheinlichkeit modifiziert, wird $f_s$ nicht
                direkt auf die Wahrscheinlichkeit $p_?$ , sondern als Bayes-Faktor angesehen und auf die Chance bzw.
                Likelihood $L_?$ aufgerechnet.
              </p>
              <p>Allgemein ist die Umrechnung zwischen Wahrscheinlichkeiten und Likelihoods:</p>


              $$L(x) = {P(x) \over {1 - P(x)}} ; P(x) = {L(x) \over {1 + L(x)}}$$

              <p>Spezifisch für die Vortestwahrscheinlichkeit nach Symptomen:</p>

              $$L_? = { {p_?} \over {1 - p_?} }$$
              
              $$L_+ = L_? \cdot 18,8 \cdot f_s$$
              
              $$p_+ = { L_+ \over {1 + L_+ } } = { { { {p_?} \over {1 - p_?} } \cdot 18,8 \cdot f_s } \over {1 + { { {p_?} \over {1 - p_?} } \cdot 18,8 \cdot f_s } } }$$ 
              
              <p>Die Wahrscheinlichkeit, infiziert zu sein, ist
              damit gegeben als:</p>
              
              $$P(I) = \left\{ 
                \begin{array}{ll} 
                p_- = p_? & \text{ohne Symptome} \\
                p_+ & \text{mit Symptomen} \\
              \end{array}
              \right. $$

              <h2>3. Berechnung der Nachtestwahrscheinlichkeiten</h2>

              <p>
                Das direkte Multiplizieren der Bayes-Faktoren auf die
                Vortestwahrscheinlichkeit führt im Allgemeinen zu falschen Ergebnissen -
                insbesondere zu Wahrscheinlichkeiten über $1$. Für extrem kleine
                Vortestwahrscheinlichkeit ist der Fehler allerdings vernachlässigbar.
              </p>

              <p>
                Für eine korrekte Berechnung muss die Vortestwahrscheinlichkeit $0 &lt;=
                P(I) &lt;= 1$ in eine Chance bzw. Likelihood $0 &lt; L(I) &lt; \infty$
                umgerechnet werden. Diese können später wieder zurück in
                Wahrscheinlichkeiten konvertiert werden. Allgemein:
              </p>

              <p>Likelihoods können valide mit Bayes-Faktoren multipliziert werden:</p>

              $$L(I|T) = L(I) \cdot {B}_{pos} ; L(I|\overline{T}) = L(I) \cdot {B}_{neg}$$
              Final ergibt sich: $$P(I|T) = { {P(I) \over {1 - P(I)} } {B}_{pos} \over {1
              + {P(I) \over {1 - P(I)} } {B}_{pos} } } = { {P(I) \over {1 - P(I)} } \cdot
              {P(T|I) \over P(T|\overline{I})} \over {1 + {P(I) \over {1 - P(I)} } \cdot
              {P(T|I) \over P(T|\overline{I})} } }$$ $$P(I|\overline{T}) = { {P(I) \over
              {1 - P(I)} } {B}_{neg} \over {1 + {P(I) \over {1 - P(I)} } {B}_{neg} } } = {
              {P(I) \over {1 - P(I)} } \cdot {P(\overline{T}|I) \over
              P(\overline{T}|\overline{I})} \over {1 + {P(I) \over {1 - P(I)} } \cdot
              {P(\overline{T}|I) \over P(\overline{T}|\overline{I})} } }$$
              $$P(\overline{I}|T) = 1 - P(I|T)$$ $$P(\overline{I}|\overline{T}) = 1 -
              P(I|\overline{T})$$

              <p>Dabei bedeutet:</p>

              
                $$ P(I|T) = \text{Wahrscheinlichkeit, dass eine Person mit positivem Testergebnis infiziert ist} $$
                $$ P(\overline{I}|T) = \text{Wahrscheinlichkeit, dass eine Person mit positivem Testergebnis nicht infiziert ist} $$
                $$ P(I|\overline{T}) = \text{Wahrscheinlichkeit, dass eine Person mit negativem Testergebnis infiziert ist} $$
                $$ P(\overline{I}|\overline{T}) = \text{Wahrscheinlichkeit, dass eine Person mit negativem Testergebnis nicht infiziert ist} $$

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
                  Anschein entsteht, die Tests würden unabhängig bzgl. Sensitivität
                  <i>und</i> Spezifität getestet werden. Das ist nicht der Fall.</b
                >
              </p>
              <p>
                Das PEI fragt u. A. die Sensitivität und Spezifität vom Hersteller ab, und
                legt daran Mindestkriterien an. Nur wenn ein Test laut Hersteller
                mindestens 80% Sensitivität und mindestens 97% Spezifität hat, kommt er
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
                Sensitivität zu machen, jedoch wird dabei kein Wert Ermittelt, der direkt
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
  props: {},
  data: () => ({
    expandedPanelsInfo: [0, 1],
    riskProfilesPrivate: [
      { val: "1.0", name: "Durchschnittliche Person" },
      { val: "0.015", name: "Lebt allein, Kontakte nur beim Einkaufen" },
      { val: "0.3", name: "Ein enger Kontakt mit unbekanntem Risiko" },
      { val: "1.1", name: "Vier enge Kontakte mit unbekanntem Risiko" },
      { val: "2.5", name: "Zehn enge Kontakte mit unbekanntem Risiko" },
      { val: "15.0", name: "Hat kürzlich eine Bar besucht" },
    ],
    riskProfilesProfessional: [
      { val: "0.0", name: "Home-Office, Arbeitslos, etc." },
      { val: "0.1", name: "Risikoarmer Beruf" },
      { val: "0.4", name: "Produktion" },
      { val: "0.5", name: "Verkauf" },
      { val: "0.8", name: "Büro" },
      { val: "1.3", name: "Kita / Kindergarten" },
      { val: "1.8", name: "Reinigungskraft" },
      { val: "2.2", name: "Grundschul-Lehrkraft" },
      { val: "3.2", name: "Pflege- und Gesundsheitsberuf" },
    ],
  }),
  mounted() {
    window.MathJax.typeset();
  },
  updated() {
    window.MathJax.typeset();
  },
};
</script>
<style scoped></style>
