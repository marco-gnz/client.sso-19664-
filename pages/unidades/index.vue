<template>
  <div class="container-fluid mt-5">
    <div class="row">
      <div class="col-xs-3">
        <Pagination />
      </div>
      <div class="col-lg-9">
        <div class="card shadow">
          <div class="card-header py-3">
              <div class="row">
                  <div class="col-md-6">
                      <h6 class="m-0 font-weight-bold text-primary">Listado de unidades en establecimientos</h6>
                  </div>
                  <div class="col-md-6">
                      <button v-if="$auth.user.permissions_roles.includes('ingresar-dato-maestro') || $auth.user.permissions.includes('ingresar-dato-maestro')" v-b-modal.modal-add-unidad class="btn btn-success float-right">Ingresar unidad</button>
                      <ModalAddUnidad />
                      <ModalEditUnidad />
                  </div>
              </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-12">
                    <b-input-group>
                        <b-form-input @keyup="keySearchCentros" v-model="searchInput" placeholder="Busque por nombre o código SIRH"></b-form-input>
                    </b-input-group>
                  </div>
                </div>
              </div>
            </div>
            <div class="row pt-lg-5">
              <template v-if="unidades.length">
                <div class="col-md-12">
                  <el-tag size="mini" type="success">{{`${pagination.total} ${pagination.total > 1 ? `resultados` : `resultado`}`}}</el-tag>
                  <table class="table pt-lg-2">
                    <thead>
                      <tr>
                        <th scope="col">Cod. SIRH</th>
                        <th scope="col">Nombre</th>
                        <th>&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(unidad, index) in unidades" :key="index">
                        <td>{{ (unidad.cod_sirh != null) ? unidad.cod_sirh : '--' }}</td>
                        <td>{{unidad.nombre}}</td>
                        <td @click.stop="">
                          <el-dropdown>
                            <span class="el-dropdown-link">Acción<i class="el-icon-arrow-down el-icon--right"></i></span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item icon="el-icon-edit" @click.native="editUnidad(unidad)" v-b-modal.modal-edit-unidad>Editar</el-dropdown-item>
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
                      <button :disabled="unidades.length === 0" class="page-link" href="#" @click.prevent="changePage(pagination.current_page - 1)">
                          <span>Volver</span>
                      </button>
                    </li>
                    <li class="page-item" v-for="page in pagesNumber" :key="page" :class="page == pagination.current_page ? 'active' : '' &&  unidades.length ? 'active' : '' ">
                        <button :disabled="unidades.length === 0" class="page-link" href="#" @click.prevent="changePage(page)">
                            {{page}}
                        </button>
                    </li>
                    <li class="page-item" v-if="pagination.current_page < pagination.last_page">
                        <button :disabled="unidades.length === 0" class="page-link" href="#" @click.prevent="changePage(pagination.current_page + 1)">
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
import Pagination from '../../components/mantenedores/pagination.vue';
import ModalAddUnidad from '../../components/mantenedores/unidades/modal-add-unidad.vue';
import ModalEditUnidad from '../../components/mantenedores/unidades/modal-edit-unidad.vue';
export default {
  middleware: 'auth',
  components: { Pagination, ModalAddUnidad, ModalEditUnidad },
  data(){
    return{
      setTimeoutBuscador:'',
      searchInput:''
    };
  },
  mounted(){
    this.getUnidades();
  },
  computed:{
    ...mapGetters({
      unidades:'mantenedores/unidades'
    }),
    pagination: function () {
        return { ...this.$store.state.mantenedores.pagination };
    },
    pagesNumber: function () {
      if (!this.$store.state.mantenedores.pagination.to) {
          return [];
      }
      var from = this.$store.state.mantenedores.pagination.current_page - this.$store.state.mantenedores.offset;
      if (from < 1) {
          from = 1;
      }
      var to = from + (this.$store.state.mantenedores.offset * 2);
      if (to >= this.$store.state.mantenedores.pagination.last_page) {
          to = this.$store.state.mantenedores.pagination.last_page;
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
    ...mapMutations({
      pasingUnidad: 'mantenedores/PASSING_UNIDAD',
      currentPageAction: "mantenedores/SET_CURRENT_PAGE"
    }),
    ...mapActions({
      getUnidades:'mantenedores/getUnidades'
    }),
    editUnidad(unidad){
      this.pasingUnidad(unidad);
    },
    changePage(page) {
        this.currentPageAction(page);
         let object = { page: page };
        this.getUnidades(object);
    },
    searchUnidades(){
      if(this.searchInput.length > 1){
        let object = { search: this.searchInput };
        this.getUnidades(object);
      }else if (this.searchInput.length === 0){
        this.getUnidades();
      }
    },
    keySearchCentros() {
        clearTimeout(this.setTimeoutBuscador);
        this.setTimeoutBuscador = setTimeout(this.searchUnidades, 500);
    },
  }
}
</script>

<style>

</style>
