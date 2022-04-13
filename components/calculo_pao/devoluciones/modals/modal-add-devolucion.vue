<template>
  <div>
    <b-modal id="modal-add-devolucion" size="lg" title="Ingresar nueva devolución" ok-only>
      <div class="row d-flex justify-content-center">
        <div class="col-md-12">
            <el-steps :active="pao_devolucion" finish-status="success">
                <el-step title="Red" icon="el-icon-school"></el-step>
                <el-step title="Periodo" icon="el-icon-date"></el-step>
                <el-step title="Horas" icon="el-icon-time"></el-step>
                <el-step title="Otros" icon="el-icon-question"></el-step>
            </el-steps>
        </div>
      </div>
      <section v-if="pao_devolucion == 0">
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-4">
              <label>Red Hospitalaria</label>
              <select class="form-control" v-model="devolucion.red" @change="getEstablecimientosChange">
                  <option value="" selected disabled>-- Seleccione red --</option>
                  <option v-for="(red, index) in redesHospitalarias" :key="index" :value="red.id">{{red.nombre}}</option>
              </select>
          </div>
          <div class="col-md-4">
              <label>Campo clínico</label> <i>(Establecimiento)</i>
              <select :disabled="devolucion.red === '' || establecimientos.length === 0" class="form-control" v-model="devolucion.campo_clinico">
                  <option value="" selected disabled>-- Seleccione campo --</option>
                  <option v-for="(campo, index) in establecimientos" :key="index" :value="campo.id">{{campo.nombre}} {{ (campo.grado_complejidad != null) ? `- °${campo.grado_complejidad.grado}` : '' }}</option>
              </select>
              <span class="text-danger" v-if="errors.establecimiento_id">{{errors.establecimiento_id[0]}}</span>
          </div>
        </div>
      </section>
      <section v-if="pao_devolucion == 1">
        <div class="row pt-4 d-flex justify-content-center">
            <div class="col-md-6">
                <label>Periodo de devolución</label>
                <el-date-picker
                    slot="reference"
                    :clearable="false"
                    v-model="devolucion.periodo"
                    type="daterange"
                    range-separator="a"
                    start-placeholder="Periodo de inicio"
                    end-placeholder="Periodo de término"
                    format="dd-MM-yyyy"
                    value-format="yyyy-MM-dd"
                    :default-value="(defaultDate != undefined) ? defaultDate : DateTime.fromISO(pao.periodo_termino).toFormat('yyyy-LL-dd')"
                    >
                </el-date-picker>
                <span class="text-danger" v-if="errors.inicio_devolucion || errors.termino_devolucion ">{{errors.inicio_devolucion[0]}}</span>
            </div>
        </div>
        <CalcularDevolucion :devolucion="devolucion" :totalPeriodoSeleccionado="totalPeriodoSeleccionado" :totalPeriodoSeleccionadoPorHora="totalPeriodoSeleccionadoPorHora" :totalDevolver="totalDevolver" :faltanDias="faltanDias" :fechFinalizacionPao="fechFinalizacionPao" />
      </section>
      <section v-if="pao_devolucion == 2">
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-6">
              <label>Horas a la semana</label>
              <select class="form-control" v-model="devolucion.contrato">
                  <option value="" selected disabled>-- Seleccione horas --</option>
                  <option v-for="(hora, index) in tipoContratos" :key="index" :value="hora">{{hora.nombre}}</option>
              </select>
              <span class="text-danger" v-if="errors.tipo_contrato">{{errors.tipo_contrato[0]}}</span>
          </div>
        </div>
        <CalcularDevolucion :devolucion="devolucion" :totalPeriodoSeleccionado="totalPeriodoSeleccionado" :totalPeriodoSeleccionadoPorHora="totalPeriodoSeleccionadoPorHora" :totalDevolver="totalDevolver" :faltanDias="faltanDias" :fechFinalizacionPao="fechFinalizacionPao" />
      </section>
      <section v-if="pao_devolucion == 3">
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-6">
            <!-- listar solo de acuerdo a la especialidad del pao-->
            <label>Seleccione escritura pública que se asociará a la devolución</label>
              <select :disabled="escrituras.length === 0" class="form-control" v-model="devolucion.escritura" >
                  <option value="" selected disabled>-- Seleccione escritura pública --</option>
                  <option v-for="(escritura, index) in escrituras" :key="index" :value="escritura.id">{{`N° repertorio ${escritura.n_repertorio != null ? escritura.n_repertorio : 'sin n°'}/${escritura.anio_repertorio != null ? escritura.anio_repertorio : 'sin año'}`}} - {{`${escritura.valor_garantia} UF`}} - {{`${escritura.escritura_firmada != 0 ? `Firmada` : `No firmada`}`}}</option>
              </select>
              <span class="pt-2" v-if="escrituras.length == 0"><i>Especialidad sin registros de escritura</i></span>
          </div>
        </div>
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-10">
            <label>Observación</label>
              <textarea v-model="devolucion.observacion" class="form-control" cols="10" rows="5" placeholder="Ingrese observación..."></textarea>
          </div>
        </div>
      </section>
      <template #modal-footer>
          <div class="w-100">
              <button :disabled="pao_devolucion == 0" @click.prevent="paso_pao_devolucion_volver" class="mt-3 btn btn-default float-left"><i class="fas fa-arrow-left"></i> Volver</button>
              <button v-show="pao_devolucion != 3" @click.prevent="paso_pao_devolucion_siguiente" class="mt-3 btn btn-primary float-right">Siguiente <i class="fas fa-arrow-right"></i></button>
              <button v-show="pao_devolucion == 3" @click.prevent="addDevolucion" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Añadir devolución <i class="fas fa-plus"></i></button>
          </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
