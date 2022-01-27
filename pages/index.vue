<template>
    <div class="container-fluid mt-3">
        <div class="row">
          <div class="col-md-12">
            <b-jumbotron
              fluid
              header="Sistema 19664"
              lead="Aplicación web para la gestión de profesionales ligados a la Ley N° 19664.">
              <b-button variant="primary" to="/profesionales" class="btn btn-primary btn-user">Ver profesionales</b-button>
            </b-jumbotron>
          </div>
        </div>
    </div>
</template>

<script>
export default {
  middleware: 'auth'
}
</script>

<style>

</style>
