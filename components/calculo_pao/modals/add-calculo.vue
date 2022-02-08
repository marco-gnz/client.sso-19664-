<template>
    <div>
      <b-modal id="modal-add-calculo" size="lg" title="Ingrese nuevo cálculo de PAO" ok-only>
        <div class="row d-flex justify-content-center">
          <div class="col-md-12">
              <el-steps :active="pao_pasos" finish-status="success">
                  <el-step title="Formación" icon="el-icon-document"></el-step>
                  <el-step title="Cálculo estimado" icon="el-icon-date"></el-step>
                  <el-step title="Otros" icon="el-icon-chat-line-round"></el-step>
              </el-steps>
          </div>
        </div>
        <section v-if="pao_pasos == 0">
          <div class="row pt-4 d-flex justify-content-center">
              <div class="col-md-6">
                  <select class="form-control" v-model="pao.especialidad" @change="calculoPao(pao.especialidad)">
                      <option value="">-- Seleccione formación --</option>
                      <option :class="(idEspecialidades.includes(especialidad.id)) ? 'text-tachado': ''" v-for="(especialidad, index) in formacionesProfesional" :key="index" :value="especialidad" :disabled="idEspecialidades.includes(especialidad.id)">{{especialidad.perfeccionamiento.tipo.nombre}} ({{especialidad.perfeccionamiento.nombre}})</option>
                  </select>
                  <span class="text-danger" v-if="errors.especialidad_id">{{errors.especialidad_id[0]}}</span>
                  <el-alert
                    v-if="especialidad_sin_fecha != '' "
                    :title="especialidad_sin_fecha"
                    type="warning"
                    :closable="false">
                  </el-alert>
              </div>
          </div>
        </section>
        <section v-if="pao_pasos == 1">
          <div class="row pt-2">
              <div class="col-md-12">
                  <p class="text-center">{{pao.especialidad.perfeccionamiento.tipo.nombre}} <i>({{pao.especialidad.perfeccionamiento.nombre}})</i> seleccionada, tiene un periodo de formación del <b>{{DateTime.fromISO(pao.especialidad.inicio_formacion).toFormat('dd-LL-yyyy')}}</b> a <b>{{DateTime.fromISO(pao.especialidad.termino_formacion).toFormat('dd-LL-yyyy')}}</b>. ({{Math.round(diff_anos_especialidad.values.years)}} años)</p>
                  <p class="text-center">Por lo tanto, el periodo estimado de PAO sería de <b>{{messagge}}</b> por devolver.</p>
              </div>
          </div>
          <div class="row pt-1">
             <div class="col-md-12">
               <div class="row d-flex justify-content-center">
                 <div class="col-xs-6 ml-sm-3">
                   <el-date-picker
                      :disabled="!pao_estimado_modificado"
                      v-model="pao.periodo[0]"
                      type="date"
                      range-separator="a"
                      start-placeholder="Periodo de inicio"
                      end-placeholder="Periodo de término"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                      @input="verifyDate"
                      >
                  </el-date-picker>
                  <span class="text-danger" v-if="errors.periodo_inicio || errors.periodo_termino">{{errors.periodo_inicio[0]}}</span>
                 </div>
                 <div class="col-xs-3 pt-sm-3 ml-sm-2">
                      <span><i class="el-icon-arrow-right"></i> <strong style="font-size: 15px;">{{ (pao.periodo[1] != undefined) ? DateTime.fromISO(pao.periodo[1]).toFormat('dd-LL-yyyy') : 'sin fecha'}}</strong></span>
                  </div>
               </div>
               <div class="row pt-lg-3 d-flex justify-content-center">
                    <div class="col-md-10">
                        <template v-if="pao_estimado_modificado_text_area">
                            <label>Observación de acuerdo a la modificación de PAO estimado</label>
                            <textarea v-model="pao.observacion_periodo" class="form-control" cols="10" rows="5" placeholder="Ingrese observación..."></textarea>
                        </template>
                    </div>
                </div>
                <div class="row pt-lg-3">
                    <div class="col-md-12">
                        <el-checkbox class="float-left" v-model="pao_estimado_modificado">Modificar periodo</el-checkbox>
                    </div>
                </div>
             </div>
          </div>
        </section>
        <section v-if="pao_pasos == 2">
          <div class="row pt-4 d-flex justify-content-center">
              <div class="col-md-10">
                  <label>Observación</label> <i>(Opcional)</i>
                  <textarea v-model="pao.observacion" class="form-control" cols="10" rows="5" placeholder="Ingrese observación..."></textarea>
              </div>
              <span class="text-danger" v-if="errors.observacion">{{errors.observacion[0]}}</span>
          </div>
        </section>
        <template #modal-footer>
            <div class="w-100">
                <button :disabled="pao_pasos == 0" @click.prevent="calculo_pasos_volver" class="mt-3 btn btn-default float-left"><i class="fas fa-arrow-left"></i> Volver</button>
                <button :disabled="pao.especialidad === '' || especialidad_sin_fecha != '' " v-show="pao_pasos != 2" @click.prevent="calculo_pasos_siguiente" class="mt-3 btn btn-primary float-right">Siguiente <i class="fas fa-arrow-right"></i></button>
                <button v-show="pao_pasos == 2" class="mt-3 btn btn-success float-right" @click.prevent="storePao" v-loading.fullscreen.lock="fullscreenLoading">Añadir cálculo PAO<i class="fas fa-plus"></i></button>
            </div>
        </template>
      </b-modal>
    </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
