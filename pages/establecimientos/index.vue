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
                      <h6 class="m-0 font-weight-bold text-primary">Listado de establecimientos</h6>
                  </div>
                  <div class="col-md-6">
                      <button v-if="$auth.user.permissions_roles.includes('ingresar-dato-maestro') || $auth.user.permissions.includes('ingresar-dato-maestro')" v-b-modal.modal-add-establecimiento class="btn btn-success float-right">Ingresar establecimiento</button>
                      <ModalAddEstablecimiento />
                      <ModalEditEstablecimiento />
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
              <div class="col-md-12">
                <el-tag size="mini" type="success">{{`${establecimientos.length} ${establecimientos.length > 1 ? `resultados` : `resultado`}`}}</el-tag>
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">Cod. SIRH</th>
                      <th scope="col">Siglas</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">° complejidad</th>
                      <th scope="col">Red hospitalaria</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(establecimiento, index) in establecimientos" :key="index">
                      <td>{{ (establecimiento.cod_sirh != null) ? establecimiento.cod_sirh : '--' }}</td>
                      <td>{{establecimiento.sigla}}</td>
                      <td>{{establecimiento.nombre}}</td>
                      <td>{{ (establecimiento.grado_complejidad != null) ? establecimiento.grado_complejidad.grado : '--' }}</td>
                      <td>{{ (establecimiento.red_hospitalaria != null) ? establecimiento.red_hospitalaria.sigla : '--' }}</td>
                      <td @click.stop="">
                          <el-dropdown>
                            <span class="el-dropdown-link">Acción<i class="el-icon-arrow-down el-icon--right"></i></span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item icon="el-icon-edit" @click.native="editEstablecimiento(establecimiento)" v-b-modal.modal-edit-establecimiento>Editar</el-dropdown-item>
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
import Pagination from '../../components/mantenedores/pagination.vue';
import ModalAddEstablecimiento from '../../components/mantenedores/establecimientos/modal-add-establecimiento.vue';
import ModalEditEstablecimiento from '../../components/mantenedores/establecimientos/modal-edit-establecimiento.vue';
export default {
  middleware: 'auth',
  components: { Pagination, ModalAddEstablecimiento, ModalEditEstablecimiento },
  data(){
    return{

    };
  },
  mounted(){
    this.getRedesHospitalarias();
    this.getEstablecimientos();
    this.getGradoComplejidad();
  },
  computed:{
    ...mapGetters({
      establecimientos:'establecimientos/establecimientos'
    })
  },
  methods:{
    ...mapMutations({
      pasingEstablecimiento: 'establecimientos/PASSING_ESTABLECIMIENTO',
    }),
    ...mapActions({
      getEstablecimientos:'establecimientos/getEstablecimientos',
      getRedesHospitalarias:'mantenedores/getRedesHospitalarias',
      getGradoComplejidad:'mantenedores/getGradoComplejidad'
    }),
    editEstablecimiento(establecimiento){
      this.pasingEstablecimiento(establecimiento);
    }
  }
}
</script>

<style>

</style>
