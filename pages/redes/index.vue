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
                      <h6 class="m-0 font-weight-bold text-primary">Listado de redes hospitalarias</h6>
                  </div>
                  <div class="col-md-6">
                      <button v-if="$auth.user.permissions_roles.includes('ingresar-dato-maestro') || $auth.user.permissions.includes('ingresar-dato-maestro')" v-b-modal.modal-add-red class="btn btn-success float-right">Ingresar red</button>
                      <ModalAddRed />
                      <ModalEditRed />
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
                <el-tag size="mini" type="success">{{`${redes.length} ${redes.length > 1 ? `resultados` : `resultado`}`}}</el-tag>
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">Cod. SIRH</th>
                      <th scope="col">Siglas</th>
                      <th scope="col">Nombre</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(red, index) in redes" :key="index">
                      <td>{{ (red.cod_sirh != null) ? red.cod_sirh : '--' }}</td>
                      <td>{{red.sigla}}</td>
                      <td>{{red.nombre}}</td>
                      <td @click.stop="">
                        <el-dropdown>
                          <span class="el-dropdown-link">Acción<i class="el-icon-arrow-down el-icon--right"></i></span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item icon="el-icon-edit" @click.native="editRed(red)" v-b-modal.modal-edit-red>Editar</el-dropdown-item>
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
import ModalAddRed from '../../components/mantenedores/red/modal-add-red.vue';
import ModalEditRed from '../../components/mantenedores/red/modal-edit-red.vue';
export default {
  middleware: 'auth',
  components: { Pagination, ModalAddRed, ModalEditRed },
  head(){
    return{
      title: `Redes hospitalarias`
    };
  },
  data(){
    return{

    };
  },
  mounted(){
    this.getRedesHospitalarias();
  },
  computed:{
    ...mapGetters({
      redes:'mantenedores/redesHospitalarias'
    })
  },
  methods:{
    ...mapMutations({
      pasingRed: 'mantenedores/PASSING_RED',
    }),
    ...mapActions({
      getRedesHospitalarias:'mantenedores/getRedesHospitalarias'
    }),
    editRed(red){
      this.pasingRed(red);
    }
  }
}
</script>

<style>

</style>
