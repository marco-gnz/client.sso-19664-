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
                    <h6 class="m-0 font-weight-bold text-primary">Listado de campos clínicos</h6>
                </div>
                <div class="col-md-6">
                    <button v-if="$auth.user.permissions_roles.includes('ingresar-dato-maestro') || $auth.user.permissions.includes('ingresar-dato-maestro')" v-b-modal.modal-add-campo-clinico class="btn btn-success float-right">Ingresar campo clínico</button>
                    <ModalAddCampoClinico />
                    <ModalEditCampoClinico />
                </div>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-12">
                    <b-input-group>
                        <!-- <b-form-input @keyup="keySearchCausal" v-model="searchInput" placeholder="Busque por nombre o código SIRH"></b-form-input> -->
                    </b-input-group>
                  </div>
                </div>
              </div>
            </div>
            <div class="row pt-lg-5">
              <template v-if="camposClinicos.length">
                <div class="col-md-12">
                  <el-tag size="mini" type="success">{{`${camposClinicos.length} ${camposClinicos.length > 1 ? `resultados` : `resultado`}`}}</el-tag>
                  <table class="table pt-lg-2">
                    <thead>
                      <tr>
                        <th scope="col">Cod. SIRH</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Estado</th>
                        <th>&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(campo, index) in camposClinicos" :key="index">
                        <td>{{campo.cod_sirh != null ? campo.cod_sirh : '--'}}</td>
                        <td>{{campo.nombre}}</td>
                        <td>
                          <el-tooltip :content="`Estado: ${campo.estado == 1 ? `Habilitado` : `Deshabilitado`}`" placement="top">
                            <el-switch :active-value="campo.estado === 0" :inactive-value="campo.estado === 1" @change="editStatus(campo.id)" v-loading.fullscreen.lock="fullscreenLoading"></el-switch>
                          </el-tooltip>
                        </td>
                        <td @click.stop="">
                          <el-dropdown>
                            <span class="el-dropdown-link">Acción<i class="el-icon-arrow-down el-icon--right"></i></span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item icon="el-icon-edit" @click.native="editCampoClinico(campo)" v-b-modal.modal-edit-campo-clinico>Editar</el-dropdown-item>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
import Pagination from "../../components/mantenedores/pagination.vue";
import ModalAddCampoClinico from "../../components/mantenedores/campo-clinico/modal-add-campo-clinico.vue";
import ModalEditCampoClinico from "../../components/mantenedores/campo-clinico/modal-edit-campo-clinico.vue";
export default {
    middleware: 'auth',
    components: { Pagination, ModalAddCampoClinico, ModalEditCampoClinico },
    head(){
      return{
        title: `Campos clínicos`
      };
    },
    data(){
      return{
        fullscreenLoading:false
      };
    },
    mounted(){
      this.getCampoClinico();
    },
    computed:{
      ...mapGetters({
        camposClinicos:'mantenedores/camposClinicos'
      }),
    },
    methods:{
      ...mapMutations({
        changeStatusAction: "mantenedores/UPDATE_CAMPO_CLINICO",
        pasingCampoClinico: 'mantenedores/PASSING_CAMPO_CLINICO',
      }),
      ...mapActions({
        getCampoClinico:'mantenedores/getCampoClinico'
      }),
      editCampoClinico(campoClinico){
        this.pasingCampoClinico(campoClinico);
      },
      async editStatus(id){
        this.fullscreenLoading = !this.fullscreenLoading;
        const url = `/api/admin/mantenedores/campo-clinico/estado-campo-clinico/${id}`;

        await this.$axios.$put(url).then(response => {
          this.fullscreenLoading = !this.fullscreenLoading;
          if(response[0] === true){
            this.changeStatusAction(response[1]);
            this.$notify.success({
                message: `Campo clínico ${response[1].estado != false ? `habilitado` : `deshabilitado`}.`,
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
