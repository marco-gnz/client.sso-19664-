<template>
  <div>
    <b-modal id="modal-add-red" size="lg" title="Ingresar nueva red asistencial" ok-only>
      <div class="row d-flex justify-content-center">
        <div class="col-md-2">
          <label>Código SIRH</label>
          <input v-model="red.cod_sirh" type="text" class="form-control" placeholder="Código SIRH">
          <span class="text-danger" v-if="errors.cod_sirh">{{errors.cod_sirh[0]}}</span>
        </div>
        <div class="col-md-4">
          <label>Nombre red</label>
          <input v-model="red.nombre" type="text" class="form-control" placeholder="Nombre de red">
          <span class="text-danger" v-if="errors.nombre">{{errors.nombre[0]}}</span>
        </div>
        <div class="col-md-2">
          <label>Siglas red</label>
          <input v-model="red.siglas" type="text" class="form-control" placeholder="Siglas">
          <span class="text-danger" v-if="errors.sigla">{{errors.sigla[0]}}</span>
        </div>
      </div>
      <template #modal-footer>
          <div class="w-100">
              <button @click.prevent="addRed" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Añadir red </button>
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
      red:{
        cod_sirh:'',
        nombre:'',
        siglas:''
      },
      errors:{}
    };
  },
  methods:{
     ...mapMutations({
      addRedAction: 'mantenedores/ADD_RED'
    }),
    async addRed(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = '/api/admin/mantenedores/red/add-red';
      const data = {
        cod_sirh: this.red.cod_sirh,
        nombre: this.red.nombre,
        sigla: this.red.siglas
      };

      await this.$axios.$post(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.addRedAction(response[1]);
          this.$message({
              message: 'Red ingresada con éxito.',
              type: 'success'
          });
        }else{
          this.$message.error("Error. Error de servidor.");
        }
        this.$root.$emit('bv::hide::modal', 'modal-add-red', '#btnShow');
        for(let key in this.red){
          this.red[key] = '';
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
