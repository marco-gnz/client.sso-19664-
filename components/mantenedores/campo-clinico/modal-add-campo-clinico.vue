<template>
  <div>
    <b-modal id="modal-add-campo-clinico" size="sb" title="Ingresar nuevo campo clínico" ok-only>
      <div class="row">
        <div class="col-md-4">
          <label>Código SIRH</label>
          <input v-model="campoClinico.cod_sirh" type="text" class="form-control" placeholder="Código SIRH">
          <span class="text-danger" v-if="errors.cod_sirh">{{errors.cod_sirh[0]}}</span>
        </div>
        <div class="col-md-8">
          <label>Descripción</label>
          <input v-model="campoClinico.nombre" type="text" class="form-control" placeholder="Nombre de campo clínico">
          <span class="text-danger" v-if="errors.nombre">{{errors.nombre[0]}}</span>
        </div>
      </div>
      <template #modal-footer>
          <div class="w-100">
              <button @click.prevent="addCampoClinico" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Añadir campo clínico</button>
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
      campoClinico:{
        cod_sirh:'',
        nombre:'',
      },
      errors:{}
    };
  },
  methods:{
    ...mapMutations({
      addCampoClinicoAction: 'mantenedores/ADD_CAMPO_CLINICO'
    }),
    async addCampoClinico(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = '/api/admin/mantenedores/campo-clinico/add-campo-clinico';
      const data = {
        cod_sirh: this.campoClinico.cod_sirh,
        nombre: this.campoClinico.nombre,
      };

      await this.$axios.$post(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        console.log(response);
        if(response[0] === true){
          this.addCampoClinicoAction(response[1]);
          this.$message({
              message: 'Campo clínico ingresado con éxito.',
              type: 'success'
          });
        }else{
          this.$message.error("Error. Error de servidor.");
        }
        this.$root.$emit('bv::hide::modal', 'modal-add-campo-clinico', '#btnShow');
        for(let key in this.campoClinico){
          this.campoClinico[key] = '';
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
