<template>
  <div>
    <b-modal id="modal-edit-factura" size="lg" title="Editar factura" scrollable ok-only>
      <div class="row d-flex justify-content-center">
        <div class="col-md-12">
          <el-steps :active="factura_pasos" finish-status="success">
              <el-step title="Covenio" icon="el-icon-s-check"></el-step>
              <el-step title="Datos convenio" icon="el-icon-s-claim"></el-step>
              <el-step title="Datos factura" icon="el-icon-document"></el-step>
              <el-step title="Observación" icon="el-icon-document"></el-step>
          </el-steps>
        </div>
      </div>
      <section v-if="factura_pasos === 0">
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-6">
             <label>Seleccione convenio</label>
             <select class="form-control" v-model="convenioSelect" @change="selectConvenio">
                  <option value="">-- Seleccione convenio --</option>
                  <option v-for="(convenio, index) in convenios" :key="index" :value="convenio.id">{{convenio.n_resolucion}}/{{ DateTime.fromISO(convenio.fecha_resolucion).toFormat('dd-LL-yyyy')}} - {{ (convenio.especialidad != null) ? convenio.especialidad.centro_formador.nombre : '' }} - {{ (convenio.tipo != null) ? convenio.tipo.nombre : 'sin tipo' }}</option>
              </select>
              <span class="text-danger" v-if="errors.convenio_id">{{errors.convenio_id[0]}}</span>
          </div>
        </div>
        <div class="row pt-lg-3">
          <div class="col-md-12">
            <el-alert
              title="Información importante"
              type="info"
              description="Si no existe convenio de por medio, puede ir directo a los datos de factura."
              :closable="false"
              show-icon>
            </el-alert>
          </div>
        </div>
      </section>
      <section v-if="factura_pasos === 1">
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-4">
              <label>N° de resolución convenio</label>
              <input :disabled="convenioSelect" type="number" v-model="n_resolucion_convenio" class="form-control" placeholder="Ingrese número de resolución convenio">
              <span class="text-danger" v-if="errors.n_resolucion">{{errors.n_resolucion[0]}}</span>
          </div>
          <div class="col-md-4">
              <label>Fecha resolución convenio</label>
              <input :disabled="convenioSelect" type="date" v-model="fecha_resolucion_convenio" class="form-control">
              <span class="text-danger" v-if="errors.fecha_resolucion">{{errors.fecha_resolucion[0]}}</span>
          </div>
        </div>
      </section>
      <section v-if="factura_pasos === 2">
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-6">
              <label>N° de factura</label>
              <input type="number" v-model="n_factura" class="form-control" placeholder="Ingrese número de factura">
              <span class="text-danger" v-if="errors.n_factura">{{errors.n_factura[0]}}</span>
          </div>
          <div class="col-md-6">
              <label>Fecha de factura</label>
              <input type="date" v-model="fecha_factura" class="form-control">
              <span class="text-danger" v-if="errors.n_factura">{{errors.n_factura[0]}}</span>
          </div>
        </div>
        <div class="row pt-4 d-flex justify-content-center">
            <div class="col-md-6">
                <label>N° de resolución factura</label>
                <input type="number" v-model="n_resolucion_factura" class="form-control" placeholder="Ingrese número de resolución">
                <span class="text-danger" v-if="errors.n_resolucion">{{errors.n_resolucion[0]}}</span>
            </div>
            <div class="col-md-6">
                <label>Fecha de resolución factura</label>
                <input type="date" v-model="fecha_resolucion_factura" class="form-control">
                <span class="text-danger" v-if="errors.n_factura">{{errors.n_factura[0]}}</span>
            </div>
        </div>
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-6">
              <label>Año académico</label>
              <input type="date" v-model="anio_academico" class="form-control">
              <span class="text-danger" v-if="errors.n_factura">{{errors.n_factura[0]}}</span>
          </div>
          <div class="col-md-6">
              <label>Año arancel/matricula</label><br>
              <el-select
                style="width: 380px;"
                :collapse-tags="true"
                v-model="anios_pago"
                multiple
                size="mini"
                placeholder="Seleccione años de arancel">
                <el-option
                    v-for="(anio, index) in anios"
                    :key="index"
                    :label="anio"
                    :value="anio">
                </el-option>
              </el-select>
              <span class="text-danger" v-if="errors.anios_pago">{{errors.anios_pago[0]}}</span>
          </div>
        </div>
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-6">
            <label>Monto total (CLP)</label>
            <input v-model="monto_total" type="number" class="form-control" placeholder="Monto total factura. (Monto sin puntos)">
            <span class="text-danger" v-if="errors.monto_total">{{errors.monto_total[0]}}</span>
          </div>
          <div class="col-md-6">
            <label>Tipo de factura</label><br>
            <el-select
                style="width: 380px;"
                v-model="tipo_factura"
                multiple
                size="mini"
                placeholder="Tipo de factura">
                  <el-option
                      v-for="(tipo, index) in tiposFacturas"
                      :key="index"
                      :label="tipo.nombre"
                      :value="tipo.id">
                  </el-option>
            </el-select>
            <span class="text-danger" v-if="errors.tipo_factura">{{errors.tipo_factura[0]}}</span>
          </div>
        </div>
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-6">
              <label class="required">Seleccione situación factura</label>
              <select v-model="situacion_factura" class="form-control">
                  <option value="" selected disabled>-- Seleccione situación --</option>
                  <option v-for="(situacion, index) in situacionesFactura" :key="index" :value="situacion.id">{{situacion.nombre}}</option>
              </select>
              <span class="text-danger" v-if="errors.situacion_factura_id">{{errors.situacion_factura_id[0]}}</span>
          </div>
          <div class="col-md-6">
              <label>Fecha de pago</label>
              <input type="date" v-model="fecha_pago" class="form-control">
              <span class="text-danger" v-if="errors.n_factura">{{errors.n_factura[0]}}</span>
          </div>
        </div>
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-6">
            <label class="required">Centro formador/Universidad</label>
            <select class="form-control" v-model="centro_formador" :disabled="factura.convenio.especialidad_id"> <!-- disable aqui qeude!!-->
                <option value="">-- Seleccione convenio --</option>
                <option v-for="(centro, index) in centrosFormadores" :key="index" :value="centro.id">{{centro.nombre}}</option>
            </select>
            <span class="text-danger" v-if="errors.centro_formador_id">{{errors.centro_formador_id[0]}}</span>
          </div>
          <div class="col-md-6">
              <label class="required">Red hospitalaria</label>
              <select class="form-control" v-model="red_hospitalaria">
                  <option value="" selected disabled>-- Seleccione red --</option>
                  <option v-for="(red, index) in redesHospitalariasUserAuth" :key="index" :value="red.id">{{red.nombre}}</option>
              </select>
              <span class="text-danger" v-if="errors.red_hospitalaria_id">{{errors.red_hospitalaria_id[0]}}</span>
          </div>
        </div>
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-6">
            <label>Tipo de contrato profesional</label>
            <select class="form-control" v-model="tipo_contrado">
                <option value="" selected disabled>-- Seleccione horas --</option>
                <option v-for="(hora, index) in tipoContratos" :key="index" :value="hora.id">{{hora.nombre}}</option>
            </select>
            <span class="text-danger" v-if="errors.tipo_contrado_id">{{errors.tipo_contrado_id[0]}}</span>
          </div>
          <div class="col-md-6">
              <label>Fecha vencimiento factura</label>
              <input type="date" v-model="fecha_vencimiento_factura" class="form-control">
              <span class="text-danger" v-if="errors.n_factura">{{errors.n_factura[0]}}</span>
          </div>
        </div>
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-6">
            <label>Envío finanzas</label><br>
            <input type="checkbox" v-model="envio_finanza"> <span>{{ factura.envio_finanza != true ? 'No' : 'Si' }}</span>
          </div>
          <div class="col-md-6">
              <label>Cargo al ítem</label>
              <input type="text" v-model="cargo_item" class="form-control" placeholder="Ingrese ítem">
              <span class="text-danger" v-if="errors.cargo_item">{{errors.cargo_item[0]}}</span>
          </div>
        </div>
      </section>
      <section v-if="factura_pasos === 3">
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-12">
            <label>Observaciones</label>
            <textarea v-model="observacion" style="resize:none;" cols="10" rows="6" class="form-control" placeholder="Ingrese observación..."></textarea>
          </div>
        </div>
      </section>
      <template #modal-footer>
        <div class="w-100">
            <button :disabled="factura_pasos == 0" @click.prevent="factura_pasos_volver" class="mt-3 btn btn-default float-left"><i class="fas fa-arrow-left"></i> Volver</button>
            <button v-show="factura_pasos != 3"  @click.prevent="factura_pasos_siguiente" class="mt-3 btn btn-primary float-right">Siguiente <i class="fas fa-arrow-right"></i></button>
            <button v-show="factura_pasos == 3" class="mt-3 btn btn-success float-right" @click.prevent="editarFactura" v-loading.fullscreen.lock="fullscreenLoading">Editar factura <i class="fas fa-plus"></i></button>
        </div>
    </template>
    </b-modal>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
