<template>
  <div>
    <b-modal id="modal-edit-red" size="lg" title="Editar red asistencial" ok-only>
      <div class="row d-flex justify-content-center">
        <div class="col-md-2">
          <label>Código SIRH</label>
          <input v-model="cod_sirh" type="text" class="form-control" placeholder="Código SIRH">
          <span class="text-danger" v-if="errors.cod_sirh">{{errors.cod_sirh[0]}}</span>
        </div>
        <div class="col-md-4">
          <label>Nombre red</label>
          <input v-model="nombre" type="text" class="form-control" placeholder="Nombre de red">
          <span class="text-danger" v-if="errors.nombre">{{errors.nombre[0]}}</span>
        </div>
        <div class="col-md-2">
          <label>Siglas red</label>
          <input v-model="sigla" type="text" class="form-control" placeholder="Siglas">
          <span class="text-danger" v-if="errors.sigla">{{errors.sigla[0]}}</span>
        </div>
      </div>
      <template #modal-footer>
          <div class="w-100">
              <button @click.prevent="editRed" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Editar red</button>
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
        return this.$store.state.mantenedores.red.cod_sirh;
      },
      set(newValue) {
        this.$store.commit('mantenedores/RED_COD_SIRH', newValue);
      }
    },
    nombre:{
      get() {
        return this.$store.state.mantenedores.red.nombre;
      },
      set(newValue) {
        this.$store.commit('mantenedores/RED_NOMBRE', newValue);
      }
    },
    sigla:{
      get() {
        return this.$store.state.mantenedores.red.sigla;
      },
      set(newValue) {
        this.$store.commit('mantenedores/RED_SIGLA', newValue);
      }
    },
  },
  methods:{
    ...mapMutations({
      updateRedAction: 'mantenedores/UPDATE_RED'
    }),
    async editRed(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/admin/mantenedores/red/edit-red/${this.$store.state.mantenedores.red.id}`;
      const data = {
        cod_sirh: this.cod_sirh,
        nombre: this.nombre,
        sigla: this.sigla
      };

      await this.$axios.$put(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.updateRedAction(response[1]);
          this.$message({
              message: 'Red editada con éxito.',
              type: 'success'
          });
        }else{
          this.$message.error("Error. Error de servidor.");
        }
        this.$root.$emit('bv::hide::modal', 'modal-edit-red', '#btnShow');
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
