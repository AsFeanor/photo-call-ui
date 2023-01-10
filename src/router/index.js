import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
    {
        path: "",
        component: () => import("@/components/HomePage.vue"),
        beforeEnter(to, from, next){
            if (store.getters.isAuthenticated) {
                next()
            }else {
                next('/login')
            }
        }
    },
    {
        path: "/attendance",
        component: () => import('@/components/TheAttendance.vue'),
        beforeEnter(to, from, next){
            if (store.getters.isAuthenticated) {
                next()
            }else {
                next('/login')
            }
        },
    },
    {
        path: "/attendance-list",
        component:  () => import('@/components/TheAttendanceList.vue'),
        beforeEnter(to, from, next){
            if (store.getters.isAuthenticated) {
                next()
            }else {
                next('/login')
            }
        }
    },
    {
        path: "/login",
        name: "TheLogin",
        component:  () => import('@/components/Auth/TheLogin.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router