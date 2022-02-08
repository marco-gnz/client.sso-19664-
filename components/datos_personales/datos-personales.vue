<template>
    <div>
      <form class="user" @submit.prevent="editPro" v-loading.fullscreen.lock="fullscreenLoading">
        <div class="row pt-2">
            <div class="col-md-6">
                <div class="row">
                    <div class="col-md-6">
                        <label class="required font-weight-bold">RUT</label>
                        <input type="text" v-model="datosPersonalesEdit.rut" class="form-control" placeholder="Ingrese rut">
                        <span class="text-danger" v-if="errors.rut">{{errors.rut[0]}}</span>
                    </div>
                    <div class="col-md-2">
                        <label class="required font-weight-bold">DV</label>
                        <input type="text" v-model="datosPersonalesEdit.dv"  class="form-control" placeholder="DV">
                        <span class="text-danger" v-if="errors.dv">{{errors.dv[0]}}</span>
                    </div>
                    <div class="col-md-4">
                        <label class="required font-weight-bold">Género</label>
                        <select class="form-control" v-model="datosPersonalesEdit.genero">
                            <option value="" selected disabled>-- Seleccione género --</option>
                            <option v-for="(genero, index) in generos" :key="index" :value="genero.id">{{genero.nombre}}</option>
                        </select>
                        <span class="text-danger" v-if="errors.genero_id">{{errors.genero_id[0]}}</span>
                    </div>
                </div>
                <div class="row pt-lg-4">
                    <div class="col-md-6">
                        <label class="required font-weight-bold">Nombres</label>
                        <input type="text" v-model="datosPersonalesEdit.nombres" class="form-control" placeholder="Ingrese nombres" v-uppercase>
                        <span class="text-danger" v-if="errors.nombres">{{errors.nombres[0]}}</span>
                    </div>
                    <div class="col-md-6">
                        <label class="required font-weight-bold">Apellidos</label>
                        <input type="text" v-model="datosPersonalesEdit.apellidos" class="form-control" placeholder="Ingrese apellidos" v-uppercase>
                        <span class="text-danger" v-if="errors.apellidos">{{errors.apellidos[0]}}</span>
                    </div>
                </div>
                <div class="row pt-lg-4">
                    <div class="col-md-6">
                        <label class="font-weight-bold">Nº de contacto</label>
                        <input type="text" v-model="datosPersonalesEdit.n_contacto"  class="form-control" placeholder="Ingrese nº de contacto">
                        <span class="text-danger" v-if="errors.n_contacto">{{errors.n_contacto[0]}}</span>
                    </div>
                    <div class="col-md-6">
                        <label class="font-weight-bold">Correo electrónico</label>
                        <input type="email" class="form-control" v-model="datosPersonalesEdit.email" placeholder="Ingrese correo electrónico">
                        <span class="text-danger" v-if="errors.email">{{errors.email[0]}}</span>
                    </div>
                </div>
                <div class="row pt-lg-4">
                    <div class="col-md-6">
                        <label class="font-weight-bold">Ciudad de residencia</label>
                        <input type="text" v-model="datosPersonalesEdit.ciudad"  class="form-control" placeholder="Ingrese ciudad" v-uppercase>
                        <span class="text-danger" v-if="errors.ciudad">{{errors.ciudad[0]}}</span>
                    </div>
                    <div class="col-md-6">
                        <label class="font-weight-bold">Dirección de residencia</label>
                        <input type="text" v-model="datosPersonalesEdit.direccion_residencia"  class="form-control" placeholder="Ingrese dirección" v-uppercase>
                        <span class="text-danger" v-if="errors.direccion_residencia">{{errors.direccion_residencia[0]}}</span>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="row">
                    <div class="col-md-6">
                        <label class="required font-weight-bold">Planta</label>
                        <select class="form-control" v-model="datosPersonalesEdit.planta">
                            <option value="" selected disabled>-- Seleccione planta --</option>
                            <option v-for="(planta, index) in plantas" :key="index" :value="planta.id">{{planta.nombre}}</option>
                        </select>
                        <span class="text-danger" v-if="errors.planta_id">{{errors.planta_id[0]}}</span>
                    </div>
                    <div class="col-md-6">
                        <label class="font-weight-bold">Situación actual</label>
                        <select class="form-control" v-model="datosPersonalesEdit.situacion_actual">
                            <option value="" selected disabled>-- Seleccione situación actual --</option>
                            <option v-for="(situacion, index) in situacionesActual" :key="index" :value="situacion.id">{{situacion.nombre}}</option>
                        </select>
                        <span class="text-danger" v-if="errors.situacion_actual_id">{{errors.situacion_actual_id[0]}}</span>
                    </div>
                </div>
                <div class="row pt-lg-4">
                    <div class="col-md-6">
                        <label class="required font-weight-bold">Etapa</label>
                        <select class="form-control" v-model="datosPersonalesEdit.etapa">
                            <option value="" selected disabled>-- Seleccione etapa --</option>
                            <option v-for="(etapa, index) in etapas" :key="index" :value="etapa.id">{{etapa.nombre}}</option>
                        </select>
                        <span class="text-danger" v-if="errors.etapas_id">{{errors.etapas_id[0]}}</span>
                    </div>
                    <div class="col-md-6">
                        <label class="required font-weight-bold">Calidad jurídica</label>
                        <select class="form-control" v-model="datosPersonalesEdit.calidad">
                            <option value="" selected disabled>-- Seleccione calidad jurídica --</option>
                            <option v-for="(calidad, index) in calidades" :key="index" :value="calidad.id">{{calidad.nombre}}</option>
                        </select>
                        <span class="text-danger" v-if="errors.calidad_juridica_id">{{errors.calidad_juridica_id[0]}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <!-- <span class="float-right">¿PAO?</span><input class="float-right mr-2" type="checkbox"> -->
          </div>
        </div>
        <div class="row pt-4">
            <div class="col-md-12">
                <button v-if="$auth.user.permissions_roles.includes('editar-profesional') || $auth.user.permissions.includes('editar-profesional')" type="submit" class="mt-3 btn btn-success float-right">Editar datos personales</button>
            </div>
        </div>
        </form>
    </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
export default {
  props:['profesional'],
  data(){
    return{
      fullscreenLoading:false,
      errors:{}
    };
  },
  computed:{
    /* ...mapState('profesionales', ['datosPersonalesEdit']), */
      ...mapGetters({
        plantas: 'mantenedores/plantas',
        calidades: 'mantenedores/calidades',
        generos: 'mantenedores/generos',
        etapas: 'mantenedores/etapas',
        situacionesActual:'mantenedores/situacionesActual'
      }),
      datosPersonalesEdit(){
        return {...this.$store.state.profesionales.datosPersonalesEdit}
      }
    },
    mounted(){
      this.getPlantas();
      this.getCalidades();
      this.getGeneros();
      this.getEtapas();
      this.getSituacionesActual();
      this.getProfesional(this.$route.params.id);
    },
  methods:{
    ...mapActions({
      getPlantas: 'mantenedores/getPlantas',
      getCalidades: 'mantenedores/getCalidades',
      getGeneros: 'mantenedores/getGeneros',
      getEtapas: 'mantenedores/getEtapas',
      getSituacionesActual:'mantenedores/getSituacionesActual',
      getProfesional: 'profesionales/getProfesional',
      errorStatus401:'errors/redirectSessionExpired'
    }),
    ...mapMutations({
      updateProfesionalAction: 'profesionales/UPDATE_PROFESIONAL'
    }),
    async editPro(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = '/api/profesionales/profesional/update-datos-personales/'+this.datosPersonalesEdit.id;

      const data = {
              rut: this.datosPersonalesEdit.rut,
              dv: this.datosPersonalesEdit.dv,
              rut_completo: this.datosPersonalesEdit.rut+'-'+this.datosPersonalesEdit.dv,
              nombres: this.datosPersonalesEdit.nombres,
              apellidos: this.datosPersonalesEdit.apellidos,
              nombre_completo: this.datosPersonalesEdit.nombres+' '+this.datosPersonalesEdit.apellidos,
              email: this.datosPersonalesEdit.email,
              n_contacto: this.datosPersonalesEdit.n_contacto,
              ciudad: this.datosPersonalesEdit.ciudad,
              direccion_residencia:this.datosPersonalesEdit.direccion_residencia,
              etapas_id: this.datosPersonalesEdit.etapa,
              calidad_juridica_id: this.datosPersonalesEdit.calidad,
              planta_id: this.datosPersonalesEdit.planta,
              genero_id:this.datosPersonalesEdit.genero,
              situacion_actual_id:this.datosPersonalesEdit.situacion_actual
            };

      await this.$axios.$put(url, data).then(response => {
        if(response[0] === true){
          this.updateProfesionalAction(response[1]);
          this.fullscreenLoading = !this.fullscreenLoading;
          this.$message({
              message: 'Datos personales actualizados con éxito.',
              type: 'success'
          });
          this.errors = {};
        }else{
          this.fullscreenLoading = !this.fullscreenLoading;
          this.errors = {};
        }
      }).catch(error => {
        this.fullscreenLoading = !this.fullscreenLoading;
        /* this.errorStatus401(error.response.status); */
        this.errors = error.response.data.errors;
      });
    }
  }
}
</script>

<style>

</style>
