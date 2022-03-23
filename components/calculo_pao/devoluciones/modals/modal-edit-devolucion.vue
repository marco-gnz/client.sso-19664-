<template>
  <div>
    <b-modal id="modal-edit-devolucion" size="lg" title="Editar devolución" ok-only>
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
              <select class="form-control" v-model="red" @change="getEstablecimientosChange">
                  <option value="" selected disabled>-- Seleccione red --</option>
                  <option v-for="(red, index) in redesHospitalarias" :key="index" :value="red.id">{{red.nombre}}</option>
              </select>
          </div>
          <div class="col-md-4">
              <label>Campo clínico</label> <i>(Establecimiento)</i>
              <select :disabled="red === '' || establecimientos.length === 0" class="form-control" v-model="campo_clinico">
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
            <label>Periodo de devolucion</label>
            <el-popover
              placement="bottom-end"
              width="700"
              trigger="hover"
              content="Fechas deshabilitadas corresponden a devoluciones, interrupciones o periodos no disponibles...">
              <el-date-picker
                  slot="reference"
                  v-model="periodo.periodo"
                  type="daterange"
                  range-separator="a"
                  start-placeholder="Periodo de inicio"
                  end-placeholder="Periodo de término"
                  format="dd-MM-yyyy"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                  @input="calculoSaldoTotalToDate"
                  :default-value="(defaultDate != undefined) ? defaultDate : DateTime.fromISO(pao.periodo_termino).toFormat('yyyy-LL-dd')"
                  >
              </el-date-picker>
            </el-popover>
          </div>
        </div>
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-10">
            <el-alert
                v-show="mesagge_saldo_active && tipo_contrato"
                class="pt-lg-4"
                title="Total saldo por devolver"
                :type="(textAlert != true)  ? 'info' : 'warning' "
                :description="message_total"
                :closable="false"
                show-icon>
              </el-alert>
          </div>
        </div>
      </section>
      <section v-if="pao_devolucion == 2">
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-6">
              <label>Horas a la semana</label>
              <select class="form-control" v-model="tipo_contrato" @change="calculoSaldoTotal">
                  <option value="" selected disabled>-- Seleccione horas --</option>
                  <option v-for="(hora, index) in tipoContratos" :key="index" :value="hora">{{hora.nombre}}</option>
              </select>
              <span class="text-danger" v-if="errors.tipo_contrato">{{errors.tipo_contrato[0]}}</span>
          </div>
        </div>
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-10">
            <el-alert
                v-show="mesagge_saldo_active"
                class="pt-lg-4"
                title="Total saldo por devolver"
                :type="(textAlert != true)  ? 'info' : 'warning' "
                :description="message_total"
                :closable="false"
                show-icon>
              </el-alert>
          </div>
        </div>
      </section>
      <section v-if="pao_devolucion == 3">
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-6">
            <!-- listar solo de acuerdo a la especialidad del pao-->
            <label>Seleccione escritura pública que se asociará a la devolución</label>
              <select :disabled="escrituras.length === 0" class="form-control" v-model="escritura" >
                  <option value="" selected disabled>-- Seleccione escritura pública --</option>
                  <option v-for="(escritura, index) in escrituras" :key="index" :value="escritura.id">{{`N° ${escritura.n_resolucion}`}} - {{DateTime.fromISO(escritura.fecha_resolucion).toFormat('dd/LL/yyyy')}} - {{`${escritura.valor_garantia} UF`}} - {{`${escritura.escritura_firmada != 0 ? `Firmada` : `No firmada`}`}}</option>
              </select>
              <span class="pt-2" v-if="escrituras.length == 0"><i>Especialidad sin registros de escritura</i></span>
          </div>
        </div>
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-10">
            <label>Observación</label>
              <textarea v-model="observacion" class="form-control" cols="10" rows="5" placeholder="Ingrese observación..."></textarea>
          </div>
        </div>
      </section>
      <template #modal-footer>
          <div class="w-100">
              <button :disabled="pao_devolucion == 0" @click.prevent="paso_pao_devolucion_volver" class="mt-3 btn btn-default float-left"><i class="fas fa-arrow-left"></i> Volver</button>
              <button v-show="pao_devolucion != 3" @click.prevent="paso_pao_devolucion_siguiente" class="mt-3 btn btn-primary float-right">Siguiente <i class="fas fa-arrow-right"></i></button>
              <button v-show="pao_devolucion == 3" @click.prevent="editDevolucion" v-loading.fullscreen.lock="fullscreenLoading" class="mt-3 btn btn-success float-right">Editar devolución <i class="fas fa-plus"></i></button>
          </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
