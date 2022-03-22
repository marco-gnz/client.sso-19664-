<template>
  <div v-if="factura">
    <b-modal id="modal-view-factura" :title="`Información factura #${factura.n_resolucion}`" size="lg"  hide-footer>
        <div class="row">
          <div class="col-md-6">
            <div class="row">
              <div class="col-md-6">
                <p><strong>N° de resolución factura</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{factura.n_resolucion != null ? factura.n_resolucion : 'sin n°'}}/{{factura.fecha_resolucion != null ? DateTime.fromISO(factura.fecha_resolucion).toFormat('dd-LL-yyyy'): 'sin fecha'}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p><strong>N° de factura</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{factura.n_factura != null ? factura.n_factura : 'sin n°'}}/{{factura.fecha_emision_factura != null ? DateTime.fromISO(factura.fecha_emision_factura).toFormat('dd-LL-yyyy'):'sin fecha factura'}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p><strong>N° de resolución convenio</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{factura.n_resolucion_convenio != null ? factura.n_resolucion_convenio : 'sin n°'}}/{{factura.fecha_convenio != null ? DateTime.fromISO(factura.fecha_convenio).toFormat('dd-LL-yyyy'):'sin fecha convenio'}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p><strong>Año académico</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{factura.anio_academico != null ? DateTime.fromISO(factura.anio_academico).toFormat('dd-LL-yyyy'):'--'}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p><strong>Año pago</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{factura.anios_pago != null ? factura.anios_pago.map(a => a).join(' - ') : '--'}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p><strong>Monto total</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>${{factura.monto_total != null ? Intl.NumberFormat('de-DE').format(factura.monto_total) : '0'}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p><strong>Tipo de factura</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{`${factura.tipos != null ? `${factura.tipos.map(t => t.nombre).join(' - ')}` : `--`}`}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p><strong>Envío finanzas</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{factura.envio_finanza != false ? 'Si' : 'No'}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p><strong>Situación factura</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{factura.situacion_actual != null ? factura.situacion_actual.nombre : '--'}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p><strong>Fecha de pago</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{factura.fecha_pago != null ? DateTime.fromISO(factura.fecha_pago).toFormat('dd-LL-yyyy'):'--'}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p><strong>Fecha vencimiento factura</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{factura.fecha_vencimiento_factura != null ? DateTime.fromISO(factura.fecha_vencimiento_factura).toFormat('dd-LL-yyyy') : '--'}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p><strong>Cargo al Item</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{factura.cargo_item != null ? factura.cargo_item : '--'}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p><strong>observación</strong>:</p>
              </div>
              <div class="col-md-6">
                <p>{{factura.observacion != null ? factura.observacion : '--'}}</p>
              </div>
            </div>
          </div>


          <div class="col-md-6">
              <div class="row">
                <div class="col-md-4">
                  <p><strong>Rut profesional</strong>:</p>
                </div>
                <div class="col-md-8">
                  <p>{{factura.profesional != null ? factura.profesional.rut_completo : '--'}}</p>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <p><strong>Profesional</strong>:</p>
                </div>
                <div class="col-md-8">
                  <p>{{factura.profesional != null ? factura.profesional.nombre_completo : '--'}}</p>
                </div>
              </div>
            <div class="row">
              <div class="col-md-4">
                <p><strong>Horas contrato</strong>:</p>
              </div>
              <div class="col-md-8">
                <p>{{factura.tipo_contrato_profesional != null ? factura.tipo_contrato_profesional.nombre : '--'}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <p><strong>C.F./Universidad</strong>:</p>
              </div>
              <div class="col-md-8">
                <p>{{factura.centro_formador != null ? factura.centro_formador.nombre : '--'}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <p><strong>Red hospitalaria</strong>:</p>
              </div>
              <div class="col-md-8">
                <p>{{factura.red_hospitalaria != null ? factura.red_hospitalaria.nombre : '--'}}</p>
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
