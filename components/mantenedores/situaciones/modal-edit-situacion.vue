<template>
  <div>
    <b-modal id="modal-edit-situacion" size="sb" title="Editar situación actual" ok-only>
      <div class="row">
        <div class="col-md-4">
          <label>Código SIRH</label>
          <input v-model="cod_sirh" type="text" class="form-control" placeholder="Código SIRH">
          <span class="text-danger" v-if="errors.cod_sirh">{{errors.cod_sirh[0]}}</span>
        </div>
        <div class="col-md-8">
          <label>Nombre o descripción</label>
          <input v-model="nombre" type="text" class="form-control" placeholder="Nombre de situación">
          <span class="text-danger" v-if="errors.nombre">{{errors.nombre[0]}}</span>
        </div>
      </div>
      <template #modal-footer>
          <div class="w-100">
              <button @click.prevent="editSituacion" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Editar situación</button>
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
        return this.$store.state.mantenedores.situacion.cod_sirh;
      },
      set(newValue) {
        this.$store.commit('mantenedores/SITUACION_COD_SIRH', newValue);
      }
    },
    nombre:{
      get() {
        return this.$store.state.mantenedores.situacion.nombre;
      },
      set(newValue) {
        this.$store.commit('mantenedores/SITUACION_NOMBRE', newValue);
      }
    },
  },
  methods:{
    ...mapMutations({
      updateSituacionAction: 'mantenedores/UPDATE_SITUACION'
    }),
    async editSituacion(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/admin/mantenedores/situacion/edit-situacion/${this.$store.state.mantenedores.situacion.id}`;
      const data = {
        cod_sirh: this.cod_sirh,
        nombre: this.nombre
      };

      await this.$axios.$put(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.updateSituacionAction(response[1]);
          this.$message({
              message: 'Situacion editada con éxito.',
              type: 'success'
          });
        }else{
          this.$message.error("Error. Error de servidor.");
        }
        this.$root.$emit('bv::hide::modal', 'modal-edit-situacion', '#btnShow');
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
