<template>
  <div>
    <b-modal id="modal-add-centro" size="sb" title="Ingresar nuevo centro formador" ok-only>
      <div class="row">
        <div class="col-md-4">
          <label>Código SIRH</label>
          <input v-model="centro.cod_sirh" type="text" class="form-control" placeholder="Código SIRH">
          <span class="text-danger" v-if="errors.cod_sirh">{{errors.cod_sirh[0]}}</span>
        </div>
        <div class="col-md-8">
          <label>Nombre centro formador</label>
          <input v-model="centro.nombre" type="text" class="form-control" placeholder="Nombre de centro">
          <span class="text-danger" v-if="errors.nombre">{{errors.nombre[0]}}</span>
        </div>
      </div>
      <template #modal-footer>
          <div class="w-100">
              <button @click.prevent="addCentro" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Añadir centro</button>
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
      centro:{
        cod_sirh:'',
        nombre:''
      },
      errors:{}
    };
  },
  methods:{
    ...mapMutations({
      addCentroFormador: 'mantenedores/ADD_CENTRO_FORMADOR'
    }),
    async addCentro(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = '/api/admin/mantenedores/centro/add-centro';
      const data = {
        cod_sirh: this.centro.cod_sirh,
        nombre:this.centro.nombre
      };

      await this.$axios.$post(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.addCentroFormador(response[1]);
          this.$message({
              message: 'Centro formador ingresado con éxito.',
              type: 'success'
          });
        }else{
          this.$message.error("Error. Error de servidor.");
        }
        this.$root.$emit('bv::hide::modal', 'modal-add-centro', '#btnShow');
        for(let key in this.centro){
          this.centro[key] = '';
        }
        this.errors = {};
      }).catch(error => {
        this.fullscreenLoading = !this.fullscreenLoading;
        console.log(error);
        this.errors = error.response.data.errors;
      });
    }
  }
}
</script>

<style>

</style>
