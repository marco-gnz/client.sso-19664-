<template>
    <div>
      <div class="row">
        <div class="col-md-6">
          <h6>Lista de formaciones</h6>
        </div>
        <div class="col-md-6">
          <button v-if="$auth.user.permissions_roles.includes('ingresar-formacion') || $auth.user.permissions.includes('ingresar-formacion')" v-b-modal.modal-add-especialidad class="btn btn-success float-right">Ingresar formación</button>
        </div>
      </div>
      <div class="row pt-lg-3">
        <EditFormacion />
        <ShowFormacion />
        <div class="col-md-12">
          <template v-if="formaciones.length">
              <table class="table table-xs pt-2">
                <thead>
                      <tr>
                          <th>Centro</th>
                          <th>Tipo</th>
                          <th>Perfeccionamiento</th>
                          <th>Periodo de formación</th>
                          <th>Motivo</th>
                          <th>Contar</th>
                          <th>&nbsp;</th>
                      </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(especialidad, index) in formaciones" :key="index" @click.prevent="show(especialidad)" v-b-modal.modal-show-especialidad class="click">
                      <td>{{especialidad.centro_formador.nombre}}</td>
                      <td>{{especialidad.perfeccionamiento.tipo.nombre}}</td>
                      <td>{{especialidad.perfeccionamiento.nombre}}</td>
                      <td>{{ (especialidad.inicio_formacion != null) ? DateTime.fromISO(especialidad.inicio_formacion).toFormat('dd-LL-yyyy') : '--' }} a {{ (especialidad.termino_formacion != null) ? DateTime.fromISO(especialidad.termino_formacion).toFormat('dd-LL-yyyy') : '--'}}</td>
                      <td>{{especialidad.origen}}</td>
                      <td>{{especialidad.contabilizar_periodo != false ? 'Si' : 'No'}}</td>
                      <td @click.stop="">
                          <el-dropdown>
                              <span class="el-dropdown-link">
                                  Acción<i class="el-icon-arrow-down el-icon--right"></i>
                              </span>
                              <el-dropdown-menu slot="dropdown">
                                <template v-if="$auth.user.permissions_roles.includes('editar-formacion') || $auth.user.permissions.includes('editar-formacion')">
                                  <el-dropdown-item icon="el-icon-edit" @click.native="clickEditFormacion(especialidad)" v-b-modal.modal-edit-formacion>Editar</el-dropdown-item>
                                </template>
                                <template v-if="$auth.user.permissions_roles.includes('eliminar-formacion') || $auth.user.permissions.includes('eliminar-formacion')">
                                  <el-dropdown-item icon="el-icon-delete" @click.native="deleteEspecialidad(especialidad.id)">Eliminar</el-dropdown-item>
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
              title="El profesional no tiene registro de formaciones..."
              type="warning"
              show-icon
              :closable="false"
              >
            </el-alert>
          </template>
        </div>
      </div>
      <div class="row pt-4">
        <div class="col-md-12 border-bottom border-left border-right">
          <div class="row pt-lg-4 text-center">
            <div class="col-md-4">
              <span><strong class="text-success">TOTAL FORMACIÓN</strong>: {{ `${calculateTotalFormacion.years > 1 ? `${calculateTotalFormacion.years} años` : `${calculateTotalFormacion.years} año`}, ${calculateTotalFormacion.months > 1 ? `${calculateTotalFormacion.months} meses` : `${calculateTotalFormacion.months} mes`} y ${Math.round(calculateTotalFormacion.days) > 1 ? `${calculateTotalFormacion.days.toFixed(1)} días` : `${calculateTotalFormacion.days.toFixed(1)} día`}` }}</span>
            </div>
            <div class="col-md-4">
              <span><strong class="text-primary">TOTAL CONTABILIZABLE</strong>: {{ `${calculateTotalFormacionContabilizable.years > 1 ? `${calculateTotalFormacionContabilizable.years} años` : `${calculateTotalFormacionContabilizable.years} año`}, ${calculateTotalFormacionContabilizable.months > 1 ? `${calculateTotalFormacionContabilizable.months} meses` : `${calculateTotalFormacionContabilizable.months} mes`} y ${Math.round(calculateTotalFormacionContabilizable.days) > 1 ? `${calculateTotalFormacionContabilizable.days.toFixed(1)} días` : `${calculateTotalFormacionContabilizable.days.toFixed(1)} día`}` }}</span>
            </div>
            <div class="col-md-4">
              <span><strong class="text-danger">TOTAL NO CONTABILIZABLE</strong>: {{ `${calculateTotalFormacionNoContabilizable.years > 1 ? `${calculateTotalFormacionNoContabilizable.years} años` : `${calculateTotalFormacionNoContabilizable.years} año`}, ${calculateTotalFormacionNoContabilizable.months > 1 ? `${calculateTotalFormacionNoContabilizable.months} meses` : `${calculateTotalFormacionNoContabilizable.months} mes`} y ${Math.round(calculateTotalFormacionNoContabilizable.days) > 1 ? `${calculateTotalFormacionNoContabilizable.days.toFixed(1)} días` : `${calculateTotalFormacionNoContabilizable.days.toFixed(1)} día`}` }}</span>
            </div>
          </div>
        </div>
      </div>
      <ModalCreate :profesional="profesional" />
    </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
