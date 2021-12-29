<template>
  <div class="container-fluid mt-5">
    <div class="row justify-content-center">
      <div class="col-xl-10 col-lg-12 col-md-9">
        <div class="card o-hidden border-0 shadow-lg my-5">
          <div class="card-body p-0">
            <div class="row">
              <div class="col-lg-6 d-none d-lg-block bg-login-image"></div>
              <div class="col-lg-6">
                <div class="p-5">
                  <div class="text-center">
                      <h1 v-if="error.statusCode === 404" class="h4 text-gray-900 mb-4">{{error.statusCode}} - Página no encontrada</h1>
                      <h1 v-else class="h4 text-gray-900 mb-4">Ocurrió un error - {{ error.statusCode }}</h1>
                  </div>
                  <NuxtLink to="/"><button type="submit" class="btn btn-primary btn-user btn-block">Volver al inicio</button></NuxtLink>
                </div>
              </div>
            </div>
          </div>
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
