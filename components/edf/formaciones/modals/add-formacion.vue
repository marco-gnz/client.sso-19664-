<template>
  <div>
    <b-modal id="modal-add-formacion-edf" size="lg" title="Ingresar nueva formación" ok-only>
      <div class="row d-flex justify-content-center">
          <div class="col-md-12">
              <el-steps :active="formacion_pasos" finish-status="success">
                  <el-step title="Formación" icon="el-icon-school"></el-step>
                  <el-step title="Registro" icon="el-icon-date"></el-step>
                  <el-step title="Periodo formación" icon="el-icon-date"></el-step>
                  <el-step title="Observación" icon="el-icon-chat-dot-square"></el-step>
              </el-steps>
          </div>
      </div>
      <section v-if="formacion_pasos === 0">
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-3">
              <label>Centro formador</label>
              <select class="form-control" v-model="formacion.centro_formador">
                  <option value="" selected disabled>-- Seleccione centro --</option>
                  <option v-for="(centro, index) in centrosFormadores" :key="index" :value="centro.id">{{centro.nombre}}</option>
              </select>
              <span class="text-danger" v-if="errors.centro_formador_id">{{errors.centro_formador_id[0]}}</span>
          </div>
          <div class="col-md-3">
              <label>Tipo de perfeccionamiento</label>
              <select class="form-control" v-model="formacion.tipo_perfeccionamiento" @change="perfeccionamientoGet">
                  <option value="" selected disabled>-- Seleccione tipo --</option>
                  <option v-for="(tipo, index) in tipoPerfeccionamientos" :key="index" :value="tipo.id">{{tipo.nombre}}</option>
              </select>
          </div>
          <div class="col-md-3">
              <label>Perfeccionamiento</label>
              <select :disabled="formacion.tipo_perfeccionamiento == '' || perfeccionamientos.length == 0" class="form-control" v-model="formacion.perfeccionamiento">
                  <option value="" selected disabled>-- Seleccione perfeccionamiento --</option>
                  <option v-for="(perfeccionamiento, index) in perfeccionamientos" :key="index" :value="perfeccionamiento.id">{{perfeccionamiento.nombre}}</option>
              </select>
              <span class="text-danger" v-if="errors.perfeccionamiento_id">{{errors.perfeccionamiento_id[0]}}</span>
              <span class="pt-2" v-if="formacion.tipo_perfeccionamiento != '' && perfeccionamientos.length == 0"><i>No existen registros</i></span>
          </div>
        </div>
      </section>
      <section v-if="formacion_pasos === 1">
          <div class="row pt-4 d-flex justify-content-center">
              <div class="col-md-6">
                <label>Fecha de registro superintendencia</label>
                <input type="date" class="form-control" v-model="formacion.fecha_registro">
                <span class="text-danger" v-if="errors.fecha_registro">{{errors.fecha_registro[0]}}</span>
              </div>
              <div class="col-md-6">
                <label>Situación profesional</label>
                <select class="form-control" v-model="formacion.situacion_profesional">
                    <option value="">-- Seleccione situación actual --</option>
                    <option v-for="(situacion, index) in situacionesActual" :key="index" :value="situacion.id">{{situacion.nombre}}</option>
                </select>
                <span class="text-danger" v-if="errors.situacion_profesional_id">{{errors.situacion_profesional_id[0]}}</span>
              </div>
          </div>
      </section>
      <section v-if="formacion_pasos === 2">
          <div class="row pt-4 d-flex justify-content-center">
              <div class="col-md-6">
                  <label>Periodo de formación</label>
                  <el-date-picker
                      :clearable="false"
                      v-model="formacion.periodo"
                      type="daterange"
                      range-separator=">"
                      start-placeholder="Inicio"
                      end-placeholder="Término"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd">
                  </el-date-picker>
                  <span class="text-danger" v-if="errors.inicio_formacion">{{errors.inicio_formacion[0]}}</span>
              </div>
          </div>
          <div class="row pt-lg-3">
            <div class="col-md-3">
              <el-checkbox v-model="formacion.aumentar">Aumentar periodo</el-checkbox>
            </div>
            <div class="col-md-9" v-if="formacion.aumentar">
              <label class="required">Observación</label>
              <textarea v-model="formacion.aumentar_observacion" class="form-control" cols="10" rows="5"></textarea>
              <span class="text-danger" v-if="errors.observacion_aumentar">{{errors.observacion_aumentar[0]}}</span>
            </div>
          </div>
      </section>
      <section v-if="formacion_pasos === 3">
          <div class="row pt-4 d-flex justify-content-center">
              <div class="col-md-10">
                  <label>Observación</label>
                  <textarea v-model="formacion.observacion" class="form-control" cols="10" rows="5" placeholder="Ingrese observación..."></textarea>
              </div>
          </div>
      </section>
      <template #modal-footer>
          <div class="w-100">
              <button :disabled="formacion_pasos == 0" @click.prevent="paso_formacion_volver" class="mt-3 btn btn-default float-left"><i class="fas fa-arrow-left"></i> Volver</button>
              <button v-show="formacion_pasos != 3" @click.prevent="paso_formacion_siguiente" class="mt-3 btn btn-primary float-right">Siguiente <i class="fas fa-arrow-right"></i></button>
              <button v-show="formacion_pasos == 3" @click.prevent="addFormacionValidate" class="mt-3 btn btn-success float-right">Añadir formación <i class="fas fa-plus"></i></button>
          </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapActions} from 'vuex';
