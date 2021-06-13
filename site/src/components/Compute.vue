<template>
  <v-container class="fill-height">
    <v-row class="fill-height">
      <v-col cols="12" class="fill-height">
        <Disclaimer/>

        <v-expansion-panels multiple class="mb-8" v-model="expandedPanelsCalc">
          <Introduction/>
          <TestSelection
          :loadedData="loadedData"
          :detailedMode="detailedMode"
          v-model="selectedTest"
          />
          <DataSelection
          :detailedMode="detailedMode"
          :selectedTest="selectedTest"
          v-on:sensitivity="sensitivity = $event"
          v-on:specificity="specificity = $event"
          />

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
import Disclaimer from "./compute/Disclaimer.vue";
import Introduction from "./compute/Introduction.vue";
import TestSelection from "./compute/TestSelection.vue";
import DataSelection from "./compute/DataSelection.vue";

export default {
  components: {
    Info,
    Disclaimer,
    Introduction,
    TestSelection,
    DataSelection,
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

    sensitivity: null,
    specificity: null,

    // user selections
    selectedTest: null,
    stateId: null,
    districtId: null,
    incidenceSource: "germany",
    riskProfilePrivate: "1.0",
    riskProfileProfessional: "0.8",
    additionalRiskString: "0",
    expandedPanelsCalc: [0, 1, 2],

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

      // new data suggests it to be about 1.8 see https://www.rki.de/DE/Content/Gesundheitsmonitoring/Studien/lid/Ergebnisse.pdf?__blob=publicationFile
      return 1.8;
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
        !Number.isNaN(this.specificity) &&
        this.priorProbSymptoms != null &&
        this.sensitivity != null &&
        this.specificity != null
      );
    },
  },
};
</script>
<style scoped></style>
