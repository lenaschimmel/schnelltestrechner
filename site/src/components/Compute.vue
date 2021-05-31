<template>
  <v-container class="fill-height">
    <v-row class="fill-height">
      <v-col cols="12" class="fill-height">
        <v-alert color="orange" type="warning" icon="mdi-alert">
          <p>
            Diese Seite und die ihr zugrunde liegenden Berechnungen wurden nach bestem
            Wissen und Gewissen erstellt. Sie wurde und wird nach Beratung mit externen
            Fachkundigen fortlaufend weiter verbessert.
          </p>
          <p>
            Bekannte Fehler, Probleme und Ungenauigkeiten sind in den
            <a
              href="https://github.com/lenaschimmel/schnelltestrechner/issues"
              target="_blank"
              class="white--text"
              >GitHub Issues</a
            >
            erfasst. Trotzdem können noch weitere, unentdeckte Fehler enthalten sein.
            Bitte richte weitere Anmerkungen dorthin, oder an die verlinkten
            <a href="https://twitter.com/Testrechner" target="_blank" class="white--text"
              >Twitter-</a
            >
            und
            <a
              href="mailto:mail@schnelltestrechner.de"
              target="_blank"
              class="white--text"
              >Mail</a
            >-Accounts.
          </p>
        </v-alert>

        <v-expansion-panels multiple class="mb-8" v-model="expandedPanelsCalc">
          <v-expansion-panel>
            <v-expansion-panel-header
              class="font-weight-bold text-uppercase"
              color="blue lighten-3"
            >
              Einleitung
            </v-expansion-panel-header>
            <v-expansion-panel-content color="blue lighten-5" class="pt-4">
              <p>
                Wie zuverlässig eigentlich ein Schnell- oder Selbst-Test auf Sars-CoV-2
                ist,
                <b>lässt sich unmöglich allgemein beantworten.</b> Neben den Eigenschaften
                des eigentlichen Tests (<Info
                  text="Sensitivität"
                  content="Wahrscheinlichkeit, dass eine infizierte Person ein positives Ergebnis bekommt"
                />
                und
                <Info
                  text="Spezifität"
                  content="Wahrscheinlichkeit, dass eine gesunde Person ein negatives Ergebnis bekommt"
                />) spielt auch die sogenannte
                <Info
                  text="Vortestwahrscheinlichkeit"
                  content="Wahrscheinlichkeit, dass die Person infiziert ist, unabhänging vom Test"
                />
                eine enorm große Rolle. Und die hängt grundsätzlich von der
                <i>Inzidenz</i>, sowie dem privaten und beruflichen
                <i>Risiko-Profil</i> ab. Wer außerdem <i>Symptome</i> hat, hat eine
                zusätzlich stark erhöhte Vortestwahrscheinlichkeit.
              </p>

              <p>Um in einem konkreten Fall das Ergebnis zu bewerten, müsste man also:</p>
              <ul class="mb-4">
                <li>
                  Die mathematischen Grundprinzipien verstehen, insbesondere das
                  scheinbare paradoxe Phänomen des
                  <a
                    href="https://de.wikipedia.org/wiki/Pr%C3%A4valenzfehler"
                    target="_blank"
                    >Prävalenzfehlers</a
                  >
                </li>
                <li>Alle oben genannten Werte recherchieren bzw. abschätzen</li>
                <li>Diese Werte in Formeln einsetzen und Ergebnisse ausrechnen</li>
              </ul>

              <p>
                <b>
                  Diese Seite möchte bei all diesen Schritten helfen. Der Fokus liegt auf
                  einem Test für eine bestimmte Person zu einem bestimmten Zeitpunkt, also
                  nicht auf Abschätzungen für die Gesamtbevölkerung.
                </b>
              </p>
              <p>
                Details zur Funktionsweise finden sich im Tab "Weitere Infos" sowie an den
                entsprechenden Stellen dieser Seite hinter den
                <Info type="Dialog">Dieser Info-Button ist nur ein Beispiel</Info
                >-Buttons.
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header
              class="font-weight-bold text-uppercase"
              color="blue lighten-3"
            >
              Test-Auswahl
            </v-expansion-panel-header>
            <v-expansion-panel-content color="blue lighten-5" class="pt-4">
              <p>
                Für die Berechnung der Test-Zuverlässigkeit müssen dessen Sensititvität
                und Spezifität bekannt sein. Für die allermeisten Tests liegen die Daten
                bereits vor, so dass nur der Test ausgewählt werden muss.
              </p>
              <v-btn-toggle v-model="testsKind">
                <v-btn value="list">
                  <span class="hidden-xs-only mr-4">Aus Liste wählen</span>
                  <span class="hidden-sm-and-up mr-4">Liste</span>
                  <v-icon> mdi-format-list-checkbox </v-icon>
                </v-btn>

                <v-btn value="input">
                  <span class="hidden-xs-only mr-4">Eigene Werte eingeben</span>
                  <span class="hidden-sm-and-up mr-4">Eingabe</span>
                  <v-icon> mdi-pencil </v-icon>
                </v-btn>
              </v-btn-toggle>

              <template v-if="testsKind == 'list'">
                <v-container fluid>
                  <v-row no-gutters>
                    <v-col cols="12" sm="6" md="4" no-gutters>
                      <v-checkbox v-model="testFilterSelf">
                        <template v-slot:label>
                          Nur Selbst-Tests<Info
                            type="Dialog"
                            content="Zeigt nur Schnelltests an, die eine Sonderzulassung zur Verwendung von Laien an sich selbst haben."
                          /> </template
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" no-gutters>
                      <v-checkbox v-model="testFilterPei">
                        <template v-slot:label>
                          <div>
                            Nur vom
                            <Info
                              text="PEI"
                              icon="none"
                              content="Paul-Ehrlich-Institut - Bundesinstitut für Impfstoffe und biomedizinische Arzneimittel"
                            />
                            evaluiert
                            <Info
                              type="Dialog"
                              content="Das Paul-Ehrlich-Institut prüft einige Schnelltests, ob diese Mindeskriterien erfüllen. Zugelassene Selbst-Tests sind per Defition vom PEI zugelassen. Im Tab 'Weitere Infos' gibt es einen ganzen Textabschnitt zur Bedeutung dieser Evaluation."
                            />
                          </div>
                        </template>
                      </v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" no-gutters>
                      <v-checkbox v-model="testFilterStudies">
                        <template v-slot:label>
                          Wissenschaftliche Studien<Info
                            type="Dialog"
                            content="Zeigt nur Schnelltests an, zu denen Studien vorliegen, die ihre Wirksamkeit untersucht haben. Die 'Erweiterte Ansicht' muss aktiviert werden, um diese Studiendaten zu nutzen."
                          /> </template
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </v-container>

                <v-text-field
                  solo
                  v-model="testFilter"
                  append-icon="mdi-magnify"
                  label="Suchbegriff"
                  placeholder="Suche nach Hersteller, Name, Distributor, AT-Nummer, Sonderzulassungsnummer"
                >
                </v-text-field>

                <v-card>
                  <v-data-table
                    dense
                    v-model="selectedTests"
                    :items="visibleTests"
                    :headers="testHeaders"
                    show-select
                    single-select
                    locale="de-DE"
                    mobile-breakpoint="360"
                    :options="{ itemsPerPage: 5 }"
                  >
                    <template v-slot:item.selftest="{ item }">
                      <v-chip :color="item.selftest ? 'green' : 'red'" dark>
                        {{ item.selftest ? "Ja" : "Nein" }}
                      </v-chip>
                    </template>
                    <template v-slot:item.studies="{ item }">
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <div v-bind="attrs" v-on="on">
                            <v-icon
                              v-for="circle in getDataCircles(item.studies)"
                              :key="item.id + '_s_' + circle.color"
                              small
                              :color="circle.color"
                            >
                              {{ circle.icon }}
                            </v-icon>
                          </div>
                        </template>
                        <span>{{ getDataText(item.studies) }}</span>
                      </v-tooltip>
                    </template>
                    <template v-slot:item.sampledings="{ item }">
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <div v-bind="attrs" v-on="on">
                            {{ getSampleIcons(item) }}
                          </div>
                        </template>
                        <span>{{ getSampleText(item) }}</span>
                      </v-tooltip>
                    </template>
                    <template v-slot:item.attrib="{ item }">
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <div v-bind="attrs" v-on="on">
                            <v-icon
                              v-for="circle in getAttribCircles(item)"
                              :key="item.id + '_a_' + circle.color"
                              small
                              :color="circle.color"
                            >
                              {{ circle.icon }}
                            </v-icon>
                          </div>
                        </template>
                        <span>{{ getAttribText(item) }}</span>
                      </v-tooltip>
                    </template>
                    <template v-slot:item.attrib_and_studies="{ item }">
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <div v-bind="attrs" v-on="on">
                            <v-icon
                              v-for="circle in getDataCircles(item.studies)"
                              :key="item.id + '_as_s_' + circle.color"
                              small
                              :color="circle.color"
                            >
                              {{ circle.icon }}
                            </v-icon>
                            <v-icon
                              v-for="circle in getAttribCircles(item)"
                              :key="item.id + '_as_a_' + circle.color"
                              small
                              :color="circle.color"
                            >
                              {{ circle.icon }}
                            </v-icon>
                          </div>
                        </template>
                        <span>{{
                          getDataText(item.studies) + " - " + getAttribText(item)
                        }}</span>
                      </v-tooltip>
                    </template>
                    <template v-slot:item.manufacturer_name="{ item }">
                      {{ item.manufacturer + " - " + item.name }}
                    </template>
                  </v-data-table>
                </v-card>

                <template
                  v-if="
                    detailedMode &&
                    this.selectedTest &&
                    Object.keys(this.selectedTest.studies).length > 0
                  "
                >

                  <p class="mt-4" v-if="selectedTest && selectedTest.distributors.length > 0">
                    Distributoren:
                    <ul>
                      <li 
                        v-for="dist in selectedTest.distributors"
                        :key="dist"
                      >{{ dist }}</li>
                    </ul>
                  </p>

                  <p class="mt-4" v-if="selectedTest && selectedTest.tradename.length > 0">
                    Alternative Handelsnamen:
                    <ul>
                      <li 
                        v-for="name in selectedTest.tradename"
                        :key="name"
                      >{{ name }}</li>
                    </ul>
                  </p>

                  <p
                    v-if="Object.keys(this.selectedTest.studies).length > 1"
                    class="mt-4"
                  >
                    Quelle der Angaben zu Sensitivität und Spezifität:
                    <v-select
                      v-model="studyId"
                      :items="studies"
                      item-text="author"
                      item-value="id"
                      solo
                    >
                      <template v-slot:item="{ parent, item }">
                        {{ item | studyTitle }}
                      </template>
                      <template v-slot:selection="{ parent, item }">
                        {{ item | studyTitle }}
                      </template>
                    </v-select>
                  </p>

                  <p>
                    Werte innerhalb des 95%-Konfidenzintervalls:

                    <v-btn-toggle v-model="confidence" class="mt-2">
                      <v-btn value="min">
                        <span class="hidden-xs-only">Niedrigste</span>
                        <v-icon> mdi-format-vertical-align-bottom </v-icon>
                      </v-btn>
                      <v-btn value="avg">
                        <span class="hidden-xs-only">Mittlere</span>
                        <v-icon> mdi-format-vertical-align-center </v-icon>
                      </v-btn>
                      <v-btn value="max">
                        <span class="hidden-xs-only">Höchste</span>
                        <v-icon> mdi-format-vertical-align-top </v-icon>
                      </v-btn>
                    </v-btn-toggle>
                  </p>
                </template>

                <v-container fluid class="pt-8" v-if="!Number.isNaN(this.sensitivity)">
                  <v-row>
                    <v-col cols="12" sm="6" md="3" no-gutters>
                      Sensitivität: {{ sensitivity | formatPercent }}
                    </v-col>
                    <v-col cols="12" sm="6" md="3" no-gutters>
                      Spezifität: {{ specificity | formatPercent }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <template v-if="detailedMode">
                      <v-col cols="12" sm="6" md="3" no-gutters
                        >Falsch-Negativ-Rate: {{ fnr | formatPercent }}
                      </v-col>
                      <v-col cols="12" sm="6" md="3" no-gutters
                        >Falsch-Positiv-Rate: {{ fpr | formatPercent }}
                      </v-col>
                      <v-col cols="12" sm="6" md="3" no-gutters
                        >Bayes-Faktor bei positivem Test:
                        {{ bayesFactorPos | formatNumber }}</v-col
                      >
                      <v-col cols="12" sm="6" md="3" no-gutters
                        >Bayes-Faktor bei negativem Test:
                        {{ (1 / bayesFactorNeg) | formatNumber }}</v-col
                      >
                    </template>
                  </v-row>
                </v-container>

                <v-alert
                  icon="mdi-alert"
                  dense
                  outlined
                  type="warning"
                  text
                  class="mt-4"
                  v-if="this.selectedTest != null && Number.isNaN(this.sensitivity)"
                >
                  Zu diesem Test liegen uns keine Daten zu Sensitivität und Spezifität vom
                  Hersterller vor. Bitte einen anderen Test auswählen oder eigene Werte
                  eingeben.
                </v-alert>

                <v-alert
                  icon="mdi-alert"
                  dense
                  outlined
                  type="warning"
                  text
                  class="mt-4"
                  v-if="peiAssumption"
                >
                  Zu diesem Test liegen uns keine Daten zu Sensitivität und Spezifität vom
                  Hersterller vor.
                  <b
                    >Für die Berechnung werden daher die Mindestkriterien des PEI
                    angenommen.</b
                  >
                  Falls du die Daten kennst, z.B. aus dem Beipackzettel, kannst du diese
                  selbst eingeben. In dem Fall freuen wir uns auch über eine Nachricht,
                  damit wir die Daten bei uns einpflegen können.
                </v-alert>

                <v-alert
                  icon="mdi-alert"
                  dense
                  outlined
                  type="warning"
                  text
                  class="mt-4"
                  v-if="this.selectedTest == null"
                >
                  Bitte einen Test auswählen oder eigene Daten zu Sensitivität und
                  Spezifität eingeben.
                </v-alert>
              </template>

              <template v-else>
                <v-container fluid class="pt-8">
                  <v-row>
                    <v-col cols="12" sm="6" md="3" no-gutters>
                      Sensitivität:
                      <v-text-field v-model="sensitivityString" solo />
                    </v-col>
                    <v-col cols="12" sm="6" md="3" no-gutters>
                      Spezifität:
                      <v-text-field v-model="specificityString" solo />
                    </v-col>
                  </v-row>
                  <v-row>
                    <template v-if="detailedMode">
                      <v-col cols="12" sm="6" md="3" no-gutters
                        >Falsch-Negativ-Rate: {{ fnr | formatPercent }}
                      </v-col>
                      <v-col cols="12" sm="6" md="3" no-gutters
                        >Falsch-Positiv-Rate: {{ fpr | formatPercent }}
                      </v-col>
                      <v-col cols="12" sm="6" md="3" no-gutters
                        >Bayes-Faktor bei positivem Test:
                        {{ bayesFactorPos | formatNumber }}</v-col
                      >
                      <v-col cols="12" sm="6" md="3" no-gutters
                        >Bayes-Faktor bei negativem Test:
                        {{ (1 / bayesFactorNeg) | formatNumber }}</v-col
                      >
                    </template>
                  </v-row>
                </v-container>
              </template>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header
              class="font-weight-bold text-uppercase"
              color="blue lighten-3"
            >
              Inzidenz und Prävalenz
            </v-expansion-panel-header>
            <v-expansion-panel-content color="blue lighten-5" class="pt-4">
              <p>
                Wähle aus, ob die Inzidenz einer Region oder ein eigener Wert genutzt
                werden soll.
                <Info type="dialog">
                  Die Aussagekraft eines Tests ergibt sich nicht nur aus dessen
                  Sensititvität und Spezifität, sondern hängt von der
                  Vortestwahrscheinlichkeit ab, also der Wahrscheinlichkeit, dass die zu
                  testende Person infiziert ist. Diese wird zunächst aus der Inzidenz der
                  Bevölkerung einer Region abgeschätzt. Je genauer die Region eingegrenzt
                  wird, desto aussagekräftiger ist der Wert.
                </Info>
              </p>
              <v-radio-group v-model="incidenceSource" mandatory>
                <v-radio value="germany" label="Ganz Deutschland"></v-radio>
                <v-radio value="state" label="Nach Bundesland"></v-radio>
                <v-radio value="district" label="Nach Landkreis"></v-radio>
                <v-radio value="input">
                  <template v-slot:label>
                    <div>
                      Eigene Inzidenz eingeben
                      <Info
                        content="Die Inzidenz beschreibt die Zahl der offiziell gemeldeten, bestätigten Neuinfektionen innerhalb einer Woche in den letzten 7 Tage, normiert auf 100.000 Einwohner."
                      />
                    </div>
                  </template>
                </v-radio>
                <v-radio value="inputPrevalence">
                  <template v-slot:label>
                    <div>
                      Eigene Prävalenz eingeben
                      <Info
                        content="Die Prävalenz beschreibt die Zahl der infizierten Personen, normiert auf 100.000 Einwohner. Sie liegt deutlich über der Inzidenz, da längst nicht jede Infektion erkannt und erfasst wird."
                      />
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>

              <template v-if="incidenceSource == 'state'">
                <p>
                  Bundesland:
                  <v-select
                    v-model="stateId"
                    :items="loadedData.states"
                    item-text="name"
                    item-value="id"
                    solo
                  >
                  </v-select>
                </p>
              </template>

              <template v-if="incidenceSource == 'district'">
                <p>
                  Stadt (SK) oder Landkreis (LK):
                  <v-autocomplete
                    v-model="districtId"
                    :items="districtsChoices"
                    item-text="displayName"
                    item-value="ags"
                    solo
                  >
                  </v-autocomplete>
                </p>
              </template>

              <template v-if="incidenceSource != 'input' && incidenceSource != 'inputPrevalence'">
                <p>
                  Quelle der Inzidenzdaten:
                  <a href="https://api.corona-zahlen.org" target="_blank"
                    >api.corona-zahlen.org</a
                  >
                  - Stand der Daten: {{ dataUpdateDate }}
                </p>
                <v-alert color="orange" type="warning" icon="mdi-alert" v-if="isDataTooOld">
                    Zeitweise gibt es Probleme mit der offiziellen API des RKI, die auch
                    unsere Datenquelle,
                    <a
                      href="https://api.corona-zahlen.org/docs/"
                      target="_blank"
                      class="white--text"
                      >corona-zahlen.org</a
                    >, betreffen. Deshalb werden unter umständen veraltete Daten genutzt. Das Problem ist
                    <a
                      href="https://github.com/lenaschimmel/schnelltestrechner/issues/48"
                      target="_blank"
                      class="white--text"
                      >hier</a
                    >
                    dokumentiert. 
                </v-alert>
              </template>

              <template v-if="incidenceSource == 'input'">
                <p>
                  7-Tage Inzidenz je 100.000:
                  <v-text-field v-model="incidenceString" solo />
                </p>
              </template>

              <template v-if="incidenceSource == 'inputPrevalence'">
                <p>
                  Prävalenz je 100.000:
                  <v-text-field v-model="prevalenceString" solo />
                </p>
              </template>
              <template v-if="detailedMode">
                <template
                  v-if="
                    incidenceSource != 'input' && incidenceSource != 'inputPrevalence'
                  "
                >
                  <p>
                    Gemeldete 7-Tage Inzidenz je 100.000 diese Woche:
                    <input disabled :value="incidence | formatNumber" />
                  </p>
                  <p>
                    Gemeldete 7-Tage Inzidenz je 100.000 vorherige Woche:
                    <input disabled :value="incidencePrev | formatNumber" />
                  </p>
                </template>
              </template>

              <p v-if="!Number.isNaN(prevalence)">
                Geschätzte Prävalenz: {{ prevalence | formatNumber }}
                <Info type="Dialog" v-if="incidenceSource != 'inputPrevalence'">
                  <p>
                    Die Region hat eine gemeldete 7-Tage-Inzidenz von
                    {{ incidence | formatNumber }}, d.h. so viele Infektionen je 100.000
                    Einwohner wurden gemeldet.
                  </p>
                  <template v-if="incidenceSource != 'input'">
                    <p>
                      Bis eine tatsächliche Infektion in den offiziellen Meldedaten und
                      somit der Inzidenz erscheint, vergeht i.d.R. etwa eine Woche.
                    </p>
                    <p>
                      Von der letzten Woche (Inzidenz
                      {{ incidencePrev | formatNumber }}) zu dieser Woche (Inzidenz
                      {{ incidence | formatNumber }}) hat sich die Inzidenz um den Faktor
                      {{ delayFactor | formatNumber }} geändert.
                    </p>

                    <p>
                      Die aktuell gemeldete Inzidenz wird mit diesem Faktor multipliziert,
                      um die Inzidenz eine Woche in die Zukunft zu projizieren. Dies
                      ergibt eine angepasste Inzidenz von
                      {{ incidenceAdjusted | formatNumber }}, welche die aktuellen
                      Infektionen besser wiedergibt als die offizielle Zahl.
                    </p>
                  </template>
                  <p v-else>
                    Bei einer selbst eingegebenen Inzidenz wird kein Ausgleich des
                    Meldeverzugs vorgenommen, sondern der Wert direkt übernommen.
                  </p>
                  <p>
                    Aus dieser Inzidenz wird eine Prävalenz von
                    {{ prevalence | formatNumber }} geschätzt. Das heißt, dass
                    {{ prevalence | formatNumber }}
                    von 100.000 Einwohnern aktuell infiziert sind.
                  </p>
                  <p>
                    Dies basiert auf der Annahme, dass nur ein Bruchteil aller Infektionen
                    erkannt und erfasst werden, so dass ein Faktor von
                    {{ underReportingFactor }} für die Dunkelziffer hinzu gerechnet wird.
                    Außerdem wird angenommen, dass eine Person im Schnitt für 7 Tage
                    infiziert ist, so dass die 7-Tage-Inzidenz als Grundlage der Prävalenz
                    gültig ist.
                  </p>
                </Info>
              </p>
              <v-alert
                icon="mdi-alert"
                dense
                outlined
                type="warning"
                text
                class="mt-4"
                v-if="Number.isNaN(this.prevalence)"
              >
                Die Angaben zu Inzidenz bzw. Prävalenz sind nicht vollständig. Bitte
                nachbessern, da sonst keine Vortestwahrscheinlichkeit ermittelt werden
                kann.
              </v-alert>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header
              class="font-weight-bold text-uppercase"
              color="blue lighten-3"
            >
              Persönliches Risiko
            </v-expansion-panel-header>
            <v-expansion-panel-content color="blue lighten-5" class="pt-4">
              Privates Risiko-Profil:
              <v-select
                v-model="riskProfilePrivate"
                :items="riskProfilesPrivate"
                item-text="name"
                item-value="val"
                solo
                class="mt-2"
              >
              </v-select>

              Berufliches Risiko-Profil:
              <v-select
                v-model="riskProfileProfessional"
                :items="riskProfilesProfessional"
                item-text="name"
                item-value="val"
                solo
                class="mt-2"
              >
              </v-select>

              Optional: Zusätzliche Risiken in den letzten 10 Tagen laut
              <a href="https://www.microcovid.org/?lng=de" target="_blank"
                >microCOVID.org</a
              ><Info type="Dialog">
                <p>
                  Auf der Website des microCOVID Project kann das ungefähre COVID-Risiko
                  einer Aktivität oder Beziehung berechnet werden. Auf Wunsch kann dieses
                  Risiko hier eingetragen werden.
                  <b
                    >Dies ist jedoch relativ aufwändig und kann entfallen, wenn in letzter
                    Zeit keine Begegnungen mit hohem Risiko stattfanden.</b
                  >
                </p>
                <p>
                  Ähnlich wie auf dieser Seite werden durch microCOVID diverse
                  Rahmenbedingungen abgefragt und auf Basis wissenschaftlicher
                  Erkenntnisse und gewissenhaft abgeschätzter Berechnungsformeln ein
                  ungefährer Wert ermittelt.
                </p>
                <p>
                  Dabei bezeichnet 1 Microcovid bzw. 1 µCoV als Einheit das Risiko von
                  eins zu einer Million, sich mit SARS-CoV-2 infiziert zu haben.
                </p>
                <p>
                  Mit den vorherigen Auswahlfeldern wurde versucht, das Alltagsrisiko
                  durch privates Zusammenleben und berufliche Kontakte abzuschätzen. Hier
                  geht es darum, zusätzliche, einmalige Risiken hinzu zu rechnen. Es
                  können natürlich auch mehrere Risiko-Begegnungen ermittelt und zusammen
                  addiert werden.
                </p> </Info
              >:
              <v-text-field
                v-model="additionalRiskString"
                background-color="white"
                suffix="µCoV"
                solo
                class="mt-2"
              >
              </v-text-field>

              <p v-if="detailedMode">
                Vortestwahrscheinlichkeit vor Symptomen:
                <input disabled v-bind:value="priorProb | formatPercent" />
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header
              class="font-weight-bold text-uppercase"
              color="blue lighten-3"
            >
              Symptome
            </v-expansion-panel-header>
            <v-expansion-panel-content color="blue lighten-5" class="pt-4">
              Wer aktuell Anzeichen einer Krankheit (Symptome) hat, ist mit deutlich
              höherer Wahrscheinlichkeit infiziert.
              <Info type="Dialog">
                <p>
                  Nicht jede Infektion mit SARS-CoV-2 führt zu Symptomen, und selbst wenn,
                  ist man schon vor Beginn der ersten Symptome ansteckend. Daher ist das
                  Risiko nicht gleich Null, nur weil man sich gesund fühlt.
                </p>
                <p>
                  Andererseits gibt es viele andere, meist harmlose Krankheiten, deren
                  Symptome denen von Covid-19 ähneln.
                </p>
                <p>
                  Inzwischen gibt es Erkenntnisse über Kombinationen von Symptomen, die
                  besonders für eine Infektion mit SARS-CoV-2 sprechen, oder eher für eine
                  Infektion mit einem anderen Erreger.
                </p>
              </Info>
              <v-container fluid>
                <v-row no-gutters>
                  <v-col cols="12" sm="4" md="4" no-gutters>
                    <v-checkbox v-model="sympSmell" label="Geruchsverlust"></v-checkbox>
                    <v-checkbox
                      v-model="sympTaste"
                      label="Geschmacksverlust"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" sm="4" md="4" no-gutters>
                    <v-checkbox v-model="sympFever" label="Fieber"></v-checkbox>
                    <v-checkbox v-model="sympCough" label="Husten"></v-checkbox>
                  </v-col>
                  <v-col cols="12" sm="4" md="4" no-gutters>
                    <v-checkbox
                      v-model="sympChest"
                      label="Engegefühl in der Brust"
                    ></v-checkbox>
                    <v-checkbox v-model="sympWheez" label="Keuchen"></v-checkbox>
                  </v-col>
                  <v-col cols="12" no-gutters>
                    <v-checkbox
                      v-model="sympOther"
                      label="Sonstige verdächtige Symptome"
                    ></v-checkbox>
                    <p>
                      z.B. Schnupfen,
                      <Info text="Bronchitis" content="Entzündung der Bronchien" />,
                      <Info text="Pneumonie" content="Lungenentzündung" />, Atemnot,
                      Halsschmerzen, Kopf- und Gliederschmerzen, Appetitlosigkeit,
                      Gewichtsverlust, Übelkeit, Bauchschmerzen, Erbrechen, Durchfall,
                      <Info text="Konjunktivitis" content="Bindehautentzündung (Auge)" />,
                      Hautausschlag, Lymphknotenschwellung,
                      <Info text="Apathie" content="Teilnahmslosigkeit" />,
                      <Info text="Somnolenz" content="Benommenheit" />
                    </p>
                  </v-col>
                </v-row>
              </v-container>

              <v-alert
                icon="mdi-information"
                dense
                outlined
                type="info"
                v-if="sympChest || sympWheez"
              >
                Hinweis: wenn <i>Keuchen</i> oder
                <i>Engegefühl in der Brust</i> vorliegen, sinkt die
                Vortestwahrscheinlichkeit scheinbar. Das verwirrt auf den ersten Blick,
                hat aber einen Grund, der
                <a
                  href="https://github.com/lenaschimmel/schnelltestrechner/issues/21#issuecomment-808184992"
                  target="_blank"
                  >hier</a
                >
                erläutert wird.
              </v-alert>
              <v-alert icon="mdi-alert" dense outlined type="warning" text class="mt-4">
                Diese Website kann generell nur eine Abschätzung der
                Vortestwahrscheinlichkeit bieten und keine
                <i>exakte</i> Bestimmung. Während die vorherigen Schritte der Abschätzung
                ziemlich sicher sind, ist die Einbeziehung der Symptome eine relativ
                ungenaue Angelegenheit.
                <Info type="Dialog">
                  <p>
                    In der Studie
                    <a
                      href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7584484/"
                      target="_blank"
                      >A Symptom-Based Rule for Diagnosis of COVID-19</a
                    >
                    von Smith, Richey und Brunetto wurde relativ genau beschrieben, wie
                    viel aussagekräftiger manche Symptome sind als andere.
                  </p>
                  <p>
                    So kann z.B. gesagt werden, dass der Verluste von Geruch
                    <b>oder</b> Geschmack die Wahrscheinlichkeit einer SARS-CoV-Infektion
                    viel stärker erhöht als Fieber <b>und</b> Husten zusammen.
                  </p>
                  <p>
                    Allerdings fehlen im Moment noch zuverlässige Informationen dazu, wie
                    stark Symptome im Allgeinen das Riksiko erhöhen. Wir gehen aktuell von
                    einem Faktor von 18,8 aus, der eben je nach konkreter
                    Symptom-Kombination auch höher oder niedriger ausfallen kann.
                  </p>
                  <p>
                    Die Schätzung dieses Faktors basiert auf einigen
                    <a
                      href="https://github.com/lenaschimmel/schnelltestrechner/issues/9#issuecomment-805657593"
                      target="_blank"
                      >sehr gewagten Annahmen</a
                    >. Wir sind davon überzeugt, dass es besser ist, die Symptome mit
                    diesem ungefähren Wert einzuberechnen, als sie komplett zu ignorieren.
                  </p>
                  <p>
                    Trotzdem steht es natürlich jedem, der diesen Wert für falsch hält,
                    frei, keine Symptome anzugeben und sie somit nicht in die Rechnung
                    eingehen zu lassen.
                  </p>
                </Info>
              </v-alert>

              <template v-if="anySymptoms && detailedMode">
                <p>C19 Rule score: <input disabled v-bind:value="ruleScore" /></p>
                <p>
                  C19 Rule likelihood ratio:
                  <input disabled v-bind:value="ruleLR | formatNumber" />
                </p>
                <p>
                  Symptom-Faktor:
                  <input
                    disabled
                    v-bind:value="(ruleLR * anySymptomFactor) | formatNumber"
                  />
                </p>
              </template>
              <p v-if="detailedMode">
                Vortestwahrscheinlichkeit nach Symptomen:
                <input disabled v-bind:value="priorProbSymptoms | formatPercent" />
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-spacer></v-spacer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Info from "./Info.vue";

export default {
  components: {
    Info,
  },
  name: "Compute",
  props: {
    loadedData: Object,
    result: Object,
    detailedMode: Boolean,
  },
  data: () => ({
    // showing any symtomps that might lead to PCR testing in Germany
    // increases odds by 18.8, which is based on some very rough
    // calculations based on data from the end of february
    anySymptomFactor: 18.8,

    // user selections
    selectedTests: [],
    stateId: null,
    districtId: null,
    incidenceSource: "germany",
    riskProfilePrivate: "1.0",
    riskProfileProfessional: "0.8",
    additionalRiskString: "0",
    confidence: "avg",
    studyId: "manufacturer",
    testsKind: "list",
    testFilterSelf: true,
    testFilterPei: false,
    testFilterStudies: false,

    expandedPanelsCalc: [0, 1],

    // symptoms
    sympSmell: false,
    sympTaste: false,
    sympFever: false,
    sympCough: false,
    sympChest: false,
    sympWheez: false,
    sympOther: false,

    // user inputs
    incidenceString: "100",
    prevalenceString: "500",
    sensitivityString: "80,0 %",
    specificityString: "80,0 %",
    testFilter: "",
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
  methods: {
    getDataCircles(studiesObject) {
      let numMax = function (num) {
        if (num > 9) return "9-plus";
        else return "" + num;
      };

      let studies = Object.values(studiesObject);
      let count = studies.length;
      let manCount = studies.filter((study) => study.author.startsWith("manufacturer"))
        .length;
      let lcCount = studies.filter((study) => study.quadas == "low concern").length;
      let icCount = studies.filter((study) => study.quadas == "intermediate concern")
        .length;
      let hcCount = studies.filter((study) => study.quadas == "high concern").length;
      let nonManCount = count - manCount;
      let ucCount = nonManCount - (lcCount + icCount + hcCount);
      let array = [];

      if (manCount > 0)
        array.push({ icon: "mdi-alpha-h-circle", color: "blue darken-2" });
      if (lcCount > 0)
        array.push({
          icon: "mdi-numeric-" + numMax(lcCount) + "-circle",
          color: "green darken-2",
        });
      if (icCount > 0)
        array.push({
          icon: "mdi-numeric-" + numMax(icCount) + "-circle",
          color: "yellow darken-2",
        });
      if (hcCount > 0)
        array.push({
          icon: "mdi-numeric-" + numMax(hcCount) + "-circle",
          color: "red darken-2",
        });
      if (ucCount > 0)
        array.push({
          icon: "mdi-numeric-" + numMax(ucCount) + "-circle",
          color: "black",
        });

      if (array.length == 0)
        array.push({ icon: "mdi-numeric-0-circle-outline", color: "grey darken-2" });

      return array;
    },
    getDataText(studiesObject) {
      let studies = Object.values(studiesObject);
      let count = studies.length;
      let manCount = studies.filter((study) => study.author.startsWith("manufacturer"))
        .length;
      let lcCount = studies.filter((study) => study.quadas == "low concern").length;
      let icCount = studies.filter((study) => study.quadas == "intermediate concern")
        .length;
      let hcCount = studies.filter((study) => study.quadas == "high concern").length;
      let nonManCount = count - manCount;
      let ucCount = nonManCount - (lcCount + icCount + hcCount);

      let text = "";

      if (manCount > 0) text += manCount + " Hersteller-Angabe(n) vorhanden. ";
      if (nonManCount > 0) text += nonManCount + " Studie(n), darunter ";
      if (lcCount > 0) text += lcCount + " mit hoher Qualität, ";
      if (icCount > 0) text += icCount + " mit mittlerer Qualität, ";
      if (hcCount > 0) text += hcCount + " mit geringer Qualität, ";
      if (ucCount > 0) text += ucCount + " mit unklarer Qualität, ";
      if (nonManCount > 0) text += " vorhanden.";

      if (text == "") text = "Keine Daten vorhanden.";

      return text;
    },
    getSampleValues(test) {
      let samples = [];
      if (test.sample) {
        samples.push(...test.sample);
      }
      let studies = Object.values(test.studies);
      for (const study of studies) {
        if (study.sample) {
          samples.push(... study.sample);
        }
      }

      samples = samples.filter(function(item, pos) {
          return samples.indexOf(item) == pos;
      });
      return samples;
    },
    getSampleIcons(test) {
      let samples = this.getSampleValues(test);
      let ret = "";
      if (samples.includes("nasal")) {
        ret = ret + "👃";
      }     
      if (samples.includes("np")) {
        ret = ret + "🥺";
      }     
      if (samples.includes("op")) {
        ret = ret + "😲";
      }     
      if (samples.includes("sputum")) {
        ret = ret + "🤑";
      }
      if (samples.includes("saliva")) {
        ret = ret + "💦";
      }
      if (samples.includes("stool")) {
        ret = ret + "💩";
      }
      return ret;
    },
    getSampleText(test) {
      return this.getSampleValues(test).join(",");
    },
    getAttribCircles(test) {
      let array = [];
      if (!test.selftest) array.push({ icon: "mdi-doctor", color: "red darken-2" });
      if (test.selftest) array.push({ icon: "mdi-account", color: "green darken-2" });
      if (test.pei) array.push({ icon: "mdi-certificate", color: "blue darken-2" });
      if (test.shops && test.shops.length > 0)
        array.push({ icon: "mdi-cart", color: "purple darken-2" });

      return array;
    },
    getAttribText(test) {
      let text = "";

      if (!test.selftest) text += "Profi-Test. ";
      if (test.selftest) text += "Selbst-Test. ";
      if (test.pei) text += "Vom PEI evaluiert. ";
      if (test.shops && test.shops.length > 0)
        text += "Im Einzelhandel erhältlich bei: " + test.shops.join(", ");

      return text;
    },
    testMatchesFilter(test) {
      if (this.testFilterSelf && !test.selftest) return false;

      if (this.testFilterPei && !test.pei) return false;

      if (
        this.testFilterStudies &&
        !Object.values(test.studies).some((study) => study.author != "manufacturer")
      )
        return false;

      let textMatch = false;
      let filter = this.testFilter.toLowerCase();
      if (this.testFilter == "") {
        textMatch = true;
      } else {
        textMatch |= test.reference && test.reference.toLowerCase().includes(filter);
        textMatch |= test.id && test.id.toLowerCase().includes(filter);
        textMatch |= test.name && test.name.toLowerCase().includes(filter);
        textMatch |=
          test.manufacturer && test.manufacturer.toLowerCase().includes(filter);
        textMatch |=
          test.tradename && test.tradename.some((t) => t.toLowerCase().includes(filter));
        textMatch |=
          test.distributors &&
          test.distributors.some((t) => t.toLowerCase().includes(filter));
      }

      return textMatch;
    },
  },
  watch: {
    selectedTest: function (newVal, oldVal) {
      if (newVal == null) {
        this.studyId = null;
      } else if (newVal != oldVal) {
        let studies = Object.values(newVal.studies).filter(
          (study) => study.author == "manufacturer"
        );
        if (studies.length > 0) this.studyId = studies[0].id;
        else this.studyId = null;
      }
    },
    updatedProbPos: function (newVal) {
      this.result.probPos = newVal;
      this.result.valid = this.resultValid;
    },
    updatedProbNeg: function (newVal) {
      this.result.probNeg = newVal;
      this.result.valid = this.resultValid;
    },
    priorProbSymptoms: function (newVal) {
      this.result.prior = newVal;
      this.result.valid = this.resultValid;
    },
  },
  computed: {
    dataUpdateDate() {
      if (this.loadedData.date) {
        const options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        };
        return this.loadedData.date.toLocaleDateString("de-DE", options);
      }
      return "unbekannt";
    },
    isDataTooOld() {
      const _MS_PER_DAY = 1000 * 60 * 60 * 24;
      if (this.loadedData.date) {
        let a = this.loadedData.date;
        let b = new Date();
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        let daysOld = Math.floor((utc2 - utc1) / _MS_PER_DAY);
        return daysOld > 1;
      }
      return true;
    },
    selectedTest() {
      if (this.selectedTests.length > 0) return this.selectedTests[0];
      else return null;
    },
    visibleTests() {
      if (!this.loadedData.tests) return [];

      return this.loadedData.tests.filter((test) => this.testMatchesFilter(test));
    },
    studies() {
      if (this.selectedTest) {
        return Object.values(this.selectedTest.studies);
      }
      return [];
    },
    peiAssumption() {
      return (
        this.selectedTest &&
        !this.selectedTest.studies[this.studyId] &&
        this.selectedTest.pei
      );
    },
    sensitivity() {
      if (this.testsKind == "input") {
        return (
          parseFloat(this.sensitivityString.replace(",", ".").replace("%", "")) / 100.0
        );
      } else {
        if (!this.selectedTest) {
          return Number.NaN;
        }
        if (this.selectedTest.studies[this.studyId]) {
          return this.selectedTest.studies[this.studyId].sensitivity[this.confidence];
        } else {
          if (this.selectedTest.pei) {
            return 0.8; // we have no better data, so assume the test just matches the minimum criteria
          } else {
            return Number.NaN;
          }
        }
      }
    },
    specificity() {
      if (this.testsKind == "input") {
        return (
          parseFloat(this.specificityString.replace(",", ".").replace("%", "")) / 100.0
        );
      } else {
        if (!this.selectedTest) {
          return Number.NaN;
        }
        if (this.selectedTest.studies[this.studyId]) {
          return this.selectedTest.studies[this.studyId].specificity[this.confidence];
        } else {
          if (this.selectedTest.pei) {
            return 0.97; // we have no better data, so assume the test just matches the minimum criteria
          } else {
            return Number.NaN;
          }
        }
      }
    },
    selectedState() {
      if (this.stateId) {
        return this.loadedData.states.filter((s) => s.id == this.stateId)[0];
      } else {
        return null;
      }
    },
    selectedDistrict() {
      if (this.districtId) {
        return this.loadedData.districts.filter((d) => d.ags == this.districtId)[0];
      } else {
        return null;
      }
    },
    incidence() {
      if (this.incidenceSource == "input") {
        return parseFloat(this.incidenceString.replace(",", "."));
      } else if (this.incidenceSource == "germany" && this.loadedData.germany) {
        return this.loadedData.germany[7].weekIncidence;
      } else if (this.incidenceSource == "state" && this.selectedState) {
        return this.selectedState.history[7].weekIncidence;
      } else if (this.incidenceSource == "district" && this.selectedDistrict) {
        return this.selectedDistrict.history[7].weekIncidence;
      } else {
        return 0.0;
      }
    },
    incidencePrev() {
      if (this.incidenceSource == "input") {
        return parseFloat(this.incidenceString.replace(",", "."));
      } else if (this.incidenceSource == "germany" && this.loadedData.germany) {
        return this.loadedData.germany[0].weekIncidence;
      } else if (this.incidenceSource == "state" && this.selectedState) {
        return this.selectedState.history[0].weekIncidence;
      } else if (this.incidenceSource == "district" && this.selectedDistrict) {
        return this.selectedDistrict.history[0].weekIncidence;
      } else {
        return 0.0;
      }
    },
    underReportingFactor() {
      // estimated to be between 4 and 6 by rki, see
      // https://www.rki.de/DE/Content/Infekt/EpidBull/Archiv/2020/Ausgaben/50_20.pdf?__blob=publicationFile
      // on page 3
      return 5.0;
    },
    delayFactor() {
      // see https://www.microcovid.org/paper/7-basic-method step 3
      let delayFactor = this.incidence / this.incidencePrev;
      if (delayFactor > 2.0) delayFactor = 2.0;
      return delayFactor;
    },
    incidenceAdjusted() {
      return this.incidence * this.delayFactor;
    },
    prevalence() {
      if (this.incidenceSource == "inputPrevalence")
        return parseFloat(this.prevalenceString.replace(",", "."));
      else return this.incidenceAdjusted * this.underReportingFactor;
    },
    fpr() {
      return 1.0 - this.specificity;
    },
    fnr() {
      return 1.0 - this.sensitivity;
    },
    bayesFactorPos() {
      // If the false positive rate is 0, the bayes facotr would be infinity. This will break other computetions later.
      // Using a high, finite value kinda fixes it. We used to return 9999 here, which was so far from infinity that
      // the result was useless. Using 99,999,999 instead reduces the error so much that it disappears from the
      // result display due to rounding - at least for true-positives which will be 100%.
      // It would still show 0.0001444 % false-positives, which will not be rounded down to 0 because of the
      // way small percentages are formatted (four significant digits).
      if (this.fpr > 0) return Math.min(99999999, this.sensitivity / this.fpr);
      else return 99999999;
    },
    bayesFactorNeg() {
      return this.fnr / this.specificity;
    },
    priorProb() {
      let riskFactors =
        (parseFloat(this.riskProfilePrivate) + parseFloat(this.riskProfileProfessional)) /
        1.8;
      let additionalRisk = parseFloat(this.additionalRiskString) / 1000000.0;
      if (Number.isNaN(additionalRisk)) additionalRisk = 0.0;
      let prior = (this.incidenceAdjusted / 100000.0) * riskFactors + additionalRisk;
      if (prior > 0.999) prior = 0.999; // 1.00 would give computational erros for updates probabilities
      return prior;
    },
    anySymptoms() {
      return (
        this.sympSmell ||
        this.sympTaste ||
        this.sympFever ||
        this.sympCough ||
        this.sympWheez ||
        this.sympChest ||
        this.sympOther
      );
    },
    ruleScore() {
      let score = 0.0;
      if (this.sympSmell || this.sympTaste) score += 2;
      if (this.sympFever && this.sympCough) score += 1;
      if (this.sympWheez || this.sympChest) score += -1;
      return score;
    },
    ruleLR() {
      switch (this.ruleScore) {
        case 3:
          return 15.0;
        case 2:
          return 4.2;
        case 1:
          return 1.2;
        case 0:
          return 0.7;
        case -1:
          return 0.1;
      }
      return 0.0;
    },
    priorProbSymptoms() {
      let priorOdds = this.priorProb / (1.0 - this.priorProb);
      let updatedOddsPos = priorOdds;
      if (this.anySymptoms) {
        updatedOddsPos = priorOdds * this.ruleLR * this.anySymptomFactor;
      }
      return updatedOddsPos / (1.0 + updatedOddsPos);
    },
    updatedProbPos() {
      let priorOdds = this.priorProbSymptoms / (1.0 - this.priorProbSymptoms);
      let updatedOddsPos = priorOdds * this.bayesFactorPos;
      return updatedOddsPos / (1.0 + updatedOddsPos);
    },
    updatedProbNeg() {
      let priorOdds = this.priorProbSymptoms / (1.0 - this.priorProbSymptoms);
      let updatedOddsNeg = priorOdds * this.bayesFactorNeg;
      return updatedOddsNeg / (1.0 + updatedOddsNeg);
    },
    testHeaders() {
      if (this.$vuetify.breakpoint.xsOnly)
        return [
          { text: "Hersteller und Name", value: "manufacturer_name" },
          { text: "Merkmale", value: "attrib_and_studies", sortable: false },
        ];
      else
        return [
          { text: "Hersteller", value: "manufacturer" },
          { text: "Name", value: "name" },
          { text: "Merkmal", value: "attrib", sortable: false },
          { text: "Daten", value: "studies", sortable: false },
          { text: "Probe", value: "sampledings", sortable: false}
        ];
    },
    districtsChoices() {
      if (this.loadedData.districts.length == 0 || this.loadedData.districtsFull == {}) {
        return [];
      }

      return this.loadedData.districts.map((district) => {
        district.displayName = this.loadedData.districtsFull[district.ags].county;
        return district;
      });
    },
    resultValid() {
      return (
        !Number.isNaN(this.priorProbSymptoms) &&
        !Number.isNaN(this.sensitivity) &&
        !Number.isNaN(this.specificity)
      );
    },
  },
};
</script>
<style scoped></style>
