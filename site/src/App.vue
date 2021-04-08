<template>
  <v-app id="rapidtest">
    <!-- class="hidden"> -->
    <v-app-bar app dark color="light-blue darken-2" flat clipped-right>
      <v-img
        max-height="46"
        max-width="46"
        src="/icons/android-chrome-192x192.png"
      ></v-img>
      <v-toolbar-title>SchnellTestRechner.de</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-switch v-model="intermediate" label="Erweiterte Ansicht" hide-details></v-switch>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            href="https://twitter.com/Testrechner"
            target="_"
          >
            <v-icon>mdi-twitter</v-icon>
          </v-btn>
        </template>
        <span>Zum Twitter-Account @testrechner</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            href="https://github.com/lenaschimmel/schnelltestrechner"
            target="_"
          >
            <v-icon>mdi-github</v-icon>
          </v-btn>
        </template>
        <span>Code auf Github ansehen</span>
      </v-tooltip>

      <template v-slot:extension>
        <v-tabs v-model="tab">
          <v-tabs-slider color="pink"></v-tabs-slider>

          <v-tab v-for="item in tabs" :key="item.id">
            {{ item.title }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-main class="white">
      <v-tabs-items v-model="tab" touchless>
        <v-tab-item>
          <!-- TAB calc -->
          <v-container class="fill-height">
            <v-row class="fill-height">
              <v-col cols="12" class="fill-height">
                <v-alert color="red" type="warning" icon="mdi-alert">
                  <p>
                    Dies ist eine sehr frühe Vorschau-Version dieser Seite. Sie wurde
                    bisher nicht von unabhängigen, fachkundigen Menschen auf Plausibilität
                    und Fehlerfreiheit geprüft. Bitte verwende die Ergebnisse mit Vorsicht
                    und Skepsis!
                  </p>
                  <p>
                    Bekannte Fehler, Probleme und Ungenauigkeiten sind in den
                    <a
                      href="https://github.com/lenaschimmel/schnelltestrechner/issues"
                      target="_"
                      class="white--text"
                      >GitHub Issues</a
                    >
                    erfasst. Bitte richte weitere Anmerkungen dorthin, oder an die
                    verlinkten
                    <a
                      href="https://twitter.com/Testrechner"
                      target="_"
                      class="white--text"
                      >Twitter-</a
                    >
                    und
                    <a
                      href="mailto:mail@schnelltestrechner.de"
                      target="_"
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
                        Wie zuverlässig eigentlich ein Schnell- oder Selbst-Test auf
                        Sars-CoV-2 ist,
                        <b>lässt sich unmöglich allgemein beantworten.</b> Neben den
                        Eigenschaften des eigentlichen Tests (<i>Sensitivität</i> und
                        <i>Spezifität</i>) spielt auch die sogenannte
                        <i>Vortestwahrscheinlichkeit</i> eine enorm große Rolle. Und die
                        hängt grundsätzlich von der <i>Inzidenz</i>, sowie dem privatem
                        und beruflichem <i>Risiko-Profil</i> ab. Wer außerdem
                        <i>Symptome</i> hat, hat eine zusätzlich stark erhöhte
                        Vortestwahrscheinlichkeit.
                      </p>

                      <p>
                        Um in einem konkreten Fall das Ergebnis zu bewerten, müsste man
                        also:
                      </p>
                      <ul class="mb-4">
                        <li>
                          Die mathematischen Grundprinzipien verstehen, insbesondere das
                          scheinbare paradoxe Phänomen des
                          <a
                            href="https://de.wikipedia.org/wiki/Pr%C3%A4valenzfehler"
                            target="_"
                            >Prävalenzfehlers</a
                          >
                        </li>
                        <li>Alle oben genannten Werte recherchieren bzw. abschätzen</li>
                        <li>
                          Diese Werte in Formeln einsetzen und Ergebnisse ausrechnen
                        </li>
                      </ul>

                      <p>
                        Diese Seite möchte bei all diesen Schritten helfen. Der Fokus
                        liegt auf einem Test für eine bestimmte Person zu einem bestimmten
                        Zeitpunkt, also nicht auf Abschätzungen für die Gesamtbevölkerung.
                      </p>
                      <p>
                        Details zur Funktionsweise finden sich im Tab "Weitere Infos".
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
                              <v-checkbox
                                label="Nur Selbst-Tests"
                                v-model="testFilterSelf"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" no-gutters>
                              <v-checkbox v-model="testFilterPei">
                                <template v-slot:label>
                                  <div>
                                    Nur vom
                                    <acronym
                                      title="Paul-Ehrlich-Institut - Bundesinstitut für Impfstoffe und biomedizinische Arzneimittel"
                                      >PEI</acronym
                                    >
                                    evaluiert
                                  </div>
                                </template>
                              </v-checkbox>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" no-gutters>
                              <v-checkbox
                                label="Wissenschaftliche Studien"
                                v-model="testFilterStudies"
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
                                      :key="circle.color"
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
                            <template v-slot:item.attrib="{ item }">
                              <v-tooltip left>
                                <template v-slot:activator="{ on, attrs }">
                                  <div v-bind="attrs" v-on="on">
                                    <v-icon
                                      v-for="circle in getAttribCircles(item)"
                                      :key="circle.color"
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
                                      :key="circle.color"
                                      small
                                      :color="circle.color"
                                    >
                                      {{ circle.icon }}
                                    </v-icon>
                                    <v-icon
                                      v-for="circle in getAttribCircles(item)"
                                      :key="circle.color"
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
                            intermediate &&
                            this.selectedTest &&
                            Object.keys(this.selectedTest.studies).length > 0
                          "
                        >
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
                                {{ studyTitle(item) }}
                              </template>
                              <template v-slot:selection="{ parent, item }">
                                {{ studyTitle(item) }}
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

                        <v-container
                          fluid
                          class="pt-8"
                          v-if="!Number.isNaN(this.sensitivity)"
                        >
                          <v-row>
                            <v-col cols="12" sm="6" md="3" no-gutters>
                              Sensitivität: {{ formatPercent(sensitivity) }}
                            </v-col>
                            <v-col cols="12" sm="6" md="3" no-gutters>
                              Spezifität: {{ formatPercent(specificity) }}
                            </v-col>
                          </v-row>
                          <v-row>
                            <template v-if="intermediate">
                              <v-col cols="12" sm="6" md="3" no-gutters
                                >Falsch-Negativ-Rate: {{ formatPercent(fnr) }}
                              </v-col>
                              <v-col cols="12" sm="6" md="3" no-gutters
                                >Falsch-Positiv-Rate: {{ formatPercent(fpr) }}
                              </v-col>
                              <v-col cols="12" sm="6" md="3" no-gutters
                                >Bayes-Faktor bei positivem Test:
                                {{ formatNumber(bayesFactorPos) }}</v-col
                              >
                              <v-col cols="12" sm="6" md="3" no-gutters
                                >Bayes-Faktor bei negativem Test:
                                {{ formatNumber(1 / bayesFactorNeg) }}</v-col
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
                          v-if="
                            this.selectedTest != null && Number.isNaN(this.sensitivity)
                          "
                        >
                          Zu diesem Test hat der Hersteller keine Sensitivität und
                          Spezifität angegeben. Bitte einen anderen Test auswählen oder
                          Daten selbst eingeben.
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
                            <template v-if="intermediate">
                              <v-col cols="12" sm="6" md="3" no-gutters
                                >Falsch-Negativ-Rate: {{ formatPercent(fnr) }}
                              </v-col>
                              <v-col cols="12" sm="6" md="3" no-gutters
                                >Falsch-Positiv-Rate: {{ formatPercent(fpr) }}
                              </v-col>
                              <v-col cols="12" sm="6" md="3" no-gutters
                                >Bayes-Faktor bei positivem Test:
                                {{ formatNumber(bayesFactorPos) }}</v-col
                              >
                              <v-col cols="12" sm="6" md="3" no-gutters
                                >Bayes-Faktor bei negativem Test:
                                {{ formatNumber(1 / bayesFactorNeg) }}</v-col
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
                    <v-expansion-panel-content color="blue lighten-5">
                      <v-radio-group v-model="incidenceSource" mandatory>
                        <v-radio value="germany" label="Ganz Deutschland"></v-radio>
                        <v-radio value="state" label="Nach Bundesland"></v-radio>
                        <v-radio value="district" label="Nach Landkreis"></v-radio>
                        <v-radio value="input" label="Eigenen Wert eingeben"></v-radio>
                      </v-radio-group>

                      <template v-if="incidenceSource == 'state'">
                        <p>
                          Bundesland:
                          <v-select
                            v-model="stateId"
                            :items="states"
                            item-text="name"
                            item-value="id"
                            solo
                          >
                          </v-select>
                        </p>
                      </template>

                      <template v-if="incidenceSource == 'district'">
                        <p>
                          Stadt / Landkreis:
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

                      <template v-if="incidenceSource == 'input'">
                        <p>
                          7-Tage Prävalenz je 100.000:
                          <v-text-field v-model="incidenceString" solo />
                        </p>
                      </template>
                      <template v-if="intermediate">
                        <template v-if="incidenceSource != 'input'">
                          <p>
                            <i
                              >Quelle der Inzidenzdaten:
                              <a href="https://api.corona-zahlen.org" target="_"
                                >api.corona-zahlen.org</a
                              ></i
                            >
                          </p>
                          <p>
                            Gemeldete 7-Tage Inzidenz je 100.000 diese Woche:
                            <input disabled :value="formatNumber(incidence)" />
                          </p>
                          <p>
                            Gemeldete 7-Tage Inzidenz je 100.000 vorherige Woche:
                            <input disabled :value="formatNumber(incidencePrev)" />
                          </p>
                        </template>
                        <p>
                          Geschätzte Prävalenz:
                          <input disabled :value="formatNumber(incidenceAdjusted)" />
                        </p>
                      </template>
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
                      >
                      </v-select>

                      Berufliches Risiko-Profil:
                      <v-select
                        v-model="riskProfileProfessional"
                        :items="riskProfilesProfessional"
                        item-text="name"
                        item-value="val"
                        solo
                      >
                      </v-select>

                      Zusätzliche Risiken in den letzten 10 Tagen laut
                      <a href="https://www.microcovid.org" target="_">microCOVID.org</a>:
                      <v-text-field
                        v-model="additionalRiskString"
                        background-color="white"
                        suffix="µCoV"
                        solo
                      >
                      </v-text-field>

                      <p v-if="intermediate">
                        Vortestwahrscheinlichkeit vor Symptomen:
                        <input disabled v-bind:value="formatPercent(priorProb)" />
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
                    <v-expansion-panel-content color="blue lighten-5">
                      <v-container fluid>
                        <v-row no-gutters>
                          <v-col cols="12" sm="4" md="4" no-gutters>
                            <v-checkbox
                              v-model="sympSmell"
                              label="Geruchsverlust"
                            ></v-checkbox>
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
                              hint="z.B. Schnupfen, Bronchitis, Pneumonie, Atemnot, Halsschmerzen, Kopf-
                        und Gliederschmerzen, Appetitlosigkeit, Gewichtsverlust, Übelkeit, Bauchschmerzen, Erbrechen,
                        Durchfall, Konjunktivitis, Hautausschlag, Lymphknotenschwellung, Apathie, Somnolenz"
                              persistent-hint
                            ></v-checkbox>
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
                        Vortestwahrscheinlichkeit scheinbar. Das verwirrt auf den ersten
                        Blick, hat aber einen Grund, der
                        <a
                          href="https://github.com/lenaschimmel/schnelltestrechner/issues/21#issuecomment-808184992"
                          target="_"
                          >hier</a
                        >
                        erläutert wird.
                      </v-alert>

                      <template v-if="anySymptoms && intermediate">
                        <p>C19 Rule score: <input disabled v-bind:value="ruleScore" /></p>
                        <p>
                          C19 Rule likelihood ratio:
                          <input disabled v-bind:value="formatNumber(ruleLR)" />
                        </p>
                        <p>
                          Symptom-Faktor:
                          <input
                            disabled
                            v-bind:value="formatNumber(ruleLR * anySymptomFactor)"
                          />
                        </p>
                      </template>
                      <p v-if="intermediate">
                        Vortestwahrscheinlichkeit nach Symptomen:
                        <input disabled v-bind:value="formatPercent(priorProbSymptoms)" />
                      </p>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <v-spacer></v-spacer>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>

        <v-tab-item>
          <!-- TAB comparision -->
          <v-container class="fill-height">
            <v-row class="fill-height">
              <v-col cols="12" class="fill-height">
                <v-expansion-panels multiple class="mb-8" v-model="expandedPanelsCompare">
                  <v-expansion-panel>
                    <v-expansion-panel-header
                      class="font-weight-bold text-uppercase"
                      color="blue lighten-3"
                    >
                      Funktionsweise des Vergleichs
                    </v-expansion-panel-header>
                    <v-expansion-panel-content color="blue lighten-5">
                      <p class="mt-4">
                        Hier kann die Sensititvität und Spezifität von Schnelltests
                        grafisch verglichen werden.
                      </p>

                      <p>
                        Die Filterung funktioniert grundsätzlich wie im Testrechner.
                        Zusätzlich können beliebig viele Tests mit der Checkbox in der
                        linken Spalte für einen engeren Vergleich ausgewählt werden. Wenn
                        anschließend der Filter "Ausgewählte" aktiviert wird, werden nur
                        noch diese angezeigt.
                      </p>

                      <p>
                        Die Grafiken für Sensititvität und Spezifität bilden jeweils einen
                        Bereich von 0% (links) bis 100% (rechts) ab. Jede Zeile steht für
                        eine Datenquelle, also die Herstellerangaben oder eine Studie aus
                        der
                        <a
                          href="https://www.klinikum.uni-heidelberg.de/diagnostics-global-health"
                          target="_"
                          >Liste wissenschaftlicher Studien</a
                        >
                        der Uni Heidelberg. Kurze, vertikale Linie gibt den Mittelwert an,
                        die längere, horizontale Linie das 95%-Konfidenzintervall.
                      </p>
                      <p>Die Farben der Linien haben folgende Bedeutung:</p>
                      <ul>
                        <li><b>Blau:</b> Hersteller-Angaben</li>
                        <li><b>Grün:</b> Studie hoher Qualität</li>
                        <li><b>Gelb:</b> Studie mittlerer Qualität</li>
                        <li><b>Rot:</b> Studie geringer Qualität</li>
                        <li><b>Schwarz:</b> Studie unklarer Qualität</li>
                      </ul>
                      <p>
                        Mit der Maus kann über den einzelnen Zeilen gehovert werden, um
                        die Autor_innen der Studie und die exakten Werte in einem Tooltip
                        anzuzeigen.
                      </p>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel>
                    <v-expansion-panel-header
                      class="font-weight-bold text-uppercase"
                      color="blue lighten-3"
                    >
                      Vergleich von Schnelltests
                    </v-expansion-panel-header>
                    <v-expansion-panel-content color="blue lighten-5">
                      <v-container fluid>
                        <v-row no-gutters>
                          <v-col cols="12" sm="4" md="3" no-gutters>
                            <v-checkbox
                              label="Nur Selbst-Tests"
                              v-model="compareFilterSelf"
                            ></v-checkbox>
                          </v-col>
                          <v-col cols="12" sm="8" md="3" no-gutters>
                            <v-checkbox v-model="compareFilterPei">
                              <template v-slot:label>
                                <div>
                                  Nur vom
                                  <acronym
                                    title="Paul-Ehrlich-Institut - Bundesinstitut für Impfstoffe und biomedizinische Arzneimittel"
                                    >PEI</acronym
                                  >
                                  evaluiert
                                </div>
                              </template>
                            </v-checkbox>
                          </v-col>
                          <v-col cols="12" sm="4" md="3" no-gutters>
                            <v-checkbox
                              label="Wissenschaftliche Studien"
                              v-model="compareFilterStudies"
                            ></v-checkbox>
                          </v-col>
                          <v-col cols="12" sm="4" md="3" no-gutters>
                            <v-checkbox
                              label="Ausgewählte"
                              v-model="compareFilterSelected"
                            ></v-checkbox>
                          </v-col>
                        </v-row>
                      </v-container>

                      <p>Anzeige-Einstellungen:</p>
                      <v-checkbox
                        label="Spezifität auf oberste 10% heran zoomen"
                        v-model="zoomSpecificity"
                      >
                      </v-checkbox>

                      <v-card class="mt-4">
                        <v-data-table
                          dense
                          v-model="compareTests"
                          :items="visibleCompareTests"
                          :headers="compareHeaders"
                          show-select
                          locale="de-DE"
                          mobile-breakpoint="360"
                          :options="{ itemsPerPage: 15 }"
                        >
                          <template v-slot:item.sensitivity="{ item }">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              :height="20 * Object.values(item.studies).length"
                              width="201"
                            >
                              <rect
                                width="201"
                                :height="20 * Object.values(item.studies).length"
                                style="
                                  fill: rgb(255, 255, 255);
                                  stroke-width: 1;
                                  stroke: rgb(0, 0, 0);
                                "
                              />
                              <line
                                v-for="x in [10, 20, 30, 40, 50, 60, 70, 80, 90]"
                                :key="x"
                                :x1="x * 2"
                                :x2="x * 2"
                                y1="0"
                                :y2="20 * Object.values(item.studies).length"
                                :style="'stroke:grey;stroke-width:1'"
                              />

                              <template v-for="(study, i) in Object.values(item.studies)">
                                <template v-if="study && study.sensitivity">
                                  <rect
                                    width="201"
                                    :height="20"
                                    :y="20 * i"
                                    style="fill: transparent; stroke: none"
                                    :key="study.id + '_sp1'"
                                  >
                                    <title>
                                      {{
                                        formatPercent(study.sensitivity.avg) +
                                        " (95% CI: " +
                                        formatPercent(study.sensitivity.min) +
                                        " bis " +
                                        formatPercent(study.sensitivity.max) +
                                        ") - " +
                                        studyTitle(study)
                                      }}
                                    </title>
                                  </rect>
                                  <line
                                    :key="study.id + '_sp2'"
                                    :x1="study.sensitivity.min * 200"
                                    :x2="study.sensitivity.max * 200"
                                    :y1="10 + i * 20"
                                    :y2="10 + i * 20"
                                    :style="
                                      'stroke:' + getStudyColor(study) + ';stroke-width:2'
                                    "
                                  />
                                  <line
                                    :key="study.id + '_sp3'"
                                    :x1="study.sensitivity.avg * 200"
                                    :x2="study.sensitivity.avg * 200"
                                    :y1="5 + i * 20"
                                    :y2="15 + i * 20"
                                    :style="
                                      'stroke:' + getStudyColor(study) + ';stroke-width:2'
                                    "
                                  />
                                </template>
                              </template>
                            </svg>
                          </template>

                          <template v-slot:item.specificity="{ item }">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              :height="20 * Object.values(item.studies).length"
                              width="201"
                            >
                              <rect
                                width="201"
                                :height="20 * Object.values(item.studies).length"
                                style="
                                  fill: rgb(255, 255, 255);
                                  stroke-width: 1;
                                  stroke: rgb(0, 0, 0);
                                "
                              />
                              <g v-if="!zoomSpecificity">
                                <line
                                  v-for="x in [10, 20, 30, 40, 50, 60, 70, 80, 90]"
                                  :key="x"
                                  :x1="x * 2"
                                  :x2="x * 2"
                                  y1="0"
                                  :y2="20 * Object.values(item.studies).length"
                                  :style="'stroke:grey;stroke-width:1'"
                                />
                              </g>
                              <template v-for="(study, i) in Object.values(item.studies)">
                                <template v-if="study && study.specificity">
                                  <rect
                                    width="201"
                                    :height="20"
                                    :y="20 * i"
                                    style="fill: transparent; stroke: none"
                                    :key="study.id + '_sp1'"
                                  >
                                    <title>
                                      {{
                                        formatPercent(study.specificity.avg) +
                                        " (95% CI: " +
                                        formatPercent(study.specificity.min) +
                                        " bis " +
                                        formatPercent(study.specificity.max) +
                                        ") - " +
                                        study.author +
                                        ", n = " +
                                        (study.sampleSize || "unbekannt")
                                      }}
                                    </title>
                                  </rect>
                                  <line
                                    :key="study.id + '_sp2'"
                                    :x1="getSpecificityX(study.specificity.min)"
                                    :x2="getSpecificityX(study.specificity.max)"
                                    :y1="10 + i * 20"
                                    :y2="10 + i * 20"
                                    :style="
                                      'stroke:' + getStudyColor(study) + ';stroke-width:2'
                                    "
                                  />
                                  <line
                                    :key="study.id + '_sp3'"
                                    :x1="getSpecificityX(study.specificity.avg)"
                                    :x2="getSpecificityX(study.specificity.avg)"
                                    :y1="5 + i * 20"
                                    :y2="15 + i * 20"
                                    :style="
                                      'stroke:' + getStudyColor(study) + ';stroke-width:2'
                                    "
                                  />
                                </template>
                              </template>
                            </svg>
                          </template>
                          <template v-slot:item.manufacturer_name="{ item }">
                            {{ item.manufacturer + " - " + item.name }}
                          </template>
                        </v-data-table>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>

        <v-tab-item>
          <!-- TAB info -->
          <v-container class="fill-height">
            <v-row class="fill-height">
              <v-col cols="12" class="fill-height">
                <v-expansion-panels multiple class="mb-8" v-model="expandedPanelsInfo">
                  <v-expansion-panel>
                    <v-expansion-panel-header
                      class="font-weight-bold text-uppercase"
                      color="blue lighten-3"
                    >
                      Verwendete Quellen und Methoden+
                    </v-expansion-panel-header>
                    <v-expansion-panel-content color="blue lighten-5">
                      <p class="font-weight-bold mt-4">
                        Die Daten über verfügbare Schnelltests kommen aus diesen Quellen:
                      </p>
                      <ul>
                        <li>
                          <a
                            href="https://www.bfarm.de/DE/Medizinprodukte/Antigentests/_node.html"
                            target="_"
                            >Liste der Tests zur Eigenanwendung durch Laien</a
                          >
                          des BfArM
                        </li>
                        <li>
                          <a
                            href="https://antigentest.bfarm.de/ords/f?p=ANTIGENTESTS-AUF-SARS-COV-2"
                            target="_"
                            >Liste der Antigen-Tests zum direkten Erregernachweis des
                            Coronavirus SARS-CoV-2</a
                          >
                          des BfArM
                        </li>
                        <li>
                          <a
                            href="https://www.klinikum.uni-heidelberg.de/diagnostics-global-health"
                            target="_"
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
                          <a href="https://api.corona-zahlen.org/docs/" target="_"
                            >corona-zahlen.org</a
                          >
                        </li>
                        <li>
                          einer Extrapolation der Inzidenz durch das Wachstum seit der
                          Vor-Woche
                        </li>
                        <li>
                          einer Abschätzung des Underreporting-Faktors von 4-6 durch das
                          <a
                            href="https://www.rki.de/DE/Content/Infekt/EpidBull/Archiv/2020/Ausgaben/50_20.pdf?__blob=publicationFile"
                            target="_"
                            >RKI</a
                          >
                        </li>
                        <li>
                          Faktoren für das private Infektionsrisiko, die an
                          <a href="https://www.microcovid.org" target="_">Microcovid</a>
                          angelehnt sind
                        </li>
                        <li>
                          Faktoren für das berufliche Risiko, die beispielhaft aus
                          Grafiken von
                          <a
                            href="https://www.addendum.org/coronavirus/berufe-ansteckungsrisiko/"
                            target="_"
                            >www.addendum.org</a
                          >
                          entnommen wurden
                        </li>
                      </ul>
                      <p class="mt-4">
                        Die Berechnung der Bayes-Faktoren und der
                        A-Posteriori-Wahrscheinlichkeiten folgt der Berechnung des Videos
                        <a href="https://www.youtube.com/watch?v=lG4VkPoG3ko" target="_"
                          >The medical test paradox: Can redesigning Bayes rule help?</a
                        >
                        von 3Blue1Brown.
                      </p>
                      <p>
                        Der Einfluss von Symptomen auf die a-priori Wahrscheinlichkeit
                        einer Infektion wurde nach der
                        <a
                          href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7584484/"
                          target="_"
                          >Punkteregel nach Smith, Richey und Brunetto</a
                        >
                        implementiert. Die Punkteregel ist darauf ausgelegt, die a-priori
                        Wahrscheinlichkeit eines symptomatischen Patienten (mit unklaren
                        Symptomen, die grob auf Covid-19 hindeuten) anhand seiner
                        spezifischen Symptome zu verfeinern. Dazu wird die Prävalenz um
                        den Faktor 18,8 angehoben, sobald Symptome vorhanden sind, um
                        anschließend die Punkteregel anzuwenden.
                        <strong
                          >Der Faktor 18,8 basiert auf sehr groben Abschätzungen und
                          stellt wahrscheinlich die größte Ungenauigkeit innerhalb der
                          gesamten Berechnung dar. Er sollte dringend durch einen
                          wissenschaftlich basierten Wert ersetzt werden.</strong
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
                        SARS-CoV-2-Tests vollständig und fehlerfrei anzubieten. Daher
                        empfehlen wir ausdrücklich, auch weitere Informationsquellen zu
                        Rate zu ziehen!
                      </p>
                      <ul>
                        <li>
                          <a
                            href="https://www.zusammengegencorona.de/informieren/testen/"
                            target="_"
                            >Informationen zum Testen</a
                          >
                          vom Bundesministerium für Gesundheit
                        </li>
                        <li>
                          <a
                            href="https://www.infektionsschutz.de/coronavirus/tests-auf-sars-cov-2.html"
                            target="_"
                            >Tests auf das Coronavirus SARS-CoV-2</a
                          >
                          von der Bundeszentrale für gesundheitliche Aufklärung (BZgA)
                        </li>
                        <li>
                          Sämtliche Informationen des
                          <a
                            href="https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/nCoV.html"
                            target="_"
                            >Robert Koch Instituts (RKI)</a
                          >
                        </li>

                        <li>
                          Der
                          <a
                            href="https://diagnostics-global-health.github.io/rechner/"
                            target="_"
                          >
                            Schnelltest-Rechner der Uni-Heidelberg</a
                          >, von der auch die Studiendaten kommen. Schnell und einfach,
                          aber ohne individuelle Vortest-Wahrscheinlichkeit.
                        </li>
                        <li>
                          Der
                          <a href="https://rki-wiko.shinyapps.io/test_qual/" target="_">
                            Schnelltest-Rechner des Robert Koch Instituts (RKI)</a
                          >. Er ist zwar langsam und weniger mächtig als dieser hier,
                          bietet aber ein paar andere Darstellungsweisen der Ergebnisse.
                        </li>
                        <li>
                          Im
                          <a
                            href="https://www.ndr.de/nachrichten/info/Das-Glossar-zum-Corona-Podcast,podcastcoronavirus146.html#SARS"
                            target="_"
                            >Corona-Glossar</a
                          >
                          des
                          <a href="https://www.ndr.de/nachrichten/info/podcast4684.html"
                            >Coronavirus-Update von NDR Info</a
                          >
                          werden alle wichtigen Fachbegriffe erläutert. Generell ist der
                          Podcast sehr empfehlenswert und es gibt ein
                          <a
                            href="https://www.ndr.de/nachrichten/info/coronaskript174.pdf"
                            target="_"
                            >durchsuchbares Transkript aller Folgen als PDF</a
                          >.
                        </li>
                        <li>
                          Die Initiative
                          <a href="https://rapidtests.de/" target="_">RapidTests.de</a>
                          erläutert wichtige Konzepte, auch in ihren umfangreichen
                          <a href="https://rapidtests.de/faq" target="_">FAQ</a>.
                        </li>
                        <li>
                          Die
                          <a
                            href="https://www.cochrane.de/de/news/aktualisierter-cochrane-review-bewertet-zuverl%C3%A4ssigkeit-von-schnelltests-zum-nachweis-von-covid"
                            target="_"
                            >Zusammenfassung</a
                          >
                          und die
                          <a
                            href="https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD013705.pub2/full/de"
                            target="_"
                            >(wirklich lange) Langfassung</a
                          >
                          des Aktualisierten Cochrane Review bewertet Zuverlässigkeit von
                          Schnelltests zum Nachweis von COVID-19. Die Ergebnisse daraus
                          sind <i>noch nicht</i> in die Datenbasis dieses Rechners
                          integriert.
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
                        Paul-Ehrlich-Institut (PEI) evaluiert sind. Auch lässt sich die
                        Liste nach diesem Kriterium filtern.
                      </p>
                      <p>
                        <b
                          >Die Relevanz der PEI-Evaluation kann leicht überschätzt werden,
                          da der Anschein entsteht, die Tests würden unabhängig bzgl.
                          Sensititvität <i>und</i> Spezifität getestet werden. Das ist
                          nicht der Fall.</b
                        >
                      </p>
                      <p>
                        Das PEI fragt u. A. die Sensitivität und Spezifität vom Hersteller
                        ab, und legt daran Mindestkriterien an. Nur wenn ein Test laut
                        Hersteller mindestens 80% Sensititvität und mindestens 97%
                        Spezifität hat, kommt er für die Evaluierung überhaupt in Frage.
                      </p>
                      <p>
                        Die Tests, die nicht bereits durch die Hersteller-Angaben
                        ausscheiden, <i>können</i> dann vom PEI weiter betrachtet werden,
                        worauf jedoch kein Anspruch besteht.
                      </p>
                      <p>
                        Für die erfolgreiche Evaluierung ist ebenfalls eine
                        Laboruntersuchung durch
                        <i
                          >"verschiedene Institutionen in Deutschland (u.a.
                          Robert-Koch-Institut; Paul-Ehrlich-Institut; Konsiliarlabor für
                          Coronaviren; Institut für Mikrobiologie der Bundeswehr)"</i
                        >
                        nötig. In einem einheitlichen, analytischen (praxis-fernen, aber
                        sinnvollem) Verfahren wird die Sensitivität des Tests geprüft.
                        <b
                          >Der Labortest im Rahmen der PEI-Evaluation testet
                          <i>nicht</i> die Spezifität.</b
                        >
                      </p>
                      <p>
                        Der durchgeführte Test ist zwar geeignet, eine vage Aussage zur
                        Sensititvität zu machen, jedoch wird dabei kein Wert Ermittelt,
                        der direkt mit den Ergebnissen der Hersteller oder anderer
                        unabhängiger Studien verglichen werden kann. Insbesondere wird vom
                        PEI kein solcher Wert als Prozentangabe veröffentlicht, sondern
                        nur die Liste der Tests, die als
                        <i
                          >"dem derzeitigen Stand der Technik entsprechend bewertet
                          wurden"</i
                        >.
                      </p>
                      <p>
                        Die konkreten Verfahrensweise können bei PEI nachgelesen werden:
                      </p>
                      <ul>
                        <li>
                          <a
                            href="https://www.pei.de/SharedDocs/Downloads/DE/newsroom/dossiers/mindestkriterien-sars-cov-2-antigentests-01-12-2020.pdf?__blob=publicationFile&v=6"
                            target="_"
                            >Mindestkriterien für SARS-CoV-2 Antigentests im Sinne von § 1
                            Abs. 1 Satz 1 TestVO: Antigenschnelltests</a
                          >
                        </li>
                        <li>
                          <a
                            href="https://www.pei.de/SharedDocs/Downloads/DE/newsroom/dossiers/evaluierung-sensitivitaet-sars-cov-2-antigentests-04-12-2020.pdf?__blob=publicationFile&v=36"
                            target="_"
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
        </v-tab-item>

        <v-tab-item>
          <!-- TAB imprint -->
          <v-container class="fill-height">
            <v-row class="fill-height">
              <v-col cols="12" class="fill-height">
                <v-expansion-panels multiple class="mb-8" v-model="expandedPanelsImprint">
                  <v-expansion-panel>
                    <v-expansion-panel-header class="font-weight-bold text-uppercase">
                      Verantwortliche
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <h2>
                        Angaben gemäß § 5 TMG und Verantwortliche für den Inhalt nach § 55
                        Abs. 2 RStV
                      </h2>
                      <ul>
                        <li>Lena Schimmel</li>
                        <li>Chemnitzstr. 7</li>
                        <li>38118 Braunschweig</li>
                        <li>
                          E-Mail:
                          <a href="mailto:mail@schnelltestrechner.de"
                            >mail@schnelltestrechner.de</a
                          >
                        </li>
                      </ul>
                      <p>
                        Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten
                        Kontaktdaten durch Dritte zur Übersendung von nicht ausdrücklich
                        angeforderter Werbung und Informationsmaterialien wird hiermit
                        ausdrücklich widersprochen. Die Betreiber der Seiten behalten sich
                        ausdrücklich rechtliche Schritte im Falle der unverlangten
                        Zusendung von Werbeinformationen, etwa durch Spam-Mails, vor.
                      </p>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel>
                    <v-expansion-panel-header class="font-weight-bold text-uppercase">
                      Datenschutz
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <p>
                        Bei der Nutzung dieser Webseite werden keine personenbezogenen
                        Daten, insbesondere keine Gesundheitsdaten erhoben, da alle
                        Eingaben lokal im Browser verarbeitet werden. Es werden keine
                        Cookies o.Ä. verwendet, und keine Anfragen an andere Anbieter und
                        Domains gemacht.
                      </p>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel>
                    <v-expansion-panel-header class="font-weight-bold text-uppercase">
                      Haftung für Inhalte
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <p>
                        Die Inhalte meiner Seiten wurden mit größter Sorgfalt erstellt.
                        Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
                        kann ich jedoch keine Gewähr übernehmen. Als Diensteanbieter bin
                        ich gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach
                        den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG bin
                        ich als Diensteanbieter jedoch nicht verpflichtet, übermittelte
                        oder gespeicherte fremde Informationen zu überwachen oder nach
                        Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
                        hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
                        Nutzung von Informationen nach den allgemeinen Gesetzen bleiben
                        hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab
                        dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
                        möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen
                        werde ich diese Inhalte umgehend entfernen.
                      </p>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel>
                    <v-expansion-panel-header class="font-weight-bold text-uppercase">
                      Haftung für Links
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <p>
                        Mein Angebot enthält Links zu externen Webseiten Dritter, auf
                        deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
                        diese fremden Inhalte auch keine Gewähr übernehmen. Für die
                        Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
                        oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
                        wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
                        überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
                        Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle
                        der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer
                        Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
                        Rechtsverletzungen werde ich derartige Links umgehend entfernen.
                      </p>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </v-main>

    <v-footer
      height="70"
      v-if="tab == 0 && !resultValid"
      :app="fixedFooter"
      :fixed="fixedFooter"
      color="red lighten-3"
      id="footer"
    >
      <v-card-text
        >Ergebnis kann nicht ermittelt werden, bevor die Eingaben vollständig
        sind.</v-card-text
      >
    </v-footer>

    <v-footer
      :height="$vuetify.breakpoint.xsOnly ? 250 : 200"
      v-if="tab == 0 && resultValid"
      :app="fixedFooter"
      :fixed="fixedFooter"
      color="light-blue lighten-3"
      id="footer"
    >
      <v-container fluid>
        <v-row v-if="$vuetify.breakpoint.xsOnly">
          <v-col class="font-weight-bold text-center" cols="12"
            >Vortestwahrscheinlichkeit {{ formatPercent(priorProbSymptoms) }}
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            sm="4"
            md="3"
            class="font-weight-bold mt-3"
            v-if="$vuetify.breakpoint.smAndUp"
          >
            Vortestwahrscheinlichkeit:
            <v-card class="mt-2 pt-7 pb-7 text-center text-h4">
              {{ formatPercent(priorProbSymptoms) }}
            </v-card>
          </v-col>
          <v-col cols="12" sm="8" md="9">
            <v-container fluid>
              <v-row>
                <v-col cols="4" md="2"> </v-col>
                <v-col cols="4" md="5"> Infiziert </v-col>
                <v-col cols="4" md="5"> Nicht infiziert </v-col>
              </v-row>
            </v-container>

            <v-card color="#FFDDDD">
              <v-container>
                <v-row>
                  <v-col cols="4" md="2" class="text-left font-weight-bold">
                    Test positiv:
                  </v-col>
                  <v-col cols="4" md="5">
                    <Info
                      :text="
                        formatPercent(updatedProbPos) +
                        ($vuetify.breakpoint.mdAndUp ? ' echt-positiv' : '')
                      "
                      :content="
                        'Bei einem positiven Testergebnis liegt zu ' +
                        formatPercent(updatedProbPos) +
                        ' wirklich eine Infektion vor (echt-positiv).'
                      "
                    />
                  </v-col>
                  <v-col cols="4" md="5">
                    <Info
                      :text="
                        formatPercent(1 - updatedProbPos) +
                        ($vuetify.breakpoint.mdAndUp ? ' falsch-positiv' : '')
                      "
                      :content="
                        'Bei einem positiven Testergebnis liegt zu ' +
                        formatPercent(1 - updatedProbPos) +
                        ' keine Infektion vor (falsch-positiv).'
                      "
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card>

            <v-card class="mt-2">
              <v-container>
                <v-row>
                  <v-col cols="4" md="2" class="text-left font-weight-bold">
                    Test negativ:
                  </v-col>
                  <v-col cols="4" md="5">
                    <Info
                      :text="
                        formatPercent(updatedProbNeg) +
                        ($vuetify.breakpoint.mdAndUp ? ' falsch-negativ' : '')
                      "
                      :content="
                        'Bei einem negativen Testergebnis liegt zu ' +
                        formatPercent(updatedProbNeg) +
                        ' trotzdem eine Infektion vor (falsch-negativ).'
                      "
                    />
                  </v-col>
                  <v-col cols="4" md="5">
                    <Info
                      :text="
                        formatPercent(1 - updatedProbNeg) +
                        ($vuetify.breakpoint.mdAndUp ? ' echt-negativ' : '')
                      "
                      :content="
                        'Bei einem negativen Testergebnis liegt zu ' +
                        formatPercent(1 - updatedProbNeg) +
                        ' wirklich keine Infektion vor (echt-negativ).'
                      "
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>

    <v-fab-transition v-if="tab == 0">
      <v-btn
        color="pink"
        v-show="!fixedFooter && !scrolledToBottom"
        fab
        dark
        fixed
        bottom
        right
        class="mb-8 mr-8"
        @click="$vuetify.goTo('#footer', { duration: 600, easing: 'easeInOutCubic' })"
      >
        <v-icon>mdi-chevron-triple-down</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-app>
