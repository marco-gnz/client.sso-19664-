<template>
    <div>
      <b-modal id="modal-add-interrupcion" size="lg" title="Ingresar nueva interrupción" ok-only>
        <div class="row d-flex justify-content-center">
          <div class="col-md-12">
            <el-steps :active="paso_interrupciones" finish-status="success">
                <el-step title="Contrato (devolución)" icon="el-icon-document-checked"></el-step>
                <el-step title="Periodo interrupción" icon="el-icon-date"></el-step>
                <el-step title="Causal" icon="el-icon-question"></el-step>
            </el-steps>
          </div>
        </div>
        <section v-if="paso_interrupciones === 0">
          <div class="row pt-4 d-flex justify-content-center">
            <div class="col-md-6">
              <label>Seleccione proceso de devolución (contrato) afectado</label>
              <select class="form-control" v-model="interrupcion.devolucion">
                <option value="" selected disabled>-- Seleccione devolución --</option>
                <option v-for="(devolucion, index) in pao.devoluciones" :key="index" :value="devolucion">#{{devolucion.uuid.substring(0, 5)}} - {{devolucion.establecimiento.sigla}} - {{DateTime.fromISO(devolucion.inicio_devolucion).toFormat('dd LLL yyyy')}} a {{DateTime.fromISO(devolucion.termino_devolucion).toFormat('dd LLL yyyy')}} en {{devolucion.tipo_contrato.nombre}} hrs.</option>
              </select>
              <span class="text-danger" v-if="errors.devolucion_id">{{errors.devolucion_id[0]}}</span>
            </div>
          </div>
        </section>
        <section v-if="paso_interrupciones === 1">
          <div class="row pt-4 d-flex justify-content-center">
              <div class="col-md-6">
                <label>Ingrese periodo de interrupción</label>
                <el-date-picker
                    v-model="interrupcion.periodo"
                    type="daterange"
                    range-separator=">"
                    start-placeholder="Inicio"
                    end-placeholder="Término"
                    format="dd-MM-yyyy"
                    value-format="yyyy-MM-dd"
                    :default-value="(defaultDate != undefined) ? defaultDate : DateTime.fromISO(pao.periodo_termino).toFormat('yyyy-LL-dd')"
                    >
                </el-date-picker>
                <span class="text-danger" v-if="errors.inicio_interrupcion || errors.termino_interrupcion">{{errors.inicio_interrupcion[0]}}</span>
              </div>
          </div>
        </section>
        <section v-if="paso_interrupciones === 2">
          <div class="row pt-4 d-flex justify-content-center">
            <div class="col-md-6">
              <label>Seleccione causal de interrupción de PAO</label>
              <select class="form-control" v-model="interrupcion.causal">
                  <option value="" selected disabled>-- Seleccione causal --</option>
                  <option v-for="(causal, index) in causales" :key="index" :value="causal.id">{{causal.nombre}}</option>
              </select>
              <span class="text-danger" v-if="errors.causal_id">{{errors.causal_id[0]}}</span>
            </div>
          </div>
          <div class="row pt-4 d-flex justify-content-center">
              <div class="col-md-10">
                  <label>Observación</label>
                  <textarea v-model="interrupcion.observacion" class="form-control" cols="10" rows="5" placeholder="Ingrese observación..."></textarea>
              </div>
          </div>
        </section>
        <template #modal-footer>
          <div class="w-100">
              <button :disabled="paso_interrupciones == 0" @click.prevent="paso_interrupcion_volver" class="mt-3 btn btn-default float-left"><i class="fas fa-arrow-left"></i> Volver</button>
              <button v-show="paso_interrupciones != 2" @click.prevent="paso_interrupcion_siguiente" class="mt-3 btn btn-primary float-right">Siguiente <i class="fas fa-arrow-right"></i></button>
              <button v-show="paso_interrupciones == 2" @click.prevent="addInterrupcion" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Añadir interrupción <i class="fas fa-plus"></i></button>
          </div>
      </template>
      </b-modal>
    </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';
