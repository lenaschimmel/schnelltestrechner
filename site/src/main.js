import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueScreen from 'vue-screen';

Vue.config.productionTip = false
Vue.use(VueScreen);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
