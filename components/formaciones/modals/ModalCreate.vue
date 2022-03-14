<template>
  <div>
    <b-modal id="modal-add-especialidad" size="lg" title="Ingrese una formación" ok-only>
        <div class="row d-flex justify-content-center">
            <div class="col-md-12">
                <el-steps :active="especialidad_pasos" finish-status="success">
                    <el-step title="Formación" icon="el-icon-document"></el-step>
                    <el-step title="Registro" icon="el-icon-date"></el-step>
                    <el-step title="Periodo" icon="el-icon-date"></el-step>
                </el-steps>
            </div>
        </div>
        <section v-if="especialidad_pasos === 0">
          <div class="row pt-4">
            <div class="col-md-4">
              <div class="form-group">
                <label>Centro formador</label>
                <select class="form-control" v-model="especialidad.centro_formador">
                    <option value="" selected disabled>-- Seleccione centro --</option>
                    <option v-for="(centro, index) in centrosFormadores" :key="index" :value="centro.id">{{centro.nombre}}</option>
                </select>
                <span class="text-danger" v-if="errors.centro_formador_id">{{errors.centro_formador_id[0]}}</span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label>Tipo de perfeccionamiento</label>
                <select class="form-control" v-model="especialidad.tipo_perfeccionamiento" @change="perfeccionamientoGet">
                    <option value="" selected disabled>-- Seleccione tipo --</option>
                    <option v-for="(tipo, index) in tipoPerfeccionamientos" :key="index" :value="tipo.id">{{tipo.nombre}}</option>
                </select>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label>Perfeccionamientos</label>
                <select :disabled="especialidad.tipo_perfeccionamiento == '' || perfeccionamientos.length == 0"  class="form-control" v-model="especialidad.perfeccionamiento">
                    <option value="" selected disabled>-- Seleccione perfeccionamiento --</option>
                    <option v-for="(perfeccionamiento, index) in perfeccionamientos" :key="index" :value="perfeccionamiento.id">{{perfeccionamiento.nombre}}</option>
                </select>
                <span class="pt-2" v-if="especialidad.tipo_perfeccionamiento != '' && perfeccionamientos.length == 0"><i>No existen registros</i></span>
                <span class="text-danger" v-if="errors.perfeccionamiento_id">{{errors.perfeccionamiento_id[0]}}</span>
              </div>
            </div>
          </div>
        </section>
        <section v-if="especialidad_pasos === 1">
          <div class="row pt-4">
            <div class="col-md-4">
              <div class="form-group">
                <label>Fecha de registro Superintendencia</label>
                <input type="date" class="form-control" v-model="especialidad.fecha_registro">
                <span class="text-danger" v-if="errors.fecha_registro">{{errors.fecha_registro[0]}}</span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label>Situación profesional</label>
                <select class="form-control" v-model="especialidad.situacion_profesional">
                    <option value="">-- Seleccione situación actual --</option>
                    <option v-for="(situacion, index) in situacionesActual" :key="index" :value="situacion.id">{{situacion.nombre}}</option>
                </select>
              </div>
            </div>
            <div class="col-md-4">
              <label>Motivo de formación</label>
              <select class="form-control" v-model="especialidad.origen">
                <option value="" selected disabled>-- Seleccione motivo --</option>
                <option value="PAO">Registro de PAO</option>
                <option value="EDF">Registro de EDF</option>
                <option value="OTROS">Otros</option>
              </select>
              <span class="text-danger" v-if="especialidad.origen === 'EDF' ">Si la formación es con fines de calcular EDF, se recomienda ingresar en modulo de "Registro EDF".</span>
              <span class="text-danger" v-if="errors.origen">{{errors.origen[0]}}</span>
            </div>
          </div>
        </section>
        <section v-if="especialidad_pasos === 2">
            <div class="row pt-4 d-flex justify-content-center">
              <div class="col-md-6">
                <label>Periodo de formación</label>
                <el-date-picker
                    size="mini"
                    v-model="especialidad.periodo"
                    type="daterange"
                    range-separator=">"
                    start-placeholder="Inicio"
                    end-placeholder="Término"
                    format="dd-MM-yyyy"
                    value-format="yyyy-MM-dd">
                </el-date-picker><br>
                <span class="text-danger" v-if="errors.inicio_formacion || errors.termino_formacion">{{errors.inicio_formacion[0]}}</span>
              </div>
            </div>
        </section>
        <section v-if="especialidad_pasos === 3">
          <div class="row pt-4 d-flex justify-content-center">
            <div class="col-md-10">
              <label>Observación</label>
              <textarea v-model="especialidad.observacion" class="form-control" cols="10" rows="5" placeholder="Ingrese observación..."></textarea>
            </div>
          </div>
        </section>
        <template #modal-footer>
            <div class="w-100">
                <button :disabled="especialidad_pasos == 0" @click.prevent="especialidad_pasos_volver" class="mt-3 btn btn-default float-left"><i class="fas fa-arrow-left"></i> Volver</button>
                <button v-show="especialidad_pasos != 3" @click.prevent="especialidad_pasos_siguiente" class="mt-3 btn btn-primary float-right">Siguiente <i class="fas fa-arrow-right"></i></button>
                <button v-show="especialidad_pasos == 3" @click.prevent="addFormacion" class="mt-3 btn btn-success float-right" v-loading.fullscreen.lock="fullscreenLoading">Añadir formación<i class="fas fa-plus"></i></button>
            </div>
        </template>
    </b-modal>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
