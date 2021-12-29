<template>
  <div v-if="factura">
    <b-modal id="modal-view-factura" :title="`Información factura #${factura.n_resolucion}`" size="lg"  hide-footer>
        <div class="row">
          <div class="col-md-6">
            <div class="row">
              <div class="col-md-6">
                <p><strong>N° de resolución</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{factura.n_resolucion}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p><strong>Fecha de resolución</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{DateTime.fromISO(factura.fecha_resolucion).toFormat('dd LLLL yyyy')}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p><strong>N° de factura</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{factura.n_factura}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p><strong>Fecha emisión factura</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{DateTime.fromISO(factura.fecha_emision_factura).toFormat('dd LLLL yyyy')}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p><strong>Fecha vencimiento factura</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{DateTime.fromISO(factura.fecha_vencimiento_factura).toFormat('dd LLLL yyyy')}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p><strong>Cargo al Item</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{factura.cargo_item}}</p>
              </div>
            </div>
            <div class="row" v-if="factura.anios_pago">
              <div class="col-md-6">
                <p><strong>Año pago</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{factura.anios_pago.map(a => a).join(' - ')}}</p>
              </div>
            </div>
            <div class="row" v-if="factura.monto_total">
              <div class="col-md-6">
                <p><strong>Monto total</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>${{Intl.NumberFormat('de-DE').format(factura.monto_total)}}</p>
              </div>
            </div>
            <div class="row" v-if="factura.situacion_actual">
              <div class="col-md-6">
                <p><strong>Situación actual</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{factura.situacion_actual.nombre}}</p>
              </div>
            </div>
            <div class="row" v-if="factura.convenio">
              <div class="col-md-6">
                <p><strong>Convenio</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{factura.convenio.n_resolucion}} / {{DateTime.fromISO(factura.convenio.fecha_resolucion).toFormat('dd-LL-yyyy')}}</p>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <template v-if="factura.profesional">
              <div class="row">
                <div class="col-md-4">
                  <p><strong>Rut Profesional</strong>:</p>
                </div>
                <div class="col-md-8">
                  <p>{{factura.profesional.rut_completo}}</p>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <p><strong>Profesional</strong>:</p>
                </div>
                <div class="col-md-8">
                  <p>{{factura.profesional.nombre_completo}}</p>
                </div>
              </div>
            </template>
            <div class="row" v-if="factura.tipo_contrato_profesional">
              <div class="col-md-4">
                <p><strong>Contrato profesional</strong>:</p>
              </div>
              <div class="col-md-8">
                <p>{{factura.tipo_contrato_profesional.nombre}}</p>
              </div>
            </div>
            <div class="row" v-if="factura.centro_formador">
              <div class="col-md-4">
                <p><strong>Centro formador convenio</strong>:</p>
              </div>
              <div class="col-md-8">
                <p>{{factura.centro_formador.nombre}}</p>
              </div>
            </div>
            <div class="row" v-if="factura.red_hospitalaria">
              <div class="col-md-4">
                <p><strong>Red hospitalaria</strong>:</p>
              </div>
              <div class="col-md-8">
                <p>{{factura.red_hospitalaria.nombre}}</p>
              </div>
            </div>
            <template v-if="factura.perfeccionamiento">
              <div class="row">
                <div class="col-md-4">
                  <p><strong>Tipo perfeccionamiento</strong>:</p>
                </div>
                <div class="col-md-8">
                  <p>{{factura.perfeccionamiento.tipo.nombre}}</p>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <p><strong>Perfeccionamiento</strong>:</p>
                </div>
                <div class="col-md-8">
                  <p>{{factura.perfeccionamiento.nombre}}</p>
                </div>
              </div>
            </template>
            <div class="row" v-if="factura.user_add">
              <div class="col-md-4">
                <p><strong>Ingresada el</strong>:</p>
              </div>
              <div class="col-md-8">
                <p>{{ DateTime.fromSQL(factura.fecha_add).toFormat('ff') }} - {{factura.user_add.sigla}}</p>
              </div>
            </div>
            <div class="row" v-if="factura.user_update && factura.fecha_update">
              <div class="col-md-4">
                <p><strong>Última actualización</strong>:</p>
              </div>
              <div class="col-md-8">
                <p>{{ DateTime.fromSQL(factura.fecha_update).toFormat('ff') }} - {{factura.user_update.sigla}}</p>
              </div>
            </div>
          </div>
        </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  computed:{
    factura(){
      return this.$store.state.facturas.factura;
    }
  }
}
</script>

<style>

</style>
