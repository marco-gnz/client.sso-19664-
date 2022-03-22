<template>
  <div>
    <div class="row">
      <div class="col-md-6">
        <h6>Lista de facturas</h6>
      </div>
      <div class="col-md-6">
        <button v-if="$auth.user.permissions_roles.includes('ingresar-factura') || $auth.user.permissions.includes('ingresar-factura')" v-b-modal.modal-add-factura class="btn btn-success float-right">Ingresar factura</button>
        <ModalAddFactura />
        <ModalEditFactura />
      </div>
    </div>
    <div class="row pt-lg-3">
      <div class="col-md-12">
        <template v-if="facturas.length">
          <table class="table table-xs pt-2">
            <thead>
                <tr>
                    <th>N° factura</th>
                    <th>Centro formador / Universidad</th>
                    <th>Situación</th>
                    <th>Año</th>
                    <th>Tipo</th>
                    <th>Total</th>
                    <th>&nbsp;</th>
                </tr>
            </thead>
            <tbody>
              <tr v-for="(factura, index) in facturas" :key="index" v-b-modal.modal-view-factura @click.prevent="showFactura(factura)">
                <td>{{factura.n_factura != null ? factura.n_factura : '--'}} / {{factura.fecha_emision_factura != null ? DateTime.fromISO(factura.fecha_emision_factura).toFormat('dd-LL-yyyy') : '--'}}</td>
                <td>{{factura.centro_formador != null ? factura.centro_formador.nombre : '--'}}</td>
                <td><strong :class="(factura.situacion_actual != null ? factura.situacion_actual.id == 3 : '') ? 'text-success' : 'text-secondary' ">{{factura.situacion_actual != null ? factura.situacion_actual.nombre : '--'}}</strong></td>
                <td>{{factura.anios_pago != null ? factura.anios_pago.map(a => a).join(' - ') : '--'}}</td>
                <td>{{`${factura.tipos.length ? `${factura.tipos.map(t => t.nombre).join(' - ')}` : `--`}`}}</td>
                <td>${{Intl.NumberFormat('de-DE').format(factura.monto_total)}}</td>
                <td @click.stop="">
                  <el-dropdown>
                      <span class="el-dropdown-link">
                          Acción<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <template v-if="$auth.user.permissions_roles.includes('estado-factura') || $auth.user.permissions.includes('estado-factura')">
                          <el-dropdown-item icon="el-icon-edit" v-b-modal.modal-edit-situacion @click.native="updateEstado(factura)">Modificar situación</el-dropdown-item>
                        </template>
                        <template>
                          <el-dropdown-item icon="el-icon-edit" @click.native="clickEditFactura(factura)" v-b-modal.modal-edit-factura>Editar</el-dropdown-item>
                        </template>
                        <template v-if="$auth.user.permissions_roles.includes('eliminar-factura') || $auth.user.permissions.includes('eliminar-factura')">
                          <el-popconfirm
                              @confirm="deleteFactura(factura.uuid)"
                              v-loading.fullscreen.lock="fullscreenLoading"
                              confirm-button-text='Si, eliminar'
                              cancel-button-text='No'
                              icon="el-icon-info"
                              icon-color="red"
                              title="¿Eliminar factura?"
                              >
                              <el-dropdown-item slot="reference" icon="el-icon-delete">Eliminar</el-dropdown-item>
                          </el-popconfirm>
                        </template>
                      </el-dropdown-menu>
                  </el-dropdown>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
        <template v-else>
          <el-alert
            title="No existen facturas..."
            type="warning"
            show-icon
            :closable="false"
            >
          </el-alert>
        </template>
      </div>
    </div>
    <ModaEditSituacion />
    <ShowFactura />
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
import ModalAddFactura from "./modals/modal-add-factura.vue";
import ModaEditSituacion from './modals/moda-edit-situacion.vue';
import ShowFactura from './modals/show-factura.vue';
import ModalEditFactura from './modals/modal-edit-factura.vue';
export default {
    components: { ModalAddFactura, ModaEditSituacion, ShowFactura, ModalEditFactura },
    data(){
      return{
        fullscreenLoading:false
      };
    },
    mounted(){
      this.getFacturas(this.$route.params.id);
    },
    computed:{
      ...mapGetters({
        facturas:'facturas/facturas'
      }),
    },
    methods:{
      ...mapMutations({
        deleteFacturaAction:'facturas/REMOVE_FACTURA',
        passingSituacionAction:'facturas/PASSING_FACTURA_EDIT',
        showFacturaAction:'facturas/SHOW_FACTURA'
      }),
      ...mapActions({
        getFacturas:'facturas/getFacturas'
      }),
      updateEstado(factura){
        this.passingSituacionAction(factura);
      },
      showFactura(factura){
        this.showFacturaAction(factura);
      },
      async deleteFactura(uuid){
        this.fullscreenLoading = !this.fullscreenLoading;
        const url = `/api/profesionales/profesional/documentos/factura/delete-factura/${uuid}`;

        await this.$axios.$delete(url).then(response => {
          this.fullscreenLoading = !this.fullscreenLoading;
          if(response === true){
            this.deleteFacturaAction(uuid);
            this.$message({
              message: 'Factura eliminada con éxito.',
              type: 'success'
            });
          }else{
            this.$message.error("Error. Error de servidor.");
          }
        }).catch(error => {
          this.fullscreenLoading = !this.fullscreenLoading;
          console.log(error);
        });
      },
      clickEditFactura(factura){
        this.passingSituacionAction(factura);
      }
    }
}
</script>

<style>

</style>
