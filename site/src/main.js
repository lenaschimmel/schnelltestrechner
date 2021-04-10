import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueScreen from 'vue-screen';

Vue.config.productionTip = false
Vue.use(VueScreen);

var percentFormatter = new Intl.NumberFormat("de-DE", {
  style: "percent",
  minimumSignificantDigits: 2,
  maximumSignificantDigits: 3,
});

var numberFormatter = new Intl.NumberFormat("de-DE", {
  style: "decimal",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

Vue.filter('formatPercent', function (value) {
  if (!value) return ''
  if (value < 0.0000015) return percentFormatter.format(0);
  else return percentFormatter.format(value);
})


Vue.filter('formatNumber', function (value) {
  if (!value) return ''
  return numberFormatter.format(value);
})

Vue.filter('studyTitle', function (study) {
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
})

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
