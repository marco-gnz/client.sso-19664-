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
                      <h6 class="m-0 font-weight-bold text-primary">Listado especialidades y subespecialidades</h6>
                  </div>
                  <div class="col-md-6">
                      <button v-if="$auth.user.permissions_roles.includes('ingresar-dato-maestro') || $auth.user.permissions.includes('ingresar-dato-maestro')" v-b-modal.modal-add-perfeccionamiento class="btn btn-success float-right">Ingresar perfeccionamiento</button>
                      <ModalAddPerfeccionamiento />
                      <ModalEditPerfeccionamiento />
                  </div>
              </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-4">
                    <select class="form-control" v-model="perfeccionamiento.tipo" @change="searchPerfeccionamiento">
                      <option value="" selected>-- Seleccione tipo --</option>
                      <option v-for="(tipo, index) in tipo" :key="index" :value="tipo.id">{{tipo.nombre}}</option>
                    </select>
                  </div>
                  <div class="col-md-8">
                    <b-input-group>
                        <b-form-input v-model="perfeccionamiento.input" @keyup="keySearchPerfeccionamientos" placeholder="Busque por nombre o código SIRH"></b-form-input>
                    </b-input-group>
                  </div>
                </div>
              </div>
            </div>
            <div class="row pt-lg-5">
              <template v-if="perfeccionamientos.length">
                <div class="col-md-12">
                  <el-tag size="mini" type="success">{{`${pagination.total} ${pagination.total > 1 ? `resultados` : `resultado`}`}}</el-tag>
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">Cod. SIRH</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Tipo</th>
                        <th>&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(perfeccionamiento, index) in perfeccionamientos" :key="index">
                        <td>{{ (perfeccionamiento.cod_sirh != null) ? perfeccionamiento.cod_sirh : '--' }}</td>
                        <td>{{perfeccionamiento.nombre}}</td>
                        <td>{{ (perfeccionamiento.tipo != null) ? perfeccionamiento.tipo.nombre : '--' }}</td>
                        <td @click.stop="">
                          <el-dropdown>
                            <span class="el-dropdown-link">Acción<i class="el-icon-arrow-down el-icon--right"></i></span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item icon="el-icon-edit" @click.native="editPerfeccionamiento(perfeccionamiento)" v-b-modal.modal-edit-perfeccionamiento>Editar</el-dropdown-item>
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
                      <button :disabled="perfeccionamientos.length === 0" class="page-link" href="#" @click.prevent="changePage(pagination.current_page - 1)">
                          <span>Volver</span>
                      </button>
                    </li>
                    <li class="page-item" v-for="page in pagesNumber" :key="page" :class="page == pagination.current_page ? 'active' : '' &&  perfeccionamientos.length ? 'active' : '' ">
                        <button :disabled="perfeccionamientos.length === 0" class="page-link" href="#" @click.prevent="changePage(page)">
                            {{page}}
                        </button>
                    </li>
                    <li class="page-item" v-if="pagination.current_page < pagination.last_page">
                        <button :disabled="perfeccionamientos.length === 0" class="page-link" href="#" @click.prevent="changePage(pagination.current_page + 1)">
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
import ModalAddPerfeccionamiento from '../../components/mantenedores/perfeccionamientos/modal-add-perfeccionamiento.vue';
import ModalEditPerfeccionamiento from '../../components/mantenedores/perfeccionamientos/modal-edit-perfeccionamiento.vue';
export default {
  middleware: 'auth',
  components: { Pagination, ModalAddPerfeccionamiento, ModalEditPerfeccionamiento },
  head(){
    return{
      title: `Perfeccionamientos`
    };
  },
  data(){
    return{
      perfeccionamiento:{
        tipo:'',
        input:''
      },
      setTimeoutBuscador:''
    };
  },
  mounted(){
    this.getTipoPerfeccionamientos();
    this.getPerfeccionamientosAll();
  },
  computed:{
    ...mapGetters({
      tipo:'mantenedores/tipoPerfeccionamientos',
      perfeccionamientos:'mantenedores/perfeccionamientos'
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
      currentPageAction: "mantenedores/SET_CURRENT_PAGE",
      pasingPerfeccionamiento: 'mantenedores/PASSING_PERFECCIONAMIENTO',
    }),
    ...mapActions({
      getTipoPerfeccionamientos:'mantenedores/getTipoPerfeccionamientos',
      getPerfeccionamientosAll:'mantenedores/getPerfeccionamientosAll'
    }),
    editPerfeccionamiento(perfeccionamiento){
      this.pasingPerfeccionamiento(perfeccionamiento);
    },
    changePage(page) {
        this.currentPageAction(page);
         let object = { page: page };
        this.getPerfeccionamientosAll(object);
    },
    searchPerfeccionamiento(){
      console.log(this.perfeccionamiento.tipo);
      if(this.perfeccionamiento.tipo != '' || this.perfeccionamiento.input.length > 1){
        let object = { search: this.perfeccionamiento };
        this.getPerfeccionamientosAll(object);
      }else if (this.perfeccionamiento.input.length === 0){
        this.getPerfeccionamientosAll();
      }
    },
    keySearchPerfeccionamientos(){
       clearTimeout(this.setTimeoutBuscador);
      this.setTimeoutBuscador = setTimeout(this.searchPerfeccionamiento, 500);
    }
  }
}
</script>

<style>

</style>