export default {
  data(){
    return{
      fullscreenLoading:false,
      pao_pasos:0,
      pao:{
        especialidad:'',
        periodo:[],
        observacion_periodo:'',
        observacion:''
      },
      especialidad_select:{
          periodo:[]
      },
      pao_estimado:{
          periodo:[],
          dias:''
      },
      diff_days:'',
      pao_estimado_modificado:false,
      pao_estimado_modificado_text_area:false,
      errors:{},
      messagge:'',
      diff_anos_especialidad:'',
      especialidad_sin_fecha:''
    };
  },
  mounted(){
    this.getFormacionesProfesional(this.$route.params.id);
  },
  computed:{
    ...mapGetters({
      formacionesProfesional: 'calculoPao/formacionesProfesional',
      paos:'calculoPao/paos',
      idEspecialidades:'calculoPao/idEspecialidades'
  }),
  },
  methods:{
    ...mapMutations({
      addMutation: 'calculoPao/ADD_CALCULO_PAO'
    }),
    ...mapActions({
            getFormacionesProfesional: 'calculoPao/getFormacionesProfesional'
        }),
    calculoPao(especialidad){
      console.log(especialidad);
      if(especialidad.inicio_formacion != null || especialidad.termino_formacion != null){
        let fecha_inicio_especialidad       = this.DateTime.fromISO(especialidad.inicio_formacion);
      let fecha_termino_especialidad      = this.DateTime.fromISO(especialidad.termino_formacion);

      this.diff_anos_especialidad = fecha_termino_especialidad.diff(fecha_inicio_especialidad, 'years');

      let dias = fecha_termino_especialidad.diff(fecha_inicio_especialidad, 'days');

      this.especialidad_select.periodo[0] = fecha_inicio_especialidad;
      this.especialidad_select.periodo[1] = fecha_termino_especialidad;

      this.pao.periodo[0]                 = fecha_termino_especialidad.startOf('day').plus({days: 1}).toFormat('yyyy-LL-dd');
      this.pao_estimado.periodo[0]        = fecha_termino_especialidad.startOf('day').plus({days: 1}).toFormat('yyyy-LL-dd');

      let fecha_inici_format              = this.DateTime.fromISO(this.pao.periodo[0]);
      this.pao.periodo[1]                 = (fecha_inici_format.plus({days: (dias.values.days) * 2}).toFormat('yyyy-LL-dd'));
      this.pao_estimado.periodo[1]        = (fecha_inici_format.plus({days: (dias.values.days) * 2}).toFormat('yyyy-LL-dd'))

      let final                           = (fecha_inici_format.plus({days: (dias.values.days) * 2}).toFormat('yyyy-LL-dd'));
      let format_final                    = this.DateTime.fromISO(final);


      let diff_pao_calculado              = format_final.diff(fecha_inici_format, 'days');

      let calculo_message                 = format_final.diff(fecha_inici_format, ['days', 'months', 'years']);

      this.diff_days                      = diff_pao_calculado.values.days;
      this.pao_estimado.dias              = diff_pao_calculado.values.days;

      let object                          = this.Duration.fromObject({days: calculo_message.values.days, months:calculo_message.values.months, years:calculo_message.values.years}).normalize().toObject();

      this.messagge = `${object.years > 1 ? `${object.years} años` : `${object.years} año`}, ${object.months > 1 ? `${object.months} meses` : `${object.months} mes`} y ${Math.round(object.days) > 1 ? `${Math.round(object.days)} días` : `${Math.round(object.days)} día`}`;

      }else{
        this.especialidad_sin_fecha = 'No es posible calcular el PAO. La especialidad no tiene registro de periodo de formación, por lo que no es posible realizar el calculo de PAO.';
      }
    },
    verifyDate(){
        let dias = this.especialidad_select.periodo[1].diff(this.especialidad_select.periodo[0], 'days');
        let fecha_inici_format = this.DateTime.fromISO(this.pao.periodo[0]);

        this.pao.periodo[1]  = (fecha_inici_format.plus({days: (dias.values.days) * 2}).toFormat('yyyy-LL-dd'));

        if(this.pao_estimado.periodo[0] != this.pao.periodo[0]){
            this.pao_estimado_modificado_text_area = true;
        }else{
            this.pao_estimado_modificado_text_area = false;
            this.pao_estimado_modificado = !this.pao_estimado_modificado;
        }
    },
    async storePao(){
        this.fullscreenLoading = !this.fullscreenLoading;
        const url = '/api/profesionales/profesional/add-calculo-pao';
        const data = {
          especialidad_id: this.pao.especialidad.id,
          periodo_inicio: this.pao.periodo[0],
          periodo_termino: this.pao.periodo[1],
          observacion_periodo: this.pao.observacion_periodo,
          observacion: this.pao.observacion
        };

        await this.$axios.$post(url, data).then(response => {
          this.fullscreenLoading = !this.fullscreenLoading;
          console.log(response);
          if(response[0] === true){
            this.clearAllModal();
            this.addMutation(response[1]);
            this.$alert('Ahora puedes comenzar a ingresar devoluciones e interrupciones.', 'Cálculo de PAO ingresado', {
              type:'success',
              confirmButtonText: 'OK'
            });
          }
        }).catch(error => {
          this.fullscreenLoading = !this.fullscreenLoading;
          this.errors = error.response.data.errors;
          if(error.response.data.errors.especialidad_id){
            this.pao_pasos = 0;
          }else if(error.response.data.errors.especialidad_id){
            this.pao_pasos = 1;
          }else{
            this.pao_pasos = 2;
          }
        });
      },
    clearAllModal(){
      for(let key in this.pao){
        this.pao[key] = '';
      }
      this.pao.periodo = [];
      this.pao_pasos = 0;
      this.$root.$emit('bv::hide::modal', 'modal-add-calculo', '#btnShow');
    },
    calculo_pasos_volver(){
      this.pao_pasos--;
    },
    calculo_pasos_siguiente(){
      this.pao_pasos++;
    }
  }
}
</script>

<style>
.text-tachado{
color:rgb(180, 180, 180);
text-decoration: underline overline;
display: inline-block;
}
</style>
