<template>
    <div>
       <el-dialog :title="`${nameEspecialidad} (${nameTipoEspecialidad}) - Historial de interrupciones y devoluciones`" width="60%" top="0vh" :visible.sync="showModal" :modal="true" :destroy-on-close="true">
         <div class="row">
           <div class="col-md-12">
             <template v-if="procesos.length">
               <div class="block">
                 <div class="radio text-center">
                   <el-switch
                        :disabled="procesos.length < 2"
                        v-model="orden"
                        active-text="Ascendente"
                        inactive-text="Descendente"
                        @change="order">
                    </el-switch>
                 </div>
                 <el-timeline class="pt-4">
                   <el-timeline-item
                   placement="top"
                   size="normal"
                   v-for="(proceso, index) in procesos"
                   :key="index"
                   :type="(proceso.tipo === 'DEVOLUCIÓN') ? 'success' : 'danger'"
                   :icon="(proceso.tipo === 'DEVOLUCIÓN') ? 'el-icon-plus' : 'el-icon-minus'"
                   :timestamp="DateTime.fromISO(proceso.fecha_inicio).toFormat('dd LLLL yyyy') + ' a ' + DateTime.fromISO(proceso.fecha_termino).toFormat('dd LLLL yyyy')"
                   >
                    <el-card :style="{backgroundColor:proceso.color}">
                      <h5 style="color:#808080;">{{proceso.tipo}}</h5>
                      <p v-if="proceso.uuid"><strong>Cod</strong>: #{{proceso.uuid.substring(0,5)}}</p>
                      <p v-if="proceso.uuid_devolucion"><strong>Cod. devolución</strong>: #{{proceso.uuid_devolucion.substring(0,5)}}</p>
                      <p v-if="proceso.tipo_contrato"><strong>Contrato</strong>: {{proceso.tipo_contrato}} hrs.</p>
                      <template v-if="proceso.tipo != 'DEVOLUCIÓN' ">
                        <p v-if="proceso.diferencia"><strong>Total en días</strong>: {{  `${proceso.diferencia.d} ${proceso.diferencia.d > 1 ? `días` : `día`}, ${proceso.diferencia.m} ${proceso.diferencia.m > 1 ? `meses` : `mes`} y ${proceso.diferencia.y} ${proceso.diferencia.y > 1 ? `años` : `año`}` }}.</p>
                      </template>
                      <template v-else>
                        <p><strong>Total contrato</strong>: {{  `${proceso.total.d} ${proceso.total.d > 1 ? `días` : `día`}, ${proceso.total.m} ${proceso.total.m > 1 ? `meses` : `mes`} y ${proceso.total.y} ${proceso.total.y > 1 ? `años` : `año`}` }}</p>
                      </template>
                      <p v-if="proceso.establecimiento"><strong>Establecimiento</strong>: {{proceso.establecimiento}} - {{proceso.red}}</p>
                      <p v-if="proceso.causal"><strong>Causal</strong>: {{proceso.causal}}</p>
                      <span v-if="proceso.observacion">{{proceso.observacion}}</span>
                      <div class="bottom clearfix pt-3">
                          <time style="color:#808080;" class="time"><i>Ingresada el {{DateTime.fromSQL(proceso.fecha_add).toFormat('ff')}} - {{proceso.user_add}}</i></time>
                      </div>
                    </el-card>
                   </el-timeline-item>
                 </el-timeline>
               </div>
             </template>
             <template v-else>
                  <el-alert
                      title="No existen devoluciones o interrupciones..."
                      type="warning"
                      :closable="false"
                      show-icon>
                  </el-alert>
              </template>
           </div>
         </div>
       </el-dialog>
    </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';
export default {
  computed:{
    ...mapGetters({
      procesos:'historial/procesos',
      nameEspecialidad:'historial/nameEspecialidad',
      nameTipoEspecialidad:'historial/nameTipoEspecialidad',
      ordenFechas: 'historial/ordenFechas'
    }),
    showModal:{
      get() {
        return this.$store.getters['historial/modal']
      },
      set(value) {
        this.$store.dispatch('historial/updateModal')
      }
    },
    orden:{
      get(){
        return this.$store.getters['historial/ordenFechas']
      },
      set(){
        this.$store.dispatch('historial/changeOrdenValue')
      }
    }
  },
  methods:{
    ...mapActions({
      closeAction:'historial/CLOSE_MODAL',
      methodChangeOrden: 'historial/changeOrdenValue'
    }),
    ...mapMutations({
      changeOrderAction: 'historial/ORDER_PROCESOS'
    }),
    close(){
      this.closeAction();
    },
    order(){
      this.changeOrderAction();
    }
  }
}
</script>

<style>

</style>
