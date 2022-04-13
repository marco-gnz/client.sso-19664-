<template>
    <div>
      <div class="row">
        <div class="col-md-6">
          <h6>Registro y cálculo de Periodo Asistencial Obligatorio (PAO)</h6>
        </div>
        <div class="col-md-6">
          <button v-if="$auth.user.permissions_roles.includes('ingresar-calculo-pao') || $auth.user.permissions.includes('ingresar-calculo-pao')" v-b-modal.modal-add-calculo class="btn btn-success float-right">Ingresar cálculo PAO</button>
          <AddCalculo />
          <ModalEditDevolucion :totalDiasDevolver="daysTotalDevolver" :daysTotalDevolucion="daysTotalDevolucion" :devolucionesGeneral="pushDevoluciones" />
          <ModalViewDevolucion />
          <ModalShowInterrupcion />
        </div>
      </div>
      <div class="row pt-lg-3">
        <div class="col-md-12">
            <div class="row pt-4">
              <div class="col-md-12">
                <div v-for="(pao, index) in paos" :key="index" class="row pt-lg-4">
                  <div class="col-md-4">
                    <div class="card">
                      <div class="row pt-1 pl-1 pr-1">
                        <div class="col-md-6">
                            <i class="fas fa-user-md float-left"></i>
                        </div>
                        <div class="col-md-6">
                          <el-dropdown class="float-right" v-show="nonePermisos">
                              <span class="el-dropdown-link">
                                  Opciones<i class="el-icon-arrow-down el-icon--right"></i>
                              </span>
                              <el-dropdown-menu slot="dropdown">
                                <template v-if="pao.estado === 1 && $auth.user.permissions_roles.includes('ingresar-devolucion-pao') || $auth.user.permissions.includes('ingresar-devolucion-pao')">
                                  <el-dropdown-item @click.native="passingPao(pao, index)" icon="el-icon-plus" v-b-modal.modal-add-devolucion>Devolución</el-dropdown-item>
                                </template>
                                <template v-if="pao.estado === 1 && $auth.user.permissions_roles.includes('ingresar-interrupcion-pao') || $auth.user.permissions.includes('ingresar-interrupcion-pao')">
                                  <el-dropdown-item @click.native="passingPao(pao, index)" icon="el-icon-plus" v-b-modal.modal-add-interrupcion>Interrupción</el-dropdown-item>
                                </template>
                                <template v-if="$auth.user.permissions_roles.includes('eliminar-calculo-pao') || $auth.user.permissions.includes('eliminar-calculo-pao')">
                                  <el-dropdown-item :disabled="pao.devoluciones.length > 0  || pao.interrupciones.length > 0" @click.native="clickDeleteDevolucion(pao, index)" icon="el-icon-delete-solid">Eliminar PAO</el-dropdown-item>
                                </template>
                              </el-dropdown-menu>
                          </el-dropdown>
                        </div>
                      </div>
                      <div class="card-body">
                          <h5 class="card-title">{{pao.especialidad.perfeccionamiento.nombre}}</h5>
                          <p class="card-text">{{pao.especialidad.perfeccionamiento.tipo.nombre}}</p>
                          <p><a href="#" @click.prevent="showHistorial(pao)" v-loading.fullscreen.lock="fullscreenLoading">Historial de fechas</a></p>
                          <template v-if="$auth.user.permissions_roles.includes('estado-calculo-pao') || $auth.user.permissions.includes('estado-calculo-pao')">
                            <p><el-switch class="pb-1" active-color="#13ce66" active-text="Pao activado" :active-value="pao.estado === 0" :inactive-value="pao.estado === 1" inactive-color="#f46f6f" inactive-text="Pao suspendido" @change="editStatus(pao.uuid, index)" v-loading.fullscreen.lock="fullscreenLoading"></el-switch></p>
                          </template>
                          <template v-else>
                            <p><strong>Estado PAO</strong>: <el-tag size="mini" :type="`${pao.estado != 1 ? `danger` : `success`}`">{{ (pao.estado != 1) ? 'suspendido' : 'activo' }}</el-tag></p>
                          </template>
                      </div>
                      <ul class="list-group list-group-flush">
                        <!-- cálculo de fechas estimadas -->
                        <CalculoFechas :pao="pao" />
                      </ul>
                      <div class="card-body" v-if="pao.observacion">
                          <p class="card-text" ><small class="text-muted">{{pao.observacion}}</small></p>
                      </div>
                      <div class="card-footer">
                          <p class="card-text"><small class="text-muted">Ingresada el {{DateTime.fromISO(pao.created_at).toFormat('ff')}} - {{pao.user_add.sigla}}</small></p>
                      </div>
                    </div>
                  </div>
                  <div class="col-xs-1 pt-lg-5">
                    <i class="el-icon-right"></i>
                  </div>
                  <div class="col-md-7 border-bottom-light border-left-light">
                    <div class="row">
                      <div class="col-md-12">
                        <!-- devoluciones -->
                        <IndexDevoluciones :devoluciones="pao.devoluciones"/>
                      </div>
                    </div>
                    <div class="row pt-lg-4">
                      <div class="col-md-12">
                        <IndexInterrupciones :interrupciones="pao.interrupciones" />
                      </div>
                    </div>
                  </div>
                </div>
                <!-- modals devoluciones - interrupciones-->
                <ModalAddDevolucion :pao="paoSelect" :totalDiasDevolver="daysTotalDevolver" :daysTotalDevolucion="daysTotalDevolucion" :devolucionesGeneral="pushDevoluciones"/>
                <ModalAddInterrupcion :pao="paoSelect"/>

                <!-- modals edits -->
                <ModalEditInterrupcion />

                <ShowHistorial />
              </div>
            </div>

            <!-- TOTAL -->
            <div class="row pt-4">
              <div class="col-md-12 border-bottom border-left border-right">
                <div class="row pt-lg-4 text-center">
                  <div class="col-md-3">
                    <span><strong class="text-success">A DEVOLVER</strong>: {{ `${calculateTotalDevolver.years > 1 ? `${calculateTotalDevolver.years} años` : `${calculateTotalDevolver.years} año`}, ${calculateTotalDevolver.months > 1 ? `${calculateTotalDevolver.months} meses` : `${calculateTotalDevolver.months} mes`} y ${Math.round(calculateTotalDevolver.days) > 1 ? `${calculateTotalDevolver.days.toFixed(1)} días` : `${calculateTotalDevolver.days.toFixed(1)} día`}` }}</span>
                  </div>
                  <div class="col-md-3">
                    <span><strong class="text-primary">LLEVA</strong>: {{ `${calculateTotalDevolucion.years > 1 ? `${calculateTotalDevolucion.years} años` : `${calculateTotalDevolucion.years} año`}, ${calculateTotalDevolucion.months > 1 ? `${calculateTotalDevolucion.months} meses` : `${calculateTotalDevolucion.months} mes`} y ${Math.round(calculateTotalDevolucion.days) > 1 ? `${calculateTotalDevolucion.days.toFixed(1)} días` : `${calculateTotalDevolucion.days.toFixed(1)} día`}` }}</span>
                  </div>
                  <div class="col-md-3">
                    <span><strong class="text-danger">LE FALTAN</strong>: {{ `${calculateTotalPorDevolver.years > 1 ? `${calculateTotalPorDevolver.years} años` : `${calculateTotalPorDevolver.years} año`}, ${calculateTotalPorDevolver.months > 1 ? `${calculateTotalPorDevolver.months} meses` : `${calculateTotalPorDevolver.months} mes`} y ${Math.round(calculateTotalPorDevolver.days) > 1 ? `${calculateTotalPorDevolver.days.toFixed(1)} días` : `${calculateTotalPorDevolver.days.toFixed(1)} día`}` }}</span>
                  </div>
                  <div class="col-md-3">
                    <span><strong class="text-info">FINALIZA EL</strong>: {{fechaTerminarPao}}</span>
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
import AddCalculo from "./modals/add-calculo.vue";
import IndexDevoluciones from './devoluciones/index-devoluciones.vue';
import ModalAddDevolucion from './devoluciones/modals/modal-add-devolucion.vue';
import ModalAddInterrupcion from './interrupciones/modals/modal-add-interrupcion.vue';
import IndexInterrupciones from './interrupciones/index-interrupciones.vue';
import CalculoFechas from './calculo-fechas.vue';
import ModalEditInterrupcion from './interrupciones/modals/modal-edit-interrupcion.vue';
import ShowHistorial from './modals/show-historial.vue';
import ModalEditDevolucion from './devoluciones/modals/modal-edit-devolucion.vue';
import ModalViewDevolucion from './devoluciones/modals/modal-view-devolucion.vue';
import ModalShowInterrupcion from './interrupciones/modals/modal-show-interrupcion.vue';
export default {
    components: { AddCalculo, IndexDevoluciones, ModalAddDevolucion, ModalAddInterrupcion, IndexInterrupciones, CalculoFechas, ModalEditInterrupcion, ShowHistorial, ModalEditDevolucion, ModalViewDevolucion, ModalShowInterrupcion },
    data(){
      return{
        fullscreenLoading:false,
        paoSelect:''
      };
    },
    mounted(){
      this.getPaosProfesional(this.$route.params.id);
    },
    computed:{
      ...mapGetters({
        paos:'calculoPao/paos'
      }),
      pushDevoluciones(){
        let devolucionesGeneralArray = [];
        if(this.paos.length){
          this.paos.forEach(pao => {
              if(pao.devoluciones.length){
                pao.devoluciones.forEach(devolucion => {
                    devolucionesGeneralArray.push(devolucion);
                });
              }
          });
        }
        return devolucionesGeneralArray;
      },
      nonePermisos(){
        let permiso = true;

        if(!this.$auth.user.permissions_roles.includes('ingresar-devolucion-pao') && !this.$auth.user.permissions.includes('ingresar-devolucion-pao') &&
            !this.$auth.user.permissions_roles.includes('ingresar-interrupcion-pao') && !this.$auth.user.permissions.includes('ingresar-interrupcion-pao') &&
            !this.$auth.user.permissions_roles.includes('eliminar-calculo-pao') && !this.$auth.user.permissions.includes('eliminar-calculo-pao'))
            {
              permiso = false;
            }
        return permiso;
      },
      fechaTerminarPao(){
        let fecha_final = null;
        let fecha_max = null;
        let fecha_max_format = null;

        let ArrayFechasOtros = [];
        let ArrayFechasPao = [];
        let total_saldo = 0;
        if(this.paos.length){
          this.paos.forEach(pao => {
            ArrayFechasPao.push(pao.periodo_termino);
            if(pao.devoluciones.length){
              pao.devoluciones.forEach(devolucion => {
                  ArrayFechasOtros.push(devolucion.termino_devolucion);
              });
            }
            if(pao.interrupciones.length){
              pao.interrupciones.forEach(interrupcion => {
                  ArrayFechasOtros.push(interrupcion.termino_interrupcion);
              });
            }
          });

            total_saldo = this.daysTotalDevolver - this.daysTotalDevolucion;
            if(ArrayFechasOtros.length > 0){
              fecha_max = ArrayFechasOtros.reduce(function (valor1, valor2) { return new Date(valor1) > new Date(valor2) ? valor1 : valor2; });
              fecha_max_format     = this.DateTime.fromISO(fecha_max);
              fecha_final       = fecha_max_format.plus({days:total_saldo, months:0, years:0}).toFormat('dd-LL-yyyy');
            }else{
              fecha_max = ArrayFechasPao.reduce(function (valor1, valor2) { return new Date(valor1) > new Date(valor2) ? valor1 : valor2; });
              fecha_max_format     = this.DateTime.fromISO(fecha_max);
              fecha_final           = fecha_max_format.toFormat('dd-LL-yyyy');
            }
            return fecha_final;

        }else{
          return 'fecha no disponible';
        }
      },
      calculateFechaTermino(){
        let arrayFechasPao      = [];
        let ArrayFechas         = [];
        let total_saldo         = 0;
        let total_interrupcion  = 0;
        let ultima_fecha_devolucion = '';
        let fecha_a_finalizar = '';
        if(this.paos.length){
          this.paos.forEach(pao => {
            arrayFechasPao.push(pao.periodo_termino);
            ArrayFechas.push(pao.periodo_inicio);

               if(pao.devoluciones.length){
                pao.devoluciones.forEach(devolucion => {
                    ArrayFechas.push(devolucion.termino_devolucion);
                });
                if(pao.interrupciones.length){
                  pao.interrupciones.forEach(interrupcion => {
                      ArrayFechas.push(interrupcion.termino_interrupcion);
                  });
                }
              }
          });
          total_saldo = this.daysTotalDevolver - this.daysTotalDevolucion - total_interrupcion;

          if(ArrayFechas.length){
            ultima_fecha_devolucion     = ArrayFechas.reduce(function (valor1, valor2) { return new Date(valor1) > new Date(valor2) ? valor1 : valor2; });
            ultima_fecha_devolucion     = this.DateTime.fromISO(ultima_fecha_devolucion);
            fecha_a_finalizar       = ultima_fecha_devolucion.plus({days:total_saldo, months:0, years:0}).toFormat('dd-LL-yyyy');
            return fecha_a_finalizar;
          }
        }

        if(arrayFechasPao.length){
          let ultima_pao            = arrayFechasPao.reduce(function (valor1, valor2) { return new Date(valor1) > new Date(valor2) ? valor1 : valor2; });
          let  ultima_pao_format    = this.DateTime.fromISO(ultima_pao);
          fecha_a_finalizar         = ultima_pao_format.toFormat('dd-LL-yyyy');

        }else{
          fecha_a_finalizar = 'Fecha no disponible';
        }
          return fecha_a_finalizar;
      },
      daysTotalInterrupcion(){
        let total_dias = 0;
        if(this.paos.length){
          this.paos.forEach(pao => {
              if(pao.interrupciones.length){
                pao.interrupciones.forEach(interrupcion => {
                    let fecha_inicio    = this.DateTime.fromISO(interrupcion.inicio_interrupcion);
                    let fecha_termino   = this.DateTime.fromISO(interrupcion.termino_interrupcion);
                    let diferencia_days = fecha_termino.diff(fecha_inicio, 'days');
                    total_dias          += diferencia_days.values.days+1;
                });
              }
          });
        }
        return total_dias;
      },
      daysTotalDevolucion(){
        let total_dias = 0;
        if(this.paos.length){
          this.paos.forEach(pao => {
              if(pao.devoluciones.length){
                pao.devoluciones.forEach(devolucion => {
                    let fecha_inicio    = this.DateTime.fromISO(devolucion.inicio_devolucion);
                    let fecha_termino   = this.DateTime.fromISO(devolucion.termino_devolucion);
                    let diferencia_days = fecha_termino.diff(fecha_inicio, 'days');
                    let hora            = devolucion.tipo_contrato.horas;
                    let hora_real       = hora/44;
                    total_dias          += (diferencia_days.values.days+1)*hora_real;
                });
              }
          });
        }
        return total_dias;
      },
      calculateTotalDevolucion(){
        let object  = this.Duration.fromObject({days:this.daysTotalDevolucion, months:0, years:0}, { conversionAccuracy: 'longterm' }).normalize().toObject();
        return object;
      },
      daysTotalDevolver(){
        let total_dias = 0;
        if(this.paos.length){
          this.paos.forEach(pao => {
              let fecha_inicio    = this.DateTime.fromISO(pao.periodo_inicio);
              let fecha_termino   = this.DateTime.fromISO(pao.periodo_termino);
              let diferencia_days = fecha_termino.diff(fecha_inicio, 'days');
              total_dias          += diferencia_days.values.days+1;
          });
        }

        return total_dias;
      },
      calculateTotalDevolver(){
        let devolver = this.Duration.fromObject({days: this.daysTotalDevolver, months:0, years:0}, { conversionAccuracy: 'longterm' }).normalize().toObject();
        return devolver;
      },
      calculateTotalPorDevolver(){
        let total = this.daysTotalDevolver - this.daysTotalDevolucion;
        let object = this.Duration.fromObject({days:total, months:0, years:0}, { conversionAccuracy: 'longterm' }).normalize().toObject();

        return object;
      }
    },
    methods:{
      ...mapActions({
        getPaosProfesional:'calculoPao/getPaos',
        getHistorial:'historial/getHistorial',
        getEscrituras:'calculoPao/getEscrituras'
      }),
      ...mapMutations({
        removePaoAction:'calculoPao/REMOVE_PAO',
        refreshPaoAction:'calculoPao/REFRESH_PAO'
      }),
      showHistorial(pao){
        this.getHistorial(pao.id);
      },
      passingPao(pao, index){
        this.paoSelect = pao;
        this.paoSelect['index'] = index;
        this.getEscrituras(pao.especialidad.id);
      },
      clickDeleteDevolucion(pao) {
        this.$confirm(`Una vez eliminado, podrás ingresar nuevamente un cálculo para la ${pao.especialidad.perfeccionamiento.tipo.nombre} ${pao.especialidad.perfeccionamiento.nombre}.`, "Alerta", {
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
            type: "warning",
            center: true,
            title: '¿Eliminar cálculo PAO?',
            lockScroll: true
        }).then(() => {
            this.deletePao(pao);
        });
        },
      async editStatus(uuid, index){
        this.fullscreenLoading = !this.fullscreenLoading;
        const url = `/api/profesionales/profesional/update-status/${uuid}`;

        await this.$axios.$put(url).then(response => {
          this.fullscreenLoading = !this.fullscreenLoading;
          if(response[0] === true){
            this.refreshPaoAction(response[1]);
            this.$message({
                message: `PAO ${response[1].estado != 1 ? `suspendido` : `activado`} con éxito.`,
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
      async deletePao(pao){
        this.fullscreenLoading = !this.fullscreenLoading;
        const url = `/api/profesionales/profesional/delete-calculo-pao/${pao.uuid}`;
        await this.$axios.$delete(url).then(response => {
          this.fullscreenLoading = !this.fullscreenLoading;
          if(response === true){
            this.removePaoAction(pao);
            this.$message({
                message: 'Cálculo PAO eliminado con éxito.',
                type: 'success'
            });
          }else if(response === 'max-devoluciones'){
            this.$message.error("Error. Cálculo contiene devoluciones asociadas.");
          }else if(response === 'max-interrupciones'){
            this.$message.error("Error. Cálculo contiene interrupciones asociadas.");
          }else{
            this.$message.error("Error. Error de servidor.");
          }
        }).catch(error => {
          console.log(error);
          this.fullscreenLoading = !this.fullscreenLoading;
        });

      }
    }
}
</script>

<style>

</style>
