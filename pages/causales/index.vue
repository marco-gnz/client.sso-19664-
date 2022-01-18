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
                      <h6 class="m-0 font-weight-bold text-primary">Listado causales de interrupción</h6>
                  </div>
                  <div class="col-md-6">
                      <button v-if="$auth.user.permissions_roles.includes('ingresar-dato-maestro') || $auth.user.permissions.includes('ingresar-dato-maestro')" v-b-modal.modal-add-causal class="btn btn-success float-right">Ingresar causal</button>
                      <ModalAddCausal />
                      <ModalEditCausal />
                  </div>
              </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-12">
                    <b-input-group>
                        <b-form-input @keyup="keySearchCausal" v-model="searchInput" placeholder="Busque por nombre o código SIRH"></b-form-input>
                    </b-input-group>
                  </div>
                </div>
              </div>
            </div>
            <div class="row pt-lg-5">
              <template v-if="causales.length">
                <div class="col-md-12">
                  <el-tag size="mini" type="success">{{`${pagination.total} ${pagination.total > 1 ? `resultados` : `resultado`}`}}</el-tag>
                  <table class="table pt-lg-2">
                    <thead>
                      <tr>
                        <th scope="col">Cod. SIRH</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Estado</th>
                        <th>&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(causal, index) in causales" :key="index">
                        <td>{{ (causal.cod_sirh != null) ? causal.cod_sirh : '--' }}</td>
                        <td>{{causal.nombre}}</td>
                        <td>
                          <el-tooltip :content="`Estado: ${causal.estado == 1 ? `Habilitado` : `Deshabilitado`}`" placement="top">
                            <el-switch :active-value="causal.estado === 0" :inactive-value="causal.estado === 1" @change="editStatus(causal.id)" v-loading.fullscreen.lock="fullscreenLoading"></el-switch>
                          </el-tooltip>
                        </td>
                        <td @click.stop="">
                          <el-dropdown>
                            <span class="el-dropdown-link">Acción<i class="el-icon-arrow-down el-icon--right"></i></span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item icon="el-icon-edit" @click.native="editCausal(causal)" v-b-modal.modal-edit-causal>Editar</el-dropdown-item>
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
                      <button :disabled="causales.length === 0" class="page-link" href="#" @click.prevent="changePage(pagination.current_page - 1)">
                          <span>Volver</span>
                      </button>
                    </li>
                    <li class="page-item" v-for="page in pagesNumber" :key="page" :class="page == pagination.current_page ? 'active' : '' &&  causales.length ? 'active' : '' ">
                        <button :disabled="causales.length === 0" class="page-link" href="#" @click.prevent="changePage(page)">
                            {{page}}
                        </button>
                    </li>
                    <li class="page-item" v-if="pagination.current_page < pagination.last_page">
                        <button :disabled="causales.length === 0" class="page-link" href="#" @click.prevent="changePage(pagination.current_page + 1)">
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
import ModalAddCausal from '../../components/mantenedores/causales/modal-add-causal.vue';
import ModalEditCausal from '../../components/mantenedores/causales/modal-edit-causal.vue';
export default {
  middleware: 'auth',
  components: { Pagination, ModalAddCausal, ModalEditCausal },
  data(){
    return{
      fullscreenLoading:false,
      searchInput:''
    };
  },
  mounted(){
    this.getCausales();
  },
  computed:{
    ...mapGetters({
      causales:'mantenedores/causales'
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
      changeStatusAction: "mantenedores/UPDATE_CAUSAL",
      pasingCausal: 'mantenedores/PASSING_CAUSAL',
      currentPageAction: "mantenedores/SET_CURRENT_PAGE"
    }),
    ...mapActions({
      getCausales:'mantenedores/getCausalesAdmin'
    }),
    changePage(page) {
        this.currentPageAction(page);
         let object = { page: page };
        this.getCausales(object);
    },
    editCausal(causal){
      this.pasingCausal(causal);
    },
    searchCausales(){
      if(this.searchInput.length > 1){
        let object = { search: this.searchInput };
        this.getCausales(object);
      }else if (this.searchInput.length === 0){
        this.getCausales();
      }
    },
    keySearchCausal(){
      clearTimeout(this.setTimeoutBuscador);
      this.setTimeoutBuscador = setTimeout(this.searchCausales, 500);
    },
    async editStatus(id){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/admin/mantenedores/causal/estado-causal/${id}`;

      await this.$axios.$put(url).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.changeStatusAction(response[1]);
          this.$notify.success({
              message: `Causal ${response[1].estado != false ? `habilitada` : `deshabilitada`}.`,
              showClose: true
          });
        }else {
          this.$message.error("Error de servidor");
        }
      }).catch(error => {
        this.fullscreenLoading = !this.fullscreenLoading;
        console.log(error);
      });
    }
  }
}
</script>

<style>

</style>