export default {
  data(){
    return{
      pao_devolucion:0,
      errors:{},
      fullscreenLoading:false,
      message_total:'',
      mesagge_saldo_active:false,
      textAlert:false,
      removeDates:{
        disabledDate: (time) => {
          const datetime    = this.DateTime.fromMillis(time.getTime());
          const dates       = datetime.toFormat('yyyy-LL-dd');
          const dateArrays  = [];

          if(this.pao.devoluciones.length){
            const devoluciones = this.pao.devoluciones.filter(devolucion => devolucion.id != this.$store.state.calculoPao.devolucionEdit.id);
            devoluciones.forEach(devolucion => {
              let inicio  = this.DateTime.fromISO(devolucion.inicio_devolucion).toFormat('yyyy-LL-dd');
              let termino = this.DateTime.fromISO(devolucion.termino_devolucion).toFormat('yyyy-LL-dd');

              const dateMove  = new Date(inicio);
              let strDate     = inicio;

              while (strDate < termino) {
                strDate = dateMove.toISOString().slice(0, 10);
                dateArrays.push(strDate);
                dateMove.setDate(dateMove.getDate() + 1);
              }
            });
          }

          if(this.pao.interrupciones.length){
            this.pao.interrupciones.forEach(interrupcion => {
              let inicio  = this.DateTime.fromISO(interrupcion.inicio_interrupcion).toFormat('yyyy-LL-dd');
              let termino = this.DateTime.fromISO(interrupcion.termino_interrupcion).toFormat('yyyy-LL-dd');

              const dateMoveI  = new Date(inicio);
              let strDateI     = inicio;

              while (strDateI < termino) {
                strDateI = dateMoveI.toISOString().slice(0, 10);
                dateArrays.push(strDateI);
                dateMoveI.setDate(dateMoveI.getDate() + 1);
              }
            });
          }
          return dates < this.pao.periodo_inicio || dateArrays.indexOf(dates)>-1;
        }
      }
    };
  },
  mounted(){
    this.getRedesHospitalarias();
    this.getTipoContratos();
  },
  computed:{
    ...mapGetters({
      redesHospitalarias:'mantenedores/redesHospitalarias',
      establecimientos:'mantenedores/establecimientos',
      tipoContratos:'mantenedores/tipoContratos',
      escrituras:'calculoPao/escrituras'
    }),
    defaultDate(){
      const dates = [];

      if(this.pao.interrupciones.length){
        this.pao.interrupciones.forEach(interrupcion => {
            dates.push(interrupcion.termino_interrupcion);
        });
      }

      if(this.pao.devoluciones.length){
        this.pao.devoluciones.forEach(devolucion => {
            dates.push(devolucion.termino_devolucion);
        });
      }

      if(dates.length){
        let fecha_max = dates.reduce(function (valor1, valor2) { return new Date(valor1) > new Date(valor2) ? valor1 : valor2; }, 0);
        let fecha_max_format = this.DateTime.fromISO(fecha_max);
        let fecha = fecha_max_format.startOf('day').plus({days: 1}).toFormat('yyyy-LL-dd');
        return fecha;
      }else{
        let fecha = this.DateTime.fromISO(this.pao.especialidad.termino_formacion);
        return fecha.startOf('day').plus({days: 1}).toFormat('yyyy-LL-dd');
      }
    },
    pao(){
      return {...this.$store.state.calculoPao.pao}
    },
    red:{
      get() {
        return this.$store.state.calculoPao.devolucionEdit.red_id;
      },
      set(newValue) {
        this.$store.commit('calculoPao/RED_DEVOLUCION', newValue);
      }
    },
    campo_clinico:{
      get() {
        return this.$store.state.calculoPao.devolucionEdit.establecimiento_id;
      },
      set(newValue) {
        this.$store.commit('calculoPao/HOSPITAL_DEVOLUCION', newValue);
      }
    },
    periodo(){
      return {...this.$store.state.calculoPao.devolucionEdit}
    },
    /* periodo:{
      get() {
        return this.$store.state.calculoPao.devolucionEdit.periodo;
      },
      set(newValue) {
        this.$store.commit('calculoPao/PERIODO_DEVOLUCION', newValue);
      }
    }, */
    tipo_contrato:{
      get() {
        return this.$store.state.calculoPao.devolucionEdit.tipo_contrato;
      },
      set(newValue) {
        this.$store.commit('calculoPao/TIPO_CONTRATO', newValue);
      }
    },
    escritura:{
      get() {
        return this.$store.state.calculoPao.devolucionEdit.escritura_id;
      },
      set(newValue) {
        this.$store.commit('calculoPao/DEVOLUCION_ESCRITURA', newValue);
      }
    },
    observacion:{
      get() {
        return this.$store.state.calculoPao.devolucionEdit.observacion;
      },
      set(newValue) {
        this.$store.commit('calculoPao/DEVOLUCION_OBSERVACION', newValue);
      }
    }
  },
  methods:{
    ...mapMutations({
      updateDevolucionAction: 'calculoPao/UPDATE_DEVOLUCION_PAO',
    }),
    ...mapActions({
      getRedesHospitalarias:'mantenedores/getRedesHospitalarias',
      getEstablecimientosAction: 'mantenedores/getEstablecimientos',
      getTipoContratos:'mantenedores/getTipoContratos'
    }),
    getEstablecimientosChange(){
      this.campo_clinico = '';
      this.getEstablecimientosAction(this.red);
    },
    calculoSaldoTotalToDate(){
      if(this.tipo_contrato != ''){
        this.calculoSaldoTotal();
      }
    },
    calculoSaldoTotal(){
      if(this.periodo.periodo.length){
        let days                  = 0;

        let inicio_pao            = this.DateTime.fromISO(this.pao.periodo_inicio);
        let termino_pao           = this.DateTime.fromISO(this.pao.periodo_termino);
        let diferencia_days_pao   = termino_pao.diff(inicio_pao, 'days');


        //refactorizar código en api.backend, para tener una mayor exactitud y datos reales
        if(this.pao.devoluciones.length){
          const devoluciones = this.pao.devoluciones.filter(devolucion => devolucion.id != this.$store.state.calculoPao.devolucionEdit.id);
          devoluciones.forEach(devolucion => {
            let inicio_devolucion       = this.DateTime.fromISO(devolucion.inicio_devolucion);
            let termino_devolucion      = this.DateTime.fromISO(devolucion.termino_devolucion);
            let diff_days_devolucin     = termino_devolucion.diff(inicio_devolucion, 'days');
            let hora                    = devolucion.tipo_contrato.horas;
            let hora_real               = hora/44;
            let total_diff              = diff_days_devolucin.values.days * hora_real;

            days  += total_diff;
          });
        }

        //refactorizar código en api.backend, para tener una mayor exactitud y datos reales//
        let periodo_inicio_ingresado        = this.DateTime.fromISO(this.periodo.periodo[0]);
        let periodo_termino_ingresado       = this.DateTime.fromISO(this.periodo.periodo[1]);
        let diff_ingresado                  = periodo_termino_ingresado.diff(periodo_inicio_ingresado, 'days');


        let n_horas_select                  = this.tipo_contrato.horas;
        let calculo_n_horas                 = n_horas_select/44;
        let days_calculo                    = diff_ingresado.values.days*calculo_n_horas;

        let total           = diferencia_days_pao.values.days - days - days_calculo;

        /* let object          = this.Duration.fromObject({days: total, months:0, years:0}).normalize().toObject(); */

        let object = this.Duration.fromObject({days:total, months:0, years:0}).shiftTo('days', 'months', 'years');

        let fecha           = periodo_termino_ingresado.plus({days: total, months:0, years:0}).toFormat('dd LLLL yyyy');

        if(object.days < 0 || object.months < 0 || object.years < 0 ){
          this.textAlert = true;
          this.message_total = `Con el periodo ingresado (${periodo_inicio_ingresado.toFormat('dd LLL yyyy')} / ${periodo_termino_ingresado.toFormat('dd LLL yyyy')}) y en ${this.tipo_contrato.nombre} horas, el total a devolver ya estaría completo. Favor reducir el periodo de devolución ingresado. La fecha estimada a finalizar sería el ${fecha}.`;
        }else{
          this.textAlert = false;
          this.message_total  = `Con el periodo ingresado (${periodo_inicio_ingresado.toFormat('dd LLL yyyy')} / ${periodo_termino_ingresado.toFormat('dd LLL yyyy')}) y en ${this.tipo_contrato.nombre} horas, quedaría un total de ${object.years > 1 ? `${object.years} años` : `${object.years} año`}, ${object.months > 1 ? `${object.months} meses` : `${object.months} mes`} y ${Math.round(object.days) > 1 ? `${Math.round(object.days)} días` : `${Math.round(object.days)} día`} por devolver. La fecha estimada a finalizar sería el ${fecha}.`;
        }
        this.mesagge_saldo_active = true;
      }else{
        alert('no!');
      }
    },
    async editDevolucion(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/profesionales/profesional/pao/edit-devolucion/${this.periodo.id}` ;
      const data = {
              inicio_devolucion: this.periodo.periodo[0],
              termino_devolucion: this.periodo.periodo[1],
              observacion: this.observacion,
              tipo_contrato: this.tipo_contrato.id,
              establecimiento_id: this.campo_clinico,
              escritura_id: this.escritura
            };

            await this.$axios.$put(url, data).then(response => {
              this.fullscreenLoading = !this.fullscreenLoading;
              if(response[0] === true){
                this.clearAllModal();
                this.updateDevolucionAction(response[1]);
                this.$message({
                    message: 'Devolución editada con éxito.',
                    type: 'success'
                });
              }else if(response === 'existe-devolucion'){
                this.$alert('No se editó la devolución, ya que el profesional tiene una devolución en el mismo periodo de devolución ingresado.', 'Error', {
                    type:'warning',
                    confirmButtonText: 'OK'
                  });
              }else if(response === 'existe-interrupcion'){
                this.$alert('No se editó la devolución, ya que el profesional tiene una interrupción en el mismo periodo de devolución ingresado.', 'Error', {
                    type:'warning',
                    confirmButtonText: 'OK'
                  });
              }else if(response === 'existe-formacion'){
                this.$alert('No se editó la devolución, ya que el profesional tiene una formación en el mismo periodo de devolución ingresado.', 'Error', {
                    type:'warning',
                    confirmButtonText: 'OK'
                  });
              }
          }).catch(error => {
            this.fullscreenLoading = !this.fullscreenLoading;
            console.log(error);
            this.errors = error.response.data.errors;
            if(error.response.data.errors.establecimiento_id){
              this.pao_devolucion = 0;
            }else if(error.response.data.errors.inicio_devolucion || error.response.data.errors.termino_devolucion){
              this.pao_devolucion = 1;
            }else if(error.response.data.errors.tipo_contrato){
              this.pao_devolucion = 2;
            }else{
              this.pao_devolucion = 3;
            }
          });
    },
    clearAllModal(){
      this.pao_devolucion = 0;
      this.$root.$emit('bv::hide::modal', 'modal-edit-devolucion', '#btnShow');
      this.errors = {};
    },
    paso_pao_devolucion_volver(){
      this.pao_devolucion--;
    },
    paso_pao_devolucion_siguiente(){
      this.pao_devolucion++;
    }
  }
}
</script>

<style>

</style>
