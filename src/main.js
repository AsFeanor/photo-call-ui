import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import routes from './routes';

import './assets/main.css';

Vue.use(VueRouter)

const router = new VueRouter({
  routes,
});

new Vue({
  router,
  el: '#app',
  render: h => h(App),
})
