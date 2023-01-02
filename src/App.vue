<template>
  <div class="app-container">
    <the-navbar/>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
    TheNavbar: () => import('@/components/TheNavbar.vue'),
  }
}
</script>

<style>
.app-container {
  width: 100vw;
  height: 100vh;
}
</style>