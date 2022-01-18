<template>
  <div>
    <b-modal id="modal-edit-perfeccionamiento" size="lg" title="Editar perfeccionamiento" ok-only>
      <div class="row">
        <div class="col-md-3">
          <label>Código SIRH</label>
          <input v-model="cod_sirh" type="text" class="form-control" placeholder="Código SIRH">
          <span class="text-danger" v-if="errors.cod_sirh">{{errors.cod_sirh[0]}}</span>
        </div>
        <div class="col-md-3">
          <label>Tipo de perfeccionamiento</label>
          <select class="form-control" v-model="tipo">
            <option value="" selected disabled>-- Seleccione tipo --</option>
            <option v-for="(tipo, index) in tipos" :key="index" :value="tipo.id">{{tipo.nombre}}</option>
          </select>
          <span class="text-danger" v-if="errors.tipo">{{errors.tipo[0]}}</span>
        </div>
        <div class="col-md-6">
          <label>Nombre de perfeccionamiento</label>
          <input v-model="nombre" type="text" class="form-control" placeholder="Nombre de perfeccionamiento">
          <span class="text-danger" v-if="errors.nombre">{{errors.nombre[0]}}</span>
        </div>
      </div>
      <div class="row pt-lg-4">
        <div class="col-md-12">
          <el-alert
              title="Al modificar el tipo de perfeccionamiento, todo registro asociado a este perfeccionamiento se verá afectado."
              type="warning"
              :closable="false"
              show-icon>
          </el-alert>
        </div>
      </div>
      <template #modal-footer>
          <div class="w-100">
              <button @click.prevent="editPerfeccionamiento" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Editar perfeccionamiento</button>
          </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import {mapMutations, mapGetters} from 'vuex';
export default {
  data(){
    return{
      fullscreenLoading:false,
      errors:{}
    };
  },
  computed:{
    ...mapGetters({
      tipos:'mantenedores/tipoPerfeccionamientos',
    }),
    cod_sirh:{
      get() {
        return this.$store.state.mantenedores.perfeccionamiento.cod_sirh;
      },
      set(newValue) {
        this.$store.commit('mantenedores/PERFECCIONAMIENTO_COD_SIRH', newValue);
      }
    },
    nombre:{
      get() {
        return this.$store.state.mantenedores.perfeccionamiento.nombre;
      },
      set(newValue) {
        this.$store.commit('mantenedores/PERFECCIONAMIENTO_NOMBRE', newValue);
      }
    },
    tipo:{
      get() {
        return this.$store.state.mantenedores.perfeccionamiento.tipo;
      },
      set(newValue) {
        this.$store.commit('mantenedores/PERFECCIONAMIENTO_TIPO', newValue);
      }
    },
  },
  methods:{
    ...mapMutations({
      updatePerfeccionamientoAction: 'mantenedores/UPDATE_PERFECCIONAMIENTO'
    }),
    async editPerfeccionamiento(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/admin/mantenedores/perfeccionamiento/edit-perfeccionamiento/${this.$store.state.mantenedores.perfeccionamiento.id}`;
      const data = {
        cod_sirh: this.cod_sirh,
        tipo_perfeccionamiento_id:this.tipo,
        nombre:this.nombre
      };

      await this.$axios.$put(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.updatePerfeccionamientoAction(response[1]);
          this.$message({
              message: 'Perfeccionamiento editado con éxito.',
              type: 'success'
          });
        }else{
          this.$message.error("Error. Error de servidor.");
        }
        this.$root.$emit('bv::hide::modal', 'modal-edit-perfeccionamiento', '#btnShow');
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
