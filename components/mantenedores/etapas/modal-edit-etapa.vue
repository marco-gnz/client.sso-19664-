<template>
  <div>
    <b-modal id="modal-edit-etapa" size="lg" title="Editar etapa del profesional" ok-only>
      <div class="row">
        <div class="col-md-2">
          <label>Código SIRH</label>
          <input v-model="cod_sirh" type="text" class="form-control" placeholder="Código SIRH">
          <span class="text-danger" v-if="errors.cod_sirh">{{errors.cod_sirh[0]}}</span>
        </div>
        <div class="col-md-3">
          <label>Sigla</label>
          <input v-model="sigla" type="text" class="form-control" placeholder="Sigla">
          <span class="text-danger" v-if="errors.sigla">{{errors.sigla[0]}}</span>
        </div>
        <div class="col-md-7">
          <label>Nombre o descripción</label>
          <input v-model="nombre" type="text" class="form-control" placeholder="Nombre de etapa">
          <span class="text-danger" v-if="errors.nombre">{{errors.nombre[0]}}</span>
        </div>
      </div>
      <template #modal-footer>
          <div class="w-100">
              <button @click.prevent="editEtapa" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Editar etapa</button>
          </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
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
        return this.$store.state.mantenedores.etapa.cod_sirh;
      },
      set(newValue) {
        this.$store.commit('mantenedores/ETAPA_COD_SIRH', newValue);
      }
    },
    sigla:{
      get() {
        return this.$store.state.mantenedores.etapa.sigla;
      },
      set(newValue) {
        this.$store.commit('mantenedores/ETAPA_SIGLA', newValue);
      }
    },
    nombre:{
      get() {
        return this.$store.state.mantenedores.etapa.nombre;
      },
      set(newValue) {
        this.$store.commit('mantenedores/ETAPA_NOMBRE', newValue);
      }
    },
  },
  methods:{
    ...mapMutations({
      updateEtapaAction: 'mantenedores/UPDATE_ETAPA'
    }),
    async editEtapa(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/admin/mantenedores/etapa/edit-etapa/${this.$store.state.mantenedores.etapa.id}`;
      const data = {
        cod_sirh: this.cod_sirh,
        sigla:this.sigla,
        nombre:this.nombre,
      };

      await this.$axios.$put(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.updateEtapaAction(response[1]);
          this.$message({
              message: 'Etapa editada con éxito.',
              type: 'success'
          });
        }else{
          this.$message.error("Error. Error de servidor.");
        }
        this.$root.$emit('bv::hide::modal', 'modal-edit-etapa', '#btnShow');
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
