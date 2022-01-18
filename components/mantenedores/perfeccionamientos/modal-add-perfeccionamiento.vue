<template>
  <div>
    <b-modal id="modal-add-perfeccionamiento" size="lg" title="Ingresar nuevo perfeccionamiento" ok-only>
      <div class="row">
        <div class="col-md-3">
          <label>Código SIRH</label>
          <input v-model="perfeccionamiento.cod_sirh" type="text" class="form-control" placeholder="Código SIRH">
          <span class="text-danger" v-if="errors.cod_sirh">{{errors.cod_sirh[0]}}</span>
        </div>
        <div class="col-md-3">
          <label>Tipo de perfeccionamiento</label>
          <select class="form-control" v-model="perfeccionamiento.tipo">
            <option value="" selected disabled>-- Seleccione tipo --</option>
            <option v-for="(tipo, index) in tipos" :key="index" :value="tipo.id">{{tipo.nombre}}</option>
          </select>
          <span class="text-danger" v-if="errors.tipo">{{errors.tipo[0]}}</span>
        </div>
        <div class="col-md-6">
          <label>Nombre de perfeccionamiento</label>
          <input v-model="perfeccionamiento.nombre" type="text" class="form-control" placeholder="Nombre de perfeccionamiento">
          <span class="text-danger" v-if="errors.nombre">{{errors.nombre[0]}}</span>
        </div>
      </div>
      <template #modal-footer>
          <div class="w-100">
              <button @click.prevent="addPerfeccionamiento" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Añadir perfeccionamiento</button>
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
      perfeccionamiento:{
        cod_sirh:'',
        tipo:'',
        nombre:''
      },
      errors:{}
    };
  },
  computed:{
    ...mapGetters({
      tipos:'mantenedores/tipoPerfeccionamientos',
    }),
  },
  methods: {
       ...mapMutations({
        addPerfeccionamientoAction: 'mantenedores/ADD_PERFECCIONAMIENTO'
      }),
      async addPerfeccionamiento(){
        this.fullscreenLoading = !this.fullscreenLoading;
        const url = '/api/admin/mantenedores/perfeccionamiento/add-perfeccionamiento';
        const data = {
          cod_sirh: this.perfeccionamiento.cod_sirh,
          tipo_perfeccionamiento_id:this.perfeccionamiento.tipo,
          nombre:this.perfeccionamiento.nombre
        };

        await this.$axios.$post(url, data).then(response => {
          this.fullscreenLoading = !this.fullscreenLoading;
          if(response[0] === true){
            this.addPerfeccionamientoAction(response[1]);
            this.$message({
                message: 'Perfeccionamiento ingresado con éxito.',
                type: 'success'
            });
          }else{
            this.$message.error("Error. Error de servidor.");
          }
          this.$root.$emit('bv::hide::modal', 'modal-add-perfeccionamiento', '#btnShow');
          for(let key in this.perfeccionamiento){
            this.perfeccionamiento[key] = '';
          }
          this.errors = {};
        }).catch(error => {
          this.fullscreenLoading = !this.fullscreenLoading;
          console.log(error);
          this.errors = error.response.data.errors;
        });
      }
    },
}
</script>

<style>

</style>
