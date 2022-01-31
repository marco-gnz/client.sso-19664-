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
                    <h6 class="m-0 font-weight-bold text-primary">Listado de etapas del profesional</h6>
                </div>
                <div class="col-md-6">
                    <button v-if="$auth.user.permissions_roles.includes('ingresar-dato-maestro') || $auth.user.permissions.includes('ingresar-dato-maestro')" v-b-modal.modal-add-etapa class="btn btn-success float-right">Ingresar etapa</button>
                    <ModalAddEtapa />
                    <ModalEditEtapa />
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
              <template v-if="etapas.length">
                <div class="col-md-12">
                  <!-- <el-tag size="mini" type="success">{{`${situacionesActual.length} ${situacionesActual.length > 1 ? `resultados` : `resultado`}`}}</el-tag> -->
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">Cod. SIRH</th>
                        <th scope="col">Sigla</th>
                        <th scope="col">Nombre</th>
                        <th>&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(etapa, index) in etapas" :key="index">
                        <td>{{ (etapa.cod_sirh != null) ? etapa.cod_sirh : '--' }}</td>
                        <td>{{etapa.sigla}}</td>
                        <td>{{etapa.nombre}}</td>
                        <td @click.stop="">
                          <el-dropdown>
                            <span class="el-dropdown-link">Acción<i class="el-icon-arrow-down el-icon--right"></i></span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item icon="el-icon-edit" @click.native="editEtapa(etapa)" v-b-modal.modal-edit-etapa>Editar</el-dropdown-item>
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
import ModalAddEtapa from '../../components/mantenedores/etapas/modal-add-etapa.vue';
import ModalEditEtapa from '../../components/mantenedores/etapas/modal-edit-etapa.vue';
export default {
    components: { Pagination, ModalAddEtapa, ModalEditEtapa },
    middleware: 'auth',
    head(){
      return{
        title: `Etapas profesional`
      };
    },
    data(){
      return{
        fullscreenLoading:false
      };
    },
    mounted(){
      this.getEtapas();
    },
    computed:{
      ...mapGetters({
        etapas:'mantenedores/etapas'
      })
    },
    methods:{
      ...mapMutations({
        pasingEtapa: 'mantenedores/PASSING_ETAPA',
      }),
      ...mapActions({
        getEtapas:'mantenedores/getEtapas'
      }),
      editEtapa(etapa){
        this.pasingEtapa(etapa);
      },
    }
}
</script>

<style>

</style>
