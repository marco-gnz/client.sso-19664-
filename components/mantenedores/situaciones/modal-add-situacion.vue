<template>
  <div>
    <b-modal id="modal-add-situacion" size="sb" title="Ingresar nueva situación actual" ok-only>
      <div class="row">
        <div class="col-md-4">
          <label>Código SIRH</label>
          <input v-model="situacion.cod_sirh" type="text" class="form-control" placeholder="Código SIRH">
          <span class="text-danger" v-if="errors.cod_sirh">{{errors.cod_sirh[0]}}</span>
        </div>
        <div class="col-md-8">
          <label>Nombre o descripción</label>
          <input v-model="situacion.nombre" type="text" class="form-control" placeholder="Nombre de situación">
          <span class="text-danger" v-if="errors.nombre">{{errors.nombre[0]}}</span>
        </div>
      </div>
      <template #modal-footer>
          <div class="w-100">
              <button @click.prevent="addSituacion" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Añadir situación</button>
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
      situacion:{
        cod_sirh:'',
        nombre:''
      },
      errors:{}
    };
  },
  methods:{
    ...mapMutations({
      addSituacionAction: 'mantenedores/ADD_SITUACION'
    }),
    async addSituacion(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = '/api/admin/mantenedores/situacion/add-situacion';
      const data = {
        cod_sirh: this.situacion.cod_sirh,
        nombre:this.situacion.nombre
      };

      await this.$axios.$post(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.addSituacionAction(response[1]);
          this.$message({
              message: 'Situación ingresada con éxito.',
              type: 'success'
          });
        }else{
          this.$message.error("Error. Error de servidor.");
        }
        this.$root.$emit('bv::hide::modal', 'modal-add-situacion', '#btnShow');
        for(let key in this.situacion){
          this.situacion[key] = '';
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
