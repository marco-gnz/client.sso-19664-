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
            <td :style="{backgroundColor:devolucion.color}">{{DateTime.fromISO(devolucion.inicio_devolucion).toFormat('dd LLL yyyy')}} a {{DateTime.fromISO(devolucion.termino_devolucion).toFormat('dd LLL yyyy')}}</td>
            <td :style="{backgroundColor:devolucion.color}">{{devolucion.tipo_contrato.nombre}}</td>
            <td :style="{backgroundColor:devolucion.color}">{{devolucion.establecimiento.sigla}}, {{devolucion.establecimiento.red_hospitalaria.sigla}}</td>
            <td :style="{backgroundColor:devolucion.color}">{{ (devolucion.escritura != null) ?  (devolucion.escritura.escritura_firmada != 0) ? 'Si' :'No' : '--' }}</td>
            <td :style="{backgroundColor:devolucion.color}" v-if="devolucion.observacion">{{devolucion.observacion.substring(0, 14)+'...'}}</td>
            <td :style="{backgroundColor:devolucion.color}" v-else><i>Sin observación...</i></td>
            <td @click.stop="">
                <el-dropdown>
                    <span class="el-dropdown-link">
                        Acción<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <template v-if="$auth.user.permissions_roles.includes('editar-devolucion-pao') || $auth.user.permissions.includes('editar-devolucion-pao')">
                        <el-dropdown-item icon="el-icon-edit" @click.native="clickEditDevolucion(devolucion, index)">Editar</el-dropdown-item>
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

    <b-modal v-model="modalShow" size="lg" title="Editar devolución" ok-only>
      <div class="row d-flex justify-content-center">
        <div class="col-md-12">
            <el-steps :active="devolucion_edit_pasos" finish-status="success">
                <el-step title="Red" icon="el-icon-school"></el-step>
                <el-step title="Periodo" icon="el-icon-date"></el-step>
                <el-step title="Horas" icon="el-icon-time"></el-step>
                <el-step title="Otros" icon="el-icon-question"></el-step>
            </el-steps>
        </div>
      </div>
      <section v-if="devolucion_edit_pasos === 0">
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-4">
              <label>Red Hospitalaria</label>
              <select class="form-control" v-model="devolucionEdit.red" @change="getActionEstablecimiento">
                  <option value="" selected disabled>-- Seleccione red --</option>
                  <option v-for="(red, index) in redesHospitalarias" :key="index" :value="red.id">{{red.nombre}}</option>
              </select>
          </div>
          <div class="col-md-4">
              <label>Campo clínico</label> <i>(Establecimiento)</i>
              <select :disabled="devolucionEdit.red === '' || establecimientos.length === 0 " class="form-control" v-model="devolucionEdit.campo_clinico">
                  <option value="" selected disabled>-- Seleccione establecimiento --</option>
                  <option v-for="(campo, index) in establecimientos" :key="index" :value="campo.id">{{campo.nombre}} {{ (campo.grado_complejidad != null) ? `- °${campo.grado_complejidad.grado}` : '' }}</option>
              </select>
              <span class="text-danger" v-if="errors.establecimiento_id">{{errors.establecimiento_id[0]}}</span>
          </div>
        </div>
      </section>
      <section v-if="devolucion_edit_pasos == 1">
        <div class="row pt-4 d-flex justify-content-center">
            <div class="col-md-6">
                <label>Periodo de devolución</label>
                <el-date-picker
                    v-model="devolucionEdit.periodo"
                    type="daterange"
                    range-separator="a"
                    start-placeholder="Periodo de inicio"
                    end-placeholder="Periodo de término"
                    format="dd-MM-yyyy"
                    value-format="yyyy-MM-dd"
                    >
                </el-date-picker>
                <span class="text-danger" v-if="errors.inicio_devolucion || errors.termino_devolucion ">{{errors.inicio_devolucion[0]}}</span>
            </div>
        </div>
      </section>
      <section v-if="devolucion_edit_pasos == 2">
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-6">
              <label>Horas a la semana</label>
              <select class="form-control" v-model="devolucionEdit.tipo_contrato">
                  <option value="" selected disabled>-- Seleccione horas --</option>
                  <option v-for="(hora, index) in tipoContratos" :key="index" :value="hora">{{hora.nombre}}</option>
              </select>
              <span class="text-danger" v-if="errors.tipo_contrato">{{errors.tipo_contrato[0]}}</span>
              <!-- En 44 horas y el periodo ingresado, quedaría un saldo de......-->
              <!-- <div v-if="mesagge_saldo_active" class="pt-lg-3"><span>Con el periodo ingresado, mantiene un saldo de {{mesagge_saldo}} días</span></div>
              <div v-if="errors.devolucion"><span class="text-danger">{{errors.devolucion[0]}}</span></div> -->
          </div>
        </div>
      </section>
      <section v-if="devolucion_edit_pasos == 3">
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-10">
            <!-- listar solo de acuerdo a la especialidad del pao-->
            <label>Seleccione escritura pública que se asociará a la devolución</label>
              <textarea v-model="devolucionEdit.escritura_id" class="form-control" cols="10" rows="5" placeholder="Ingrese observación..."></textarea>
          </div>
        </div>
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-10">
            <label>Observación</label>
              <textarea v-model="devolucionEdit.observacion" class="form-control" cols="10" rows="5" placeholder="Ingrese observación..."></textarea>
          </div>
        </div>
      </section>
      <template #modal-footer>
          <div class="w-100">
              <button :disabled="devolucion_edit_pasos == 0" @click.prevent="paso_pao_devolucion_edit_volver" class="mt-3 btn btn-default float-left"><i class="fas fa-arrow-left"></i> Volver</button>
              <button v-show="devolucion_edit_pasos != 3" @click.prevent="paso_pao_devolucion_edit_siguiente" class="mt-3 btn btn-primary float-right">Siguiente <i class="fas fa-arrow-right"></i></button>
              <button v-show="devolucion_edit_pasos == 3" @click.prevent="editDevolucion" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Editar devolución <i class="fas fa-plus"></i></button>
          </div>
      </template>
    </b-modal>
    <ModalViewDevolucion :devolucion="devolucionSelect"/>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapActions} from 'vuex';
