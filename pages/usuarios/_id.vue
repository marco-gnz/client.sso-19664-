<template>
  <div class="container-fluid mt-5">
    <div class="row d-flex justify-content-center">
      <div class="col-md-12">
        <el-steps :active="pasos" align-center>
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
                    <h6 class="m-0 font-weight-bold text-primary">Editar usuario administrador</h6>
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
                        <input v-model="rut" type="number" class="form-control" placeholder="Rut">
                        <span class="text-danger" v-if="errors.rut">{{errors.rut[0]}}</span>
                      </div>
                      <div class="col-md-3">
                        <label>DV</label>
                        <input v-model="dv" type="text" class="form-control" placeholder="DV">
                        <span class="text-danger" v-if="errors.dv">{{errors.dv[0]}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="row">
                      <div class="col-md-3">
                        <label>Primer nombre</label>
                        <input v-model="primer_nombre" type="text" class="form-control" placeholder="Primer nombre">
                        <span class="text-danger" v-if="errors.primer_nombre">{{errors.primer_nombre[0]}}</span>
                      </div>
                      <div class="col-md-3">
                        <label>Segundo nombre</label>
                        <input v-model="segundo_nombre" type="text" class="form-control" placeholder="Segundo nombre">
                      </div>
                      <div class="col-md-3">
                        <label>Apellido paterno</label>
                        <input v-model="apellido_paterno" type="text" class="form-control" placeholder="A. paterno">
                        <span class="text-danger" v-if="errors.apellido_paterno">{{errors.apellido_paterno[0]}}</span>
                      </div>
                      <div class="col-md-3">
                        <label>Apellido materno</label>
                        <input v-model="apellido_materno" type="text" class="form-control" placeholder="A. materno">
                        <span class="text-danger" v-if="errors.apellido_materno">{{errors.apellido_materno[0]}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Correo institucional</label>
                    <input v-model="correo" type="email" class="form-control" placeholder="Correo institucional">
                    <span class="text-danger" v-if="errors.email">{{errors.email[0]}}</span>
                  </div>
                  <div class="form-group">
                    <label>Genero</label>
                    <select class="form-control" v-model="genero">
                        <option value="" selected disabled>-- Seleccione género --</option>
                        <option v-for="(genero, index) in generos" :key="index" :value="genero.id">{{genero.nombre}}</option>
                    </select>
                    <span class="text-danger" v-if="errors.genero_id">{{errors.genero_id[0]}}</span>
                  </div>
                  <div class="form-group">
                    <label>Red asistencial que administra</label>
                    <select class="form-control" v-model="red_admin">
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
    <section v-if="pasos == 1">
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
                    <select class="form-control" @change="getPermisos" v-model="perfil">
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
    <section v-if="pasos == 2">
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
                    <div class="form-group" v-if="addPermisosAdicional && permisosExtras.length">
                      <div class="row pt-lg-4">
                        <div style="margin: 15px 0;"></div>
                        <div class="col-md-6">
                          <label>Seleccione permisos adicionales</label>
                            <el-checkbox-group v-model="permisos_extras" size="medium">
                              <el-checkbox
                                v-for="label in permisosExtras"
                                :key="label.id"
                                :label="label.id"
                              >
                              {{ label.name }}
                              </el-checkbox>
                            </el-checkbox-group>
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
                <button :disabled="(rut == '' || dv == '') ? true : false" v-show="pasos != 2" @click="siguiente" class="btn btn-primary float-right"><i class="fas fa-arrow-left"></i> Siguiente</button>
                <button v-show="pasos == 2" @click.prevent="editUsuario" v-loading.fullscreen.lock="fullscreenLoading" class="btn btn-success float-right"><i class="fas fa-arrow-left"></i> Editar usuario</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
export default {
  middleware: 'auth',
  head(){
    return{
      title: `Editar usuario`
    };
  },
  data(){
    return{
      fullscreenLoading:false,
      addPermisosAdicional:false,
      pasos:0,
      errors:{},
      setTimeout:''
    };
  },
  mounted(){
    this.getGeneros();
    this.getRedes();
    this.getPerfiles();
    this.getPermisosToPerfil(this.perfil);
    this.getPermisosExtras(this.perfil);
    this.getUsuario(this.$route.params.id);
    this.checkAll();
  },
  computed:{
    ...mapGetters({
      usuario:'usuarios/usuario',
      generos:'mantenedores/generos',
      redes:'mantenedores/redesHospitalariasUserAuth',
      perfiles:'perfiles/perfiles',
      permisosToPerfil:'perfiles/permisosToPerfil',
      permisosExtras:'perfiles/permisosExtras'
    }),
    rut:{
      get() {
        return this.$store.state.usuarios.usuario.rut;
      },
      set(value) {
        this.$store.commit('usuarios/SET_RUT', value);
      }
    },
    dv:{
      get() {
        return this.$store.state.usuarios.usuario.dv;
      },
      set(value) {
        this.$store.commit('usuarios/SET_DV', value);
      }
    },
    primer_nombre:{
      get() {
        return this.$store.state.usuarios.usuario.primer_nombre;
      },
      set(value) {
        this.$store.commit('usuarios/SET_PRIMER_NOMBRE', value);
      }
    },
    segundo_nombre:{
      get() {
        return this.$store.state.usuarios.usuario.segundo_nombre;
      },
      set(value) {
        this.$store.commit('usuarios/SET_SEGUNDO_NOMBRE', value);
      }
    },
    apellido_materno:{
      get() {
        return this.$store.state.usuarios.usuario.apellido_materno;
      },
      set(value) {
        this.$store.commit('usuarios/SET_APELLIDO_MATERNO', value);
      }
    },
    apellido_paterno:{
      get() {
        return this.$store.state.usuarios.usuario.apellido_paterno;
      },
      set(value) {
        this.$store.commit('usuarios/SET_APELLIDO_PATERNO', value);
      }
    },
    correo:{
      get() {
        return this.$store.state.usuarios.usuario.correo;
      },
      set(value) {
        this.$store.commit('usuarios/SET_CORREO', value);
      }
    },
    genero:{
      get() {
        return this.$store.state.usuarios.usuario.genero;
      },
      set(value) {
        this.$store.commit('usuarios/SET_GENERO', value);
      }
    },
    red_admin:{
      get() {
        return this.$store.getters['usuarios/redes_admin']
      },
      set(value) {
        this.$store.commit('usuarios/SET_REDES_ADMIN', value);
      }
    },
    perfil:{
      get() {
        return this.$store.state.usuarios.usuario.perfil;
      },
      set(value) {
        this.$store.commit('usuarios/SET_PERFIL_ADMIN', value);
      }
    },
    permisos_extras:{
      get() {
        return this.$store.state.usuarios.usuario.permisos_extras;
      },
      set(value) {
        this.$store.commit('usuarios/SET_PERMISOS_EXTRAS', value);
      }
    },
  },
  methods:{
    ...mapActions({
      getUsuario:'usuarios/getUsuario',
      getGeneros: 'mantenedores/getGeneros',
      getRedes:'mantenedores/getRedesHospitalariasUserAuth',
      getPerfiles:'perfiles/getPerfiles',
      getPermisosToPerfil:'perfiles/getPermisosToPerfil',
      getPermisosExtras:'perfiles/getPermisosExtras'
    }),
    getPermisos(){
      this.getPermisosToPerfil(this.perfil);
      this.getPermisosExtras(this.perfil);
    },
    checkAll(){
      if(this.permisosExtras.length > 0 && this.permisos_extras.length > 0){
        this.addPermisosAdicional = true;
      }
    },
    async editUsuario(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/usuarios/usuario/edit-usuario/${this.$store.state.usuarios.usuario.id}`;

      const data = {
        rut:this.rut,
        dv:this.dv,
        rut_completo:`${this.rut}-${this.dv}`,
        primer_nombre:this.primer_nombre,
        segundo_nombre:this.segundo_nombre,
        apellido_materno:this.apellido_materno,
        apellido_paterno:this.apellido_paterno,
        nombre_completo:`${this.primer_nombre} ${this.segundo_nombre} ${this.apellido_paterno} ${this.apellido_materno}`,
        email:this.correo,
        genero_id:this.genero,
        rol:this.perfil,
        red_admin:this.red_admin,
        permisos_extras:this.permisos_extras
      };

      await this.$axios.$put(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        console.log(response);
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
          this.pasos = 1;
        }else{
          this.pasos = 0;
        }
      });
    },
    addUserToArray(){
      clearTimeout(this.setTimeout);
      this.setTimeout = setTimeout(this.addUser(), 4000);
    },
    addUser(){
      this.$notify({
          message: 'Usuario editado con éxito.',
          type: 'success'
      });
    },
    volver(){
      this.pasos--;
    },
    siguiente(){
      this.pasos++;
    }
  }
}
</script>

<style>

</style>
