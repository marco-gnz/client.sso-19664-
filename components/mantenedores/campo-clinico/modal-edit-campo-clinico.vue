<template>
  <div>
    <b-modal id="modal-edit-campo-clinico" size="sb" title="Editar campo clínico" ok-only>
      <div class="row">
        <div class="col-md-4">
          <label>Código SIRH</label>
          <input v-model="cod_sirh" type="text" class="form-control" placeholder="Código SIRH">
          <span class="text-danger" v-if="errors.cod_sirh">{{errors.cod_sirh[0]}}</span>
        </div>
        <div class="col-md-8">
          <label>Descripción</label>
          <input v-model="nombre" type="text" class="form-control" placeholder="Nombre de campo clínico">
          <span class="text-danger" v-if="errors.nombre">{{errors.nombre[0]}}</span>
        </div>
      </div>
      <template #modal-footer>
          <div class="w-100">
              <button @click.prevent="editCampoClinico" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Editar campo clínico</button>
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
        return this.$store.state.mantenedores.campo_clinico.cod_sirh;
      },
      set(newValue) {
        this.$store.commit('mantenedores/CAMPO_CLINICO_COD_SIRH', newValue);
      }
    },
    nombre:{
      get() {
        return this.$store.state.mantenedores.campo_clinico.nombre;
      },
      set(newValue) {
        this.$store.commit('mantenedores/CAMPO_CLINICO_NOMBRE', newValue);
      }
    },
  },
  methods:{
    ...mapMutations({
      updateCampoClinicoAction: 'mantenedores/UPDATE_CAMPO_CLINICO'
    }),
    async editCampoClinico(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/admin/mantenedores/campo-clinico/edit-campo-clinico/${this.$store.state.mantenedores.campo_clinico.id}`;
      const data = {
        cod_sirh: this.cod_sirh,
        nombre: this.nombre,
      };

      await this.$axios.$put(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.updateCampoClinicoAction(response[1]);
          this.$message({
              message: 'Campo clínico editado con éxito.',
              type: 'success'
          });
        }else{
          this.$message.error("Error. Error de servidor.");
        }
        this.$root.$emit('bv::hide::modal', 'modal-edit-campo-clinico', '#btnShow');
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
