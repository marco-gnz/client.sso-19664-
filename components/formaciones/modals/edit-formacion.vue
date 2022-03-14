<template>
  <div>
    <b-modal id="modal-edit-formacion" size="lg" title="Editar formación" ok-only>
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
                <select class="form-control" v-model="centro_formador">
                    <option value="" selected disabled>-- Seleccione centro --</option>
                    <option v-for="(centro, index) in centrosFormadores" :key="index" :value="centro.id">{{centro.nombre}}</option>
                </select>
                <span class="text-danger" v-if="errors.centro_formador_id">{{errors.centro_formador_id[0]}}</span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label>Tipo de perfeccionamiento</label>
                <select class="form-control" v-model="tipo_perfeccionamiento" @change="perfeccionamientoGet">
                    <option value="" selected disabled>-- Seleccione tipo --</option>
                    <option v-for="(tipo, index) in tipoPerfeccionamientos" :key="index" :value="tipo.id">{{tipo.nombre}}</option>
                </select>
              </div>
            </div>
            <div class="col-md-3">
              <label>Perfeccionamiento</label>
              <select :disabled="tipo_perfeccionamiento == '' || perfeccionamientos.length == 0" class="form-control" v-model="perfeccionamiento">
                  <option value="" selected disabled>-- Seleccione perfeccionamiento --</option>
                  <option v-for="(perfeccionamiento, index) in perfeccionamientos" :key="index" :value="perfeccionamiento.id">{{perfeccionamiento.nombre}}</option>
              </select>
              <span class="text-danger" v-if="errors.perfeccionamiento_id">{{errors.perfeccionamiento_id[0]}}</span>
              <span class="pt-2" v-if="tipo_perfeccionamiento != '' && perfeccionamientos.length == 0"><i>No existen registros</i></span>
          </div>
        </div>
      </section>
      <section v-if="especialidad_pasos === 1">
          <div class="row pt-4">
            <div class="col-md-4">
              <div class="form-group">
                <label>Fecha de registro Superintendencia</label>
                <input type="date" class="form-control" v-model="fecha_registro">
                <span class="text-danger" v-if="errors.fecha_registro">{{errors.fecha_registro[0]}}</span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label>Situación profesional</label>
                <select class="form-control" v-model="situacion_profesional">
                    <option value="">-- Seleccione situación actual --</option>
                    <option v-for="(situacion, index) in situacionesActual" :key="index" :value="situacion.id">{{situacion.nombre}}</option>
                </select>
              </div>
            </div>
            <div class="col-md-4">
              <label>Motivo de formación</label>
              <select class="form-control" v-model="origen">
                <option value="" selected disabled>-- Seleccione motivo --</option>
                <option value="PAO">Registro de PAO</option>
                <option value="EDF">Registro de EDF</option>
                <option value="OTROS">Otros</option>
              </select>
              <span class="text-danger" v-if="origen === 'EDF' ">Si la formación es con fines de calcular EDF, se recomienda ingresar en modulo de "Registro EDF".</span>
              <span class="text-danger" v-if="errors.origen">{{errors.origen[0]}}</span>
            </div>
          </div>
        </section>
        <section v-if="especialidad_pasos === 2">
            <div class="row pt-4 d-flex justify-content-center">
              <template v-if="formacion.count_paos > 0">
                <div class="col-md-6">
                  <el-alert
                    :closable="false"
                    title="Periodo en formación restringido"
                    type="warning"
                    description="Al modificar el periodo, se pueden producir inconsistencias en calculos (PAO) y lógica del sistema."
                    show-icon>
                  </el-alert>
                </div>
              </template>
              <template v-else>
                <div class="col-md-6">
                  <label>Periodo de formación</label>
                  <el-date-picker
                      size="mini"
                      v-model="periodo"
                      type="daterange"
                      range-separator=">"
                      start-placeholder="Inicio"
                      end-placeholder="Término"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd">
                  </el-date-picker><br>
                  <span class="text-danger" v-if="errors.inicio_formacion || errors.termino_formacion">{{errors.inicio_formacion[0]}}</span>
                </div>
              </template>
            </div>
        </section>
        <section v-if="especialidad_pasos === 3">
          <div class="row pt-4 d-flex justify-content-center">
            <div class="col-md-10">
              <label>Observación</label>
              <textarea v-model="observacion" class="form-control" cols="10" rows="5" placeholder="Ingrese observación..."></textarea>
            </div>
          </div>
        </section>
      <template #modal-footer>
          <div class="w-100">
              <button :disabled="especialidad_pasos == 0" @click.prevent="paso_formacion_volver" class="mt-3 btn btn-default float-left"><i class="fas fa-arrow-left"></i> Volver</button>
              <button v-show="especialidad_pasos != 3" @click.prevent="paso_formacion_siguiente" class="mt-3 btn btn-primary float-right">Siguiente <i class="fas fa-arrow-right"></i></button>
              <button v-show="especialidad_pasos == 3" @click.prevent="editFormacion" class="mt-3 btn btn-success float-right" v-loading.fullscreen.lock="fullscreenLoading">Editar formación <i class="fas fa-plus"></i></button>
          </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapActions} from 'vuex';
