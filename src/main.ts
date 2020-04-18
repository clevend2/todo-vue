import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import router from './routes';
import rootStore from './store';

Vue.config.productionTip = false;

Vue.use(Vuex);

new Vue({
  render: (h) => h(App),
  router,
  store: rootStore,
}).$mount('#app');
