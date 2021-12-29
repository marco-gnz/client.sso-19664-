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
                        <b-button variant="primary" to="/ingresar/profesional" class="btn btn-primary btn-sm float-right">Ingresar profesional</b-button>
                    </div>
                </div>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-12">
                  <div class="row">
                    <div class="col-md-12">
                        <b-input-group>
                            <template #append>
                                <b-button @click="toggleBusy" size="sm" text="Button" variant="success">Buscar</b-button>
                            </template>
                            <b-form-input @keyup.enter="toggleBusy" placeholder="Busque por Rut, Nombres, Apellidos, Establecimiento, etc..."></b-form-input>
                        </b-input-group>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row pt-lg-5">
                <div class="col-md-12">
                  <table class="table">
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
                            <td>{{profesional.nombres}} {{profesional.apellidos}}</td>
                            <td>{{profesional.etapa.nombre}}</td>
                            <td>
                              <el-tooltip :content="`Estado: ${profesional.estado == 1 ? `Habilitado` : `Deshabilitado`}`" placement="top">
                                <el-switch :active-value="profesional.estado === 0" :inactive-value="profesional.estado === 1" @change="editStatus(profesional.uuid, index, profesional.estado)" v-loading.fullscreen.lock="fullscreenLoading"></el-switch>
                              </el-tooltip>
                            </td>
                            <td @click.stop="" class="no">
                                <el-dropdown>
                                  <span class="el-dropdown-link">Acción<i class="el-icon-arrow-down el-icon--right"></i></span>
                                  <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item icon="el-icon-edit"><nuxt-link  :to="'/profesionales/'+profesional.uuid">Ver mas</nuxt-link></el-dropdown-item>
                                    <!-- <el-dropdown-item icon="el-icon-delete">Eliminar</el-dropdown-item> -->
                                  </el-dropdown-menu>
                                </el-dropdown>
                            </td>
                        </tr>
                    </tbody>
                  </table>
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
  middleware: 'auth',
  head(){
      return{
        title: 'Profesionales'
      };
    },
  data(){
    return{
      filterDialog:false,
      isBusy: false,
      value:1,
      fullscreenLoading:false
    };
  },
  mounted(){
    this.getProfesionales();
  },
  computed:{
    ...mapGetters({
      profesionales: 'profesionales/profesionales'
    }),
  },
  methods:{
    toggleBusy() {
      this.isBusy = !this.isBusy
    },
    ...mapActions({
      getProfesionales: 'profesionales/getProfesionales'
    }),
    ...mapMutations({
      changeStatusAction:'profesionales/UPDATE_STATUS_PROFESIONAL',
      estadoChange:'profesionales/CHAGE_ESTADO'
    }),
    async editStatus(uuid, index, estado){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/profesionales/profesional/change-status/${uuid}`;
      const data = {
        estado: !estado
      };

      try {
        await this.$axios.$put(url, data).then(response => {
          this.fullscreenLoading = !this.fullscreenLoading;
          if(response[0] === true){
            this.changeStatusAction({response:response[1], index:index});
            /* this.changeStatusAction(response[1]); */

            /* this.estadoChange({index:index, newValue:estado}); */
            this.$notify.success({
              message: `Profesional ${response[1].estado != false ? `habilitado`:`deshabilitado`}.`,
              showClose: true
            });
          }else{
            this.$message.error("Error de servidor");
          }
      }).catch(error => {
        this.fullscreenLoading = !this.fullscreenLoading;
        console.log(error);
      });
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style>
.no:hover{
    background-color: #fff;
    cursor: default;
}
</style>