import ModalCreate from "./modals/ModalCreate.vue";
import EditFormacion from './modals/edit-formacion.vue';
import ShowFormacion from './modals/show-formacion.vue';
export default {
    props: ['profesional'],
    data() {
        return {

        };
    },
    computed:{
      ...mapGetters({
        formaciones: 'formaciones/formaciones'
      }),
      daysTotalFormacion(){
        let total_dias = 0;
        if(this.formaciones.length){
          this.formaciones.forEach(formacion => {
              let fecha_inicio    = this.DateTime.fromISO(formacion.inicio_formacion);
              let fecha_termino   = this.DateTime.fromISO(formacion.termino_formacion);
              let diferencia_days = fecha_termino.diff(fecha_inicio, 'days');
              total_dias          += diferencia_days.values.days+1;
          });
        }
        return total_dias;
      },
      calculateTotalFormacion(){
        let object = this.Duration.fromObject({days:this.daysTotalFormacion, months:0, years:0}, { conversionAccuracy: 'longterm' }).normalize().toObject();
        return object;
      },
      daysTotalFormacionContabilizable(){
        let total_dias = 0;
        if(this.formaciones.length){
          let formaciones_filter_contabilizable = this.formaciones.filter(f => f.contabilizar_periodo != false);
          if(formaciones_filter_contabilizable.length){
            formaciones_filter_contabilizable.forEach(formacion => {
              let fecha_inicio    = this.DateTime.fromISO(formacion.inicio_formacion);
              let fecha_termino   = this.DateTime.fromISO(formacion.termino_formacion);
              let diferencia_days = fecha_termino.diff(fecha_inicio, 'days');
              total_dias          += diferencia_days.values.days+1;
            });
          }
        }
        return total_dias;
      },
      calculateTotalFormacionContabilizable(){
        let object = this.Duration.fromObject({days:this.daysTotalFormacionContabilizable, months:0, years:0}, { conversionAccuracy: 'longterm' }).normalize().toObject();
        return object;
      },
      daysTotalFormacionNoContabilizable(){
        let total_dias = 0;
        if(this.formaciones.length){
          let formaciones_filter_no_contabilizable = this.formaciones.filter(f => f.contabilizar_periodo != true);
          if(formaciones_filter_no_contabilizable){
              formaciones_filter_no_contabilizable.forEach(formacion => {
                let fecha_inicio    = this.DateTime.fromISO(formacion.inicio_formacion);
                let fecha_termino   = this.DateTime.fromISO(formacion.termino_formacion);
                let diferencia_days = fecha_termino.diff(fecha_inicio, 'days');
                total_dias          += diferencia_days.values.days+1;
              });
          }
        }
        return total_dias;
      },
      calculateTotalFormacionNoContabilizable(){
        let object = this.Duration.fromObject({days:this.daysTotalFormacionNoContabilizable, months:0, years:0}, { conversionAccuracy: 'longterm' }).normalize().toObject();
        return object;
      },
    },
    methods:{
        ...mapActions({
          getFormacionesAction: 'formaciones/getFormaciones',
          getCentrosFormadres:'mantenedores/getCentrosFormadoresFormaciones',
          getPerfeccionamiento:'mantenedores/getPerfeccionamientoDynamic',
          getCampoClinicoHabilitados:'mantenedores/getCampoClinicoHabilitados'
        }),
        ...mapMutations({
          removeFormacionAction:'formaciones/REMOVE_FORMACION',
          removeFormacionPaoAction:'calculoPao/REMOVE_FORMACION_PROFESIONAL',
          passingFormacion:'edf/PASSING_FORMACION',
          passingShowFormacion:'edf/SHOW_FORMACION'
        }),
        deleteEspecialidad(id){
          this.$confirm('¿Eliminar formación?. Se eliminará todo registro asociado a la formación (Devoluciones PAO, documentos, etc...)', 'Alerta', {
          confirmButtonText: 'Si, eliminar',
          cancelButtonText: 'Cancelar',
          type: 'warning'
        }).then(() => {
          this.removeFormacion(id);
        })
        },
        clickEditFormacion(especialidad){
          this.getCentrosFormadres();
          this.getPerfeccionamiento(especialidad.perfeccionamiento.tipo.id);
          this.passingFormacion(especialidad);
        },
        show(especialidad){
          let fecha_inicio      = this.DateTime.fromISO(especialidad.inicio_formacion);
          let fecha_termino     = this.DateTime.fromISO(especialidad.termino_formacion);
          let diferencia        = fecha_termino.diff(fecha_inicio, ['days', 'months', 'years']);

          especialidad['diferencia'] = diferencia.values;
          this.passingShowFormacion(especialidad);
        },
        async removeFormacion(id){
          const url = `/api/profesionales/profesional/remove-formacion/${id}`;

          await this.$axios.$delete(url).then(response => {
            if(response === 'passing_escrituras'){
              this.$alert('No es posible eliminar formación. Existen escrituras asociadas a esta formación.', 'Error', {
                type:'warning',
                confirmButtonText: 'OK'
              });
            }else if (response === 'passing_convenios'){
              this.$alert('No es posible eliminar formación. Existen convenios asociados a esta formación.', 'Error', {
                type:'warning',
                confirmButtonText: 'OK'
              });
            }else if (response === 'paos'){
              this.$alert('No es posible eliminar formación. Existen Periodos Asistenciales asociados a esta formación.', 'Error', {
                type:'warning',
                confirmButtonText: 'OK'
              });
            }else if (response === true){
              this.removeFormacionAction(id);
              this.removeFormacionPaoAction(id);
              this.$message({
                type: 'success',
                message: 'Formación eliminada con éxito.'
              });
            }else if (response === false){
              this.$message.error("Error. Error de servidor.");
            }
          }).catch(error => {
            console.log(error);
          });
        }
    },
    mounted(){
      this.getFormacionesAction(this.$route.params.id);
      this.getCampoClinicoHabilitados();
    },
    components: { ModalCreate, EditFormacion, ShowFormacion }
}
</script>

<style>

</style>
