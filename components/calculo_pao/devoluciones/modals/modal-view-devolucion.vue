<template>
  <div>
    <b-modal id="modal-view-devolucion" size="lg" title="Información extra sobre devolución" hide-footer>
      <template v-if="devolucion">
        <div class="row">
            <div class="col-md-6">
                <!-- <p><strong>Especialidad asociada</strong>: {{devolucion.pao.especialidad.perfeccionamiento.nombre}}</p> -->
                <p><strong>Periodo devolucion</strong>: {{DateTime.fromISO(devolucion.inicio_devolucion).toFormat('dd LLLL yyyy')}} / {{DateTime.fromISO(devolucion.termino_devolucion).toFormat('dd LLLL yyyy')}}</p>
                <p><strong>TOTAL DÍAS</strong>: {{devolucion.diferencia}}</p>
                <p><strong>Tipo de contrato</strong>: {{devolucion.tipo_contrato.nombre}} hrs.</p>
                <p><strong>Escritura firmada</strong>: {{ (devolucion.escritura != null) ?  (devolucion.escritura.escritura_firmada != 0) ? 'Si' :'No' : '--' }}</p>
                <template v-if="devolucion.escritura">
                  <p><strong>N° resolución escritura</strong>: {{devolucion.escritura.n_resolucion}} / {{DateTime.fromISO(devolucion.escritura.fecha_resolucion).toFormat('dd LLLL yyyy')}}</p>
                  <p><strong>Valor garantía escritura</strong>: {{Intl.NumberFormat('de-DE').format(devolucion.escritura.valor_garantia)}} UF</p>
                </template>
                <p><strong>Establecimiento:</strong>: {{devolucion.establecimiento.nombre}} - {{devolucion.establecimiento.red_hospitalaria.sigla}}</p>
            </div>
            <div class="col-md-6">
                <p><strong>Usuario</strong>: MG</p>
                <p><strong>Fecha de ingreso</strong>: {{DateTime.fromISO(devolucion.created_at).toFormat('ff')}}</p>
                <p><strong>Usuario actualización</strong>: MG</p>
                <p><strong>Última actualización</strong>: {{DateTime.fromISO(devolucion.updated_at).toFormat('ff')}}</p>
            </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  props:['devolucion']
}
</script>

<style>

</style>
