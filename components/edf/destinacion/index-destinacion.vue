<template>
  <div class="row">
    <p><i class="el-icon-circle-plus text-success"></i> <b>Sección destinaciones</b></p>
    <div class="col-md-12">
      <table class="table table-xs">
      <thead>
          <tr>
              <th>#</th>
              <th>Establecimiento</th>
              <th>° Complejidad</th>
              <th>Periodo</th>
              <th>&nbsp;</th>
          </tr>
      </thead>
      <tbody>
        <tr v-for="(destinacion, index) in destinaciones" :key="index">
          <td>{{destinacion.uuid.substring(0, 5)}}</td>
          <td>{{destinacion.establecimiento.sigla}} - {{destinacion.unidad.nombre}}</td>
          <td><strong>{{ (destinacion.grado_complejidad_establecimiento) ? destinacion.grado_complejidad_establecimiento.grado : '---' }}</strong></td>
          <td>{{DateTime.fromISO(destinacion.inicio_periodo).toFormat('dd LLL yyyy')}} a {{DateTime.fromISO(destinacion.termino_periodo).toFormat('dd LLL yyyy')}}</td>
          <td @click.stop="">
            <el-dropdown>
                <span class="el-dropdown-link">
                    Acción<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <template v-if="$auth.user.permissions_roles.includes('editar-etapa-destinacion') || $auth.user.permissions.includes('editar-etapa-destinacion')">
                    <el-dropdown-item icon="el-icon-edit">Editar</el-dropdown-item>
                  </template>
                  <template v-if="$auth.user.permissions_roles.includes('eliminar-etapa-destinacion') || $auth.user.permissions.includes('eliminar-etapa-destinacion')">
                    <el-dropdown-item icon="el-icon-delete" @click.native="deleteDestinacion(destinacion, index)" v-loading.fullscreen.lock="fullscreenLoading">Eliminar</el-dropdown-item>
                  </template>
                </el-dropdown-menu>
            </el-dropdown>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
    <div class="row ml-2 pt-lg-3">
      <div class="col-md-12">
        <span class="font-weight-bold text-success"><strong>TOTAL DESTINACIÓN</strong>: {{ `${totalDestinacion != null || totalDestinacion != undefined ? `${totalDestinacion.years > 1 ? `${totalDestinacion.years} años` : `${totalDestinacion.years} año`}, ${totalDestinacion.months > 1 ? `${totalDestinacion.months} meses` : `${totalDestinacion.months} mes`} y ${Math.round(totalDestinacion.days) > 1 ? `${Math.round(totalDestinacion.days)} días` : `${Math.round(totalDestinacion.days)} día`}` : '--' }` }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex';
export default {
props:['destinaciones'],
data(){
  return{
    fullscreenLoading:false
  };
},
computed:{
  totalDestinacion(){
      let años    = 0;
      let meses   = 0;
      let dias    = 0;

      if(this.destinaciones.length){
          this.destinaciones.forEach(destinacion => {
          let fecha_inicio    = this.DateTime.fromISO(destinacion.inicio_periodo);
          let fecha_termino   = this.DateTime.fromISO(destinacion.termino_periodo);
          let diferencia      = fecha_termino.diff(fecha_inicio, ['days', 'months', 'years']);

          años    += diferencia.values.years;
          meses   += diferencia.values.months;
          dias    += diferencia.values.days;
      });

      let total_destinacion = this.Duration.fromObject({ years: años, months: meses,  days: dias}).normalize().toObject();

      return total_destinacion;
      }
  },
},
methods:{
  ...mapMutations({
    deleteAction:'edf/REMOVE_DESTINACION'
  }),
  deleteDestinacion(destinacion){
    this.$confirm(`¿Eliminar destinación #${destinacion.uuid.substring(0,5)}?`, "Alerta", {
        confirmButtonText: "Si, eliminar",
        cancelButtonText: "Cancelar",
        type: "warning",
        center: true,
        lockScroll: true
    }).then(() => {
        this.delete(destinacion);
    });
  },
  async delete(destinacion){
    const url = `/api/profesionales/profesional/edf/delete-destinacion/${destinacion.uuid}`;

    await this.$axios.$delete(url).then(response => {
      if(response === true){
        this.deleteAction(destinacion.uuid);
        this.$message({
            message: "Destinación eliminada con éxito.",
            type: "success"
        });
      }else{
        this.$message.error("No se eliminó. Error de servidor");
      }
    }).catch(error => {
      console.log(error);
    });
  }
}

}
</script>

<style>

</style>
