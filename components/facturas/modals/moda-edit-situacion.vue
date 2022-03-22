<template>
  <div>
    <b-modal id="modal-edit-situacion" size="lg" :title="`Modificar situación actual de factura °${this.factura.n_resolucion}`" scrollable ok-only>
      <div class="row d-flex justify-content-center">
        <div class="col-md-2">
          <el-steps finish-status="success">
            <el-step title="Situación actual" icon="el-icon-s-claim"></el-step>
          </el-steps>
        </div>
      </div>
      <div class="row pt-4 d-flex justify-content-center">
        <div class="col-md-6">
          <label>Seleccione situación actual</label>
          <select v-model="situacion" class="form-control">
              <option value="" selected disabled>-- Seleccione situación --</option>
              <option v-for="(situacion, index) in situacionesFactura" :key="index" :value="situacion.id">{{situacion.nombre}}</option>
          </select>
        </div>
      </div>
      <template #modal-footer>
        <div class="w-100">
          <button class="mt-3 btn btn-success float-right" @click.prevent="editFactura" v-loading.fullscreen.lock="fullscreenLoading">Editar situación actual</button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
export default {
  data(){
    return{
      fullscreenLoading:false,
      errors:{}
    };
  },
  mounted(){
    this.getSituacionesFactura();
  },
  computed:{
    ...mapGetters({
      situacionesFactura:'mantenedores/situacionesFactura'
    }),
    situacion:{
      get(){
        return this.$store.state.facturas.facturaEdit.situacion_actual;
      },
      set(newValue){
        this.$store.commit('facturas/UPDATE_SITUACION_FACTURA', newValue);
      }
    },
    factura(){
      return this.$store.state.facturas.facturaEdit;
    }
  },
  methods:{
    ...mapMutations({
      refresFacturaAction:'facturas/REFRESH_FACTURA'
    }),
    ...mapActions({
      getSituacionesFactura:'mantenedores/getSituacionesFactura'
    }),
    async editFactura(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/profesionales/profesional/documentos/factura/edit-factura/situacion/${this.factura.uuid}`;

      const data = {
        situacion_factura_id: this.situacion
      };

      await this.$axios.$put(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.refresFacturaAction(response[1]);
          this.clearAllModal();
          this.$notify({
              message: 'Situación actualizada con éxito',
              type: 'success'
          });
        }else{
          this.$message.error("Error de servidor");
        }
      }).catch(error => {
        this.fullscreenLoading = !this.fullscreenLoading;
        console.log(error);
        this.errors = error.response.data.errors;
      });
    },
    clearAllModal(){
      this.errors = {};
      this.$root.$emit('bv::hide::modal', 'modal-edit-situacion', '#btnShow');
    },
  }
}
</script>

<style>

</style>
