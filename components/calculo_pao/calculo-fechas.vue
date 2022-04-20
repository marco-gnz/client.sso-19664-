<template>
  <div>
    <li class="list-group-item media"><strong>Periodo en formación</strong>: <el-popover placement="top-start" width="250" :close-delay="1" trigger="hover" class="clickObservacionFormacion" :content="totalFormacion"><span slot="reference">{{DateTime.fromISO(pao.especialidad.inicio_formacion).toFormat('dd-LL-yyyy')}} / {{DateTime.fromISO(pao.especialidad.termino_formacion).toFormat('dd-LL-yyyy')}}</span></el-popover></li>
    <li class="list-group-item media"><strong>Total a devolver</strong>: <el-popover placement="top-start" width="250" :close-delay="1" trigger="hover" class="clickObservacion" :content="`${DateTime.fromISO(pao.periodo_inicio).toFormat('dd-LL-yyyy')} a ${DateTime.fromISO(pao.periodo_termino).toFormat('dd-LL-yyyy')}`"><span slot="reference">{{totalPaoReferencial}}</span></el-popover></li>
    <li class="list-group-item media"><strong>Devoluciones realizadas</strong>: <span class="text-success">{{ `${totalDevolucion.years} ${totalDevolucion.years > 1 ? `años` : `año`}, ${totalDevolucion.months} ${totalDevolucion.months > 1 ? `meses` : `mes`} y ${totalDevolucion.days.toFixed(1)} ${Math.round(totalDevolucion.days) > 1 ? `días` : `día`}` }}</span></li>
    <li class="list-group-item media"><strong>Interrupciones realizadas</strong>: <span class="text-danger">{{ `${totalInterrupcion.years} ${totalInterrupcion.years > 1 ? `años` : `año`}, ${totalInterrupcion.months} ${totalInterrupcion.months > 1 ? `meses` : `mes`} y ${totalInterrupcion.days.toFixed(1)} ${totalInterrupcion.days > 1 ? `días` : `día`}` }}</span></li>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  props:['pao'],
  computed:{
    ...mapGetters({
      tipoContratos:'mantenedores/tipoContratos'
    }),
    totalFormacion(){
      let inicio                      = this.DateTime.fromISO(this.pao.especialidad.inicio_formacion);
      let termino                     = this.DateTime.fromISO(this.pao.especialidad.termino_formacion);
      let diferencia_formacion_dias   = termino.diff(inicio, ['days', 'months', 'years']);

      let message = `${diferencia_formacion_dias.values.years} ${diferencia_formacion_dias.values.years > 1 ? `años` : `años`}, ${diferencia_formacion_dias.values.months} ${diferencia_formacion_dias.values.months > 1 ? `meses` : `mes`} y ${Math.round(diferencia_formacion_dias.values.days+1)} ${diferencia_formacion_dias.values.days +1 > 1 ? `días` : `día`}`;
      return message;
    },
    totalPaoReferencial(){
        let inicio          = this.DateTime.fromISO(this.pao.periodo_inicio);
        let termino         = this.DateTime.fromISO(this.pao.periodo_termino);
        let diferencia_pao_days  = termino.diff(inicio, 'days');

        let total = this.Duration.fromObject({days:diferencia_pao_days.values.days+1, months:0, years:0}, { conversionAccuracy: 'longterm' }).normalize().toObject();
        let message = `${total.years} ${total.years > 1 ? `años` : `años`}, ${total.months} ${total.months > 1 ? `meses` : `mes`} y ${Math.round(total.days)} ${total.days > 1 ? `días` : `día`}`;

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
      let dias  = 0;
      if(this.pao.devoluciones != undefined && this.pao.devoluciones.length){
        this.pao.devoluciones.forEach(devolucion => {
           let fecha_inicio    = this.DateTime.fromISO(devolucion.inicio_devolucion);
            let fecha_termino   = this.DateTime.fromISO(devolucion.termino_devolucion);
            let diferencia      = fecha_termino.diff(fecha_inicio, 'days');
            let hora            = devolucion.tipo_contrato.horas;
            let hora_real       = hora/44;
            dias += (diferencia.values.days+1)*hora_real;
        });
      }
      let object = this.Duration.fromObject({days:dias, months:0, years:0}, { conversionAccuracy: 'longterm' }).normalize().toObject();
      return object;
    },
    totalInterrupcion(){
      let dias_interrupcion    = 0;
      if(this.pao.interrupciones != undefined && this.pao.interrupciones.length){
        this.pao.interrupciones.forEach(interrupcion => {
          let fecha_inicio              = this.DateTime.fromISO(interrupcion.inicio_interrupcion);
          let fecha_termino             = this.DateTime.fromISO(interrupcion.termino_interrupcion);
          let diferencia_interrupcion   = fecha_termino.diff(fecha_inicio, 'days');
          dias_interrupcion             += diferencia_interrupcion.values.days+1;
        });
      }
      let total_interrupciones = this.Duration.fromObject({days: dias_interrupcion, months:0, years:0}, { conversionAccuracy: 'longterm' }).normalize().toObject();
      return total_interrupciones;
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

.clickObservacionFormacion{
cursor: pointer;
 color: #808080;
}
.clickObservacionFormacion:hover{
color:#4e73df;
}
</style>
