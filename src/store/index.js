import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from "@/router";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        jwtToken: "",
        user_name: '',
        is_super_user: null,
        email: "",
        apiUrl: 'http://localhost:3000',
    },
    mutations: {
        setToken(state, jwtToken) {
            state.jwtToken = jwtToken
        },
        setUser(state, userName) {
            state.user_name = userName
        },
        setSuperUser(state, isSuperUser) {
            state.is_super_user = isSuperUser
        },
        setEmail(state, email) {
            state.email = email
        },
        clearToken(state) {
            state.jwtToken = ""
        },
        clearUser(state) {
            state.user_name = ""
        },
        clearSuperUser(state) {
            state.is_super_user = null
        },
        clearEmail(state) {
            state.email = ""
        }
    },
    actions: {
        initAuth({ commit }) {
            let jwtToken = localStorage.getItem('jwtToken');
            let user_name = localStorage.getItem('user_name');
            let super_user = localStorage.getItem('super_user');
            let email = localStorage.getItem('email');
            if (jwtToken && user_name) {
                commit('setToken', jwtToken);
                commit('setUser', user_name);
                commit('setSuperUser', super_user);
                commit('setEmail', email);
                router.push('/').catch(()=>{});
            }else {
                router.push('/login').catch(()=>{});
                return false;
            }
        },
        register(authData) {
            return axios.post('http://laravelapi.test/api/user-create', {
                name: authData.name,
                email: authData.email,
                password: authData.password})
                .then((response) => {
                    console.log(response.data);
                })
                .catch((e) => console.log(e));
        },
        login({ commit }, authData) {
            return axios.post('http://localhost:3000/lecturers/login',
                { email: authData.email, password: authData.password })
                .then((response) => {
                    commit('setToken', response.data.accessToken);
                    commit('setUser', response.data.user_name);
                    commit('setSuperUser', response.data.isSuperUser);
                    commit('setEmail', response.data.email);
                    localStorage.setItem('jwtToken', response.data.accessToken);
                    localStorage.setItem('user_name', response.data.user_name);
                    localStorage.setItem('super_user', response.data.isSuperUser);
                    localStorage.setItem('email', response.data.email);
                })
                .catch((e) => console.log(e));
        },
        logout({ commit }) {
            commit('clearToken');
            commit('clearUser');
            commit('clearSuperUser');
            commit('clearEmail');
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('user_name');
            localStorage.removeItem('super_user');
            localStorage.removeItem('email');
            router.push('/login')
        },
    },
    getters: {
        isAuthenticated(state) {
            if (state.jwtToken) {
                return state.jwtToken !== ""
            } else {
                return false
            }
        },
    },
})