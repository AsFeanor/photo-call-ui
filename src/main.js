import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import dayjs from 'dayjs';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import HelperMixin from "@/mixins/HelperMixin.js";

import './assets/main.css';

Vue.use(dayjs);
Vue.use(VueToast);
Vue.use(HelperMixin);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