export default {
  props:['pao'],
  data(){
    return{
      fullscreenLoading:false,
      paso_interrupciones:0,
      interrupcion:{
        devolucion:'',
        periodo:[],
        causal:'',
        observacion:''
      },
      errors:{},
      removeDates:{
        disabledDate: (time) => {
          const datetime    = this.DateTime.fromMillis(time.getTime());
          const dates       = datetime.toFormat('yyyy-LL-dd');
          const dateArrays  = [];

          if(this.pao.devoluciones.length){
            this.pao.devoluciones.forEach(devolucion => {
              let inicio  = this.DateTime.fromISO(devolucion.inicio_devolucion).toFormat('yyyy-LL-dd');
              let termino = this.DateTime.fromISO(devolucion.termino_devolucion).toFormat('yyyy-LL-dd');

              const dateMove  = new Date(inicio);
              let strDate     = inicio;

              while (strDate < termino) {
                strDate = dateMove.toISOString().slice(0, 10);
                dateArrays.push(strDate);
                dateMove.setDate(dateMove.getDate() + 1);
              }
            });
          }

          if(this.pao.interrupciones.length){
            this.pao.interrupciones.forEach(interrupcion => {
              let inicio  = this.DateTime.fromISO(interrupcion.inicio_interrupcion).toFormat('yyyy-LL-dd');
              let termino = this.DateTime.fromISO(interrupcion.termino_interrupcion).toFormat('yyyy-LL-dd');

              const dateMoveI  = new Date(inicio);
              let strDateI     = inicio;

              while (strDateI < termino) {
                strDateI = dateMoveI.toISOString().slice(0, 10);
                dateArrays.push(strDateI);
                dateMoveI.setDate(dateMoveI.getDate() + 1);
              }
            });
          }
          return dates < this.pao.periodo_inicio || dateArrays.indexOf(dates)>-1;
        }
      }
    };
  },
  mounted(){
    this.getCausales();
  },
  computed:{
    ...mapGetters({
      causales: 'mantenedores/causales'
    }),
    defaultDate(){
      const dates = [];

      if(this.pao.interrupciones.length){
        this.pao.interrupciones.forEach(interrupcion => {
            dates.push(interrupcion.termino_interrupcion);
        });
      }

      if(this.pao.devoluciones.length){
        this.pao.devoluciones.forEach(devolucion => {
            dates.push(devolucion.termino_devolucion);
        });
      }

      if(dates.length){
        let fecha_max = dates.reduce(function (valor1, valor2) { return new Date(valor1) > new Date(valor2) ? valor1 : valor2; }, 0);
        let fecha_max_format = this.DateTime.fromISO(fecha_max);
        let fecha = fecha_max_format.startOf('day').plus({days: 1}).toFormat('yyyy-LL-dd');
        return fecha;
      }else{
        let fecha = this.DateTime.fromISO(this.pao.especialidad.termino_formacion);
        return fecha.startOf('day').plus({days: 1}).toFormat('yyyy-LL-dd');
      }

    }
  },
  methods:{
    ...mapMutations({
      addInterrupcionToPao:'calculoPao/ADD_INTERRUPCION_PAO'
    }),
    ...mapActions({
      getCausales:'mantenedores/getCausales'
    }),
    paso_interrupcion_volver(){
      this.paso_interrupciones--;
    },
    paso_interrupcion_siguiente(){
      this.paso_interrupciones++;
    },
    async addInterrupcion(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url   = '/api/profesionales/profesional/pao/add-interrupcion';
      const data  = {
        pao_id: this.pao.id,
        devolucion_id:this.interrupcion.devolucion.id,
        inicio_interrupcion: this.interrupcion.periodo[0],
        termino_interrupcion: this.interrupcion.periodo[1],
        causal_id:this.interrupcion.causal,
        observacion:this.interrupcion.observacion,
        profesional_id:this.pao.especialidad.profesional_id
      };

      await this.$axios.$post(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] == true){
          response[1]['pao_index'] = this.pao.index;
          this.addInterrupcionToPao(response[1]);
          this.clearAllModal();
          this.$message({
              message: 'Interrupción ingresada con éxito.',
              type: 'success'
          });
        }else if(response === 'existe-interrupcion'){
            this.$alert('No se ingresó la interrupción, ya que el profesional tiene una interrupción en el mismo periodo de interrupción ingresado.', 'Error', {
              type:'warning',
              confirmButtonText: 'OK'
            });
            this.selectOtherDate();
        }else if(response === 'existe-devolucion'){
          this.clearAllModal();
          this.$alert('No se ingresó la interrupción, ya que el profesional tiene una devolución en el mismo periodo de interrupción ingresado.', 'Error', {
              type:'warning',
              confirmButtonText: 'OK'
            });
            this.selectOtherDate();
        }else{
          this.$message.error("Error de servidor");
        }
      }).catch(error => {
        this.fullscreenLoading = !this.fullscreenLoading;
        console.log(error.response.data.errors);
        this.errors = error.response.data.errors;

        if(error.response.data.errors.devolucion_id){
          this.paso_interrupciones = 0;
        }else if(error.response.data.errors.inicio_interrupcion || error.response.data.errors.termino_interrupcion){
          this.paso_interrupciones = 1;
        }else{
          this.paso_interrupciones = 2;
        }
      });
    },
    selectOtherDate(){
      this.paso_interrupciones = 1;
      this.errors = {inicio_interrupcion: []};
      this.errors.inicio_interrupcion[0] = 'Seleccione otro periodo de interrupción.';
    },
    clearAllModal(){
      for(let key in this.interrupcion){
        this.interrupcion[key] = '';
      }
      this.interrupcion.periodo = [];
      this.paso_interrupciones = 0;
      this.$root.$emit('bv::hide::modal', 'modal-add-interrupcion', '#btnShow');
      this.errors = {};
    }
  }
}
</script>

<style>

</style>
