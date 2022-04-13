<template>
  <div>
    <div class="row pt-4 d-flex justify-content-center">
      <div class="col-md-12">
          <div class="main-wrapper">
            <div class="container main-container">
              <h5>Conclusión PAO</h5>
              <div class="row main-row">
                <div class="col-12 align-center">
                  <div class="row p-3 border">
                    <div class="col-md-3">
                      <strong>PERIODO DEVOLUCIÓN</strong>:
                    </div>
                    <div class="col-3">
                      <span>{{`${devolucion.periodo.length ? `${DateTime.fromISO(devolucion.periodo[0]).toFormat('dd-LL-yyyy')} / ${DateTime.fromISO(devolucion.periodo[1]).toFormat('dd-LL-yyyy')}` : `seleccione periodo`}`}}</span>
                    </div>
                    <div class="col-md-3">
                      <strong>DÍAS DEVOLUCIÓN</strong>:
                    </div>
                    <div class="col-3">
                      <span>{{totalPeriodoSeleccionado}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row main-row pt-lg-3">
                <div class="col-12 align-center">
                  <div class="row p-3 border">
                    <div class="col-md-3">
                      <strong>HORA DEVOLUCIÓN</strong>:
                    </div>
                    <div class="col-3">
                      <span>{{devolucion.contrato != '' ? devolucion.contrato.nombre : 'seleccione hora'}}</span>
                    </div>
                    <div class="col-md-3">
                      <strong>DEVOLUCIÓN POR HORA</strong>:
                    </div>
                    <div class="col-3">
                      <span>{{totalPeriodoSeleccionadoPorHora}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row main-row pt-lg-3">
                <div class="col-12 align-center">
                  <div class="row p-3 border">
                    <div class="col-md-3">
                      <strong>PAO A DEVOLVER</strong>:
                    </div>
                    <div class="col-3">
                      <span>{{ `${totalDevolver.years > 1 ? `${totalDevolver.years} años` : `${totalDevolver.years} año`}, ${totalDevolver.months > 1 ? `${totalDevolver.months} meses` : `${totalDevolver.months} mes`} y ${totalDevolver.days > 1 ? `${Math.round(totalDevolver.days)} días` : `${Math.round(totalDevolver.days)} día`}` }}</span>
                    </div>
                    <div class="col-md-3">
                      <strong>LE FALTA</strong>:
                    </div>
                    <div class="col-3">
                      <span>{{faltanDias}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row main-row pt-lg-3">
                <div class="col-12 align-center">
                  <div class="row p-3 border">
                    <div class="col-md-6">
                      <strong>FECHA PARA SALDO EN 0</strong>:
                    </div>
                    <div class="col-6">
                      <span>{{fechFinalizacionPao}}</span>
                    </div>
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
  props:['devolucion', 'totalPeriodoSeleccionado', 'totalPeriodoSeleccionadoPorHora', 'totalDevolver', 'faltanDias', 'fechFinalizacionPao']
}
</script>

<style>

</style>
