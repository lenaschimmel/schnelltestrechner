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
      <v-switch v-model="detailedMode" label="Erweiterte Ansicht" hide-details></v-switch>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            href="https://twitter.com/Testrechner"
            target="_blank"
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
            target="_blank"
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
          <Compute :loadedData="loadedData" :result="result" :detailedMode="detailedMode" />
        </v-tab-item>

        <v-tab-item>
          <Compare :loadedData="loadedData" />
        </v-tab-item>

        <v-tab-item>
          <Information />
        </v-tab-item>

        <v-tab-item>
          <Imprint />
        </v-tab-item>
      </v-tabs-items>
    </v-main>

    <v-fab-transition v-if="tab == 0">
      <v-btn
        color="pink"
        v-show="this.$screen.height <= 750 && !scrolledToBottom"
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

    <Footer v-if="tab == 0" :result="result" />
  </v-app>
</template>

<script>
import Compute from "./components/Compute.vue";
import Compare from "./components/Compare.vue";
import Information from "./components/Information.vue";
import Imprint from "./components/Imprint.vue";
import Footer from "./components/Footer.vue";

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
    Compute,
    Compare,
    Information,
    Imprint,
    Footer,
  },
  data() {
    return {
      loadedData: {
        tests: [],
        germany: null,
        states: [],
        districts: [],
        districtsFull: {},
        date: null
      },
      result: {
        prior: NaN,
        probNeg: NaN,
        probPos: NaN,
        valid: false,
      },
      tab: null,
      detailedMode: false,
      scrolledToBottom: false,
    };
  },
  created() {
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
          this.loadedData.tests = data;
          this.loadedData.tests.sort(byName);
          // Disable tests which have no studies. This works, but usability is bad.
          // this.tests = this.tests.map(test => { if (Object.keys(test.studies).length == 0) { test.disabled = true; } return test; });
        })
        .catch((error) => console.log(error));
      fetch(apiGermany)
        .then((response) => response.json())
        .then((root) => {
          this.loadedData.germany = root.data;
          this.loadedData.date = new Date(Date.parse(root.meta.lastUpdate));
        })
        .catch((error) => console.log(error));
      fetch(apiStates)
        .then((response) => response.json())
        .then((root) => {
          this.loadedData.states = Object.values(root.data).sort(byName);
        })
        .catch((error) => console.log(error));
      fetch(apiDistricts)
        .then((response) => response.json())
        .then((root) => {
          this.loadedData.districts = Object.values(root.data).sort(byName);
        })
        .catch((error) => console.log(error));
      fetch(apiDistrictsFull)
        .then((response) => response.json())
        .then((root) => {
          this.loadedData.districtsFull = root.data;
        })
        .catch((error) => console.log(error));
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
  },
  computed: {
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
