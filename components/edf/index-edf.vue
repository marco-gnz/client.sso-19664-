<template>
  <div>
    <div class="row">
      <div class="col-md-6">
        <h6>Sección Etapa Destinación y Formación (EDF)</h6>
      </div>
      <div class="col-md-6">
        <button v-b-modal.modal-add-destinacion class="btn btn-success float-right">Ingresar destinación</button>
        <AddDestinacion :profesional="profesional"/>
      </div>
    </div>
    <div class="row pt-lg-3">
      <div class="col-md-12">
         <IndexDestinacion  :destinaciones="destinaciones"/>
      </div>
    </div>
    <div class="row pt-lg-3">
      <div class="col-md-12">
        <button :disabled="destinaciones.length === 0" v-b-modal.modal-add-formacion-edf class="btn btn-primary float-right">Ingresar formación</button>
        <AddFormacion :profesional="profesional"/>
      </div>
    </div>
    <div class="row pt-lg-3">
      <div class="col-md-12" v-show="formaciones.length  ">
         <!-- <IndexFormacion  :formaciones="formaciones"/> -->
         <IndexFormacionEDF :formaciones="formaciones"/>
      </div>
    </div>
    <div class="row pt-lg-2">
      <div class="col-md-12">
        <span class="font-weight-bold ml-2 float-lg-right" style="font-size: 13px;"><strong>TOTAL EDF</strong>: {{ `${totalEdf != null || totalEdf != undefined ? `${totalEdf.years > 1 ? `${totalEdf.years} años` : `${totalEdf.years} año`}, ${totalEdf.months > 1 ? `${totalEdf.months} meses` : `${totalEdf.months} mes`} y ${Math.round(totalEdf.days) > 1 ? `${Math.round(totalEdf.days)} días` : `${Math.round(totalEdf.days)} día`}` : '--' }` }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapActions} from 'vuex';
import IndexDestinacion from "./destinacion/index-destinacion.vue";
import AddDestinacion from './destinacion/modals/add-destinacion.vue';
import AddFormacion from './formaciones/modals/add-formacion.vue';
import IndexFormacionEDF from './formaciones/index-formacion.vue';
export default {
    props:['profesional'],
    components: { IndexDestinacion, AddDestinacion, AddFormacion, IndexFormacionEDF },
    mounted(){
      this.getDestinaciones(this.$route.params.id);
      this.getFormaciones(this.$route.params.id);
    },
    computed:{
      ...mapGetters({
        destinaciones:'edf/destinaciones',
        formaciones:'edf/formaciones'
      }),
      totalEdf(){
          let años_destinacion  = 0;
          let meses_destinacion = 0;
          let dias_destinacion  = 0;

          let años_formacion    = 0;
          let meses_formacion   = 0;
          let dias_formacion    = 0;

          if(this.destinaciones.length){
              this.destinaciones.forEach(destinacion => {
                  let fecha_inicio    = this.DateTime.fromISO(destinacion.inicio_periodo);
                  let fecha_termino   = this.DateTime.fromISO(destinacion.termino_periodo);
                  let diferencia_destinacion      = fecha_termino.diff(fecha_inicio, ['days', 'months', 'years']);

                  años_destinacion    += diferencia_destinacion.values.years;
                  meses_destinacion   += diferencia_destinacion.values.months;
                  dias_destinacion    += diferencia_destinacion.values.days;
              });

              this.formaciones.forEach(formacion => {
                  let fecha_inicio    = this.DateTime.fromISO(formacion.inicio_formacion);
                  let fecha_termino   = this.DateTime.fromISO(formacion.termino_formacion);
                  let diferencia      = fecha_termino.diff(fecha_inicio, ['days', 'months', 'years']);

                  años_formacion    += diferencia.values.years;
                  meses_formacion   += diferencia.values.months;
                  dias_formacion    += diferencia.values.days;
              });
          }

          let total_edf = this.Duration.fromObject({ years: años_destinacion + años_formacion, months: meses_destinacion + meses_formacion,  days: dias_destinacion + dias_formacion}).normalize().toObject();

          return total_edf;

      }
    },
    methods:{
      ...mapActions({
        getDestinaciones: 'edf/getDestinaciones',
        getFormaciones:'edf/getFormaciones'
      })
    }
}
</script>

<style>

</style>
