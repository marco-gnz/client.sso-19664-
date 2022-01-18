<template>
  <div>
    <b-modal id="modal-add-causal" size="sb" title="Ingresar nueva causal de interrupción" ok-only>
      <div class="row">
        <div class="col-md-4">
          <label>Código SIRH</label>
          <input v-model="causal.cod_sirh" type="text" class="form-control" placeholder="Código SIRH">
          <span class="text-danger" v-if="errors.cod_sirh">{{errors.cod_sirh[0]}}</span>
        </div>
        <div class="col-md-8">
          <label>Descripción</label>
          <input v-model="causal.nombre" type="text" class="form-control" placeholder="Descripción de causal de interrupción">
          <span class="text-danger" v-if="errors.nombre">{{errors.nombre[0]}}</span>
        </div>
      </div>
      <template #modal-footer>
          <div class="w-100">
              <button @click.prevent="addCausal" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Añadir causal</button>
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
      causal:{
        cod_sirh:'',
        nombre:'',
      },
      errors:{}
    };
  },
  methods:{
    ...mapMutations({
      addCausalAction: 'mantenedores/ADD_CAUSAL'
    }),
    async addCausal(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = '/api/admin/mantenedores/causal/add-causal';
      const data = {
        cod_sirh: this.causal.cod_sirh,
        nombre: this.causal.nombre,
      };

      await this.$axios.$post(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.addCausalAction(response[1]);
          this.$message({
              message: 'Causal ingresada con éxito.',
              type: 'success'
          });
        }else{
          this.$message.error("Error. Error de servidor.");
        }
        this.$root.$emit('bv::hide::modal', 'modal-add-causal', '#btnShow');
        for(let key in this.causal){
          this.causal[key] = '';
        }
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
