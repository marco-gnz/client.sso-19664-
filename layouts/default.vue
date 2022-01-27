<template>
  <div>
    <Navbar />
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
export default {
  components: { Navbar, Footer }
}
</script>

<style>
  html{
      font-size: 12px;
      height: 100%;
      position: relative;
  }
  body {
      margin: 0;
      margin-bottom: 40px;
  }
</style>
