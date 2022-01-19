<template>
    <div class="container-fluid mt-5">
        <div class="row">
          <div class="col-md-12">
            <div class="card shadow">
              <div class="card-header py-3">
                  <div class="row">
                      <div class="col-md-6">
                          <h6 class="m-0 font-weight-bold text-primary">Ingresar nuevo profesional</h6>
                      </div>
                  </div>
              </div>
              <b-card no-body>
                <b-tabs pills card vertical nav-wrapper-class="w-20">
                     <b-tab title="Identificar profesional">
                       <div class="row d-flex justify-content-center pt-3">
                            <h5>Para continuar, debe verificar si el profesional ya existe en los registros</h5>
                        </div>
                        <div class="row d-flex justify-content-center pt-4">
                          <div class="col-sm-3">
                            <label>RUT</label>
                            <b-form-input type="number" v-model="profesional_identificacion.rut" class="form-control form-control-user" placeholder="Ingrese rut"></b-form-input>
                          </div>
                          <div class="col-xs-1 pt-lg-5">
                              <strong>-</strong>
                          </div>
                          <div class="col-sm-1">
                              <label>DV</label>
                              <b-form-input type="text" v-model="profesional_identificacion.dv" class="form-control form-control-user" placeholder="DV" @keyup="identificarProfesional" v-loading.fullscreen.lock="fullscreenLoading"></b-form-input>
                          </div>

                      </div>
                      <template v-if="exist_rut != null">
                        <div class="row d-flex justify-content-center pt-lg-3">
                            <p v-if="exist_rut != true">El profesional ya existe en los registros.
                            </p>
                        <p v-else>El profesional no existe en los registros</p>
                        </div>
                      </template>
                     </b-tab>
                     <b-tab :disabled="!rut_validate" title="Datos personales">
                       <form @submit.prevent="addProfesional" v-loading.fullscreen.lock="fullscreenLoading">
                        <div class="row pt-2">
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-6">
                                        <label>RUT</label>
                                        <input type="text" :value="profesional_identificacion.rut" disabled class="form-control" placeholder="Ingrese rut">
                                        <span class="text-danger" v-if="errors.rut">{{errors.rut[0]}}</span>
                                    </div>
                                    <div class="col-md-2">
                                        <label>DV</label>
                                        <input type="text" :value="profesional_identificacion.dv" disabled class="form-control" placeholder="DV">
                                        <span class="text-danger" v-if="errors.dv">{{errors.dv[0]}}</span>
                                    </div>
                                    <div class="col-md-4">
                                        <label>Género</label>
                                        <select class="form-control" v-model="profesional.genero">
                                            <option value="" selected disabled>-- Seleccione género --</option>
                                            <option v-for="(genero, index) in generos" :key="index" :value="genero.id">{{genero.nombre}}</option>
                                        </select>
                                        <span class="text-danger" v-if="errors.genero_id">{{errors.genero_id[0]}}</span>
                                    </div>
                                </div>
                                <div class="row pt-2">
                                    <div class="col-md-6">
                                        <label>Nombres</label>
                                        <input type="text" class="form-control" v-model="profesional.nombres" placeholder="Ingrese nombres">
                                        <span class="text-danger" v-if="errors.nombres">{{errors.nombres[0]}}</span>
                                    </div>
                                    <div class="col-md-6">
                                        <label>Apellidos</label>
                                        <input type="text" class="form-control" v-model="profesional.apellidos" placeholder="Ingrese apellidos">
                                        <span class="text-danger" v-if="errors.apellidos">{{errors.apellidos[0]}}</span>
                                    </div>
                                </div>
                                <div class="row pt-2">
                                    <div class="col-md-6">
                                        <label>Nº de contacto</label>
                                        <input type="text" class="form-control" v-model="profesional.n_contacto" placeholder="Ingrese nº de contacto">
                                        <span class="text-danger" v-if="errors.n_contacto">{{errors.n_contacto[0]}}</span>
                                    </div>
                                    <div class="col-md-6">
                                        <label>Correo electrónico</label>
                                        <input type="text" class="form-control" v-model="profesional.email" placeholder="Ingrese correo electrónico">
                                        <span class="text-danger" v-if="errors.email">{{errors.email[0]}}</span>
                                    </div>
                                </div>
                                <div class="row pt-2">
                                    <div class="col-md-6">
                                        <label>Ciudad</label>
                                        <input type="text" v-model="profesional.ciudad"  class="form-control" placeholder="Ingrese ciudad">
                                        <span class="text-danger" v-if="errors.ciudad">{{errors.ciudad[0]}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-6">
                                        <label>Planta</label>
                                        <select class="form-control" v-model="profesional.planta">
                                            <option value="" selected disabled>-- Seleccione planta --</option>
                                            <option v-for="(planta, index) in plantas" :key="index" :value="planta.id">{{planta.nombre}}</option>
                                        </select>
                                        <span class="text-danger" v-if="errors.planta_id">{{errors.planta_id[0]}}</span>
                                    </div>
                                    <div class="col-md-6">
                                        <label>Situación actual</label>
                                        <select class="form-control" v-model="profesional.situacion_actual">
                                            <option value="">-- Seleccione situación actual --</option>
                                        </select>
                                        <span class="text-danger" v-if="errors.situacion_actual_id">{{errors.situacion_actual_id[0]}}</span>
                                    </div>
                                </div>
                                <div class="row pt-2">
                                    <div class="col-md-6">
                                        <label>Etapa</label>
                                        <select class="form-control" v-model="profesional.etapa_actual">
                                            <option value="" selected disabled>-- Seleccione etapa --</option>
                                            <option v-for="(etapa, index) in etapas" :key="index" :value="etapa.id">{{etapa.nombre}}</option>
                                        </select>
                                        <span class="text-danger" v-if="errors.etapas_id">{{errors.etapas_id[0]}}</span>
                                    </div>
                                    <div class="col-md-6">
                                        <label>Calidad jurídica</label>
                                        <select class="form-control" v-model="profesional.calidad_juridica">
                                            <option value="" selected disabled>-- Seleccione calidad jurídica --</option>
                                            <option v-for="(calidad, index) in calidades" :key="index" :value="calidad.id">{{calidad.nombre}}</option>
                                        </select>
                                        <span class="text-danger" v-if="errors.calidad_juridica_id">{{errors.calidad_juridica_id[0]}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row pt-lg-2">
                          <div class="col-md-12">
                            <button type="submit" class="btn btn-success btn-user float-right">Ingresar profesional</button>
                          </div>
                        </div>
                      </form>
                    </b-tab>
                </b-tabs>
              </b-card>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
    middleware: 'auth',
    data(){
      return{
          profesional_exist:false,
          fullscreenLoading:false,
           rut_validate:false,
           exist_rut:null,
          setTimeoutBuscador:'',
          profesional_identificacion:{
            rut:'18904336',
            dv:'',
          },
          profesional:{
            genero:'',
            nombres:'',
            apellidos:'',
            n_contacto:'',
            email:'',
            ciudad:'',
            planta:'',
            situacion_actual:'',
            etapa_actual:'',
            calidad_juridica:''
          },
          getProfesional:{},
          errors:{}
      };
    },
    computed:{
      ...mapGetters({
        plantas: 'mantenedores/plantas',
        calidades: 'mantenedores/calidades',
        generos: 'mantenedores/generos',
        etapas: 'mantenedores/etapas',
      })
    },
    mounted(){
      this.getPlantas();
      this.getCalidades();
      this.getGeneros();
      this.getEtapas();
    },
    methods:{
          ...mapActions({
            getPlantas: 'mantenedores/getPlantas',
            getCalidades: 'mantenedores/getCalidades',
            getGeneros: 'mantenedores/getGeneros',
            getEtapas: 'mantenedores/getEtapas',
          }),
         async existProfesional(){
           this.fullscreenLoading = true;
            const url = '/api/profesionales/profesional/exist';
            const data = {
              rut:this.profesional_identificacion.rut,
              dv:this.profesional_identificacion.dv
            };
            await this.$axios.$get(url, {
              params: data
            }).then(response => {
              console.log(response);
              this.fullscreenLoading = false;
              if(response[0] === true){
                this.rut_validate = false;
                this.exist_rut = false;
                this.getProfesional = response[1];
              }else{
                  this.rut_validate = true;
                  this.exist_rut = true;
              }
            }).catch(error => {
              console.log(error);
              this.fullscreenLoading = false;
            });
        },
        identificarProfesional(){
              clearTimeout(this.setTimeoutBuscador);
              this.setTimeoutBuscador = setTimeout(this.existProfesional, 1000);
        },

        async addProfesional(){
          this.fullscreenLoading = true;
          try {
            const url = '/api/profesionales/profesional/add-profesional';
            const data = {
              rut: this.profesional_identificacion.rut,
              dv: this.profesional_identificacion.dv,
              rut_completo: this.profesional_identificacion.rut+'-'+this.profesional_identificacion.dv,
              nombres: this.profesional.nombres,
              apellidos: this.profesional.apellidos,
              nombre_completo: this.profesional.nombres+' '+this.profesional.apellidos,
              email: this.profesional.email,
              n_contacto: this.profesional.n_contacto,
              ciudad: this.profesional.ciudad,
              etapas_id: this.profesional.etapa_actual,
              calidad_juridica_id: this.profesional.calidad_juridica,
              planta_id: this.profesional.planta,
              genero_id:this.profesional.genero
            };

            await this.$axios.$post(url, data).then(response => {
              this.fullscreenLoading = false;
              console.log(response);
              if(response[0] === true){
                  const h = this.$createElement;
                  this.$msgbox({
                    title: 'Profesional ingresado con éxito.',
                    type: 'success',
                    message: h('p', null, [
                        h('span', null, '¿Ir a módulos del nuevo profesional ingresado? ')
                    ]),
                    showCancelButton: true,
                    confirmButtonText: 'Si, redireccionar',
                    cancelButtonText: 'No, ir a listado de profesionales',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = 'Redirigiendo...';
                        setTimeout(() => {
                            done();
                            setTimeout(() => {
                            instance.confirmButtonLoading = false;
                            }, 300);
                        }, 1000);
                        } else {
                            this.$message({
                                message: 'Redireccionado a lista de profesionales.'
                            });
                            done();
                            this.$router.replace('/profesionales');
                        }
                    }
                  }).then(action => {
                      this.$router.replace(`/profesionales/${response[1].uuid}`);
                      this.$message({
                        type: 'info',
                        message: 'Redireccionado a profesional.'
                      });
                    });
              }
            }).catch(error => {
              console.log(error.response.data.errors);
              this.errors = error.response.data.errors;
              this.fullscreenLoading = false;
            });
          } catch (error) {
            console.log(error);
            this.fullscreenLoading = false;
          }
        }
    }
}
</script>

<style>

</style>
