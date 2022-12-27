import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import routes from './routes';

import dayjs from 'dayjs';
import VueToast from 'vue-toast-notification';import 'vue-toast-notification/dist/theme-sugar.css';

import './assets/main.css';

Vue.use(VueRouter);
Vue.use(dayjs);
Vue.use(VueToast);

const router = new VueRouter({
  routes,
});

new Vue({
  router,
  el: '#app',
  render: h => h(App),
})
