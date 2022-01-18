<template>
  <div>
    <b-modal id="modal-add-unidad" size="sb" title="Ingresar nueva unidad" ok-only>
      <div class="row">
        <div class="col-md-4">
          <label>Código SIRH</label>
          <input v-model="unidad.cod_sirh" type="text" class="form-control" placeholder="Código SIRH">
          <span class="text-danger" v-if="errors.cod_sirh">{{errors.cod_sirh[0]}}</span>
        </div>
        <div class="col-md-8">
          <label>Nombre unidad</label>
          <input v-model="unidad.nombre" type="text" class="form-control" placeholder="Nombre de unidad">
          <span class="text-danger" v-if="errors.nombre">{{errors.nombre[0]}}</span>
        </div>
      </div>
      <template #modal-footer>
          <div class="w-100">
              <button @click.prevent="addUnidad" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Añadir unidad</button>
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
      unidad:{
        cod_sirh:'',
        nombre:''
      },
      errors:{}
    };
  },
  methods:{
    ...mapMutations({
      addUnidadAction: 'mantenedores/ADD_UNIDAD'
    }),
    async addUnidad(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = '/api/admin/mantenedores/unidad/add-unidad';
      const data = {
        cod_sirh: this.unidad.cod_sirh,
        nombre:this.unidad.nombre
      };

      await this.$axios.$post(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.addUnidadAction(response[1]);
          this.$message({
              message: 'Unidad ingresada con éxito.',
              type: 'success'
          });
        }else{
          this.$message.error("Error. Error de servidor.");
        }
        this.$root.$emit('bv::hide::modal', 'modal-add-unidad', '#btnShow');
        for(let key in this.unidad){
          this.unidad[key] = '';
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
