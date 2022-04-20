<template>
  <div>
    <b-modal id="modal-view-interrupcion" size="lg" title="Información extra sobre interrupción" hide-footer>
      <template v-if="interrupcion != '' || interrupcion != null">
        <div class="row">
            <div class="col-md-7">
                <p><strong>Periodo interrupción</strong>: {{DateTime.fromISO(interrupcion.inicio_interrupcion).toFormat('dd LLLL yyyy')}} / {{DateTime.fromISO(interrupcion.termino_interrupcion).toFormat('dd LLLL yyyy')}}</p>
                <p v-if="interrupcion.diferencia"><strong>En días</strong>: {{ `${interrupcion.diferencia.years > 1 ? `${interrupcion.diferencia.years} años` : `${interrupcion.diferencia.years} año`}, ${interrupcion.diferencia.months > 1 ? `${interrupcion.diferencia.months} meses` : `${interrupcion.diferencia.months} mes`} y ${interrupcion.diferencia.days.toFixed(1) > 1 ? `${interrupcion.diferencia.days.toFixed(1)} días` : `${interrupcion.diferencia.days.toFixed(1)} día`}` }}</p>
                <p v-if="interrupcion.devolucion"><strong>Periodo devolución afectado</strong>: #{{interrupcion.devolucion.uuid.substring(0, 5)}}</p>
                <p v-if="interrupcion.causal"><strong>Causal de interrupción</strong>: {{interrupcion.causal.nombre}}</p>
            </div>
            <div class="col-md-5">
              <template v-if="interrupcion.user_add">
                <p><strong>Usuario</strong>: {{interrupcion.user_add.sigla}}</p>
                <p><strong>Fecha de ingreso</strong>: {{DateTime.fromSQL(interrupcion.fecha_add).toFormat('ff')}}</p>
              </template>
              <template v-if="interrupcion.user_update">
                <p><strong>Usuario actualización</strong>: {{interrupcion.user_update.sigla}}</p>
                <p><strong>Última actualización</strong>: {{DateTime.fromSQL(interrupcion.fecha_update).toFormat('ff')}}</p>
              </template>
            </div>
        </div>
        <div class="row pt-lg-3">
          <div class="col-md-12">
            <strong>Observación:</strong>
            <div class="form-group">
              <span>{{ (interrupcion.observacion != null) ? interrupcion.observacion : '--' }}</span>
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
    interrupcion(){
      return {...this.$store.state.calculoPao.showInterrupcion}
    },
  }
}
</script>

<style>

</style>