export default {
  data(){
    return {
      factura_pasos:0,
      fullscreenLoading:false,
      errors:{}
    };
  },
  computed:{
    ...mapGetters({
      convenios:'documentos/convenios',
      situacionesFactura:'mantenedores/situacionesFactura',
      tiposFacturas:'mantenedores/tiposFactura',
      tipoContratos:'mantenedores/tipoContratos',
      redesHospitalariasUserAuth:'mantenedores/redesHospitalariasUserAuth',
      centrosFormadores:'mantenedores/centrosFormadores',
      anios:'mantenedores/anios',
    }),
    factura(){
      return this.$store.state.facturas.facturaEdit;
    },
    convenioSelect:{
      get(){
        return this.$store.state.facturas.facturaEdit.convenio_id;
      },
      set(id){
        let convenio = id != null ? this.convenios.find(c => c.id === id) : null;
        this.$store.commit('facturas/FACTURA_CONVENIO', convenio);
      }
    },
    n_resolucion_convenio:{
      get(){
        return this.$store.state.facturas.facturaEdit.n_resolucion_convenio;
      },
      set(newValue){
        this.$store.commit('facturas/FACTURA_N_RESOLUCION_CONVENIO', newValue);
      }
    },
    fecha_resolucion_convenio:{
      get(){
        return this.$store.state.facturas.facturaEdit.fecha_resolucion_convenio;
      },
      set(newValue){
        this.$store.commit('facturas/FACTURA_FECHA_RESOLUCION_CONVENIO', newValue);
      },
    },
    n_factura:{
      get(){
        return this.$store.state.facturas.facturaEdit.n_factura;
      },
      set(newValue){
        this.$store.commit('facturas/FACTURA_N_FACTURA', newValue);
      },
    },
    fecha_factura:{
      get(){
        return this.$store.state.facturas.facturaEdit.fecha_factura;
      },
      set(newValue){
        this.$store.commit('facturas/FACTURA_FECHA_FACTURA', newValue);
      },
    },
    n_resolucion_factura:{
      get(){
        return this.$store.state.facturas.facturaEdit.n_resolucion_factura;
      },
      set(newValue){
        this.$store.commit('facturas/FACTURA_N_RESOLUCION', newValue);
      },
    },
    fecha_resolucion_factura:{
      get(){
        return this.$store.state.facturas.facturaEdit.fecha_resolucion_factura;
      },
      set(newValue){
        this.$store.commit('facturas/FACTURA_FECHA_RESOLUCION', newValue);
      },
    },
    anio_academico:{
      get(){
        return this.$store.state.facturas.facturaEdit.anio_academico;
      },
      set(newValue){
        this.$store.commit('facturas/FACTURA_ANIO_ACADEMICO', newValue);
      },
    },
    anios_pago:{
      get(){
        return this.$store.state.facturas.facturaEdit.anios_pago;
      },
      set(newValue){
        this.$store.commit('facturas/FACTURA_ANIOS_PAGO', newValue);
      },
    },
    monto_total:{
      get(){
        return this.$store.state.facturas.facturaEdit.monto_total;
      },
      set(newValue){
        this.$store.commit('facturas/FACTURA_MONTO_TOTAL', newValue);
      },
    },
    tipo_factura:{
      get(){
        return this.$store.state.facturas.facturaEdit.tipo_factura;
      },
      set(newValue){
        this.$store.commit('facturas/FACTURA_TIPO_FACTURA', newValue);
      },
    },
    situacion_factura:{
      get(){
        return this.$store.state.facturas.facturaEdit.situacion_factura;
      },
      set(newValue){
        this.$store.commit('facturas/FACTURA_SITUACION', newValue);
      },
    },
    fecha_pago:{
      get(){
        return this.$store.state.facturas.facturaEdit.fecha_pago;
      },
      set(newValue){
        this.$store.commit('facturas/FACTURA_FECHA_PAGO', newValue);
      },
    },
    centro_formador:{
      get(){
        return this.$store.state.facturas.facturaEdit.centro_formador;
      },
      set(newValue){
        this.$store.commit('facturas/FACTURA_CENTRO_FORMADOR', newValue);
      },
    },
    red_hospitalaria:{
      get(){
        return this.$store.state.facturas.facturaEdit.red_hospitalaria;
      },
      set(newValue){
        this.$store.commit('facturas/FACTURA_RED_HOSPITALARIA', newValue);
      },
    },
    tipo_contrado:{
      get(){
        return this.$store.state.facturas.facturaEdit.tipo_contrado;
      },
      set(newValue){
        this.$store.commit('facturas/FACTURA_TIPO_CONTRATO', newValue);
      },
    },
    fecha_vencimiento_factura:{
      get(){
        return this.$store.state.facturas.facturaEdit.fecha_vencimiento_factura;
      },
      set(newValue){
        this.$store.commit('facturas/FACTURA_FECHA_VENCIMIENTO_FACTURA', newValue);
      },
    },
    envio_finanza:{
      get(){
        return this.$store.state.facturas.facturaEdit.envio_finanza;
      },
      set(newValue){
        this.$store.commit('facturas/FACTURA_ENVIO_FINANZA', newValue);
      },
    },
    cargo_item:{
      get(){
        return this.$store.state.facturas.facturaEdit.cargo_item;
      },
      set(newValue){
        this.$store.commit('facturas/FACTURA_CARGO_ITEM', newValue);
      },
    },
    observacion:{
      get(){
        return this.$store.state.facturas.facturaEdit.observacion;
      },
      set(newValue){
        this.$store.commit('facturas/FACTURA_OBSERVACION', newValue);
      },
    },
  },
  methods:{
    ...mapMutations({
      refresFacturaAction:'facturas/REFRESH_FACTURA'
    }),
    async editarFactura(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/profesionales/profesional/documentos/factura/edit-factura/${this.factura.uuid}`;
      const data = {
        n_resolucion: this.n_resolucion_factura,
        fecha_resolucion:this.fecha_resolucion_factura,
        n_resolucion_convenio:this.n_resolucion_convenio,
        fecha_convenio:this.fecha_resolucion_convenio,
        envio_finanza:this.envio_finanza,
        fecha_pago:this.fecha_pago,
        anio_academico:this.anio_academico,
        n_factura:this.n_factura,
        fecha_emision_factura:this.fecha_factura,
        fecha_vencimiento_factura:this.fecha_vencimiento_factura,
        cargo_item:this.cargo_item,
        anios_pago:this.anios_pago,
        monto_total:this.monto_total,
        tipo_contrado_id:this.tipo_contrado,
        situacion_factura_id:this.situacion_factura,
        convenio_id:this.convenioSelect != '' ? this.convenioSelect : '',
        red_hospitalaria_id:this.red_hospitalaria,
        tipo_factura:this.tipo_factura,
        centro_formador_id:this.centro_formador,
        observacion:this.observacion
      };

      await this.$axios.$put(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
            this.refresFacturaAction(response[1]);
            this.$message({
              message: 'Factura editada con éxito.',
              type: 'success'
            });
            this.clearAllModal();
          }else{
            this.$message.error("Error de servidor");
          }
      }).catch(error => {
        this.fullscreenLoading = !this.fullscreenLoading;
        this.errors = error.response.data.errors;
        if(this.errors.convenio_id){
          this.factura_pasos = 0;
        }else if (this.errors.n_resolucion || this.errors.fecha_resolucion){
          this.factura_pasos = 1;
        }else{
          this.factura_pasos = 2;
          }
        console.log(error);
      });
    },
    clearAllModal(){
      this.factura_pasos = 0;
      this.errors = {};
      this.$root.$emit('bv::hide::modal', 'modal-edit-factura', '#btnShow');
    },
    selectConvenio(){

    },
    factura_pasos_volver(){
        this.factura_pasos--;
    },
    factura_pasos_siguiente(){
        this.factura_pasos++;
    },
  }
}
</script>

<style>

</style>
