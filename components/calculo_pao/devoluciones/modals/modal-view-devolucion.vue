<template>
  <div>
    <b-modal id="modal-view-devolucion" size="lg" title="Información extra sobre devolución" hide-footer>
      <template v-if="devolucion != '' || devolucion != null">
        <div class="row">
            <div class="col-md-6">
                <p><strong>Periodo devolucion</strong>: {{DateTime.fromISO(devolucion.inicio_devolucion).toFormat('dd LLLL yyyy')}} / {{DateTime.fromISO(devolucion.termino_devolucion).toFormat('dd LLLL yyyy')}}</p>
                <p v-if="devolucion.diferencia"><strong>Diferencia periodo</strong>: {{ `${devolucion.diferencia.years > 1 ? `${devolucion.diferencia.years} años` : `${devolucion.diferencia.years} año`}, ${devolucion.diferencia.months > 1 ? `${devolucion.diferencia.months} meses` : `${devolucion.diferencia.months} mes`} y ${devolucion.diferencia.days > 1 ? `${Math.round(devolucion.diferencia.days)} días` : `${Math.round(devolucion.diferencia.days)} día`}` }}</p>
                <p v-if="devolucion.tipo_contrato"><strong>Tipo de contrato</strong>: {{devolucion.tipo_contrato.nombre}} hrs.</p>
                <p v-if="devolucion.diferencia_calculate"><strong>Diferencia con horas</strong>: {{ `${devolucion.diferencia_calculate.years > 1 ? `${devolucion.diferencia_calculate.years} años` : `${devolucion.diferencia_calculate.years} año`}, ${devolucion.diferencia_calculate.months > 1 ? `${devolucion.diferencia_calculate.months} meses` : `${devolucion.diferencia_calculate.months} mes`} y ${devolucion.diferencia_calculate.days > 1 ? `${devolucion.diferencia_calculate.days.toFixed(1)} días` : `${devolucion.diferencia_calculate.days.toFixed(1)} día`}` }}</p>
                <p><strong>Escritura firmada</strong>: {{ (devolucion.escritura != null) ?  (devolucion.escritura.escritura_firmada != 0) ? 'Si' :'No' : '--' }}</p>
                <template v-if="devolucion.escritura">
                  <p><strong>N° resolución escritura</strong>: {{devolucion.escritura.n_resolucion}}/{{DateTime.fromISO(devolucion.escritura.fecha_resolucion).toFormat('dd LLLL yyyy')}}</p>
                  <p><strong>N° repertorio escritura</strong>: {{devolucion.escritura.n_repertorio != null ? devolucion.escritura.n_repertorio : 'sin n°'}}/{{devolucion.escritura.anio_repertorio != null ? devolucion.escritura.anio_repertorio : 'sin año'}}</p>
                  <p><strong>Valor garantía escritura</strong>: {{Intl.NumberFormat('de-DE').format(devolucion.escritura.valor_garantia)}} UF</p>
                </template>
                <p v-if="devolucion.establecimiento"><strong>Establecimiento</strong>: {{devolucion.establecimiento.nombre}} - {{devolucion.establecimiento.red_hospitalaria.sigla}}</p>
            </div>
            <div class="col-md-6">
              <template v-if="devolucion.user_add">
                <p><strong>Usuario</strong>: {{devolucion.user_add.sigla}}</p>
                <p><strong>Fecha de ingreso</strong>: {{DateTime.fromSQL(devolucion.fecha_add).toFormat('ff')}}</p>
              </template>
              <template v-if="devolucion.user_update">
                <p><strong>Usuario actualización</strong>: {{devolucion.user_update.sigla}}</p>
                <p><strong>Última actualización</strong>: {{DateTime.fromSQL(devolucion.fecha_update).toFormat('ff')}}</p>
              </template>
            </div>
        </div>
        <div class="row pt-lg-3">
          <div class="col-md-12">
            <strong>Observación:</strong>
            <div class="form-group">
              <span>{{ (devolucion.observacion != null) ? devolucion.observacion : '--' }}</span>
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
    devolucion(){
      return {...this.$store.state.calculoPao.showDevolucion}
    },
  }
}
</script>

<style>

</style>
