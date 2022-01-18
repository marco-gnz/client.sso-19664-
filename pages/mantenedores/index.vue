<template>
  <div class="container-fluid mt-5">
    <div class="row">
      <div class="col-md-12">
        <Pagination />
        <!-- <div class="card shadow">
          <div class="card-header py-3">
              <div class="row">
                  <div class="col-md-6">
                      <h6 class="m-0 font-weight-bold text-primary">Listado de mantenedores (datos maestro)</h6>
                  </div>
                  <div class="col-md-6">
                      <button v-if="$auth.user.permissions_roles.includes('ingresar-dato-maestro') || $auth.user.permissions.includes('ingresar-dato-maestro')" v-b-modal.modal-add-mantenedor class="btn btn-success float-right">Ingresar maestro</button>
                      <ModalAddMaestro />
                  </div>
              </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-4">
                      <select class="form-control" v-model="search.tipo">
                        <option value="" selected disabled>-- Seleccione tipo --</option>
                        <option v-for="(mantenedor, index) in mantenedores" :key="index" :value="mantenedor.id">{{mantenedor.nombre}}</option>
                      </select>
                  </div>
                  <div class="col-md-8">
                    <b-input-group>
                        <template #append>
                            <b-button size="sm" text="Button" variant="success">Buscar</b-button>
                        </template>
                        <b-form-input :disabled="!search.tipo" v-model="search.input" placeholder="Busque por nombre o código SIRH"></b-form-input>
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
                      <th scope="col">Tipo</th>
                      <th scope="col">Cod. SIRH</th>
                      <th scope="col">Descripción</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Unidad</td>
                      <td>526</td>
                      <td>URGENCIA ADULTOS</td>
                    </tr>
                    <tr>
                      <td>Red hospitalaria</td>
                      <td>200</td>
                      <td>SERVICIO DE SALUD OSORNO</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
import ModalAddMaestro from "../../components/mantenedores/modal-add-maestro.vue";
import Pagination from '../../components/mantenedores/pagination.vue';
export default {
    middleware: 'auth',
    components: { ModalAddMaestro, Pagination },
    data(){
      return{
        search:{
          tipo:'',
          input:''
        }
      };
    },
    computed:{
      ...mapGetters({
        mantenedores:'mantenedores/mantenedoresLista'
      })
    },
    methods:{

    }
}
</script>

<style>

</style>