</template>

<script>
import Info from "./components/Info.vue";

// 7 days should be enough, but sometimes the API returns fewer entries then requested
// also, there seems to be about 15% underreporting for the latest day, which we bypass by using
// data that is one day older
// const apiEndpoint = "https://api.corona-zahlen.org";
// const apiGermany = "/germany/history/incidence/8";
// const apiStates = "/states/history/incidence/8";
// const apiDistricts = "/districts/history/incidence/8";
const apiGermany = "/data/germany.json";
const apiStates = "/data/states.json";
const apiDistricts = "/data/districts.json";
const apiDistrictsFull = "/data/districts_full.json";
const apiTests = "/data/antigentests.json";

export default {
  name: "App",
  components: {
    Info,
  },
  data() {
    return {
      // showing any symtomps that might lead to PCR testing in Germany
      // increases odds by 18.8, which is based on some very rough
      // calculations based on data from the end of february
      anySymptomFactor: 18.8,

      // user selections
      selectedTests: [],
      compareTests: [],
      stateId: null,
      districtId: null,
      incidenceSource: "germany",
      riskProfilePrivate: "1.0",
      riskProfileProfessional: "0.8",
      additionalRiskString: "0",
      confidence: "avg",
      intermediate: false,
      studyId: "manufacturer",
      testsKind: "list",
      testFilterSelf: true,
      testFilterPei: false,
      testFilterStudies: false,
      zoomSpecificity: false,

      compareFilterSelf: false,
      compareFilterPei: false,
      compareFilterStudies: false,
      compareFilterSelected: false,

      scrolledToBottom: false,
      expandedPanelsCalc: [0, 1],
      expandedPanelsCompare: [1],
      expandedPanelsInfo: [0, 1],
      expandedPanelsImprint: [0, 1, 2, 3],
      tab: null,

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
      sensitivityString: "80,0 %",
      specificityString: "80,0 %",
      testFilter: "",

      // Data from own JSON
      tests: [],
      // Data from third party API JSON
      germany: null,
      states: [],
      districts: [],
      districtsFull: {},

      // not actually data
      percentFormatter: null,
      numberFormatter: null,

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
    };
  },
  created() {
    this.percentFormatter = new Intl.NumberFormat("de-DE", {
      style: "percent",
      minimumSignificantDigits: 2,
      maximumSignificantDigits: 4,
    });
    this.numberFormatter = new Intl.NumberFormat("de-DE", {
      style: "decimal",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    window.addEventListener("scroll", this.handleScroll);
    this.fetchData();
    //document.getElementById("rapidtest").classList.remove("hidden");
    //document.getElementById("loading").classList.add("hidden");
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    fetchData() {
      // local sorting function
      let byName = function (a, b) {
        // straigt from developer.mozilla.org
        var nameA = a.name.toUpperCase(); // Groß-/Kleinschreibung ignorieren
        var nameB = b.name.toUpperCase(); // Groß-/Kleinschreibung ignorieren
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      };
      /*let byId = function (a, b) {
                if (a.id < b.id) {
                    return -1;
                }
                if (a.id > b.id) {
                    return 1;
                }
                return 0;
            };*/

      fetch(apiTests)
        .then((response) => response.json())
        .then((data) => {
          this.tests = data;
          this.tests.sort(byName);
          // Disable tests which have no studies. This works, but usability is bad.
          // this.tests = this.tests.map(test => { if (Object.keys(test.studies).length == 0) { test.disabled = true; } return test; });
        })
        .catch((error) => console.log(error));
      fetch(apiGermany)
        .then((response) => response.json())
        .then((root) => {
          this.germany = root.data;
        })
        .catch((error) => console.log(error));
      fetch(apiStates)
        .then((response) => response.json())
        .then((root) => {
          this.states = Object.values(root.data).sort(byName);
        })
        .catch((error) => console.log(error));
      fetch(apiDistricts)
        .then((response) => response.json())
        .then((root) => {
          this.districts = Object.values(root.data).sort(byName);
        })
        .catch((error) => console.log(error));
      fetch(apiDistrictsFull)
        .then((response) => response.json())
        .then((root) => {
          this.districtsFull = root.data;
        })
        .catch((error) => console.log(error));
    },
    formatPercent(value) {
      // The percentFormatter will always display four significant digits. For very small values p,
      // percentFormatter.format(1-p) will already round up to "100%" while percentFormatter.format(p)
      // will still show 0.00000.. with many zeros, followed by four significant digits.
      // These small numbers are not practically useful, so let's round them down to 0 manually.
      // See the comment in bayesFactorPos() for a related issue.
      if (value < 0.0000015) return this.percentFormatter.format(0);
      else return this.percentFormatter.format(value);
    },
    formatNumber(value) {
      return this.numberFormatter.format(value);
    },
    getTestDisplayName(test) {
      if (test.shops && test.shops.length > 0) {
        return (
          test.id +
          " - " +
          test.name +
          " 🛒 (erhältlich bei " +
          test.shops.join(", ") +
          ")"
        );
      }
      return test.id + " - " + test.name;
    },
    getStudyDisplayName(study) {
      if (study.quadas) {
        return study.author + " (" + study.quadas + ")";
      } else if (study.author == "manufacturer") return "Herstellerangaben";
      else {
        return study.author;
      }
    },
    handleScroll() {
      this.scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
    },
    getStudyColor(study) {
      if (study.author == "manufacturer") return "#1976D2";
      if (study.quadas == "low concern") return "#388E3C";
      if (study.quadas == "intermediate concern") return "#FBC02D";
      if (study.quadas == "high concern") return "#D32F2F";
      return "black";
    },
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
    testMatchesCompareFilter(test) {
      if (this.compareFilterSelf && !test.selftest) return false;

      if (this.compareFilterPei && !test.pei) return false;

      if (
        this.compareFilterStudies &&
        !Object.values(test.studies).some((study) => study.author != "manufacturer")
      )
        return false;

      if (this.compareFilterSelected && !this.compareTests.includes(test)) return false;

      return true;
    },
    studyTitle(study) {
      if (study.author == "manufacturer") {
        if (study.comment && study.comment.length > 0)
          return "Angaben des Herstellers (" + study.comment + ")";
        else return "Angaben des Herstellers";
      } else {
        if (study.comment && study.comment.length > 0)
          return (
            "Studie von " +
            study.author +
            ", (" +
            study.comment +
            ", n = " +
            study.sampleSize +
            ", " +
            study.quadas +
            ")"
          );
        else
          return (
            "Studie von " +
            study.author +
            ", (n = " +
            study.sampleSize +
            ", " +
            study.quadas +
            ")"
          );
      }
    },
    getSpecificityX(val) {
      if (this.zoomSpecificity) {
        return Math.max(0, (val - 0.9) * 2000);
      } else {
        return val * 200;
      }
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
  },
  computed: {
    selectedTest() {
      if (this.selectedTests.length > 0) return this.selectedTests[0];
      else return null;
    },
    visibleTests() {
      if (!this.tests) return [];

      return this.tests.filter((test) => this.testMatchesFilter(test));
    },
    visibleCompareTests() {
      if (!this.tests) return [];

      return this.tests.filter((test) => this.testMatchesCompareFilter(test));
    },
    studies() {
      if (this.selectedTest) {
        return Object.values(this.selectedTest.studies);
      }
      return [];
    },
    sensitivity() {
      if (this.testsKind == "input") {
        return (
          parseFloat(this.sensitivityString.replace(",", ".").replace("%", "")) / 100.0
        );
      } else {
        if (this.selectedTest && this.selectedTest.studies[this.studyId]) {
          return this.selectedTest.studies[this.studyId].sensitivity[this.confidence];
        } else {
          return Number.NaN;
        }
      }
    },
    specificity() {
      if (this.testsKind == "input") {
        return (
          parseFloat(this.specificityString.replace(",", ".").replace("%", "")) / 100.0
        );
      } else {
        if (this.selectedTest && this.selectedTest.studies[this.studyId]) {
          return this.selectedTest.studies[this.studyId].specificity[this.confidence];
        } else {
          return Number.NaN;
        }
      }
    },
    selectedState() {
      if (this.stateId) {
        return this.states.filter((s) => s.id == this.stateId)[0];
      } else {
        return null;
      }
    },
    selectedDistrict() {
      if (this.districtId) {
        return this.districts.filter((d) => d.ags == this.districtId)[0];
      } else {
        return null;
      }
    },
    incidence() {
      if (this.incidenceSource == "input") {
        return parseFloat(this.incidenceString.replace(",", "."));
      } else if (this.incidenceSource == "germany" && this.germany) {
        return this.germany[6].weekIncidence;
      } else if (this.incidenceSource == "state" && this.selectedState) {
        return this.selectedState.history[6].weekIncidence;
      } else if (this.incidenceSource == "district" && this.selectedDistrict) {
        return this.selectedDistrict.history[6].weekIncidence;
      } else {
        return 0.0;
      }
    },
    incidencePrev() {
      if (this.incidenceSource == "input") {
        return parseFloat(this.incidenceString.replace(",", "."));
      } else if (this.incidenceSource == "germany" && this.germany) {
        return this.germany[0].weekIncidence;
      } else if (this.incidenceSource == "state" && this.selectedState) {
        return this.selectedState.history[0].weekIncidence;
      } else if (this.incidenceSource == "district" && this.selectedDistrict) {
        return this.selectedDistrict.history[0].weekIncidence;
      } else {
        return 0.0;
      }
    },
    incidenceAdjusted() {
      // see https://www.microcovid.org/paper/7-basic-method step 3
      let delayFactor = this.incidence / this.incidencePrev;
      if (delayFactor > 2.0) delayFactor = 2.0;
      let underReportingFacotr = 5.0; // estimated to be between 4 and 6 by rki, see
      // https://www.rki.de/DE/Content/Infekt/EpidBull/Archiv/2020/Ausgaben/50_20.pdf?__blob=publicationFile
      // on page 3
      return this.incidence * underReportingFacotr * delayFactor;
    },
    fpr() {
      return 1.0 - this.specificity;
    },
    fnr() {
      return 1.0 - this.sensitivity;
    },
    bayesFactorPos() {
      // If the false positive rate is 0, the bayes facotr would be infinity. This will break other computetions later.
      // Using a hight, finite value kinda fixes it. We used to return 9999 here, which was so far from infinity that
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
    fixedFooter() {
      return this.$screen.height > 750;
    },
    resultValid() {
      return (
        !Number.isNaN(this.priorProbSymptoms) &&
        !Number.isNaN(this.sensitivity) &&
        !Number.isNaN(this.specificity)
      );
    },
    testSelectSuccess() {
      if (!Number.isNaN(this.sensitivity) && !Number.isNaN(this.specificity))
        return (
          this.formatPercent(this.sensitivity) +
          " Sensitivität, " +
          this.formatPercent(this.specificity) +
          " Spezifität"
        );
      else return null;
    },
    testSelectError() {
      if (!Number.isNaN(this.sensitivity) && !Number.isNaN(this.specificity)) return null;

      if (!this.selectedTest) return "Bitte einen Test auswählen";

      return "Keine Daten für diesen Test verfügbar";
    },
    tabs() {
      if (this.$vuetify.breakpoint.xsOnly)
        return [
          { id: "calc", title: "Rechner" },
          { id: "compare", title: "Vergleich" },
          { id: "info", title: "Infos" },
          { id: "imprint", title: "Impressum" },
        ];
      else
        return [
          { id: "calc", title: "Rechner" },
          { id: "compare", title: "Tests vergleichen" },
          { id: "info", title: "Weitere Infos" },
          { id: "imprint", title: "Impressum / Datenschutz" },
        ];
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
        ];
    },
    compareHeaders() {
      return [
        { text: "Hersteller und Name", value: "manufacturer_name" },
        {
          text: "Sensitivität (0% bis 100%)",
          value: "sensitivity",
          sortable: false,
          width: "210px",
        },
        {
          text:
            "Spezifität" + (this.zoomSpecificity ? " (90% bis 100%)" : " (0% bis 100%)"),
          value: "specificity",
          sortable: false,
          width: "210px",
        },
      ];
    },
    districtsChoices() {
      if (this.districts.length == 0 || this.districtsFull == {}) {
        return [];
      }

      return this.districts.map((district) => {
        district.displayName = this.districtsFull[district.ags].county;
        return district;
      });
    },
  },
};
</script>

<style>
.v-messages {
  font-size: 16px !important;
}

.v-messages__message {
  line-height: 19px !important;
}

.hidden {
  display: none;
}

.v-data-table td {
  padding: 0 8px !important;
}

.v-list-item__subtitle,
.v-list-item__title {
  overflow: auto !important;
  text-overflow: unset !important;
  white-space: normal !important;
}
</style>
