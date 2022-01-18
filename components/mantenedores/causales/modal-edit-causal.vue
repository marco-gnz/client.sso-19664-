<template>
  <div>
    <b-modal id="modal-edit-causal" size="sb" title="Editar causal de interrupción" ok-only>
      <div class="row">
        <div class="col-md-4">
          <label>Código SIRH</label>
          <input v-model="cod_sirh" type="text" class="form-control" placeholder="Código SIRH">
          <span class="text-danger" v-if="errors.cod_sirh">{{errors.cod_sirh[0]}}</span>
        </div>
        <div class="col-md-8">
          <label>Descripción</label>
          <input v-model="nombre" type="text" class="form-control" placeholder="Descripción de causal de interrupción">
          <span class="text-danger" v-if="errors.nombre">{{errors.nombre[0]}}</span>
        </div>
      </div>
      <template #modal-footer>
          <div class="w-100">
              <button @click.prevent="editCausal" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Editar causal</button>
          </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import {mapMutations} from 'vuex';
export default {
  data(){
    return{
      fullscreenLoading:false,
      errors:{}
    };
  },
  computed:{
    cod_sirh:{
      get() {
        return this.$store.state.mantenedores.causal.cod_sirh;
      },
      set(newValue) {
        this.$store.commit('mantenedores/CAUSAL_COD_SIRH', newValue);
      }
    },
    nombre:{
      get() {
        return this.$store.state.mantenedores.causal.nombre;
      },
      set(newValue) {
        this.$store.commit('mantenedores/CAUSAL_NOMBRE', newValue);
      }
    },
  },
  methods:{
    ...mapMutations({
      updateCausalAction: 'mantenedores/UPDATE_CAUSAL'
    }),
    async editCausal(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/admin/mantenedores/causal/edit-causal/${this.$store.state.mantenedores.causal.id}`;
      const data = {
        cod_sirh: this.cod_sirh,
        nombre: this.nombre,
      };

      await this.$axios.$put(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.updateCausalAction(response[1]);
          this.$message({
              message: 'Causal editada con éxito.',
              type: 'success'
          });
        }else{
          this.$message.error("Error. Error de servidor.");
        }
        this.$root.$emit('bv::hide::modal', 'modal-edit-causal', '#btnShow');
        this.errors = {};
      }).catch(error => {
        this.fullscreenLoading = !this.fullscreenLoading;
        this.errors = error.response.data.errors;
        console.log(error);
      });
    }
  }
}
</script>

<style>

</style>
