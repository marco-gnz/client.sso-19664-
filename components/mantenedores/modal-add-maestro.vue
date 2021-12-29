<template>
  <div>
    <b-modal id="modal-add-mantenedor" size="lg" title="Ingresar nuevo dato maestro" ok-only>
      <div class="row pt-4 d-flex justify-content-center">
        <div class="col-md-4">
          <label>Tipo de dato maestro</label>
          <select class="form-control">
            <option value="" selected disabled>-- Seleccione tipo --</option>
            <option value="">Red hospitalaria</option>
            <option value="">Establecimiento</option>
            <option value="">Situación actual</option>
            <option value="">Etapa</option>
            <option value="">Especialidad</option>
            <option value="">Subespecialidad</option>
            <option value="">Causal de interrupción</option>
            <option value="">Centro formador (Universidad)</option>
            <option value="">Grado de complejidad</option>
            <option value="">Unidad</option>
          </select>
        </div>
        <div class="col-md-4">
          <label>¿Código SIRH?</label>
          <input type="number" class="form-control" placeholder="Ingrese código de SIRH">
        </div>
        <div class="col-md-4">
          <label>Nombre o descripción de maestro</label>
          <input type="text" class="form-control" placeholder="Ingrese nombre o descripción">
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
