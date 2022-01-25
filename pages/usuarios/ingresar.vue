<template>
  <div class="container-fluid mt-5">
    <div class="row d-flex justify-content-center">
      <div class="col-md-12">
        <el-steps :active="pasos" align-center>
          <el-step title="Identificar usuario" description="Verificar que el usuario no existen en sistema"></el-step>
          <el-step title="Datos personales" description="Datos personales del usuario"></el-step>
          <el-step title="Perfil" description="Perfiles del sistema para el usuario"></el-step>
          <el-step title="Permisos extras" description="Permisos adicionales para el usuario (Opcional)"></el-step>
        </el-steps>
      </div>
    </div>
    <section v-if="pasos == 0">
      <div class="row pt-4 d-flex justify-content-center">
        <div class="col-md-5">
          <div class="card shadow">
            <div class="card-header py-3">
              <div class="row">
                <div class="col-md-6">
                    <h6 class="m-0 font-weight-bold text-primary">Identificar nuevo usuario administrador</h6>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="card-body">
                  <div class="form-group">
                    <div class="row d-flex justify-content-center">
                      <div class="col-sm-6">
                        <label>RUT</label>
                        <b-form-input v-model="usuario.rut" type="number" class="form-control form-control-user" placeholder="Ingrese rut"></b-form-input>
                      </div>
                      <div class="col-xs-1 pt-lg-5">
                        <strong>-</strong>
                      </div>
                      <div class="col-sm-2">
                        <label>DV</label>
                        <b-form-input v-uppercase v-model="usuario.dv" @keyup="identificarUsuario" type="text" class="form-control form-control-user" placeholder="DV" v-loading.fullscreen.lock="fullscreenLoading"></b-form-input>
                      </div>
                    </div>
                    <template v-if="usuario_exist">
                      <div class="row d-flex justify-content-center pt-lg-3">
                        <div class="col-md-8">
                          <el-alert
                            title="Usuario ya existe en los registros"
                            type="warning"
                            center
                            :closable="false"
                            show-icon>
                          </el-alert>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-if="pasos == 1">
      <div class="row pt-4 d-flex justify-content-center">
        <div class="col-md-5">
          <div class="card shadow">
            <div class="card-header py-3">
              <div class="row">
                <div class="col-md-6">
                    <h6 class="m-0 font-weight-bold text-primary">Ingresar usuario administrador</h6>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="card-body">
                  <div class="form-group">
                    <div class="row">
                      <div class="col-md-9">
                        <label>Rut</label>
                        <input :value="usuario.rut" disabled type="number" class="form-control" placeholder="Rut">
                        <span class="text-danger" v-if="errors.rut">{{errors.rut[0]}}</span>
                      </div>
                      <div class="col-md-3">
                        <label>DV</label>
                        <input :value="usuario.dv" disabled type="text" class="form-control" placeholder="DV">
                        <span class="text-danger" v-if="errors.dv">{{errors.dv[0]}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="row">
                      <div class="col-md-3">
                        <label>Primer nombre</label>
                        <input v-model="usuario.primer_nombre" type="text" class="form-control" placeholder="Primer nombre" v-uppercase>
                        <span class="text-danger" v-if="errors.primer_nombre">{{errors.primer_nombre[0]}}</span>
                      </div>
                      <div class="col-md-3">
                        <label>Segundo nombre</label>
                        <input v-model="usuario.segundo_nombre" type="text" class="form-control" placeholder="Segundo nombre" v-uppercase>
                      </div>
                      <div class="col-md-3">
                        <label>Apellido paterno</label>
                        <input v-model="usuario.apellido_paterno" type="text" class="form-control" placeholder="A. paterno" v-uppercase>
                        <span class="text-danger" v-if="errors.apellido_paterno">{{errors.apellido_paterno[0]}}</span>
                      </div>
                      <div class="col-md-3">
                        <label>Apellido materno</label>
                        <input v-model="usuario.apellido_materno" type="text" class="form-control" placeholder="A. materno" v-uppercase>
                        <span class="text-danger" v-if="errors.apellido_materno">{{errors.apellido_materno[0]}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Correo institucional</label>
                    <input v-model="usuario.correo" type="email" class="form-control" placeholder="Correo institucional">
                    <span class="text-danger" v-if="errors.email">{{errors.email[0]}}</span>
                  </div>
                  <div class="form-group">
                    <label>Genero</label>
                    <select class="form-control" v-model="usuario.genero">
                        <option value="" selected disabled>-- Seleccione género --</option>
                        <option v-for="(genero, index) in generos" :key="index" :value="genero.id">{{genero.nombre}}</option>
                    </select>
                    <span class="text-danger" v-if="errors.genero_id">{{errors.genero_id[0]}}</span>
                  </div>
                  <div class="form-group">
                    <label>Red asistencial que administra</label>
                    <select class="form-control" v-model="usuario.red_admin">
                        <option value="" selected disabled>-- Seleccione red --</option>
                        <option v-for="(red, index) in redes" :key="index" :value="red.id">{{red.nombre}}</option>
                    </select>
                    <span class="text-danger" v-if="errors.red_admin">{{errors.red_admin[0]}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-if="pasos == 2">
      <div class="row pt-4 d-flex justify-content-center">
        <div class="col-md-5">
          <div class="card shadow">
            <div class="card-header py-3">
              <div class="row">
                <div class="col-md-6">
                    <h6 class="m-0 font-weight-bold text-primary">Seleccione perfil</h6>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="card-body">
                  <div class="form-group">
                    <label>Seleccione perfil que utilizará el nuevo usuario</label>
                    <select class="form-control" @change="getPermisos" v-model="usuario.perfil">
                      <option value="" selected disabled>-- Seleccione perfil --</option>
                      <option v-for="(perfil, index) in perfiles" :key="index" :value="perfil.id">{{perfil.name}}</option>
                    </select>
                    <span class="text-danger" v-if="errors.rol">{{errors.rol[0]}}</span>
                  </div>
                  <div class="form-group" v-if="permisosToPerfil.length">
                    <label>Los permisos del perfil son:</label>
                    <ul v-for="(permiso, index) in permisosToPerfil" :key="index">
                      <li>{{permiso}}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-if="pasos == 3">
      <div class="row pt-4 d-flex justify-content-center">
        <div class="col-md-5">
          <div class="card shadow">
            <div class="card-header py-3">
              <div class="row">
                <div class="col-md-6">
                    <h6 class="m-0 font-weight-bold text-primary">Seleccione permisos adicionales <i>(Opcional)</i></h6>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="card-body">
                  <el-switch
                    :disabled="permisosExtras.length === 0"
                    v-model="addPermisosAdicional"
                    active-text="Añadir permisos adicionales"
                    inactive-text="No añadir">
                  </el-switch>
                  <template v-if="permisosExtras.length">
                    <div class="form-group" v-if="addPermisosAdicional">
                      <div class="row pt-lg-4">
                        <div style="margin: 15px 0;"></div>
                        <div class="col-md-6">
                          <label>Seleccione permisos adicionales</label>
                          <ul>
                            <el-checkbox-group v-model="usuario.permisos_extras">
                              <li><el-checkbox v-for="(permiso_extra, index) in permisosExtras" :label="permiso_extra.id" :key="index">{{permiso_extra.name}}</el-checkbox></li>
                            </el-checkbox-group>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="form-group">
                      <el-alert
                        title="No existen más permisos."
                        type="warning"
                        :closable="false"
                        show-icon>
                      </el-alert>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="row pt-lg-1 d-flex justify-content-center rounded">
        <div class="col-md-5">
          <div class="card-footer rounded">
            <div class="row">
              <div class="col-md-6">
                <button :disabled="pasos === 0" @click="volver" class="btn btn-default float-left"><i class="fas fa-arrow-left"></i> Volver</button>
              </div>
              <div class="col-md-6">
                <button :disabled="(usuario.rut == '' || usuario.dv == '' || usuario_exist == true) ? true : false" v-show="pasos != 3" @click="siguiente" class="btn btn-primary float-right"><i class="fas fa-arrow-left"></i> Siguiente</button>
                <button v-show="pasos == 3 && !usuario_exist" @click.prevent="addUsuario" v-loading.fullscreen.lock="fullscreenLoading" class="btn btn-success float-right"><i class="fas fa-arrow-left"></i> Ingresar usuario</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
  middleware: "auth",
  head() {
      return {
          title: "Ingresar usuario",
      };
  },
  data(){
    return{
      addPermisosAdicional:false,
      checkAll: false,
      isIndeterminate: true,
      usuario_exist:false,
      pasos:0,
      fullscreenLoading:false,
      setTimeoutBuscador:'',
      usuario:{
        rut:'',
        dv:'',
        primer_nombre:'',
        segundo_nombre:'',
        apellido_paterno:'',
        apellido_materno:'',
        correo:'',
        genero:'',
        red_admin:'',
        perfil:'',
        permisos_extras:[]
      },
      setTimeout:'',
      errors:{}
    };
  },
  mounted(){
    this.getGeneros();
    this.getRedes();
    this.getPerfiles();
  },
  computed:{
    ...mapGetters({
      generos:'mantenedores/generos',
      redes:'mantenedores/redesHospitalariasUserAuth',
      establecimientos:'mantenedores/establecimientos',
      perfiles:'perfiles/perfiles',
      permisosToPerfil:'perfiles/permisosToPerfil',
      permisosExtras:'perfiles/permisosExtras'
    })
  },
  methods:{
    ...mapActions({
      getGeneros: 'mantenedores/getGeneros',
      getRedes:'mantenedores/getRedesHospitalariasUserAuth',
      getPerfiles:'perfiles/getPerfiles',
      getPermisosToPerfil:'perfiles/getPermisosToPerfil',
      getPermisosExtras:'perfiles/getPermisosExtras'
    }),
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.permisos_extras : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.permisos_extras.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.permisos_extras.length;
    },
    async existUsuario(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = '/api/usuarios/usuario/exist';
      const data = {
        rut: this.usuario.rut,
        dv: this.usuario.dv
      };

      await this.$axios.$get(url, {
        params:data
      }).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.usuario_exist = true; //existe
        }else{
          this.usuario_exist = false;//no existe
        }
      }).catch(error => {
        this.fullscreenLoading = !this.fullscreenLoading;
        console.log(error);
      });
    },
    identificarUsuario(){
      clearTimeout(this.setTimeoutBuscador);
      this.setTimeoutBuscador = setTimeout(this.existUsuario, 1000);
    },
    getPermisos(){
      this.getPermisosToPerfil(this.usuario.perfil);
      this.getPermisosExtras(this.usuario.perfil);
    },
    async addUsuario(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = '/api/usuarios/usuario/add-usuario';
      const data = {
        rut:this.usuario.rut,
        dv:this.usuario.dv,
        rut_completo:`${this.usuario.rut}-${this.usuario.dv}`,
        primer_nombre:this.usuario.primer_nombre,
        segundo_nombre:this.usuario.segundo_nombre,
        apellido_materno:this.usuario.apellido_materno,
        apellido_paterno:this.usuario.apellido_paterno,
        nombre_completo:`${this.usuario.primer_nombre} ${this.usuario.segundo_nombre} ${this.usuario.apellido_paterno} ${this.usuario.apellido_materno}`,
        email:this.usuario.correo,
        genero_id:this.usuario.genero,
        rol:this.usuario.perfil,
        red_admin:this.usuario.red_admin,
        permisos_extras:this.usuario.permisos_extras
      };

      await this.$axios.$post(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.$router.replace('/usuarios');
          this.addUserToArray();
        }else{
          this.$message.error("Error de servidor");
        }
      }).catch(error => {
        this.fullscreenLoading = !this.fullscreenLoading;
        this.errors = error.response.data.errors;
        if(error.response.data.errors.rol){
          this.pasos = 2;
        }else{
          this.pasos = 1;
        }
      });
    },
    addUserToArray(){
      clearTimeout(this.setTimeout);
      this.setTimeout = setTimeout(this.addUser(), 4000);
    },
    addUser(){
      this.$notify({
          message: 'Usuario ingresado con éxito.',
          type: 'success'
      });
    },
    volver(){
      this.pasos--;
    },
    siguiente(){
      this.pasos++;
    }
  },
}
</script>

<style>

</style>
