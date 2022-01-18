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
                      <h6 class="m-0 font-weight-bold text-primary">Listado de situaciones actual del profesional</h6>
                  </div>
                  <div class="col-md-6">
                      <button v-if="$auth.user.permissions_roles.includes('ingresar-dato-maestro') || $auth.user.permissions.includes('ingresar-dato-maestro')" v-b-modal.modal-add-situacion class="btn btn-success float-right">Ingresar situación</button>
                      <ModalAddSituacion />
                      <ModalEditSituacion />
                  </div>
              </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-12">
                    <b-input-group>
                        <!-- <b-form-input placeholder="Busque por nombre o código SIRH"></b-form-input> -->
                    </b-input-group>
                  </div>
                </div>
              </div>
            </div>
            <div class="row pt-lg-5">
              <template v-if="situacionesActual.length">
                <div class="col-md-12">
                  <el-tag size="mini" type="success">{{`${situacionesActual.length} ${situacionesActual.length > 1 ? `resultados` : `resultado`}`}}</el-tag>
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">Cod. SIRH</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Estado</th>
                        <th>&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(situacion, index) in situacionesActual" :key="index">
                        <td>{{ (situacion.cod_sirh != null) ? situacion.cod_sirh : '--' }}</td>
                        <td>{{situacion.nombre}}</td>
                        <td>
                          <el-tooltip :content="`Estado: ${situacion.estado == 1 ? `Habilitado` : `Deshabilitado`}`" placement="top">
                            <el-switch :active-value="situacion.estado === 0" :inactive-value="situacion.estado === 1" @change="editStatus(situacion.id)" v-loading.fullscreen.lock="fullscreenLoading"></el-switch>
                          </el-tooltip>
                        </td>
                        <td @click.stop="">
                          <el-dropdown>
                            <span class="el-dropdown-link">Acción<i class="el-icon-arrow-down el-icon--right"></i></span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item icon="el-icon-edit" @click.native="editSituacion(situacion)" v-b-modal.modal-edit-situacion>Editar</el-dropdown-item>
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
import Pagination from '../../components/mantenedores/pagination.vue';
import ModalAddSituacion from '../../components/mantenedores/situaciones/modal-add-situacion.vue';
import ModalEditSituacion from '../../components/mantenedores/situaciones/modal-edit-situacion.vue';

export default {
  middleware: 'auth',
  components: { Pagination, ModalAddSituacion, ModalEditSituacion },
  data(){
    return{
      fullscreenLoading:false
    };
  },
  mounted(){
    this.getSituacionesActual();
  },
  computed:{
    ...mapGetters({
      situacionesActual:'mantenedores/situacionesActual'
    })
  },
  methods:{
    ...mapMutations({
      pasingSituacion: 'mantenedores/PASSING_SITUACION',
      changeStatusAction: "mantenedores/UPDATE_SITUACION",
    }),
    ...mapActions({
      getSituacionesActual:'mantenedores/getSituacionesActual'
    }),
    editSituacion(situacion){
      this.pasingSituacion(situacion);
    },
    async editStatus(id){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/admin/mantenedores/situacion/estado-situacion/${id}`;

      await this.$axios.$put(url).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.changeStatusAction(response[1]);
          this.$notify.success({
              message: `Situacion actual ${response[1].estado != false ? `habilitada` : `deshabilitada`}.`,
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