import CalcularDevolucion from './calcular-devolucion.vue';
export default {
    props: ["pao", "totalDiasDevolver", "daysTotalDevolucion"],
    data() {
        return {
            fullscreenLoading: false,
            pao_devolucion: 0,
            devolucion: {
                red: "",
                campo_clinico: "",
                contrato: "",
                periodo: [],
                escritura: "",
                observacion: ""
            },
            colors: [],
            errors: {},
            message_total: "",
            mesagge_saldo_active: false,
            textAlert: false,
            removeDates: {
                disabledDate: (time) => {
                    const datetime = this.DateTime.fromMillis(time.getTime());
                    const dates = datetime.toFormat("yyyy-LL-dd");
                    const dateArrays = [];
                    if (this.pao.devoluciones.length) {
                        this.pao.devoluciones.forEach(devolucion => {
                            let inicio = this.DateTime.fromISO(devolucion.inicio_devolucion).toFormat("yyyy-LL-dd");
                            let termino = this.DateTime.fromISO(devolucion.termino_devolucion).toFormat("yyyy-LL-dd");
                            const dateMove = new Date(inicio);
                            let strDate = inicio;
                            while (strDate < termino) {
                                strDate = dateMove.toISOString().slice(0, 10);
                                dateArrays.push(strDate);
                                dateMove.setDate(dateMove.getDate() + 1);
                            }
                        });
                    }
                    if (this.pao.interrupciones.length) {
                        this.pao.interrupciones.forEach(interrupcion => {
                            let inicio = this.DateTime.fromISO(interrupcion.inicio_interrupcion).toFormat("yyyy-LL-dd");
                            let termino = this.DateTime.fromISO(interrupcion.termino_interrupcion).toFormat("yyyy-LL-dd");
                            const dateMoveI = new Date(inicio);
                            let strDateI = inicio;
                            while (strDateI < termino) {
                                strDateI = dateMoveI.toISOString().slice(0, 10);
                                dateArrays.push(strDateI);
                                dateMoveI.setDate(dateMoveI.getDate() + 1);
                            }
                        });
                    }
                    return dates < this.pao.periodo_inicio || dateArrays.indexOf(dates) > -1;
                }
            }
        };
    },
    mounted() {
        this.getRedesHospitalarias();
        this.getTipoContratos();
    },
    computed: {
        ...mapGetters({
            redesHospitalarias: "mantenedores/redesHospitalarias",
            establecimientos: "mantenedores/establecimientos",
            tipoContratos: "mantenedores/tipoContratos",
            escrituras: "calculoPao/escrituras"
        }),
        fechFinalizacionPao() {
            let fecha = null;
            if (this.devolucion.periodo.length && this.devolucion.contrato) {
                let termino = this.DateTime.fromISO(this.devolucion.periodo[1]);
                fecha = termino.plus({ days: this.faltanDiasCalculado, months: 0, years: 0 }).toFormat("dd-LL-yyyy");
            }
            else {
                fecha = "seleccione hora";
            }
            return fecha;
        },
        totalDevolver() {
            let devolver = this.Duration.fromObject({ days: this.totalDiasDevolver, months: 0, years: 0 }, { conversionAccuracy: "longterm" }).normalize().toObject();
            return devolver;
        },
        totalDaysPeriodoSeleccionado() {
            let dias = 0;
            if (this.devolucion.periodo.length) {
                let inicio = this.DateTime.fromISO(this.devolucion.periodo[0]);
                let termino = this.DateTime.fromISO(this.devolucion.periodo[1]);
                let diff = termino.diff(inicio, "days");
                dias = diff.values.days + 1;
            }
            return dias;
        },
        faltanDiasCalculado() {
            let dias = this.totalDiasDevolver - this.totalDaysPeriodoSeleccionadoPorHora - this.daysTotalDevolucion;
            return dias;
        },
        faltanDias() {
            let total = this.Duration.fromObject({ days: this.faltanDiasCalculado, months: 0, years: 0 }, { conversionAccuracy: "longterm" }).normalize().toObject();
            let message = `${total.years} ${total.years > 1 ? `años` : `años`}, ${total.months} ${total.months > 1 ? `meses` : `mes`} y ${total.days.toFixed(1)} ${total.days > 1 ? `días` : `día`}`;
            return message;
        },
        totalPeriodoSeleccionado() {
            if (this.devolucion.periodo) {
                let total = this.Duration.fromObject({ days: this.totalDaysPeriodoSeleccionado, months: 0, years: 0 }, { conversionAccuracy: "longterm" }).normalize().toObject();
                let day = total.days.toString().match(/^-?\d+(?:\d{0})?/)[0];
                let message = `${total.years} ${total.years > 1 ? `años` : `años`}, ${total.months} ${total.months > 1 ? `meses` : `mes`} y ${day} ${day > 1 ? `días` : `día`}`;
                return message;
            }
            else {
                return "Seleccione periodo de devolución.";
            }
        },
        totalDaysPeriodoSeleccionadoPorHora() {
            let dias = 0;
            if (this.devolucion.periodo.length && this.devolucion.contrato) {
                let inicio = this.DateTime.fromISO(this.devolucion.periodo[0]);
                let termino = this.DateTime.fromISO(this.devolucion.periodo[1]);
                let diferencia_periodo_seleccionado = termino.diff(inicio, "days");
                let n_horas_select = this.devolucion.contrato.horas;
                let calculo_n_horas = n_horas_select / 44;
                dias = (diferencia_periodo_seleccionado.values.days + 1) * calculo_n_horas;
            }
            return dias;
        },
        totalPeriodoSeleccionadoPorHora() {
            if (this.devolucion.periodo.length && this.devolucion.contrato) {
                let total = this.Duration.fromObject({ days: this.totalDaysPeriodoSeleccionadoPorHora, months: 0, years: 0 }, { conversionAccuracy: "longterm" }).normalize().toObject();
                let message = `${total.years} ${total.years > 1 ? `años` : `años`}, ${total.months} ${total.months > 1 ? `meses` : `mes`} y ${total.days.toFixed(1)} ${total.days > 1 ? `días` : `día`}`;
                return message;
            }
            else {
                return "Seleccione hora";
            }
        },
        defaultDate() {
            const dates = [];
            if (this.pao.interrupciones.length) {
                this.pao.interrupciones.forEach(interrupcion => {
                    dates.push(interrupcion.termino_interrupcion);
                });
            }
            if (this.pao.devoluciones.length) {
                this.pao.devoluciones.forEach(devolucion => {
                    dates.push(devolucion.termino_devolucion);
                });
            }
            if (dates.length) {
                let fecha_max = dates.reduce(function (valor1, valor2) { return new Date(valor1) > new Date(valor2) ? valor1 : valor2; }, 0);
                let fecha_max_format = this.DateTime.fromISO(fecha_max);
                let fecha = fecha_max_format.startOf("day").plus({ days: 1 }).toFormat("yyyy-LL-dd");
                return fecha;
            }
            else {
                let fecha = this.DateTime.fromISO(this.pao.especialidad.termino_formacion);
                return fecha.startOf("day").plus({ days: 1 }).toFormat("yyyy-LL-dd");
            }
        }
    },
    methods: {
        ...mapMutations({
            addDevolucionToPao: "calculoPao/ADD_DEVOLUCION_PAO"
        }),
        ...mapActions({
            getRedesHospitalarias: "mantenedores/getRedesHospitalarias",
            getEstablecimientosAction: "mantenedores/getEstablecimientos",
            getTipoContratos: "mantenedores/getTipoContratos"
        }),
        getEstablecimientosChange() {
            this.getEstablecimientosAction(this.devolucion.red);
        },
        generateColor() {
            let r = Math.floor(Math.random() * 256);
            let g = Math.floor(Math.random() * 256);
            let b = Math.floor(Math.random() * 256);
            let rgb = "rgb(" + r + "," + g + "," + b + ", 0.1)";
            if (this.colors.includes(rgb)) {
                this.generateColor();
            }
            else {
                this.colors.push(rgb);
                return rgb;
            }
        },
        async addDevolucion() {
            this.fullscreenLoading = !this.fullscreenLoading;
            const url = "/api/profesionales/profesional/pao/add-devolucion";
            const data = {
                inicio_devolucion: this.devolucion.periodo[0],
                termino_devolucion: this.devolucion.periodo[1],
                observacion: this.devolucion.observacion,
                color: this.generateColor(),
                tipo_contrato: this.devolucion.contrato.id,
                pao_id: this.pao.id,
                establecimiento_id: this.devolucion.campo_clinico,
                escritura_id: this.devolucion.escritura
            };
            await this.$axios.$post(url, data).then(response => {
                this.fullscreenLoading = !this.fullscreenLoading;
                if (response[0] === true) {
                    this.clearAllModal();
                    response[1]["pao_index"] = this.pao.index;
                    this.addDevolucionToPao(response[1]);
                    this.$message({
                        message: "Devolución ingresada con éxito.",
                        type: "success"
                    });
                }
                else if (response === "existe-devolucion") {
                    this.clearAllModal();
                    this.$alert("No se ingresó la devolución, ya que el profesional tiene una devolución en el mismo periodo de devolución ingresado.", "Error", {
                        type: "warning",
                        confirmButtonText: "OK"
                    });
                }
                else if (response === "existe-interrupcion") {
                    this.clearAllModal();
                    this.$alert("No se ingresó la devolución, ya que el profesional tiene una interrupción en el mismo periodo de devolución ingresado.", "Error", {
                        type: "warning",
                        confirmButtonText: "OK"
                    });
                }
                else if (response === "existe-formacion") {
                    this.clearAllModal();
                    this.$alert("No se ingresó la devolución, ya que el profesional tiene una formación en el mismo periodo de devolución ingresado.", "Error", {
                        type: "warning",
                        confirmButtonText: "OK"
                    });
                }
            }).catch(error => {
                console.log(error);
                this.fullscreenLoading = !this.fullscreenLoading;
                this.errors = error.response.data.errors;
                if (error.response.data.errors.establecimiento_id) {
                    this.pao_devolucion = 0;
                }
                else if (error.response.data.errors.inicio_devolucion || error.response.data.errors.termino_devolucion) {
                    this.pao_devolucion = 1;
                }
                else if (error.response.data.errors.tipo_contrato) {
                    this.pao_devolucion = 2;
                }
                else {
                    this.pao_devolucion = 3;
                }
            });
        },
        clearAllModal() {
            for (let key in this.devolucion) {
                this.devolucion[key] = "";
            }
            this.devolucion.periodo = [];
            this.pao_devolucion = 0;
            this.$root.$emit("bv::hide::modal", "modal-add-devolucion", "#btnShow");
            this.errors = {};
            this.mesagge_saldo_active = !this.mesagge_saldo_active;
        },
        paso_pao_devolucion_volver() {
            this.pao_devolucion--;
        },
        paso_pao_devolucion_siguiente() {
            this.pao_devolucion++;
        }
    },
    components: { CalcularDevolucion }
}
</script>

<style>

</style>
