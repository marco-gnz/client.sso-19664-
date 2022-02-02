<template>
  <div>
    <b-modal id="modal-edit-destinacion" size="lg" title="Editar destinación" ok-only>
      <div class="row d-flex justify-content-center">
        <div class="col-md-12">
              <el-steps :active="destinacion_pasos" finish-status="success">
                  <el-step title="Establecimiento" icon="el-icon-school"></el-step>
                  <el-step title="Periodo" icon="el-icon-date"></el-step>
                  <el-step title="Observación" icon="el-icon-chat-dot-square"></el-step>
              </el-steps>
          </div>
      </div>
      <section v-if="destinacion_pasos === 0">
        <div class="row pt-4">
          <div class="col-md-3">
            <div class="form-group">
              <label>Red hospitalaria</label>
              <select class="form-control" v-model="red" @change="getEstablecimientosChange">
                  <option value="" selected disabled>-- Seleccione red --</option>
                  <option v-for="(red, index) in redesHospitalarias" :key="index" :value="red.id">{{red.nombre}}</option>
              </select>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label>Establecimiento en destinación</label>
              <select :disabled="red === '' || establecimientos.length === 0" class="form-control" v-model="campo_clinico">
                  <option value="" selected disabled>-- Seleccione establecimiento --</option>
                  <option v-for="(campo, index) in establecimientos" :key="index" :value="campo.id">{{campo.nombre}}</option>
              </select>
              <span class="pt-2" v-if="red != '' && establecimientos.length == 0"><i>No existen establecimientos con ° de complejidad</i></span>
              <span class="text-danger" v-if="errors.establecimiento_id">{{errors.establecimiento_id[0]}}</span>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label>° Complejidad</label>
              <select :disabled="campo_clinico === '' || establecimientos.length === 0" class="form-control" v-model="grado">
                  <option value="" selected disabled>Seleccione</option>
                  <option v-for="(grado, index) in gradosComplejidad" :key="index" :value="grado.id">{{grado.grado}}</option>
              </select>
              <span class="text-danger" v-if="errors.establecimiento_id">{{errors.establecimiento_id[0]}}</span>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label>Unidad en destinación</label>
              <select :disabled="unidades.length === 0" class="form-control" v-model="unidad">
                  <option value="" selected disabled>-- Seleccione unidad --</option>
                  <option v-for="(unidad, index) in unidades" :key="index" :value="unidad.id">{{unidad.nombre}}</option>
              </select>
              <span class="text-danger" v-if="errors.unidad_id">{{errors.unidad_id[0]}}</span>
            </div>
          </div>
        </div>
      </section>
      <section v-if="destinacion_pasos === 1">
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-6">
              <label>Periodo en destinación</label>
              <el-date-picker
                  v-model="periodo"
                  type="daterange"
                  range-separator="a"
                  start-placeholder="Inicio"
                  end-placeholder="Término"
                  format="dd-MM-yyyy"
                  value-format="yyyy-MM-dd">
              </el-date-picker>
              <span class="text-danger" v-if="errors.inicio_periodo || errors.termino_periodo">{{errors.inicio_periodo[0]}}</span>
          </div>
        </div>
      </section>
      <section v-if="destinacion_pasos === 2">
          <div class="row pt-4 d-flex justify-content-center">
              <div class="col-md-10">
                  <label>Observación</label>
                  <textarea v-model="observacion" class="form-control" cols="10" rows="5" placeholder="Ingrese observación..."></textarea>
              </div>
          </div>
      </section>
      <template #modal-footer>
          <div class="w-100">
              <button :disabled="destinacion_pasos == 0"  @click.prevent="paso_destinacion_volver" class="mt-3 btn btn-default float-left"><i class="fas fa-arrow-left"></i> Volver</button>
              <button v-show="destinacion_pasos != 2"     @click.prevent="paso_destinacion_siguiente" class="mt-3 btn btn-primary float-right">Siguiente <i class="fas fa-arrow-right"></i></button>
              <button v-show="destinacion_pasos == 2"     @click.prevent="editDestinacion" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Editar destinación <i class="fas fa-plus"></i></button>
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
      destinacion_pasos:0,
      fullscreenLoading:false,
      errors:{}
    };
  },
  mounted(){
    this.getGradoComplejidad();
    this.getUnidades();
  },
  computed:{
    ...mapGetters({
      redesHospitalarias:'mantenedores/redesHospitalarias',
      establecimientos:'mantenedores/establecimientos',
      unidades:'mantenedores/unidades',
      gradosComplejidad:'mantenedores/gradosComplejidad'
    }),
    red:{
      get(){
        return this.$store.state.edf.destinacionEdit.red;
      },
      set (newValue){
        this.$store.commit('edf/DESTINACION_RED', newValue);
      }
    },
    campo_clinico:{
      get(){
        return this.$store.state.edf.destinacionEdit.campo_clinico;
      },
      set (newValue){
        this.$store.commit('edf/DESTINACION_CAMPO_CLINICO', newValue);
      }
    },
    grado:{
      get(){
        return this.$store.state.edf.destinacionEdit.grado;
      },
      set (newValue){
        this.$store.commit('edf/DESTINACION_GRADO', newValue);
      }
    },
    unidad:{
      get(){
        return this.$store.state.edf.destinacionEdit.unidad;
      },
      set (newValue){
        this.$store.commit('edf/DESTINACION_UNIDAD', newValue);
      }
    },
    periodo:{
      get(){
        return this.$store.state.edf.destinacionEdit.periodo;
      },
      set (newValue){
        this.$store.commit('edf/DESTINACION_PERIODO', newValue);
      }
    },
    destinacion(){
      return {...this.$store.state.edf.destinacionEdit}
    },
    observacion:{
      get(){
        return this.$store.state.edf.destinacionEdit.observacion;
      },
      set (newValue){
        this.$store.commit('edf/DESTINACION_OBSERVACION', newValue);
      }
    },
  },
  methods:{
    ...mapMutations({
      updateDestinacionAction:'edf/UPDATE_DESTINACION'
    }),
    ...mapActions({
      getGradoComplejidad:'mantenedores/getGradoComplejidad',
      getUnidades: 'mantenedores/getAllUnidades',
      getEstablecimientosAction: 'mantenedores/getEstablecimientos',
    }),
    getEstablecimientosChange(){
      this.campo_clinico = '';
      this.getEstablecimientosAction(this.red);
    },
    async editDestinacion(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/profesionales/profesional/edf/edit-destinacion/${this.destinacion.id}`;
      const data = {
        inicio_periodo: this.periodo[0],
        termino_periodo: this.periodo[1],
        observacion: this.observacion,
        establecimiento_id: this.campo_clinico,
        grado_complejidad_establecimiento_id: this.grado,
        unidad_id:this.unidad
      };

      await this.$axios.$put(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.clearAllModal();
          this.updateDestinacionAction(response[1]);
          this.$message({
              message: 'Destinación editada con éxito.',
              type: 'success'
          });
        }else if(response[0] === 'max-days'){
            const h = this.$createElement;
            let fecha = this.Duration.fromObject({ years: 0, months: 0,  days: Math.round(response[1])}).normalize().toObject();
            let message = `${fecha.years} ${fecha.years > 1 ? `años` : `años`}, ${fecha.months} ${fecha.months > 1 ? `meses` : `mes`} y ${fecha.days} ${fecha.days > 1 ? `días` : `día`}`;
            const messages = h('div', [
                            h('div', "Has pasado el límite total de EDF (10 años)."),
                            h('div', `Con el periodo ingresado, se contabilizó un total de ${message} de EDF.`)
                            ])
            this.$alert(messages, 'No se ingresó la destinación', {
                type:'error',
                confirmButtonText: 'OK',
            });
            this.destinacion_pasos = 1;
            this.errors = {inicio_periodo: []};
            this.errors.inicio_periodo[0] = 'Modifique el periodo en destinación.';
        }else if(response[0] === 'max-destinacion'){
            const h = this.$createElement;
            let fecha = this.Duration.fromObject({ years: 0, months: 0,  days: Math.round(response[1])}).normalize().toObject();
            let message = `${fecha.years} ${fecha.years > 1 ? `años` : `años`}, ${fecha.months} ${fecha.months > 1 ? `meses` : `mes`} y ${fecha.days} ${fecha.days > 1 ? `días` : `día`}`;
            const messages = h('div', [
                            h('div', "Has pasado el límite total de ED (6 años)."),
                            h('div', `Con el periodo ingresado, se contabilizó un total de ${message} de ED.`)
                            ])
            this.$alert(messages, 'No se ingresó la destinación', {
                type:'error',
                confirmButtonText: 'OK',
            });
            this.destinacion_pasos = 1;
            this.errors = {inicio_periodo: []};
            this.errors.inicio_periodo[0] = 'Modifique el periodo en destinación.';
        }else if(response === 'fechas-entrelazadas-formacion'){
          this.$alert('No se editó la destinación, ya que el profesional tiene un registro en formaciones en el mismo periodo ingresado...', 'Error', {
            type:'warning',
            confirmButtonText: 'OK'
          });
          this.destinacion_pasos = 1;
          this.errors = {inicio_periodo: []};
          this.errors.inicio_periodo[0] = 'Modifique el periodo en destinación.';
        }else if(response === 'fechas-entrelazadas-destinacion'){
          this.$alert('No se editó la destinación, ya que el profesional tiene un registro en destinaciones en el mismo periodo ingresado...', 'Error', {
            type:'warning',
            confirmButtonText: 'OK'
          });
          this.destinacion_pasos = 1;
          this.errors = {inicio_periodo: []};
          this.errors.inicio_periodo[0] = 'Modifique el periodo en destinación.';
        }else{
          this.$message.error('No se editó la destinación. Error de servidor');
          this.clearAllModal();
        }
      }).catch(error => {
        this.fullscreenLoading = !this.fullscreenLoading;
        this.errors = error.response.data.errors;
        if(error.response.data.errors.establecimiento_id || error.response.data.errors.unidad_id){
          this.destinacion_pasos = 0;
        }else if (error.response.data.errors.inicio_periodo || error.response.data.errors.termino_periodo){
          this.destinacion_pasos = 1;
        }else{
          this.destinacion_pasos = 2;
        }
      });
    },
    clearAllModal(){
      this.destinacion_pasos = 0;
      this.$root.$emit('bv::hide::modal', 'modal-edit-destinacion', '#btnShow');
      this.errors = {};
    },
    paso_destinacion_volver(){
      this.destinacion_pasos--;
    },
    paso_destinacion_siguiente(){
      this.destinacion_pasos++;
    }
  }
}
</script>

<style>

</style>
