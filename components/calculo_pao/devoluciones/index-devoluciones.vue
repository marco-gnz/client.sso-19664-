<template>
  <div>
    <p><i class="el-icon-circle-plus text-success"></i> <b>Sección devoluciones</b></p>
    <template v-if="devoluciones.length">
      <table class="table table-xs">
        <thead>
            <tr>
                <th>#</th>
                <th>Periodo</th>
                <th>Horas</th>
                <th>Campo clínico</th>
                <th>E. firmada</th>
                <th>Observación</th>
                <th>&nbsp;</th>
            </tr>
        </thead>
        <tbody>
          <tr v-for="(devolucion, index) in devoluciones" :key="index" @click.prevent="show(devolucion)" v-b-modal.modal-view-devolucion class="click">
            <td :style="{backgroundColor:devolucion.color}">{{devolucion.uuid.substring(0, 5)}}</td>
            <td :style="{backgroundColor:devolucion.color}">{{DateTime.fromISO(devolucion.inicio_devolucion).toFormat('dd-LL-yyyy')}} a {{DateTime.fromISO(devolucion.termino_devolucion).toFormat('dd-LL-yyyy')}}</td>
            <td :style="{backgroundColor:devolucion.color}">{{devolucion.tipo_contrato.nombre}}</td>
            <td :style="{backgroundColor:devolucion.color}">{{devolucion.establecimiento.sigla}}, {{devolucion.establecimiento.red_hospitalaria.sigla}}</td>
            <td :style="{backgroundColor:devolucion.color}">{{ (devolucion.escritura != null) ?  (devolucion.escritura.escritura_firmada != 0) ? 'Si' :'No' : '--' }}</td>
            <td :style="{backgroundColor:devolucion.color}">{{ (devolucion.observacion != null) ? devolucion.observacion.substring(0, 14)+'...' : '--'}}</td>
            <td @click.stop="">
                <el-dropdown>
                    <span class="el-dropdown-link">
                        Acción<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <template v-if="$auth.user.permissions_roles.includes('editar-devolucion-pao') || $auth.user.permissions.includes('editar-devolucion-pao')">
                        <el-dropdown-item icon="el-icon-edit" @click.native="clickEditDevolucion(devolucion, index)" v-b-modal.modal-edit-devolucion >Editar</el-dropdown-item>
                      </template>
                      <template v-if="$auth.user.permissions_roles.includes('eliminar-devolucion-pao') || $auth.user.permissions.includes('eliminar-devolucion-pao')">
                        <el-dropdown-item icon="el-icon-delete" @click.native="clickDeleteDevolucion(devolucion, index)" v-loading.fullscreen.lock="fullscreenLoading">Eliminar</el-dropdown-item>
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
          title="No existen devoluciones..."
          type="warning"
          show-icon
          :closable="false"
          >
        </el-alert>
    </template>
    <!-- <ModalViewDevolucion :devolucion="devolucionSelect"/> -->
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapActions} from 'vuex';
import ModalViewDevolucion from './modals/modal-view-devolucion.vue';
export default {
    props: ["devoluciones"],
    data() {
        return {
            fullscreenLoading:false,
            devolucionSelect: '',
            errors:{}
        };
    },
    computed:{
      ...mapGetters({
        redesHospitalarias:'mantenedores/redesHospitalarias',
        establecimientos:'mantenedores/establecimientos',
        tipoContratos:'mantenedores/tipoContratos'
      })
    },
    methods: {
        ...mapMutations({
            removeDevolucionAction: "calculoPao/REMOVE_DEVOLUCION_PAO",
            passingDevolucion:'calculoPao/PASSING_DEVOLUCION',
            updateDevolucionAction: 'calculoPao/UPDATE_DEVOLUCION_PAO',
            passingPao: 'calculoPao/SET_PAO',
            passingShowDevolucion:'calculoPao/SHOW_DEVOLUCION'
        }),
        ...mapActions({
          getEstablecimientosAction: 'mantenedores/getEstablecimientos',
          getEscrituras:'calculoPao/getEscrituras'
        }),
        show(devolucion){
          let fecha_inicio          = this.DateTime.fromISO(devolucion.inicio_devolucion);
          let fecha_termino         = this.DateTime.fromISO(devolucion.termino_devolucion);
          let dias_diferencia       = fecha_termino.diff(fecha_inicio, 'days');

          devolucion['diferencia']  = this.Duration.fromObject({days: dias_diferencia.values.days+1, months:0, years:0}, { conversionAccuracy: 'longterm' }).normalize().toObject();

          let hora      = devolucion.tipo_contrato.horas;
          let hora_real = hora/44;

          devolucion['diferencia_calculate'] = this.Duration.fromObject({days: (dias_diferencia.values.days+1)*hora_real, months:0, years:0}, { conversionAccuracy: 'longterm' }).normalize().toObject();

          this.passingShowDevolucion(devolucion);
        },
        clickEditDevolucion(devolucion) {
          this.passingPao(devolucion.pao);
          this.getEstablecimientosAction(devolucion.establecimiento.red_hospitalaria_id);
          this.passingDevolucion(devolucion);
          this.getEscrituras(devolucion.pao.especialidad_id);
        },
        getActionEstablecimiento(){
          this.devolucionEdit.campo_clinico = '';
          this.getEstablecimientosAction(this.devolucionEdit.red);
        },
        async editDevolucion(){
          this.fullscreenLoading = !this.fullscreenLoading;
          const url = `/api/profesionales/profesional/pao/edit-devolucion/${this.devolucionEdit.uuid}` ;
          const data = {
            inicio_devolucion: this.devolucionEdit.periodo[0],
            termino_devolucion: this.devolucionEdit.periodo[1],
            observacion: this.devolucionEdit.observacion,
            tipo_contrato: this.devolucionEdit.tipo_contrato.id,
            establecimiento_id: this.devolucionEdit.campo_clinico,
            escritura_id: this.devolucionEdit.escritura_id,
            profesional_id: this.devolucionEdit.profesional_id
          };

          await this.$axios.$put(url, data).then(response => {
              if(response[0] === true){
                response[1]['index_devolucion'] = this.devolucionEdit.index;
                this.updateDevolucionAction(response[1]);
                this.fullscreenLoading = !this.fullscreenLoading;
                this.$message({
                    message: 'Devolución editada con éxito.',
                    type: 'success'
                });
                this.clearAllModal();
              }else if(response === 'existe-devolucion'){
                this.clearAllModal();
                this.fullscreenLoading = !this.fullscreenLoading;
                this.$alert('No se editó la devolución, ya que el profesional tiene una devolución en el mismo periodo de devolución ingresado.', 'Error', {
                    type:'warning',
                    confirmButtonText: 'OK'
                  });
              }else if(response === 'existe-interrupcion'){
                this.clearAllModal();
                this.fullscreenLoading = !this.fullscreenLoading;
                this.$alert('No se editó la devolución, ya que el profesional tiene una interrupción en el mismo periodo de devolución ingresado.', 'Error', {
                    type:'warning',
                    confirmButtonText: 'OK'
                  });
              }else{
                this.clearAllModal();
                this.fullscreenLoading = !this.fullscreenLoading;
              }
          }).catch(error => {
            this.fullscreenLoading = !this.fullscreenLoading;
            console.log(error.response.data.errors);
            this.errors = error.response.data.errors;
            if(error.response.data.errors.establecimiento_id){
              this.devolucion_edit_pasos = 0;
            }else if(error.response.data.errors.inicio_devolucion || error.response.data.errors.termino_devolucion){
              this.devolucion_edit_pasos = 1;
            }else if(error.response.data.errors.tipo_contrato){
              this.devolucion_edit_pasos = 2;
            }else{
              this.devolucion_edit_pasos = 3;
            }
          });
        },
        clearAllModal(){
          for(let key in this.devolucionEdit){
            this.devolucionEdit[key] = '';
          }
          this.errors = {};
          this.devolucionEdit.periodo = [];
          this.devolucion_edit_pasos = 0;
          this.modalShow != this.modalShow;
          /* this.$root.$emit('bv::hide::modal', 'modal-edit-devolucion', '#btnShow'); */
        },
        clickDeleteDevolucion(devolucion, index) {
            this.$confirm("¿Eliminar devolución?", "Alerta", {
                confirmButtonText: "Si, eliminar",
                cancelButtonText: "Cancelar",
                type: "warning",
                center: true,
                title: "¿Eliminar devolución?",
                message: (devolucion.interrupciones.length > 0 ? `Al eliminar, ${devolucion.interrupciones.length} ${devolucion.interrupciones.length > 1 ? `interrupciones` : `interrupción`} se ${devolucion.interrupciones.length > 1 ? `verán afectadadas (eliminadas)` : `verá afectada (eliminada)`}.` : ''),
                lockScroll: true
            }).then(() => {
                this.delete(devolucion, index);
            });
        },
        async delete(devolucion, index) {
            this.fullscreenLoading = !this.fullscreenLoading;
            devolucion["index_devolucion"] = index;
            const url = `/api/profesionales/profesional/pao/remove-devlucion/${devolucion.uuid}`;
            await this.$axios.$delete(url).then(response => {
              this.fullscreenLoading = !this.fullscreenLoading;
                if (response === true) {
                    this.removeDevolucionAction(devolucion);
                    this.$message({
                        message: "Devolución eliminada con éxito.",
                        type: "success"
                    });
                }
                else {
                    this.$message.error("No se eliminó. Error de servidor");
                }
            }).catch(error => {
              this.fullscreenLoading = !this.fullscreenLoading;
                console.log(error);
            });
        },



        ///
      paso_pao_devolucion_edit_volver(){
        this.devolucion_edit_pasos--;
      },
      paso_pao_devolucion_edit_siguiente(){
        this.devolucion_edit_pasos++;
      }
    },
    components: { ModalViewDevolucion }
}
</script>

<style>
.click:hover{
    cursor: pointer;
    background-color: rgb(28, 121, 71, 0.2);
    color: rgb(255, 255, 255);
}
</style>
