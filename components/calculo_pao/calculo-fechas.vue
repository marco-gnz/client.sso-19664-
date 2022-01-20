<template>
  <div>
    <li class="list-group-item media"><strong>Perido en formación</strong>: <el-popover :disabled=" (pao.observacion_periodo != '') ? true : false " placement="top-start" width="400" trigger="hover" :class="(pao.observacion_periodo) ? 'clickObservacion' : '' " :content="pao.observacion_periodo"><span slot="reference">{{DateTime.fromISO(pao.especialidad.inicio_formacion).toFormat('dd-LL-yyyy')}} / {{DateTime.fromISO(pao.especialidad.termino_formacion).toFormat('dd-LL-yyyy')}}</span></el-popover></li>
    <li class="list-group-item media"><strong>Periodo a devolver</strong>: <el-popover placement="top-start" width="500" trigger="hover" class="clickObservacion" :content="totalPaoReferencial"><span slot="reference">{{DateTime.fromISO(pao.periodo_inicio).toFormat('dd-LL-yyyy')}} / {{DateTime.fromISO(pao.periodo_termino).toFormat('dd-LL-yyyy')}}</span></el-popover></li>
    <li class="list-group-item media"><strong>Devolución adquirida</strong>: <span class="text-success">{{ `${totalDevolucion.years} ${totalDevolucion.years > 1 ? `años` : `año`}, ${totalDevolucion.months} ${totalDevolucion.months > 1 ? `meses` : `mes`} y ${totalDevolucion.days} ${totalDevolucion.days > 1 ? `días` : `día`}` }}</span></li>
    <li class="list-group-item media"><strong>Interrupción adquirida</strong>: <span class="text-danger">{{ `${totalInterrupcion.years} ${totalInterrupcion.years > 1 ? `años` : `año`}, ${totalInterrupcion.months} ${totalInterrupcion.months > 1 ? `meses` : `mes`} y ${totalInterrupcion.days} ${totalInterrupcion.days > 1 ? `días` : `día`}` }}</span></li>
    <!-- <li class="list-group-item media"><strong>Fin estimado</strong>: {{ `${fechaFinEstimada != undefined || fechaFinEstimada != null ? `${fechaFinEstimada}` : `${DateTime.fromISO(pao.periodo_termino).toFormat('dd LLLL yyyy')}`}` }}<br></li> -->
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  data(){
    return{
      min:11,
      max:44,
      tipoContratoSelect:44,
      marks:{11:'11', 22:'22', 28:'28', 33:'33', 44:'44'},
    };
  },
  props:['pao'],

  computed:{
    ...mapGetters({
      tipoContratos:'mantenedores/tipoContratos'
    }),
    totalPaoReferencial(){
        let inicio          = this.DateTime.fromISO(this.pao.periodo_inicio);
        let termino         = this.DateTime.fromISO(this.pao.periodo_termino);
        let diferencia_pao  = termino.diff(inicio, ['days', 'months', 'years']);
        let message         = `Total Periodo Asistencial Obligatorio es de ${diferencia_pao.values.years} ${diferencia_pao.values.years > 1 ? `años` : `años`}, ${diferencia_pao.values.months} ${diferencia_pao.values.months > 1 ? `meses` : `mes`} y ${diferencia_pao.values.days} ${diferencia_pao.values.days > 1 ? `días` : `día`}.`;

        return message;
    },
    totalDaysInterrupciones(){
      let total_dias_interrumpe = 0;

      if (this.pao.interrupciones != undefined && this.pao.interrupciones.length) {
          this.pao.interrupciones.forEach(interrupcion => {
            let fecha_inicio    = this.DateTime.fromISO(interrupcion.inicio_interrupcion);
            let fecha_termino   = this.DateTime.fromISO(interrupcion.termino_interrupcion);
            let diferencia_interrupcion      = fecha_termino.diff(fecha_inicio, 'days');

            total_dias_interrumpe    += diferencia_interrupcion.values.days;
          });
        }
        return total_dias_interrumpe;
    },
    totalDias(){
        let total_dias_pao        = 0;
        let total_dias_devuelto   = 0;
        let total_dias            = 0;

        let fecha_inicio_pao    = this.DateTime.fromISO(this.pao.periodo_inicio);
        let fecha_termino_pao   = this.DateTime.fromISO(this.pao.periodo_termino);
        let diferencia_pao      = fecha_termino_pao.diff(fecha_inicio_pao, 'days');


        total_dias_pao          = diferencia_pao.values.days;

        if(this.pao.devoluciones != undefined && this.pao.devoluciones.length){
          this.pao.devoluciones.forEach(devolucion => {
            let fecha_inicio    = this.DateTime.fromISO(devolucion.inicio_devolucion);
            let fecha_termino   = this.DateTime.fromISO(devolucion.termino_devolucion);
            let diferencia      = fecha_termino.diff(fecha_inicio, 'days');

            let hora            = devolucion.tipo_contrato.horas;
            let hora_real       = hora/44;

            let plus = fecha_inicio.plus({days: diferencia.days * hora_real});

            let diff_days_total_test      = plus.diff(fecha_inicio, 'days');
                total_dias_devuelto       += diff_days_total_test.values.days;
          });
        }

        /* total_dias = total_dias_pao + this.totalDaysInterrupciones - total_dias_devuelto; */
        total_dias = total_dias_pao - total_dias_devuelto;

        //if si el total de
        return total_dias;
    },
    totalDevolucion(){
      let años    = 0;
      let meses   = 0;
      let dias    = 0;
      let total_days_calculo = 0;

      if(this.pao.devoluciones != undefined && this.pao.devoluciones.length){
        this.pao.devoluciones.forEach(devolucion => {
          let fecha_inicio    = this.DateTime.fromISO(devolucion.inicio_devolucion);
          let fecha_termino   = this.DateTime.fromISO(devolucion.termino_devolucion);
          let diferencia      = fecha_termino.diff(fecha_inicio, 'days');

          let hora            = devolucion.tipo_contrato.horas;
          let hora_real       = hora/44;

          let plus = fecha_inicio.plus({days: diferencia.days * hora_real});
          let diff = plus.diff(fecha_inicio, ['days', 'months', 'years']);

          let diff_days_total_test = plus.diff(fecha_inicio, 'days');
          total_days_calculo       += diff_days_total_test.values.days;

          años    += diff.values.years;
          meses   += diff.values.months;
          dias    += diff.values.days;
        });
      }

      let total_pao = this.Duration.fromObject({ years: años, months: meses,  days: Math.round(dias)}).normalize().toObject();
      total_pao['total_days'] = total_days_calculo;
      return total_pao;
    },
    totalInterrupcion(){
      let años    = 0;
      let meses   = 0;
      let dias    = 0;

      if(this.pao.interrupciones != undefined && this.pao.interrupciones.length){
        this.pao.interrupciones.forEach(interrupcion => {
          let fecha_inicio              = this.DateTime.fromISO(interrupcion.inicio_interrupcion);
          let fecha_termino             = this.DateTime.fromISO(interrupcion.termino_interrupcion);
          let diferencia_interrupcion   = fecha_termino.diff(fecha_inicio, ['years', 'months', 'days']);

          años    += diferencia_interrupcion.values.years;
          meses   += diferencia_interrupcion.values.months;
          dias    += diferencia_interrupcion.values.days;
        });
      }
      let total_interrupciones = this.Duration.fromObject({ years: años, months: meses,  days: dias}).normalize().toObject();
      return total_interrupciones;
    },
    fechaFinEstimada(){
      let array_fechas_termino_devolucion = [];
      let fecha_max;
      let fecha_max_format;
      let fecha_completa;

      if(this.pao.devoluciones != undefined && this.pao.devoluciones.length){
        this.pao.devoluciones.forEach(devolucion => {
          array_fechas_termino_devolucion.push(devolucion.termino_devolucion);
        });
      }

      if(array_fechas_termino_devolucion.length){
        fecha_max         = array_fechas_termino_devolucion.reduce(function (valor1, valor2) { return new Date(valor1) > new Date(valor2) ? valor1 : valor2; });
        fecha_max_format  = this.DateTime.fromISO(fecha_max);
        fecha_completa    = fecha_max_format.plus({days: this.totalDias}).toFormat('dd LLLL yyyy');
      }
      return fecha_completa;
    }
  },
}
</script>

<style>
.clickObservacion{
cursor: pointer;
 color: #D06224;
}
.clickObservacion:hover{
color:#D06224;
}
</style>
