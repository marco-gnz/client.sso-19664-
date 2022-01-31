<template>
  <div>
    <b-modal id="modal-add-destinacion" size="lg" title="Ingresar nueva destinación" ok-only>
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
              <select class="form-control" v-model="destinacion.red" @change="getEstablecimientosChange">
                  <option value="" selected disabled>-- Seleccione red --</option>
                  <option v-for="(red, index) in redesHospitalarias" :key="index" :value="red.id">{{red.nombre}}</option>
              </select>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label>Establecimiento en destinación</label>
              <select :disabled="destinacion.red === '' || establecimientos.length === 0" class="form-control" v-model="destinacion.campo_clinico">
                  <option value="" selected disabled>-- Seleccione establecimiento --</option>
                  <option v-for="(campo, index) in establecimientos" :key="index" :value="campo">{{campo.nombre}}</option>
              </select>
              <span class="pt-2" v-if="destinacion.red != '' && establecimientos.length == 0"><i>No existen establecimientos con ° de complejidad</i></span>
              <span class="text-danger" v-if="errors.establecimiento_id">{{errors.establecimiento_id[0]}}</span>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label>° Complejidad</label>
              <select :disabled="destinacion.campo_clinico === '' || establecimientos.length === 0" class="form-control" v-model="destinacion.grado">
                  <option value="" selected disabled>Seleccione</option>
                  <option v-for="(grado, index) in gradosComplejidad" :key="index" :value="grado.id">{{grado.grado}}</option>
              </select>
              <span class="text-danger" v-if="errors.establecimiento_id">{{errors.establecimiento_id[0]}}</span>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label>Unidad en destinación</label>
              <select :disabled="unidades.length === 0" class="form-control" v-model="destinacion.unidad">
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
                  v-model="destinacion.periodo"
                  type="daterange"
                  range-separator=">"
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
                  <textarea v-model="destinacion.observacion" class="form-control" cols="10" rows="5" placeholder="Ingrese observación..."></textarea>
              </div>
          </div>
      </section>
      <template #modal-footer>
          <div class="w-100">
              <button :disabled="destinacion_pasos == 0"  @click.prevent="paso_destinacion_volver" class="mt-3 btn btn-default float-left"><i class="fas fa-arrow-left"></i> Volver</button>
              <button v-show="destinacion_pasos != 2"     @click.prevent="paso_destinacion_siguiente" class="mt-3 btn btn-primary float-right">Siguiente <i class="fas fa-arrow-right"></i></button>
              <button v-show="destinacion_pasos == 2"     @click.prevent="addDestinacion" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Añadir destinación <i class="fas fa-plus"></i></button>
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
      destinacion_pasos:0,
      destinacion:{
        red:'',
        campo_clinico:'',
        grado:'',
        unidad:'',
        periodo:[],
        observacion:''
      },
      errors:{}
    };
  },
  mounted(){
    this.getRedesHospitalarias();
    this.getUnidades();
    this.getGradoComplejidad();
  },
  computed:{
    ...mapGetters({
      redesHospitalarias:'mantenedores/redesHospitalarias',
      establecimientos:'mantenedores/establecimientosGradoComplejidad',
      unidades:'mantenedores/unidades',
      gradosComplejidad:'mantenedores/gradosComplejidad'
    })
  },
  methods:{
    ...mapActions({
      getRedesHospitalarias:'mantenedores/getRedesHospitalarias',
      getEstablecimientosAction: 'mantenedores/getEstablecimientosGradoComplejidad',
      getUnidades: 'mantenedores/getUnidades',
      getGradoComplejidad:'mantenedores/getGradoComplejidad'
    }),
    ...mapMutations({
      storeDestinacionAction: 'edf/STORE_DESTINACION'
    }),
    getEstablecimientosChange(){
      this.getEstablecimientosAction(this.destinacion.red);
    },
    async addDestinacion(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = '/api/profesionales/profesional/edf/add-destinacion';
      const data = {
        inicio_periodo: this.destinacion.periodo[0],
        termino_periodo: this.destinacion.periodo[1],
        observacion: this.destinacion.observacion,
        profesional_id: this.profesional.id,
        establecimiento_id: (this.destinacion.campo_clinico != '') ? this.destinacion.campo_clinico.id : '',
        grado_complejidad_establecimiento_id: this.destinacion.grado,
        unidad_id:this.destinacion.unidad
      };

      await this.$axios.$post(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.clearAllModal();
          this.storeDestinacionAction(response[1]);
          this.$message({
              message: 'Destinación ingresada con éxito.',
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
          this.$alert('No se ingresó la destinación, ya que el profesional tiene un registro en formaciones en el mismo periodo ingresado...', 'Error', {
            type:'warning',
            confirmButtonText: 'OK'
          });
          this.destinacion_pasos = 1;
          this.errors = {inicio_periodo: []};
          this.errors.inicio_periodo[0] = 'Modifique el periodo en destinación.';
        }else if(response === 'fechas-entrelazadas-destinacion'){
          this.$alert('No se ingresó la destinación, ya que el profesional tiene un registro en destinaciones en el mismo periodo ingresado...', 'Error', {
            type:'warning',
            confirmButtonText: 'OK'
          });
          this.destinacion_pasos = 1;
          this.errors = {inicio_periodo: []};
          this.errors.inicio_periodo[0] = 'Modifique el periodo en destinación.';
        }else{
          this.$message.error('No se ingresó la destinación. Error de servidor');
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
      for(let key in this.destinacion){
        this.destinacion[key] = '';
      }
      this.destinacion.periodo = [];
      this.destinacion_pasos = 0;
      this.$root.$emit('bv::hide::modal', 'modal-add-destinacion', '#btnShow');
      this.errors = {};
    },
    paso_destinacion_volver(){
      this.destinacion_pasos--;
    },
    paso_destinacion_siguiente(){
      this.destinacion_pasos++;
    }
  },
}
</script>

<style>

</style>
