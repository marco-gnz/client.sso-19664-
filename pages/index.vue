<template>
    <div>
      <b-jumbotron
      fluid
      header="Ley Médica"
      lead="Aplicación web para la gestión de profesionales ligados a la Ley N° 19664.">
      <b-button variant="primary" to="/profesionales" class="btn btn-primary btn-user">Ver profesionales</b-button>
      </b-jumbotron>
    </div>
</template>

<script>
export default {
  middleware: 'auth'
}
</script>

<style>

</style>
