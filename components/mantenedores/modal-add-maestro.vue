<template>
  <div>
    <b-modal id="modal-add-mantenedor" size="lg" title="Ingresar nuevo dato maestro" ok-only>
      <div class="row pt-4">
        <div class="col-md-3">
          <label>Tipo de dato maestro</label>
          <select class="form-control" v-model="maestro.tipo">
            <option value="" selected disabled>-- Seleccione tipo --</option>
            <option v-for="(mantenedor, index) in mantenedores" :key="index" :value="mantenedor.id">{{mantenedor.nombre}}</option>
          </select>
        </div>
        <div class="col-md-2">
          <label>¿Código SIRH?</label>
          <input :disabled="!maestro.tipo" v-model="maestro.cod_sirh"  type="number" class="form-control" placeholder="Código en SIRH">
        </div>
        <div class="col-md-4">
          <label>Nombre o descripción de dato</label>
          <input :disabled="!maestro.tipo" v-model="maestro.nombre" type="text" class="form-control" placeholder="Ingrese nombre o descripción">
        </div>
        <template v-if="maestro.tipo === 1">
          <div class="col-md-2">
            <label>Siglas</label>
            <input :disabled="!maestro.tipo" v-model="red_hospitalaria.sigla" type="text" class="form-control" placeholder="Siglas">
          </div>
        </template>
      </div>
      <template #modal-footer>
        <div class="w-100">
          <button @click.prevent="addDatoMaestro" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Añadir dato maestro <i class="fas fa-plus"></i></button>
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
      maestro:{
        tipo:'',
        cod_sirh:'',
        nombre:''
      },
      red_hospitalaria:{
        sigla:''
      }
    };
  },
  computed:{
    ...mapGetters({
        mantenedores:'mantenedores/mantenedoresLista'
      })
  },
  methods:{
    async addDatoMaestro(){

      const url = '/api/mantenedores/add-dato-maestro';
      if(this.maestro.tipo === 1){
        //red hospitalaria
        const data = {
          tipo:this.maestro.tipo,
          cod_sirh:this.maestro.cod_sirh,
          sigla:this.red_hospitalaria.sigla,
          nombre:this.maestro.nombre
        };
        await this.$axios.$post(url, data).then(response => {
          console.log(response);
        }).catch(error => {
          console.log(error);
        });
      }
    }
  }
}
</script>

<style>

</style>
