import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import routes from './routes';

import dayjs from 'dayjs';

import './assets/main.css';

Vue.use(VueRouter);
Vue.use(dayjs);

const router = new VueRouter({
  routes,
});

new Vue({
  router,
  el: '#app',
  render: h => h(App),
})
