<template>
  <div class="container-fluid mt-5">
    <div class="text-center">
        <div class="row">
          <div class="col-md-12">
            <div class="error mx-auto" :data-text="error.statusCode">{{error.statusCode}}</div>
            <p class="lead text-gray-800 mb-5">Ocurrio un error - {{ error.statusCode }}</p>
            <p class="text-gray-500 mb-0">Página no encontrada...</p>
          </div>
        </div>
        <div class="row pt-lg-5">
          <div class="col-md-12">
            <NuxtLink to="/"><button type="submit" class="btn btn-primary btn-user">← Volver al inicio</button></NuxtLink>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['error'],
    layout: 'error' // you can set a custom layout for the error page
  }
</script>