export default {
  data(){
    return{
      especialidad_pasos:0,
      errors:{},
      fullscreenLoading:false
    };
  },
  mounted(){

  },
  computed:{
    ...mapGetters({
        centrosFormadores:'mantenedores/centrosFormadores',
        tipoPerfeccionamientos: 'mantenedores/tipoPerfeccionamientos',
        situacionesActual:'mantenedores/situacionesActual',
        perfeccionamientos:'mantenedores/perfeccionamientos'
    }),
    formacion(){
      return {...this.$store.state.edf.formacionEdit}
    },
    centro_formador:{
      get(){
        return this.$store.state.edf.formacionEdit.centro_formador;
      },
      set (newValue){
        this.$store.commit('edf/FORMACION_CENTRO_FORMADOR', newValue);
      }
    },
    tipo_perfeccionamiento:{
      get(){
        return this.$store.state.edf.formacionEdit.tipo_perfeccionamiento;
      },
      set (newValue){
        this.$store.commit('edf/FORMACION_TIPO_PERFECCIONAMIENTO', newValue);
      }
    },
    perfeccionamiento:{
      get(){
        return this.$store.state.edf.formacionEdit.perfeccionamiento;
      },
      set (newValue){
        this.$store.commit('edf/FORMACION_PERFECCIONAMIENTO', newValue);
      }
    },
    fecha_registro:{
      get(){
        return this.$store.state.edf.formacionEdit.fecha_registro;
      },
      set (newValue){
        this.$store.commit('edf/FORMACION_FECHA_REGISTRO', newValue);
      }
    },
    situacion_profesional:{
      get(){
        return this.$store.state.edf.formacionEdit.situacion_profesional;
      },
      set (newValue){
        this.$store.commit('edf/FORMACION_SITUACION_PROFESIONAL', newValue);
      }
    },
    origen:{
      get(){
        return this.$store.state.edf.formacionEdit.origen;
      },
      set (newValue){
        this.$store.commit('edf/FORMACION_ORIGEN', newValue);
      }
    },
    periodo:{
      get(){
        return this.$store.state.edf.formacionEdit.periodo;
      },
      set (newValue){
        this.$store.commit('edf/FORMACION_PERIODO', newValue);
      }
    },
    observacion:{
      get(){
        return this.$store.state.edf.formacionEdit.observacion;
      },
      set (newValue){
        this.$store.commit('edf/FORMACION_OBSERVACION', newValue);
      }
    },
  },
  methods:{
    ...mapActions({
        getPerfeccionamiento:'mantenedores/getPerfeccionamientoDynamic'
    }),
    ...mapMutations({
      updateFormacion: 'formaciones/UPDATE_FORMACION',
      updateFormacionToProfesional: 'calculoPao/UPDATE_FORMACION_TO_PROFESIONAL'
    }),
    perfeccionamientoGet(){
      this.perfeccionamiento = '';
      this.getPerfeccionamiento(this.tipo_perfeccionamiento);
    },
    async editFormacion(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/profesionales/profesional/edit-formacion/${this.formacion.id}`;
      const data = {
        fecha_registro: this.fecha_registro,
        origen:this.origen,
        centro_formador_id: this.centro_formador,
        perfeccionamiento_id: this.perfeccionamiento,
        situacion_profesional_id:this.situacion_profesional,
        inicio_formacion:  this.periodo[0],
        termino_formacion: this.periodo[1],
        observacion:this.observacion
      };

      this.$axios.$put(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.updateFormacion(response[1]);
          this.updateFormacionToProfesional(response[1]);
          this.$message({
              message: `${response[1].perfeccionamiento.tipo.nombre} editada con éxito.`,
              type: 'success'
          });
          this.clearAllModal();
        }
      }).catch(error => {
        this.fullscreenLoading = !this.fullscreenLoading;
        console.log(error);
      });
    },
    clearAllModal(){
      this.especialidad_pasos = 0;
      this.$root.$emit('bv::hide::modal', 'modal-edit-formacion', '#btnShow');
    },
    paso_formacion_volver(){
        this.especialidad_pasos--;
    },
    paso_formacion_siguiente(){
        this.especialidad_pasos++;
    },
  }
}
</script>

<style>

</style>
