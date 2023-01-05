import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from "@/router";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        jwtToken: "",
        user_name: '',
        apiUrl: 'http://localhost:3000',
    },
    mutations: {
        setToken(state, jwtToken) {
            state.jwtToken = jwtToken
        },
        setUser(state, userName) {
            state.user_name = userName
        },
        clearToken(state) {
            state.jwtToken = ""
        },
        clearUser(state) {
            state.user_name = ""
        },
    },
    actions: {
        initAuth({ commit }) {
            let jwtToken = localStorage.getItem('jwtToken');
            let user_name = localStorage.getItem('user_name');
            if (jwtToken && user_name) {
                commit('setToken', jwtToken);
                commit('setUser', user_name);
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
                    console.log(response.data);
                    commit('setToken', response.data.accessToken);
                    commit('setUser', response.data.accessToken);
                    localStorage.setItem('jwtToken', response.data.accessToken);
                    localStorage.setItem('user_name', response.data.user_name);
                })
                .catch((e) => console.log(e));
        },
        logout({ commit }) {
            commit('clearToken');
            commit('clearID');
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('user_name');
            router.replace('/login')
        },
    },
    getters: {
        isAuthenticated(state) {
            if (state.jwtToken) {
                return state.jwtToken !== ""
            }else {
                return false
            }
        },
    },
})