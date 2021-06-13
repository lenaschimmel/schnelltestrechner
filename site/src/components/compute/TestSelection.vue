<template>
  <v-expansion-panel>
    <v-expansion-panel-header
      class="font-weight-bold text-uppercase"
      color="blue lighten-3"
    >
      Test-Auswahl
    </v-expansion-panel-header>
    <v-expansion-panel-content color="blue lighten-5" class="pt-4">
      <p>
        Für die Berechnung der Test-Zuverlässigkeit müssen dessen Sensititvität und
        Spezifität bekannt sein. Für die allermeisten Tests liegen die Daten bereits vor,
        so dass nur der Test ausgewählt werden muss.
      </p>

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
                    v-for="circle in getDataCircles(item)"
                    :key="item.id + '_s_' + circle.color"
                    small
                    :color="circle.color"
                  >
                    {{ circle.icon }}
                  </v-icon>
                </div>
              </template>
              <span>{{ getDataText(item) }}</span>
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
                    v-for="circle in getDataCircles(item)"
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
              <span>{{ getDataText(item) + " - " + getAttribText(item) }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.manufacturer_name="{ item }">
            {{ item.manufacturer + " - " + item.name }}
          </template>
        </v-data-table>
      </v-card>

      <v-alert
        icon="mdi-alert"
        dense
        outlined
        type="warning"
        text
        class="mt-4"
        v-if="this.selectedTest == null"
      >
        Bitte einen Test auswählen oder eigene Daten zu Sensitivität und Spezifität
        eingeben.
      </v-alert>

      <p class="mt-4" v-if="selectedTest && selectedTest.instructionsUrl">
        <a target="_blank" :href="selectedTest.instructionsUrl"
          >Link zur Packungsbeilage</a
        >
      </p>

      <p class="mt-4" v-if="selectedTest && selectedTest.distributors.length > 0 && selectedTest.distributors.length < 4">
        {{ selectedTest.distributors.length }} Distributor(en):
        <ul>
        <li v-for="dist in selectedTest.distributors" :key="dist">{{ dist }}</li>
        </ul>
      </p>
      <p class="mt-4" v-if="selectedTest && selectedTest.distributors.length >= 4">
        {{ selectedTest.distributors.length }} Distributoren
        <Info type="Dialog" title="Distributoren">
          <ul>
            <li v-for="dist in selectedTest.distributors" :key="dist">{{ dist }}</li>
          </ul>
        </Info>
      </p>

      <p class="mt-4" v-if="selectedTest && selectedTest.tradename.length > 1 && selectedTest.tradename.length < 4">
        {{ selectedTest.tradename.length }} Alternative Handelsnamen:
        <ul>
        <li v-for="name in selectedTest.tradename" :key="name">{{ name }}</li>
        </ul>
      </p>
      <p class="mt-4" v-if="selectedTest && selectedTest.tradename.length >= 4">
        {{ selectedTest.tradename.length }} Alternative Handelsnamen
        <Info type="Dialog" title="Alternative Handelsnamen">
          <ul>
            <li v-for="name in selectedTest.tradename" :key="name">{{ name }}</li>
          </ul>
        </Info>
      </p>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script>
import Info from "../Info.vue";
import { getSampleIcons, getSampleText } from "../../helpers.js";

export default {
  components: {
    Info,
  },
  name: "TestSelection",
  props: {
    loadedData: Object,
    detailedMode: Boolean,
  },
  data: () => ({
    selectedTests: [],
    testFilterSelf: true,
    testFilterPei: false,
    testFilterStudies: false,
    testFilter: "",
  }),
  methods: {
    getSampleIcons,
    getSampleText,
    getDataCircles(test) {
      let studiesObject = test.studies
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
        array.push({ 
          icon: "mdi-numeric-" + numMax(manCount) + "-circle",
          color: "blue darken-2"
           });
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
      if (test.logisticRegression)
        array.push({ icon: "mdi-chart-bell-curve-cumulative", color: "orange darken-2" });


      if (array.length == 0)
        array.push({ icon: "mdi-numeric-0-circle-outline", color: "grey darken-2" });

      return array;
    },
    getDataText(test) {
      let studiesObject = test.studies;
      let studies = studiesObject ? Object.values(studiesObject) : [];
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
      if (test.logisticRegression) text += "Teil des Sensitivitäts-Vergleichs von Scheiblauer et.al. (50%-Grenze CT " + Math.round(test.logisticRegression.test*10)/10 + ")";

      if (text == "") text = "Keine Daten vorhanden.";

      return text;
    },
    getAttribCircles(test) {
      let array = [];
      if (!test.selftest) array.push({ icon: "mdi-doctor", color: "red darken-2" });
      if (test.selftest) array.push({ icon: "mdi-account", color: "green darken-2" });
      if (test.pei) array.push({ icon: "mdi-certificate", color: "blue darken-2" });
      if (test.instructionsUrl)
        array.push({ icon: "mdi-map-check-outline", color: "pink darken-2" });
      if (test.shops && test.shops.length > 0)
        array.push({ icon: "mdi-cart", color: "purple darken-2" });
      
      return array;
    },
    getAttribText(test) {
      let text = "";

      if (!test.selftest) text += "Profi-Test. ";
      if (test.selftest) text += "Selbst-Test. ";
      if (test.pei) text += "Vom PEI evaluiert. ";
      if (test.instructionsUrl) text += "Packungsbeilage verlinkt. ";

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
  computed: {
    selectedTest() {
      if (this.selectedTests.length > 0) return this.selectedTests[0];
      else return null;
    },
    visibleTests() {
      if (!this.loadedData.tests) return [];

      return this.loadedData.tests.filter((test) => this.testMatchesFilter(test));
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
          { text: "Probe", value: "sampledings", sortable: false },
        ];
    },
  },
  watch: {
    selectedTest: function (newVal) {
      this.$emit("input", newVal);
    },
  },
};
</script>
