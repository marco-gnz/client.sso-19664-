<template>
  <div>
    <b-modal id="modal-add-etapa" size="lg" title="Ingresar nueva etapa del profesional" ok-only>
      <div class="row">
        <div class="col-md-2">
          <label>Código SIRH</label>
          <input v-model="etapa.cod_sirh" type="text" class="form-control" placeholder="Código SIRH">
          <span class="text-danger" v-if="errors.cod_sirh">{{errors.cod_sirh[0]}}</span>
        </div>
        <div class="col-md-3">
          <label>Sigla</label>
          <input v-model="etapa.sigla" type="text" class="form-control" placeholder="Sigla">
          <span class="text-danger" v-if="errors.sigla">{{errors.sigla[0]}}</span>
        </div>
        <div class="col-md-7">
          <label>Nombre o descripción</label>
          <input v-model="etapa.nombre" type="text" class="form-control" placeholder="Nombre de etapa">
          <span class="text-danger" v-if="errors.nombre">{{errors.nombre[0]}}</span>
        </div>
      </div>
      <template #modal-footer>
          <div class="w-100">
              <button @click.prevent="addEtapa" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Añadir etapa</button>
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
      etapa:{
        cod_sirh:'',
        sigla:'',
        nombre:''
      },
      errors:{}
    };
  },
  methods:{
    ...mapMutations({
      addEtapaAction: 'mantenedores/ADD_ETAPA'
    }),
    async addEtapa(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = '/api/admin/mantenedores/etapa/add-etapa';
      const data = {
        cod_sirh: this.etapa.cod_sirh,
        sigla:this.etapa.sigla,
        nombre:this.etapa.nombre
      };

      await this.$axios.$post(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.addEtapaAction(response[1]);
          this.$message({
              message: 'Etapa ingresada con éxito.',
              type: 'success'
          });
        }else{
          this.$message.error("Error. Error de servidor.");
        }
        this.$root.$emit('bv::hide::modal', 'modal-add-etapa', '#btnShow');
        for(let key in this.etapa){
          this.etapa[key] = '';
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
