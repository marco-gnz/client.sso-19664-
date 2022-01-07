<template>
  <div class="container-fluid mt-5">
    <div class="row">
      <div class="col-md-12">
        <div class="card shadow">
          <div class="card-header py-3">
            <div class="row">
              <div class="col-md-6">
                  <h6 class="m-0 font-weight-bold text-primary">Listado de usuarios del sistema</h6>
              </div>
              <div class="col-md-6">
                <nuxt-link to="/usuarios/ingresar"><button to="/usuarios/ingresar" class="btn btn-success float-right">Ingresar usuario</button></nuxt-link>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-4">
                      <select class="form-control" v-model="searchPerfil" @change="searchUsuarios">
                        <option value="" selected>-- Seleccione perfil --</option>
                        <option v-for="(perfil, index) in perfiles" :value="perfil.id" :key="index">{{perfil.name}}</option>
                      </select>
                  </div>
                  <div class="col-md-8">
                    <b-input-group>
                        <b-form-input  v-model="searchInput" @keyup="keySearchUsuarios" placeholder="Busque por rut, nombre, apellidos, siglas o correo electrónico..."></b-form-input>
                    </b-input-group>
                  </div>
                </div>
              </div>
            </div>
            <div class="row pt-lg-5">
              <template v-if="usuarios.length">
                <div class="col-md-12">
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">Rut</th>
                        <th scope="col">Nombres</th>
                        <th scope="col">Perfil</th>
                        <th scope="col">Red hospitalaria</th>
                        <th scope="col">Estado</th>
                        <th>&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(usuario, index) in usuarios" :key="index">
                        <td>{{usuario.rut_completo}}</td>
                        <td>{{usuario.primer_nombre}} {{usuario.apellido_materno}} {{usuario.apellido_paterno}}</td>
                        <td>{{ (usuario.roles.length > 0) ? usuario.roles.map(r => r.name).join(' - ') : '--' }}</td>
                        <td>{{ (usuario.redes_hospitalarias.length) ? usuario.redes_hospitalarias.map(r => r.nombre).join(', ') : '--' }}</td>
                        <td>
                          <el-tooltip :content="`Estado: ${usuario.estado == 1 ? `Habilitado` : `Deshabilitado`}`" placement="top">
                            <el-switch :active-value="usuario.estado === 0" :inactive-value="usuario.estado === 1" @change="editStatus(usuario.uuid, index, usuario.estado)" v-loading.fullscreen.lock="fullscreenLoading"></el-switch>
                          </el-tooltip>
                        </td>
                        <td @click.stop="">
                            <el-dropdown>
                                <span class="el-dropdown-link">
                                    Acción<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-popconfirm
                                        @confirm="restablecerContrasena(usuario, index)"
                                        confirm-button-text='Si, restablecer'
                                        cancel-button-text='No'
                                        icon="el-icon-info"
                                        icon-color="red"
                                        title="¿Restablecer contraseña?"
                                        >
                                      <el-dropdown-item slot="reference" icon="el-icon-refresh" v-loading.fullscreen.lock="fullscreenLoading">Restablecer contraseña</el-dropdown-item>
                                    </el-popconfirm>
                                    <el-dropdown-item icon="el-icon-edit">Editar</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
              <template v-else>
                <div class="col-md-12">
                  <el-empty :image-size="50">
                    <div class="row" slot="description">
                      <div class="col-md-12"><span>No se encontraron resultados...</span></div>
                    </div>
                  </el-empty>
                </div>
              </template>
            </div>
          </div>
          <div class="card-footer text-muted text-center clearfix">
            <div class="row">
              <div class="col-md-6">
                <nav aria-label="Page navigation example">
                  <ul class="pagination">
                    <li class="page-item" v-if="pagination.current_page > 1">
                      <button :disabled="usuarios.length === 0" class="page-link" href="#" @click.prevent="changePage(pagination.current_page - 1)">
                          <span>Volver</span>
                      </button>
                    </li>
                    <li class="page-item" v-for="page in pagesNumber" :key="page" :class="page == pagination.current_page ? 'active' : '' &&  usuarios.length ? 'active' : '' ">
                        <button :disabled="usuarios.length === 0" class="page-link" href="#" @click.prevent="changePage(page)">
                            {{page}}
                        </button>
                    </li>
                    <li class="page-item" v-if="pagination.current_page < pagination.last_page">
                        <button :disabled="usuarios.length === 0" class="page-link" href="#" @click.prevent="changePage(pagination.current_page + 1)">
                            <span>Siguiente</span>
                        </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