export default {
  props:['profesional'],
  data(){
    return{
      fullscreenLoading:false,
      formacion_pasos:0,
      formacion:{
          centro_formador:'',
          tipo_perfeccionamiento:'',
          perfeccionamiento:'',
          fecha_registro:'',
          periodo:[],
          situacion_profesional:'',
          observacion:'',
          aumentar:false,
          aumentar_observacion:''
      },
      perfeccionamientos:[],
      errors:{}
    };
  },
  computed:{
    ...mapGetters({
        centrosFormadores:'mantenedores/centrosFormadores',
        tipoPerfeccionamientos: 'mantenedores/tipoPerfeccionamientos',
        situacionesActual:'mantenedores/situacionesActual'
    })
  },
  methods:{
    ...mapMutations({
      addFormacionToProfesional:'edf/STORE_FORMACION'
    }),
    async perfeccionamientoGet(){
      const url = '/api/mantenedores/tipo-perfeccionamientos/perfeccionamientos';
      const data = {
        tipo_perfeccionamiento_id: this.formacion.tipo_perfeccionamiento
      };

      await this.$axios.$get(url, {params: data}).then(response => {
        if(response.length){
          this.perfeccionamientos = response;
        }
      }).catch(error => {
        console.log(error);
      });
    },
    addFormacionValidate(){
      if(this.formacion.aumentar === true && this.formacion.aumentar_observacion === ''){
        this.formacion_pasos = 2;
          this.errors = {observacion_aumentar: []};
          this.errors.observacion_aumentar[0] = 'Al aumentar el periodo, la observación es obligatoria.';
      }else if (!this.formacion.periodo[0] || !this.formacion.periodo[1]){
          this.errors = {inicio_formacion: []};
          this.errors.inicio_formacion[0] = 'El periodo es obligatorio';
          this.formacion_pasos = 2;
      }else{
        this.addEtapaFormacion();
      }
    },
    async addEtapaFormacion(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = '/api/profesionales/profesional/edf/add-formacion';
      const data = {
        fecha_registro: this.formacion.fecha_registro,
        inicio_formacion:this.formacion.periodo[0],
        termino_formacion:this.formacion.periodo[1],
        origen:'EDF',
        observacion:this.formacion.observacion,
        profesional_id:this.profesional.id,
        centro_formador_id:this.formacion.centro_formador,
        perfeccionamiento_id:this.formacion.perfeccionamiento,
        situacion_profesional_id:this.formacion.situacion_profesional,
        aumentar:this.formacion.aumentar,
        aumentar_observacion:this.formacion.aumentar_observacion
      };

      await this.$axios.$post(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.addFormacionToProfesional(response[1]);
          this.clearAllModal();
          this.$message({
              message: `${response[1].perfeccionamiento.tipo.nombre} ingresada con éxito.`,
              type: 'success'
          });
        }else if(response[0] === 'max-days'){
            const h = this.$createElement;
            let fecha = this.Duration.fromObject({ years: 0, months: 0,  days: Math.round(response[1])}).normalize().toObject();
            let message = `${fecha.years} ${fecha.years > 1 ? `años` : `años`}, ${fecha.months} ${fecha.months > 1 ? `meses` : `mes`} y ${fecha.days} ${fecha.days > 1 ? `días` : `día`}`;
            const messages = h('div', [
                            h('div', "Has pasado el límite total de EDF (10 años + 4 meses)."),
                            h('div', `Con el periodo ingresado, se contabilizó un total de ${message} de EDF.`)
                            ])
            this.$alert(messages, 'No se ingresó la formación', {
                type:'error',
                confirmButtonText: 'OK',
            });
            this.formacion_pasos = 2;
            this.errors = {inicio_formacion: []};
            this.errors.inicio_formacion[0] = 'Modifique el periodo de formación.';
        }else if(response[0] === 'max-formacion'){
            const h = this.$createElement;
            let fecha = this.Duration.fromObject({ years: 0, months: 0,  days: Math.round(response[1])}).normalize().toObject();
            let message = `${fecha.years} ${fecha.years > 1 ? `años` : `años`}, ${fecha.months} ${fecha.months > 1 ? `meses` : `mes`} y ${fecha.days} ${fecha.days > 1 ? `días` : `día`}`;
            const messages = h('div', [
                            h('div', "Has pasado el límite total de EF (4 años)."),
                            h('div', `Con el periodo ingresado, se contabilizó un total de ${message} de EF.`)
                            ])
            this.$alert(messages, 'No se ingresó la formación', {
                type:'error',
                confirmButtonText: 'OK',
            });
            this.formacion_pasos = 2;
            this.errors = {inicio_formacion: []};
            this.errors.inicio_formacion[0] = 'Modifique el periodo de formación.';
        }else if(response === 'fechas-entrelazadas-formacion'){
          this.$alert('No se ingresó la formación, ya que el profesional tiene un registro en formaciones en el mismo periodo ingresado...', 'Error', {
            type:'warning',
            confirmButtonText: 'OK'
          });
          this.formacion_pasos = 2;
          this.errors = {inicio_formacion: []};
          this.errors.inicio_formacion[0] = 'Modifique el periodo de formación.';
        }else if(response === 'fechas-entrelazadas-destinacion'){
          this.$alert('No se ingresó la formación, ya que el profesional tiene un registro en destinaciones en el mismo periodo ingresado...', 'Error', {
            type:'warning',
            confirmButtonText: 'OK'
          });
          this.formacion_pasos = 2;
          this.errors = {inicio_formacion: []};
          this.errors.inicio_formacion[0] = 'Modifique el periodo de formación.';
        }else{
          this.$message.error('No se ingreso la formación. Error de servidor');
          this.clearAllModal();
        }
      }).catch(error => {
        this.fullscreenLoading = !this.fullscreenLoading;
        this.errors = error.response.data.errors;
        if(error.response.data.errors.centro_formador_id || error.response.data.errors.perfeccionamiento_id){
          this.formacion_pasos = 0;
        }else if (error.response.data.errors.fecha_registro){
          this.formacion_pasos = 1;
        }else if (error.response.data.errors.inicio_formacion || error.response.data.errors.termino_formacion){
          this.formacion_pasos = 2;
        }
      });
    },
    clearAllModal(){
      for(let key in this.formacion){
        this.formacion[key] = '';
      }
      this.formacion.periodo = [];
      this.formacion_pasos = 0;
      this.$root.$emit('bv::hide::modal', 'modal-add-formacion-edf', '#btnShow');
    },
    paso_formacion_volver(){
        this.formacion_pasos--;
    },
    paso_formacion_siguiente(){
        this.formacion_pasos++;
    },
  }
}
</script>

<style>

</style>
