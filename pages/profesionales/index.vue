<template>
    <div class="container-fluid mt-5">
      <div class="row">
        <div class="col-md-12">
          <div class="card shadow">
            <div class="card-header py-3">
                <div class="row">
                    <div class="col-md-6">
                        <h6 class="m-0 font-weight-bold text-primary">Listado de profesionales</h6>
                    </div>
                    <div class="col-md-6">
                        <b-button v-if="$auth.user.permissions_roles.includes('ingresar-profesional') || $auth.user.permissions.includes('ingresar-profesional')" variant="primary" to="/ingresar/profesional" class="btn btn-primary btn-sm float-right">Ingresar profesional</b-button>
                    </div>
                </div>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-12">
                  <div class="row">
                    <div class="col-md-12">
                        <b-input-group>
                            <b-form-input :state="buscador" :disabled="!$auth.user.permissions_roles.includes('buscar-profesional') && !$auth.user.permissions.includes('buscar-profesional')" size="small" v-model="searchInput" :autofocus="true" @keyup="keySearchProfesionales" placeholder="Busque por Rut, Nombre o Apellidos..."></b-form-input>
                        </b-input-group>
                    </div>
                  </div>
                  <div class="row">
                      <div class="col-xs-2">
                          <el-button :disabled="!$auth.user.permissions_roles.includes('buscar-profesional') && !$auth.user.permissions.includes('buscar-profesional')" @click.prevent="openFilter" type="text" size="medium" icon="el-icon-plus">Filtro avanzado</el-button>
                      </div>
                      <div class="col-md-10 pt-lg-3" v-if="searchAll.active_filtro_avanzado">
                        <span class="float-right"><i class="el-icon-loading text-danger" style="width: 15px;"></i><i>Existen filtros avanzados activados. Para eliminar, favor hacer click en <strong>filtro avanzado</strong> y <strong>refrescar campos</strong></i>.</span>
                      </div>
                  </div>
                </div>
              </div>
              <div class="row pt-lg-5">
                <template v-if="profesionales.length">
                  <div class="col-md-12">
                    <el-tag size="mini" type="success">{{`${pagination.total} ${pagination.total > 1 ? `resultados` : `resultado`}`}}</el-tag>
                    <table class="table pt-lg-2">
                      <thead>
                        <tr>
                          <th scope="col">Rut</th>
                          <th scope="col">Nombres</th>
                          <th scope="col">Etapa</th>
                          <th scope="col">Estado</th>
                          <th>&nbsp;</th>
                        </tr>
                      </thead>
                        <tbody>
                          <tr v-for="(profesional, index) in profesionales" :key="index" class="click">
                            <td>{{profesional.rut_completo}}</td>
                            <td>{{profesional.apellidos}} {{profesional.nombres}}</td>
                            <td>{{profesional.etapa.nombre}}</td>
                            <td>
                              <template v-if="$auth.user.permissions_roles.includes('estado-profesional') || $auth.user.permissions.includes('estado-profesional')">
                                <el-tooltip :content="`Estado: ${profesional.estado == 1 ? `Habilitado` : `Deshabilitado`}`" placement="top">
                                  <el-switch :active-value="profesional.estado === 0" :inactive-value="profesional.estado === 1" @change="editStatus(profesional.uuid, index, profesional.estado)" v-loading.fullscreen.lock="fullscreenLoading"></el-switch>
                                </el-tooltip>
                              </template>
                              <template v-else>
                                <el-tag size="mini" :type="profesional.estado === 1 ? 'success' : 'danger'">{{ `${profesional.estado == 1 ? `Habilitado` : `Deshabilitado`}` }}</el-tag>
                              </template>
                            </td>
                            <td @click.stop="" class="no">
                                <el-dropdown>
                                  <span class="el-dropdown-link">Acción<i class="el-icon-arrow-down el-icon--right"></i></span>
                                  <el-dropdown-menu slot="dropdown">
                                    <template v-if="$auth.user.permissions_roles.includes('ver-profesional') || $auth.user.permissions.includes('ver-profesional')">
                                      <el-dropdown-item icon="el-icon-edit"><nuxt-link  :to="'/profesionales/'+profesional.uuid">Ver mas</nuxt-link></el-dropdown-item>
                                    </template>
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
                  <nav v-show="profesionales.length" aria-label="Page navigation example">
                    <ul class="pagination">
                      <li class="page-item" v-if="pagination.current_page > 1">
                        <button :disabled="profesionales.length === 0" class="page-link" href="#" @click.prevent="changePage(pagination.current_page - 1)">
                            <span>Volver</span>
                        </button>
                      </li>
                      <li class="page-item" v-for="page in pagesNumber" :key="page" :class="page == pagination.current_page ? 'active' : '' &&  profesionales.length ? 'active' : '' ">
                          <button :disabled="profesionales.length === 0" class="page-link" href="#" @click.prevent="changePage(page)">
                              {{page}}
                          </button>
                      </li>
                      <li class="page-item" v-if="pagination.current_page < pagination.last_page">
                          <button :disabled="profesionales.length === 0" class="page-link" href="#" @click.prevent="changePage(pagination.current_page + 1)">
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
      <ModalFiltro />
    </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
