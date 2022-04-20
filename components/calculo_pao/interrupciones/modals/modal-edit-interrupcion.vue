<template>
  <div>
      <b-modal v-model="modal" size="lg" title="Ingresar nueva interrupción" ok-only>
        <template #modal-header="{ close }">
          <h5 class="modal-title">Editar interrupción</h5>
          <button type="button" aria-label="Close" @click="close()" class="close">×</button>
        </template>
        <div class="row d-flex justify-content-center">
          <div class="col-md-12">
            <el-steps :active="paso_interrupciones_edit" finish-status="success">
                <el-step title="Contrato (devolución)" icon="el-icon-document-checked"></el-step>
                <el-step title="Periodo interrupción" icon="el-icon-date"></el-step>
                <el-step title="Causal" icon="el-icon-question"></el-step>
            </el-steps>
          </div>
        </div>
        <section v-if="paso_interrupciones_edit === 0">
          <div class="row d-flex justify-content-center">
            <div class="col-md-6">
              <label>Seleccione proceso de devolución afectado</label> <i>(Opcional)</i>
              <select class="form-control" v-model="interrupcion.devolucion">
                <option value="" selected>-- Seleccione devolución --</option>
                <option v-for="(devolucion, index) in interrupcion.devoluciones" :key="index" :value="devolucion.id">{{devolucion.establecimiento.sigla}} - {{DateTime.fromISO(devolucion.inicio_devolucion).toFormat('dd LLL yyyy')}} a {{DateTime.fromISO(devolucion.termino_devolucion).toFormat('dd LLL yyyy')}} en {{devolucion.tipo_contrato.nombre}} hrs.</option>
              </select>
              <span class="text-danger" v-if="errors.devolucion_id">{{errors.devolucion_id[0]}}</span>
            </div>
          </div>
        </section>
        <section v-if="paso_interrupciones_edit === 1">
          <div class="row d-flex justify-content-center">
            <div class="col-md-6">
                <label class="required">Periodo de interrupción</label>
                <el-date-picker
                    v-model="interrupcion.periodo"
                    type="daterange"
                    range-separator=">"
                    start-placeholder="Inicio"
                    end-placeholder="Término"
                    format="dd-MM-yyyy"
                    value-format="yyyy-MM-dd"
                    :clearable="false"
                    >
                </el-date-picker>
                <span class="text-danger" v-if="errors.inicio_interrupcion || errors.termino_interrupcion">{{errors.inicio_interrupcion[0]}}</span>
              </div>
          </div>
        </section>
        <section v-if="paso_interrupciones_edit === 2">
          <div class="row pt-4 d-flex justify-content-center">
            <div class="col-md-6">
              <label class="required">Seleccione causal de interrupción de PAO</label>
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
              <button :disabled="paso_interrupciones_edit == 0" @click.prevent="paso_interrupcion_volver" class="mt-3 btn btn-default float-left"><i class="fas fa-arrow-left"></i> Volver</button>
              <button v-show="paso_interrupciones_edit != 2" @click.prevent="paso_interrupcion_siguiente" class="mt-3 btn btn-primary float-right">Siguiente <i class="fas fa-arrow-right"></i></button>
              <button v-show="paso_interrupciones_edit == 2" @click.prevent="editInterrupcion" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Editar interrupción <i class="fas fa-plus"></i></button>
          </div>
      </template>
      </b-modal>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
export default {
  data(){
    return{
      fullscreenLoading:false,
      paso_interrupciones_edit:0,
      errors:{}
    };
  },
  mounted(){
    this.getCausales();
  },
  computed:{
    ...mapGetters({
        show: 'calculoPao/modalInterrupcion',
        causales: 'mantenedores/causales',
        paos:'calculoPao/paos'
    }),
    interrupcion(){
      return {...this.$store.state.calculoPao.interrupcionEditModal}
    },
    modal:{
      get() {
        return this.$store.getters['calculoPao/modalInterrupcion']
      },
      set(value) {
        this.$store.dispatch('calculoPao/updateModal')
      }
    }
  },
  methods:{
    ...mapMutations({
      closeAction:'calculoPao/CLOSE_MODAL',
      freshToInterrupcion:'calculoPao/FRESH_TO_INTERRUPCION',
      refreshModal: 'calculoPao/REFRESH_MODAL'
    }),
    ...mapActions({
      getCausales:'mantenedores/getCausales'
    }),
    close(){
      this.closeAction();
    },
    async editInterrupcion(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const indice_pao = this.paos.map(pao => pao.id).indexOf(this.interrupcion.pao_id);
      const url = `/api/profesionales/profesional/pao/edit-interrupcion/${this.interrupcion.uuid}`;
      const data = {
        devolucion_id:this.interrupcion.devolucion,
        inicio_interrupcion: this.interrupcion.periodo[0],
        termino_interrupcion: this.interrupcion.periodo[1],
        causal_id:this.interrupcion.causal,
        observacion:this.interrupcion.observacion
      };

      await this.$axios.$put(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        console.log(response);
        if(response[0] == true){
          response[1]['pao_index'] = indice_pao;
          this.freshToInterrupcion(response[1]);
          this.clearAllModal();
          this.$message({
              message: 'Interrupción editada con éxito.',
              type: 'success'
          });
        }else if(response === 'existe-interrupcion'){
            this.$alert('No se editó la interrupción, ya que el profesional tiene una interrupción en el mismo periodo de interrupción ingresado.', 'Error', {
              type:'warning',
              confirmButtonText: 'OK'
            });
            this.selectOtherDate();
        }else if(response === 'existe-devolucion'){
          this.$alert('No se editó la interrupción, ya que el profesional tiene una devolución en el mismo periodo de interrupción ingresado.', 'Error', {
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
          this.paso_interrupciones_edit = 0;
        }else if(error.response.data.errors.inicio_interrupcion || error.response.data.errors.termino_interrupcion){
          this.paso_interrupciones_edit = 1;
        }else{
          this.paso_interrupciones_edit = 2;
        }
      });
    },
    selectOtherDate(){
      this.paso_interrupciones_edit = 1;
      this.errors = {inicio_interrupcion: []};
      this.errors.inicio_interrupcion[0] = 'Seleccione otro periodo de interrupción.';
    },
    clearAllModal(){
      this.paso_interrupciones_edit = 0;
      this.errors = {};
      this.closeAction();
      this.refreshModal();
    },
    paso_interrupcion_volver(){
    this.paso_interrupciones_edit--;
    },
    paso_interrupcion_siguiente(){
    this.paso_interrupciones_edit++;
    },
  }
}
</script>

<style>

</style>