import ModalViewDevolucion from './modals/modal-view-devolucion.vue';
export default {
    props: ["devoluciones"],
    data() {
        return {
            modalShow:false,
            fullscreenLoading:false,
            devolucion_edit_pasos:0,
            devolucionSelect: '',
            devolucionEdit:{
              index:'',
              uuid:'',
              red:'',
              campo_clinico:'',
              periodo:[],
              observacion:'',
              tipo_contrato:'',
              escritura_id:'',
              pao_id:'',
              profesional_id:''
            },
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
            updateDevolucionAction: 'calculoPao/UPDATE_DEVOLUCION_PAO'
        }),
        ...mapActions({
          getEstablecimientosAction: 'mantenedores/getEstablecimientos',
        }),
        show(devolucion){
          this.devolucionSelect = devolucion;
          let fecha_inicio      = this.DateTime.fromISO(this.devolucionSelect.inicio_devolucion);
          let fecha_termino     = this.DateTime.fromISO(this.devolucionSelect.termino_devolucion);
          let diferencia        = fecha_termino.diff(fecha_inicio, 'days');

          this.devolucionSelect['diferencia'] = diferencia.values.days;
        },
        clickEditDevolucion(devolucion, index) {
            this.modalShow = !this.modalShow;
            this.devolucionEdit.index           = index;
            this.devolucionEdit.uuid            = devolucion.uuid;
            this.devolucionEdit.red             = devolucion.establecimiento.red_hospitalaria_id;
            this.getEstablecimientosAction(this.devolucionEdit.red);
            this.devolucionEdit.campo_clinico   = devolucion.establecimiento_id;
            this.devolucionEdit.periodo[0]      = devolucion.inicio_devolucion;
            this.devolucionEdit.periodo[1]      = devolucion.termino_devolucion;
            this.devolucionEdit.observacion     = devolucion.observacion;
            this.devolucionEdit.tipo_contrato   = devolucion.tipo_contrato;
            this.devolucionEdit.escritura_id    = devolucion.escritura_id;
            this.devolucionEdit.pao_id          = devolucion.pao_id;
            this.devolucionEdit.profesional_id  = devolucion.pao.especialidad.profesional_id;
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
              console.log(response);
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
          console.log(devolucion);
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