import ModalFiltro from '../../components/profesionales/modal-filtro.vue';
export default {
    middleware: "auth",
    head() {
        return {
            title: "Profesionales",
        };
    },
    data() {
        return {
            filterDialog: false,
            isBusy: false,
            value: 1,
            fullscreenLoading: false,
            setTimeoutBuscador: ""
        };
    },
    mounted() {
        this.setFiltro();
        this.getProfesionales();
    },
    computed: {
        ...mapGetters({
          profesionales: "profesionales/profesionales"
        }),
        buscador(){
          return (this.searchInput.length > 0) ? true : null;
        },
        searchInput:{
          get() {
            return this.$store.getters['profesionales/inputSearch']
          },
          set(value) {
            this.$store.commit('profesionales/SET_INPUT_SEARCH', value);
          }
        },
        searchAll(){
          return {...this.$store.state.profesionales.search}
        },
        pagination: function () {
            return { ...this.$store.state.profesionales.pagination };
        },
        pagesNumber: function () {
          if (!this.$store.state.profesionales.pagination.to) {
              return [];
          }
          var from = this.$store.state.profesionales.pagination.current_page - this.$store.state.profesionales.offset;
          if (from < 1) {
              from = 1;
          }
          var to = from + (this.$store.state.profesionales.offset * 2);
          if (to >= this.$store.state.profesionales.pagination.last_page) {
              to = this.$store.state.profesionales.pagination.last_page;
          }
          var pagesArray = [];
          while (from <= to) {
              pagesArray.push(from);
              from++;
          }
          return pagesArray;
        }
    },
    methods: {
        toggleBusy() {
            this.isBusy = !this.isBusy;
        },
        ...mapActions({
            getProfesionales: "profesionales/getProfesionales",
            open: "profesionales/updateModal",
        }),
        ...mapMutations({
            changeStatusAction: "profesionales/UPDATE_STATUS_PROFESIONAL",
            estadoChange: "profesionales/CHAGE_ESTADO",
            currentPageAction: "profesionales/SET_CURRENT_PAGE",
            setParamsFiltro: 'profesionales/SET_PARAMS_FILTRO'
        }),
        openFilter() {
            this.open();
        },
        changePage(page) {
            this.currentPageAction(page);
            this.getProfesionales();
        },
        setFiltro(){
            let filtro = JSON.parse(localStorage.getItem('filtros'));
            if(filtro){
              this.setParamsFiltro(filtro);
            }
        },
        searchProfesionales() {
          if(this.searchInput.length > 1){
            this.getProfesionales();
          }else if (this.searchInput.length == 0){
            localStorage.setItem('filtros', JSON.stringify(this.searchAll));
            this.getProfesionales();
          }
        },
        keySearchProfesionales() {
            this.currentPageAction(1);
            clearTimeout(this.setTimeoutBuscador);
            this.setTimeoutBuscador = setTimeout(this.searchProfesionales, 500);
        },
        async editStatus(uuid, index, estado) {
            this.fullscreenLoading = !this.fullscreenLoading;
            const url = `/api/profesionales/profesional/change-status/${uuid}`;
            const data = {
                estado: !estado
            };
            try {
                await this.$axios.$put(url, data).then(response => {
                    this.fullscreenLoading = !this.fullscreenLoading;
                    if (response[0] === true) {
                        this.changeStatusAction({ response: response[1], index: index });
                        this.$notify.success({
                            message: `Profesional ${response[1].estado != false ? `habilitado` : `deshabilitado`}.`,
                            showClose: true
                        });
                    }
                    else {
                        this.$message.error("Error de servidor");
                    }
                }).catch(error => {
                    this.fullscreenLoading = !this.fullscreenLoading;
                    console.log(error);
                });
            }
            catch (error) {
                console.log(error);
            }
        }
    },
    components: { ModalFiltro }
}
</script>

<style>
.no:hover{
    background-color: #fff;
    cursor: default;
}
</style>
