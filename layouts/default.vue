<template>
  <div>
    <Navbar />
    <Nuxt />
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
export default {
  components: { Navbar}
}
</script>

<style>
  html{
      font-size: 11px;
      min-height: 100%;
      position: relative;
  }
  body {
      margin: 0;
      margin-bottom: 40px;
  }
</style>
