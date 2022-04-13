<template>
  <div>
    <p><i class="el-icon-remove text-danger"></i> <b>Sección interrupciones</b></p>
    <template v-if="interrupciones.length">
      <table class="table table-xs">
        <thead>
            <tr>
                <th>Periodo interrupción</th>
                <th>Causal</th>
                <th>Observación</th>
                <th>&nbsp;</th>
            </tr>
        </thead>
        <tbody>

            <tr v-for="(interrupcion, index) in interrupciones" :key="index" class="click" @click.prevent="show(interrupcion)" v-b-modal.modal-view-interrupcion>
                <el-tooltip :content="`Interrupción pertenece a devolución con código #${interrupcion.devolucion.uuid.substring(0, 5)}`" placement="bottom">
                  <td :style="{backgroundColor:interrupcion.devolucion.color}">{{DateTime.fromISO(interrupcion.inicio_interrupcion).toFormat('dd-LL-yyyy')}} a {{DateTime.fromISO(interrupcion.termino_interrupcion).toFormat('dd-LL-yyyy')}}</td>
                </el-tooltip>
                <td :style="{backgroundColor:interrupcion.devolucion.color}">{{interrupcion.causal.nombre}}</td>
                <td :style="{backgroundColor:interrupcion.devolucion.color}">{{ (interrupcion.observacion != null) ? `${interrupcion.observacion.substring(0, 14)}...` : `--` }}</td>
              <td @click.stop="">
                  <el-dropdown>
                      <span class="el-dropdown-link">
                          Acción<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <template v-if="$auth.user.permissions_roles.includes('editar-interrupcion-pao') || $auth.user.permissions.includes('editar-interrupcion-pao')">
                          <el-dropdown-item icon="el-icon-edit" @click.native="clickEditInterrupcion(interrupcion, index)">Editar</el-dropdown-item>
                        </template>
                        <template v-if="$auth.user.permissions_roles.includes('eliminar-interrupcion-pao') || $auth.user.permissions.includes('eliminar-interrupcion-pao')">
                          <el-popconfirm
                              @confirm="deleteInterrupcion(interrupcion, index)"
                              confirm-button-text='Si, eliminar'
                              cancel-button-text='No'
                              icon="el-icon-info"
                              icon-color="red"
                              title="¿Eliminar interrupción?"
                              >
                            <el-dropdown-item slot="reference" icon="el-icon-delete" v-loading.fullscreen.lock="fullscreenLoading" >Eliminar</el-dropdown-item>
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
          title="No existen interrupciones..."
          type="warning"
          show-icon
          :closable="false"
          >
        </el-alert>
    </template>
  </div>
</template>

<script>
import {mapMutations} from 'vuex';
export default {
  props:['interrupciones'],
  data(){
    return{
      fullscreenLoading:false,
    };
  },
  methods:{
    ...mapMutations({
      removeInterrupcionAction:'calculoPao/REMOVE_INTERRUPCION_PAO',
      passingInterrupcionModal: 'calculoPao/QUERY_INTERRUPCION',
      passingShowInterrupcion:'calculoPao/SHOW_INTERRUPCION'
    }),
    clickEditInterrupcion(interrupcion, index){
      interrupcion['index'] = index;
      this.passingInterrupcionModal(interrupcion);
    },
    show(interrupcion){
      let fecha_inicio      = this.DateTime.fromISO(interrupcion.inicio_interrupcion);
      let fecha_termino     = this.DateTime.fromISO(interrupcion.termino_interrupcion);
      let diferencia        = fecha_termino.diff(fecha_inicio, 'days');

      interrupcion['diferencia'] = this.Duration.fromObject({days: diferencia.values.days+1, months:0, years:0}, { conversionAccuracy: 'longterm' }).normalize().toObject();
      this.passingShowInterrupcion(interrupcion);
    },
    async deleteInterrupcion(interrupcion, index){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/profesionales/profesional/pao/remove-interrupcion/${interrupcion.uuid}`;

      interrupcion["index_interrupcion"] = index;

      await this.$axios.$delete(url).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response === true){
          this.removeInterrupcionAction(interrupcion);
          this.$message({
              message: "Interrupción eliminada con éxito.",
              type: "success"
          });
        }else{
          this.$message.error("No se eliminó. Error de servidor");
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
