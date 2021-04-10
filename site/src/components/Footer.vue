<template>
  <v-footer
    :height="resultData.valid ? ($vuetify.breakpoint.xsOnly ? 250 : 200) : 70"
    :app="fixedFooter"
    :fixed="fixedFooter"
    :color="resultData.valid ? 'light-blue lighten-3' : 'red lighten-3'"
    id="footer"
  >
    <v-card-text v-if="!resultData.valid"
      >Ergebnis kann nicht ermittelt werden, bevor die Eingaben vollständig
      sind.</v-card-text
    >
    <v-container fluid v-if="resultData.valid">
      <v-row v-if="$vuetify.breakpoint.xsOnly">
        <v-col class="font-weight-bold text-center mb-0 pb-0" cols="12"
          >Vortestwahrscheinlichkeit {{ resultData.prior | formatPercent }}
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
            {{ resultData.prior | formatPercent }}
          </v-card>
        </v-col>
        <v-col cols="12" sm="8" md="9">
          <v-container fluid>
            <v-row no-gutters>
              <v-col cols="4" md="2"> </v-col>
              <v-col cols="4" md="5"> Infiziert </v-col>
              <v-col cols="4" md="5"> Nicht infiziert </v-col>
            </v-row>
          </v-container>

          <v-card color="#FFDDDD">
            <v-container>
              <v-row no-gutters>
                <v-col cols="4" md="2" class="text-left font-weight-bold">
                  {{ $vuetify.breakpoint.mdAndUp ? "Test positiv:" : "positiv" }}
                </v-col>
                <v-col cols="4" md="5">
                  <Info
                    :icon="$vuetify.breakpoint.mdAndUp ? 'info' : 'none'"
                    :text="
                      $options.filters.formatPercent(resultData.probPos) +
                      ($vuetify.breakpoint.mdAndUp ? ' echt-positiv' : '')
                    "
                    :content="
                      'Bei einem positiven Testergebnis liegt zu ' +
                      $options.filters.formatPercent(resultData.probPos) +
                      ' wirklich eine Infektion vor (echt-positiv).'
                    "
                  />
                </v-col>
                <v-col cols="4" md="5">
                  <Info
                    :icon="$vuetify.breakpoint.mdAndUp ? 'info' : 'none'"
                    :text="
                      $options.filters.formatPercent(1 - resultData.probPos) +
                      ($vuetify.breakpoint.mdAndUp ? ' falsch-positiv' : '')
                    "
                    :content="
                      'Bei einem positiven Testergebnis liegt zu ' +
                      $options.filters.formatPercent(1 - resultData.probPos) +
                      ' keine Infektion vor (falsch-positiv).'
                    "
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card>

          <v-card class="mt-2">
            <v-container>
              <v-row no-gutters>
                <v-col cols="4" md="2" class="text-left font-weight-bold">
                  {{ $vuetify.breakpoint.mdAndUp ? "Test negativ:" : "negativ" }}
                </v-col>
                <v-col cols="4" md="5">
                  <Info
                    :icon="$vuetify.breakpoint.mdAndUp ? 'info' : 'none'"
                    :text="
                      $options.filters.formatPercent(resultData.probNeg) +
                      ($vuetify.breakpoint.mdAndUp ? ' falsch-negativ' : '')
                    "
                    :content="
                      'Bei einem negativen Testergebnis liegt zu ' +
                      $options.filters.formatPercent(resultData.probNeg) +
                      ' trotzdem eine Infektion vor (falsch-negativ).'
                    "
                  />
                </v-col>
                <v-col cols="4" md="5">
                  <Info
                    :icon="$vuetify.breakpoint.mdAndUp ? 'info' : 'none'"
                    :text="
                      $options.filters.formatPercent(1 - resultData.probNeg) +
                      ($vuetify.breakpoint.mdAndUp ? ' echt-negativ' : '')
                    "
                    :content="
                      'Bei einem negativen Testergebnis liegt zu ' +
                      $options.filters.formatPercent(1 - resultData.probNeg) +
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
</template>

<script>
import Info from "./Info.vue";

export default {
  name: "Footer",
  components: {
    Info,
  },
  props: {
    result: Object,
  },
  data: function () {
    return {
      resultData: this.result,
    };
  },
  computed: {
    fixedFooter() {
      return this.$screen.height > 750;
    },
  },
};
</script>
<style scoped></style>
