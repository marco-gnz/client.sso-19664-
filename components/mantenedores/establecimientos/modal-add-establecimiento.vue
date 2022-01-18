<template>
  <div>
    <b-modal id="modal-add-establecimiento" size="xl" title="Ingresar nuevo establecimiento" ok-only>
      <div class="row">
        <div class="col-md-1">
          <label>Código SIRH</label>
          <input v-model="establecimiento.cod_sirh" type="text" class="form-control" placeholder="SIRH">
          <span class="text-danger" v-if="errors.cod_sirh">{{errors.cod_sirh[0]}}</span>
        </div>
        <div class="col-md-3">
          <label>Red hospitalaria</label>
          <select class="form-control" v-model="establecimiento.red">
              <option value="" selected disabled>-- Seleccione red --</option>
              <option v-for="(red, index) in redesHospitalarias" :key="index" :value="red.id">{{red.nombre}}</option>
          </select>
          <span class="text-danger" v-if="errors.red_hospitalaria_id">{{errors.red_hospitalaria_id[0]}}</span>
        </div>
        <div class="col-md-4">
          <label>Nombre establecimiento</label>
          <input v-model="establecimiento.nombre" type="text" class="form-control" placeholder="Nombre de establecimiento">
          <span class="text-danger" v-if="errors.nombre">{{errors.nombre[0]}}</span>
        </div>
        <div class="col-md-1">
          <label>Siglas</label>
          <input v-model="establecimiento.sigla" type="text" class="form-control" placeholder="Siglas">
          <span class="text-danger" v-if="errors.sigla">{{errors.sigla[0]}}</span>
        </div>
        <div class="col-md-3">
          <label>Grado complejidad</label>
          <select class="form-control" v-model="establecimiento.grado">
              <option value="" selected disabled>-- Seleccione grado --</option>
              <option v-for="(grado, index) in gradosComplejidad" :key="index" :value="grado.id">{{grado.grado}}</option>
          </select>
          <span class="text-danger" v-if="errors.grado_complejidad_id">{{errors.grado_complejidad_id[0]}}</span>
        </div>
      </div>
      <template #modal-footer>
          <div class="w-100">
              <button @click.prevent="addEstablecimiento" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Añadir establecimiento</button>
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
      establecimiento:{
        cod_sirh:'',
        red:'',
        nombre:'',
        sigla:'',
        grado:''
      },
      errors:{}
    };
  },
  computed:{
    ...mapGetters({
      redesHospitalarias:'mantenedores/redesHospitalarias',
      gradosComplejidad:'mantenedores/gradosComplejidad'
    })
  },
  methods:{
    ...mapMutations({
      addEstablecimientoAction: 'establecimientos/ADD_ESTABLECIMIENTO'
    }),
    async addEstablecimiento(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = '/api/admin/mantenedores/establecimiento/add-establecimiento';
      const data = {
        cod_sirh: this.establecimiento.cod_sirh,
        sigla:this.establecimiento.sigla,
        nombre:this.establecimiento.nombre,
        red_hospitalaria_id:this.establecimiento.red,
        grado_complejidad_id:this.establecimiento.grado
      };

      await this.$axios.$post(url, data).then(response => {
        console.log(response);
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.addEstablecimientoAction(response[1]);
          this.$message({
              message: 'Establecimiento ingresado con éxito.',
              type: 'success'
          });
        }else{
          this.$message.error("Error. Error de servidor.");
        }
        this.$root.$emit('bv::hide::modal', 'modal-add-establecimiento', '#btnShow');
        for(let key in this.establecimiento){
          this.establecimiento[key] = '';
        }
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
