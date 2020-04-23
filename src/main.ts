import './class-component-hooks';

import Vue from 'vue';
import router from './routes';
import rootStore from './store';
import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  router,
  store: rootStore,
}).$mount('#app');
