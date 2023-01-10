<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <router-link class="navbar-brand" to="/">Photo-Call</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
        </li>
      </ul>
      <div v-if="$store.getters.isAuthenticated">
        <span class="navbar-text mr-3" v-if="$store && $store.state && $store.state.user_name">
          {{ $store.state.user_name }}
        </span>
        <button class="btn btn-outline-secondary text-light" @click="logOut">LogOut</button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "TheNavbar",
  computed: {
    userName() {
      return localStorage.getItem('user_name');
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch('logout');
    }
  }
}
</script>

<style scoped>

</style>