export default {
  middleware: "auth",
  head() {
      return {
          title: "Usuarios",
      };
  },
  data(){
    return{
      fullscreenLoading:false,
      setTimeoutBuscador:''
    };
  },
  mounted(){
    let filtros = JSON.parse(localStorage.getItem("filtros_usuarios"));
    if (filtros) {
      let object = { search: filtros };
      this.getUsuarios(object);
    }else{
      this.getUsuarios();
    }
    this.getPerfiles();
  },
  computed:{
    ...mapGetters({
      usuarios:'usuarios/usuarios',
      perfiles:'perfiles/perfiles'
    }),
    searchInput:{
      get() {
        return this.$store.getters['usuarios/inputSearch']
      },
      set(value) {
        this.$store.commit('usuarios/SET_INPUT_SEARCH', value);
      }
    },
    searchPerfil:{
      get() {
        return this.$store.getters['usuarios/inputPerfil']
      },
      set(value) {
        this.$store.commit('usuarios/SET_INPUT_PERFIL', value);
      }
    },
    cargando(){
      return {...this.$store.state.usuarios.screenCargando}
    },
    searchAll(){
      return {...this.$store.state.usuarios.search}
    },
    pagination: function () {
      return { ...this.$store.state.usuarios.pagination };
    },
    pagesNumber: function () {
      if (!this.$store.state.usuarios.pagination.to) {
          return [];
      }
      var from = this.$store.state.usuarios.pagination.current_page - this.$store.state.usuarios.offset;
      if (from < 1) {
          from = 1;
      }
      var to = from + (this.$store.state.usuarios.offset * 2);
      if (to >= this.$store.state.usuarios.pagination.last_page) {
          to = this.$store.state.usuarios.pagination.last_page;
      }
      var pagesArray = [];
      while (from <= to) {
          pagesArray.push(from);
          from++;
      }
      return pagesArray;
    }
  },
  methods:{
    ...mapActions({
      getUsuarios:'usuarios/getUsuarios',
      getPerfiles:'perfiles/getPerfiles'
    }),
    ...mapMutations({
      currentPageAction: "usuarios/SET_CURRENT_PAGE",
      changeStatusAction: "usuarios/UPDATE_STATUS_USUARIOS",
    }),
    async restablecerContrasena(usuario){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/usuarios/restablecer-contrasena/${usuario.uuid}`;

      await this.$axios.$put(url).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        console.log(response);
        if(response === true){
          this.$notify.success({
            message: 'Contraseña restablecida con éxito.',
            showClose: true
          });
        }else{
          this.$message.error("Error de servidor");
        }
      }).catch(error => {
        this.fullscreenLoading = !this.fullscreenLoading;
        console.log(error);
      });
    },
    async editStatus(uuid, index, estado){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url   = `/api/usuarios/change-status/${uuid}`;

      await this.$axios.$put(url).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        console.log(response);
        if (response[0] === true) {
          this.changeStatusAction({ response: response[1], index: index });
          this.$notify.success({
            message: `Usuario ${response[1].estado != false ? `habilitado` : `deshabilitado`}.`,
            showClose: true
          });
        }else {
          this.$message.error("Error de servidor");
        }
      }).catch(error => {
        this.fullscreenLoading = !this.fullscreenLoading;
        console.log(error);
      });
    },
    searchUsuarios(){
      if (this.searchInput.length > 2 || this.searchPerfil != '') {
       let object = { search: this.searchAll };
          this.getUsuarios(object);
          localStorage.setItem('filtros_usuarios', JSON.stringify(this.searchAll));
      }else if (this.searchInput.length == 0){
          this.getUsuarios();
          localStorage.removeItem('filtros_usuarios');
      }
    },
    keySearchUsuarios(){
      clearTimeout(this.setTimeoutBuscador);
      this.setTimeoutBuscador = setTimeout(this.searchUsuarios, 500);
    },
    changePage(page) {
        this.currentPageAction(page);
        let object = { page: page };
        this.getUsuarios(object);
    },
  }
}
</script>

<style>

</style>
