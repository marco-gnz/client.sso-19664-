<template>
  <div class="row">
    <p><i class="el-icon-circle-plus text-primary"></i> <b>Sección formaciones</b></p>
    <div class="col-md-12">
      <table class="table table-xs">
        <thead>
            <tr>
                <th>#</th>
                <th>Universidad</th>
                <th>Formación</th>
                <th>Periodo</th>
                <th>&nbsp;</th>
            </tr>
        </thead>
        <tbody>
          <tr v-for="(formacion, index) in formaciones" :key="index">
            <td>{{formacion.uuid.substring(0,5)}}</td>
            <td>{{formacion.centro_formador.nombre}}</td>
            <td>{{formacion.perfeccionamiento.nombre}} <i>({{formacion.perfeccionamiento.tipo.nombre}})</i></td>
            <td>{{DateTime.fromISO(formacion.inicio_formacion).toFormat('dd-LL-yyyy')}} / {{DateTime.fromISO(formacion.termino_formacion).toFormat('dd-LL-yyyy')}}</td>
            <td @click.stop="">
              <el-dropdown>
                  <span class="el-dropdown-link">
                      Acción<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <template v-if="$auth.user.permissions_roles.includes('editar-etapa-formacion') || $auth.user.permissions.includes('editar-etapa-formacion')">
                      <el-dropdown-item icon="el-icon-edit">Editar</el-dropdown-item>
                    </template>
                    <template v-if="$auth.user.permissions_roles.includes('eliminar-etapa-formacion') || $auth.user.permissions.includes('eliminar-etapa-formacion')">
                      <el-dropdown-item icon="el-icon-delete" @click.native="deleteFormacion(formacion, index)" v-loading.fullscreen.lock="fullscreenLoading">Eliminar</el-dropdown-item>
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
        <span class="font-weight-bold text-primary"><strong>TOTAL FORMACIÓN</strong>: {{ `${totalFormacion != null || totalFormacion != undefined ? `${totalFormacion.years > 1 ? `${totalFormacion.years} años` : `${totalFormacion.years} año`}, ${totalFormacion.months > 1 ? `${totalFormacion.months} meses` : `${totalFormacion.months} mes`} y ${Math.round(totalFormacion.days) > 1 ? `${Math.round(totalFormacion.days)} días` : `${Math.round(totalFormacion.days)} día`}` : '--' }` }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex';
export default {
  props:['formaciones'],
  data(){
    return{
      fullscreenLoading:false
    };
  },
  computed:{
    totalFormacion(){
      let años    = 0;
      let meses   = 0;
      let dias    = 0;

      if(this.formaciones.length){
          this.formaciones.forEach(formacion => {
          let fecha_inicio    = this.DateTime.fromISO(formacion.inicio_formacion);
          let fecha_termino   = this.DateTime.fromISO(formacion.termino_formacion);
          let diferencia      = fecha_termino.diff(fecha_inicio, ['days', 'months', 'years']);

          años    += diferencia.values.years;
          meses   += diferencia.values.months;
          dias    += diferencia.values.days;
      });

      let total_formacion = this.Duration.fromObject({ years: años, months: meses,  days: dias}).normalize().toObject();

      return total_formacion;
      }
  }
  },
  methods:{
    ...mapMutations({
      deleteAction:'edf/REMOVE_FORMACION'
    }),
    deleteFormacion(formacion){
      this.$confirm(`¿Eliminar formacion #${formacion.uuid.substring(0,5)}?`, "Alerta", {
        confirmButtonText: "Si, eliminar",
        cancelButtonText: "Cancelar",
        type: "warning",
        center: true,
        lockScroll: true
      }).then(() => {
          this.delete(formacion);
      });
    },
    async delete(formacion){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/profesionales/profesional/edf/delete-formacion/${formacion.uuid}`;

      await this.$axios.$delete(url).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response === true){
          this.deleteAction(formacion.uuid);
          this.$message({
              message: "Formación eliminada con éxito.",
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
