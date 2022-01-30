<template>
  <div>
    <b-modal id="modal-edit-establecimiento" size="xl" title="Editar establecimiento" ok-only>
      <div class="row">
        <div class="col-md-1">
          <label>Código SIRH</label>
          <input v-model="cod_sirh" type="text" class="form-control" placeholder="SIRH">
          <span class="text-danger" v-if="errors.cod_sirh">{{errors.cod_sirh[0]}}</span>
        </div>
        <div class="col-md-3">
          <label>Red hospitalaria</label>
          <select class="form-control" v-model="red">
              <option value="" selected disabled>-- Seleccione red --</option>
              <option v-for="(red, index) in redesHospitalarias" :key="index" :value="red.id">{{red.nombre}}</option>
          </select>
          <span class="text-danger" v-if="errors.red_hospitalaria_id">{{errors.red_hospitalaria_id[0]}}</span>
        </div>
        <div class="col-md-4">
          <label>Nombre establecimiento</label>
          <input v-model="nombre" type="text" class="form-control" placeholder="Nombre de establecimiento">
          <span class="text-danger" v-if="errors.nombre">{{errors.nombre[0]}}</span>
        </div>
        <div class="col-md-1">
          <label>Siglas</label>
          <input v-model="sigla" type="text" class="form-control" placeholder="Siglas">
          <span class="text-danger" v-if="errors.sigla">{{errors.sigla[0]}}</span>
        </div>
        <div class="col-md-3">
          <label>Grado complejidad</label>
          {{grado}}
          <select class="form-control" v-model="grado">
              <option value="" selected disabled>-- Seleccione grado --</option>
              <option v-for="(grado, index) in gradosComplejidad" :key="index" :value="grado.id">{{grado.grado}}</option>
          </select>
          <span class="text-danger" v-if="errors.grado_complejidad_id">{{errors.grado_complejidad_id[0]}}</span>
        </div>
      </div>
      <template #modal-footer>
          <div class="w-100">
              <button @click.prevent="editEstablecimiento" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Editar establecimiento</button>
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
    ...mapGetters({
      redesHospitalarias:'mantenedores/redesHospitalarias',
      gradosComplejidad:'mantenedores/gradosComplejidad'
    }),
    cod_sirh:{
      get() {
        return this.$store.state.establecimientos.establecimiento.cod_sirh;
      },
      set(newValue) {
        this.$store.commit('establecimientos/ESTABLECIMIENTO_COD_SIRH', newValue);
      }
    },
    sigla:{
      get() {
        return this.$store.state.establecimientos.establecimiento.sigla;
      },
      set(newValue) {
        this.$store.commit('establecimientos/ESTABLECIMIENTO_SIGLA', newValue);
      }
    },
    nombre:{
      get() {
        return this.$store.state.establecimientos.establecimiento.nombre;
      },
      set(newValue) {
        this.$store.commit('establecimientos/ESTABLECIMIENTO_NOMBRE', newValue);
      }
    },
    red:{
      get() {
        return this.$store.state.establecimientos.establecimiento.red;
      },
      set(newValue) {
        this.$store.commit('establecimientos/ESTABLECIMIENTO_RED', newValue);
      }
    },
    grado:{
      get() {
        return this.$store.state.establecimientos.establecimiento.grado;
      },
      set(newValue) {
        this.$store.commit('establecimientos/ESTABLECIMIENTO_GRADO', newValue);
      }
    },
  },
  methods:{
    ...mapMutations({
      updateEstablecimientoAction: 'establecimientos/UPDATE_ESTABLECIMIENTO'
    }),
    async editEstablecimiento(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/admin/mantenedores/establecimiento/edit-establecimiento/${this.$store.state.establecimientos.establecimiento.id}`;
      const data = {
        cod_sirh: this.cod_sirh,
        sigla:this.sigla,
        nombre:this.nombre,
        red_hospitalaria_id:this.red,
        grado_complejidad_id:this.grado
      };

      await this.$axios.$put(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.updateEstablecimientoAction(response[1]);
          this.$message({
              message: 'Establecimiento editado con éxito.',
              type: 'success'
          });
        }else{
          this.$message.error("Error. Error de servidor.");
        }
        this.$root.$emit('bv::hide::modal', 'modal-edit-establecimiento', '#btnShow');
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
