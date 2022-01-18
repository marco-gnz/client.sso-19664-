<template>
  <div>
    <b-modal id="modal-edit-unidad" size="sb" title="Editar unidad" ok-only>
      <div class="row">
        <div class="col-md-4">
          <label>Código SIRH</label>
          <input v-model="cod_sirh" type="text" class="form-control" placeholder="Código SIRH">
          <span class="text-danger" v-if="errors.cod_sirh">{{errors.cod_sirh[0]}}</span>
        </div>
        <div class="col-md-8">
          <label>Nombre red</label>
          <input v-model="nombre" type="text" class="form-control" placeholder="Nombre de red">
          <span class="text-danger" v-if="errors.nombre">{{errors.nombre[0]}}</span>
        </div>
      </div>
      <template #modal-footer>
          <div class="w-100">
              <button @click.prevent="editUnidad" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Editar unidad</button>
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
        return this.$store.state.mantenedores.unidad.cod_sirh;
      },
      set(newValue) {
        this.$store.commit('mantenedores/UNIDAD_COD_SIRH', newValue);
      }
    },
    nombre:{
      get() {
        return this.$store.state.mantenedores.unidad.nombre;
      },
      set(newValue) {
        this.$store.commit('mantenedores/UNIDAD_NOMBRE', newValue);
      }
    },
  },
  methods:{
    ...mapMutations({
      updateUnidadAction: 'mantenedores/UPDATE_UNIDAD'
    }),
    async editUnidad(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/admin/mantenedores/unidad/edit-unidad/${this.$store.state.mantenedores.unidad.id}`;
      const data = {
        cod_sirh: this.cod_sirh,
        nombre: this.nombre
      };

      await this.$axios.$put(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.updateUnidadAction(response[1]);
          this.$message({
              message: 'Unidad editada con éxito.',
              type: 'success'
          });
        }else{
          this.$message.error("Error. Error de servidor.");
        }
        this.$root.$emit('bv::hide::modal', 'modal-edit-unidad', '#btnShow');
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