export default {
  props:['profesional', 'formaciones'],
  data(){
    return{
      fullscreenLoading:false,
      especialidad_pasos:0,
      especialidad:{
          centro_formador:'',
          tipo_perfeccionamiento:'',
          perfeccionamiento:'',
          fecha_registro:'',
          situacion_profesional:'',
          origen:'',
          periodo:[],
          observacion:''
      },
      perfeccionamientos:[],
      errors:{}
    };
  },
  mounted(){
      this.getCentrosFormadres();
      this.getTipoPerfeccionamientos();
  },
  computed:{
    ...mapGetters({
            centrosFormadores: 'mantenedores/centrosFormadores',
            tipoPerfeccionamientos: 'mantenedores/tipoPerfeccionamientos',
            situacionesActual:'mantenedores/situacionesActual'
        })
  },
  methods:{
    ...mapActions({
            getCentrosFormadres: 'mantenedores/getCentrosFormadres',
            getTipoPerfeccionamientos: 'mantenedores/getTipoPerfeccionamientos'
        }),
    ...mapMutations({
      addMutation: 'formaciones/ADD_FORMACION',
      addFormacionToProfesional: 'calculoPao/ADD_FORMACION_TO_PROFESIONAL'
    }),
    async perfeccionamientoGet(){
      const url = '/api/mantenedores/tipo-perfeccionamientos/perfeccionamientos';
      const data = {
        tipo_perfeccionamiento_id: this.especialidad.tipo_perfeccionamiento
      };

      await this.$axios.$get(url, {params: data}).then(response => {
        if(response.length){
          this.perfeccionamientos = response;
        }
      }).catch(error => {
        console.log(error);
      });
    },
    async addFormacion(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = '/api/profesionales/profesional/add-formacion';
      const data = {
        profesional_id: this.profesional.id,
        fecha_registro: this.especialidad.fecha_registro,
        origen:this.especialidad.origen,
        situacion_profesional_id:this.especialidad.situacion_profesional,
        inicio_formacion: this.especialidad.periodo[0],
        termino_formacion: this.especialidad.periodo[1],
        observacion: this.especialidad.observacion,
        centro_formador_id: this.especialidad.centro_formador,
        perfeccionamiento_id: this.especialidad.perfeccionamiento
      };

      await this.$axios.$post(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
          if(response[0] === true){
            this.addMutation(response[1]);
            this.addFormacionToProfesional(response[1]);
            /* this.formaciones.push(response[1]); */
            this.$message({
                message: `${response[1].perfeccionamiento.tipo.nombre} ingresada con éxito.`,
                type: 'success'
            });
            this.clearAllModal();
          }else if(response === 'fechas-entrelazadas'){
            this.$alert('No se ingresó la formación, ya que el profesional tiene un registro en el mismo periodo de formación ingresado...', 'Error', {
              type:'warning',
              confirmButtonText: 'OK'
            });
            this.clearAllModal();
          }else{
            this.$message.error('No se ingreso la formación. Error de servidor');
            this.clearAllModal();
          }
      }).catch(error => {
        console.log(error.response.data.errors);
        this.errors = error.response.data.errors;
        this.fullscreenLoading = !this.fullscreenLoading;
        if(error.response.data.errors.centro_formador_id || error.response.data.errors.perfeccionamiento_id){
          this.especialidad_pasos = 0;
        }else if(error.response.data.errors.fecha_registro){
          this.especialidad_pasos = 1;
        }else{
          this.especialidad_pasos = 2;
        }
      });
    },
    clearAllModal(){
      for(let key in this.especialidad){
        this.especialidad[key] = '';
      }
      this.especialidad_pasos = 0;
      this.$root.$emit('bv::hide::modal', 'modal-add-especialidad', '#btnShow');
    },
    especialidad_pasos_volver(){
      this.especialidad_pasos--;
    },
    especialidad_pasos_siguiente(){
      this.especialidad_pasos++;
    }
  }
}
</script>

<style>

</style>
