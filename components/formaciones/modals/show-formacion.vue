<template>
  <div>
    <b-modal id="modal-show-especialidad" size="lg" title="Información extra sobre formación" hide-footer>
      <template v-if="formacion != '' || formacion != null">
        <div class="row">
            <div class="col-md-6">
                <p><strong>Periodo en formación</strong>: {{DateTime.fromISO(formacion.inicio_formacion).toFormat('dd LLLL yyyy')}} / {{DateTime.fromISO(formacion.termino_formacion).toFormat('dd LLLL yyyy')}}</p>
                <p v-if="formacion.diferencia"><strong>En días</strong>: {{ `${formacion.diferencia.years > 1 ? `${formacion.diferencia.years} años` : `${formacion.diferencia.years} año`}, ${formacion.diferencia.months > 1 ? `${formacion.diferencia.months} meses` : `${formacion.diferencia.months} mes`} y ${formacion.diferencia.days.toFixed(1) > 1 ? `${formacion.diferencia.days.toFixed(1)} días` : `${formacion.diferencia.days.toFixed(1)} día`}` }}</p>
                <p><strong>Universidad</strong>: {{formacion.centro_formador != null ? formacion.centro_formador.nombre : '--'}}</p>
                <p><strong>Formación</strong>: {{formacion.perfeccionamiento != null ? formacion.perfeccionamiento.nombre : '--'}} <i>({{formacion.perfeccionamiento != null ? formacion.perfeccionamiento.tipo.nombre : '--'}})</i></p>
                <p><strong>Campo clínico</strong>: {{formacion.campo_clinico != null ? formacion.campo_clinico.nombre : '--'}}</p>
                <p><strong>Fecha registro superintendencia</strong>: {{ (formacion.fecha_registro != null) ? DateTime.fromISO(formacion.fecha_registro).toFormat('dd-LL-yyyy') : '--'}}</p>
                <p><strong>Situación profesional</strong>: {{ (formacion.situacion_profesional != null) ? formacion.situacion_profesional.nombre : '--'}}</p>
                <p><strong>Contabilizar periodo en formación</strong>: {{formacion.contabilizar_periodo != true ? 'No' : 'Si'}}</p>
            </div>
            <div class="col-md-6">
              <template v-if="formacion.user_add">
                <p><strong>Usuario</strong>: {{formacion.user_add.sigla}}</p>
                <p><strong>Fecha de ingreso</strong>: {{DateTime.fromSQL(formacion.fecha_add).toFormat('ff')}}</p>
              </template>
              <template v-if="formacion.user_update">
                <p><strong>Usuario actualización</strong>: {{formacion.user_update.sigla}}</p>
                <p><strong>Última actualización</strong>: {{DateTime.fromSQL(formacion.fecha_update).toFormat('ff')}}</p>
              </template>
            </div>
        </div>
        <div class="row pt-lg-3">
          <div class="col-md-12">
            <strong>Observación:</strong>
            <div class="form-group">
              <span>{{ (formacion.observacion != null) ? formacion.observacion : '--' }}</span>
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
    formacion(){
      return {...this.$store.state.edf.showFormacion}
    },
  }
}
</script>

<style>

</style>
