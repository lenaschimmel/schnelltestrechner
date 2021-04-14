<template>
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
                Hier kann die Sensititvität und Spezifität von Schnelltests grafisch
                verglichen werden.
              </p>

              <p>
                Die Filterung funktioniert grundsätzlich wie im Testrechner. Zusätzlich
                können beliebig viele Tests mit der Checkbox in der linken Spalte für
                einen engeren Vergleich ausgewählt werden. Wenn anschließend der Filter
                "Ausgewählte" aktiviert wird, werden nur noch diese angezeigt.
              </p>

              <p>
                Die Grafiken für Sensititvität und Spezifität bilden jeweils einen Bereich
                von 0% (links) bis 100% (rechts) ab. Jede Zeile steht für eine
                Datenquelle, also die Herstellerangaben oder eine Studie aus der
                <a
                  href="https://www.klinikum.uni-heidelberg.de/diagnostics-global-health"
                  target="_blank"
                  >Liste wissenschaftlicher Studien</a
                >
                der Uni Heidelberg. Kurze, vertikale Linie gibt den Mittelwert an, die
                längere, horizontale Linie das 95%-Konfidenzintervall.
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
                Mit der Maus kann über den einzelnen Zeilen gehovert werden, um die
                Autor_innen der Studie und die exakten Werte in einem Tooltip anzuzeigen.
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
                                $options.filters.formatPercent(study.sensitivity.avg) +
                                " (95% CI: " +
                                $options.filters.formatPercent(study.sensitivity.min) +
                                " bis " +
                                $options.filters.formatPercent(study.sensitivity.max) +
                                ") - " +
                                $options.filters.studyTitle(study)
                              }}
                            </title>
                          </rect>
                          <line
                            v-if="
                              study.sensitivity.min &&
                              study.sensitivity.max &&
                              !Number.isNaN(study.sensitivity.min) &&
                              !Number.isNaN(study.sensitivity.max)
                            "
                            :key="study.id + '_sp2'"
                            :x1="study.sensitivity.min * 200"
                            :x2="study.sensitivity.max * 200"
                            :y1="10 + i * 20"
                            :y2="10 + i * 20"
                            :style="'stroke:' + getStudyColor(study) + ';stroke-width:2'"
                          />
                          <line
                            v-if="
                              study.sensitivity.avg &&
                              !Number.isNaN(study.sensitivity.avg)
                            "
                            :key="study.id + '_sp3'"
                            :x1="study.sensitivity.avg * 200"
                            :x2="study.sensitivity.avg * 200"
                            :y1="5 + i * 20"
                            :y2="15 + i * 20"
                            :style="'stroke:' + getStudyColor(study) + ';stroke-width:2'"
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
                                $options.filters.formatPercent(study.specificity.avg) +
                                " (95% CI: " +
                                $options.filters.formatPercent(study.specificity.min) +
                                " bis " +
                                $options.filters.formatPercent(study.specificity.max) +
                                ") - " +
                                study.author +
                                ", n = " +
                                (study.sampleSize || "unbekannt")
                              }}
                            </title>
                          </rect>
                          <line
                            v-if="
                              study.specificity.min &&
                              study.specificity.max &&
                              !Number.isNaN(study.specificity.min) &&
                              !Number.isNaN(study.specificity.max)
                            "
                            :key="study.id + '_sp2'"
                            :x1="getSpecificityX(study.specificity.min)"
                            :x2="getSpecificityX(study.specificity.max)"
                            :y1="10 + i * 20"
                            :y2="10 + i * 20"
                            :style="'stroke:' + getStudyColor(study) + ';stroke-width:2'"
                          />
                          <line
                            v-if="
                              study.specificity.avg &&
                              !Number.isNaN(study.specificity.avg)
                            "
                            :key="study.id + '_sp3'"
                            :x1="getSpecificityX(study.specificity.avg)"
                            :x2="getSpecificityX(study.specificity.avg)"
                            :y1="5 + i * 20"
                            :y2="15 + i * 20"
                            :style="'stroke:' + getStudyColor(study) + ';stroke-width:2'"
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
</template>

<script>
export default {
  name: "Compare",
  props: {
    loadedData: Object,
  },
  data: () => ({
    expandedPanelsCompare: [1],
    compareTests: [],
    compareFilterSelf: false,
    compareFilterPei: false,
    compareFilterStudies: false,
    compareFilterSelected: false,
    zoomSpecificity: false,
  }),
  methods: {
    getStudyColor(study) {
      if (study.author == "manufacturer") return "#1976D2";
      if (study.quadas == "low concern") return "#388E3C";
      if (study.quadas == "intermediate concern") return "#FBC02D";
      if (study.quadas == "high concern") return "#D32F2F";
      return "black";
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
    getSpecificityX(val) {
      if (this.zoomSpecificity) {
        return Math.max(0, (val - 0.9) * 2000);
      } else {
        return val * 200;
      }
    },
  },
  computed: {
    visibleCompareTests() {
      if (!this.loadedData.tests) return [];

      return this.loadedData.tests.filter((test) => this.testMatchesCompareFilter(test));
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
  },
};
</script>
<style scoped></style>
