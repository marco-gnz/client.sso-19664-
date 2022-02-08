<template>
  <div>
    <b-modal id="modal-show-destinacion" size="lg" title="Información extra sobre destinación" hide-footer>
      <template v-if="destinacion != '' || destinacion != null">
        <div class="row">
            <div class="col-md-6">
                <p><strong>Periodo destinación</strong>: {{DateTime.fromISO(destinacion.inicio_periodo).toFormat('dd LLLL yyyy')}} / {{DateTime.fromISO(destinacion.termino_periodo).toFormat('dd LLLL yyyy')}}</p>
                <p v-if="destinacion.diferencia"><strong>En días</strong>: {{ `${destinacion.diferencia.years > 1 ? `${destinacion.diferencia.years} años` : `${destinacion.diferencia.years} año`}, ${destinacion.diferencia.months > 1 ? `${destinacion.diferencia.months} meses` : `${destinacion.diferencia.months} mes`} y ${Math.round(destinacion.diferencia.days) > 1 ? `${Math.round(destinacion.diferencia.days)} días` : `${Math.round(destinacion.diferencia.days)} día`}` }}</p>
                <p v-if="destinacion.establecimiento"><strong>Establecimiento:</strong>: {{destinacion.establecimiento.nombre}} - {{destinacion.establecimiento.red_hospitalaria.sigla}}</p>
                <p v-if="destinacion.grado_complejidad_establecimiento"><strong>Grado de complejidad</strong>: {{destinacion.grado_complejidad_establecimiento.grado}}</p>
                <p v-if="destinacion.unidad"><strong>Unidad</strong>: {{destinacion.unidad.nombre}}</p>
                <p v-if="destinacion.situacion_profesional"><strong>Situación profesional</strong>: {{destinacion.situacion_profesional.nombre}}</p>
            </div>
            <div class="col-md-6">
              <template v-if="destinacion.user_add">
                <p><strong>Usuario</strong>: {{destinacion.user_add.sigla}}</p>
                <p><strong>Fecha de ingreso</strong>: {{DateTime.fromSQL(destinacion.fecha_add).toFormat('ff')}}</p>
              </template>
              <template v-if="destinacion.user_update">
                <p><strong>Usuario actualización</strong>: {{destinacion.user_update.sigla}}</p>
                <p><strong>Última actualización</strong>: {{DateTime.fromSQL(destinacion.fecha_update).toFormat('ff')}}</p>
              </template>
            </div>
        </div>
        <div class="row pt-lg-3">
          <div class="col-md-12">
            <strong>Observación:</strong>
            <div class="form-group">
              <span>{{ (destinacion.observacion != null) ? destinacion.observacion : '--' }}</span>
            </div>
          </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  computed:{
    destinacion(){
      return {...this.$store.state.edf.showDestinacion}
    },
  }
}
</script>

<style>

</style>
