<template>
  <div>
    <b-modal id="modal-add-factura" size="lg" title="Agregar factura" scrollable ok-only>
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
             <select class="form-control" v-model="factura.convenio" @change="selectConvenio">
                  <option value="">-- Seleccione convenio --</option>
                  <option v-for="(convenio, index) in convenios" :key="index" :value="convenio">{{convenio.n_resolucion}}/{{ DateTime.fromISO(convenio.fecha_resolucion).toFormat('dd-LL-yyyy')}} - {{ (convenio.especialidad != null) ? convenio.especialidad.centro_formador.nombre : '' }} - {{ (convenio.tipo != null) ? convenio.tipo.nombre : 'sin tipo' }}</option>
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
              <input :disabled="factura.convenio" type="number" v-model="factura.n_resolucion_convenio" class="form-control" placeholder="Ingrese número de resolución convenio">
              <span class="text-danger" v-if="errors.n_resolucion">{{errors.n_resolucion[0]}}</span>
          </div>
          <div class="col-md-4">
              <label>Fecha resolución convenio</label>
              <input :disabled="factura.convenio" type="date" v-model="factura.fecha_resolucion_convenio" class="form-control">
              <span class="text-danger" v-if="errors.fecha_resolucion">{{errors.fecha_resolucion[0]}}</span>
          </div>
        </div>
      </section>
      <section v-if="factura_pasos === 2">
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-6">
              <label>N° de factura</label>
              <input type="number" v-model="factura.n_factura" class="form-control" placeholder="Ingrese número de factura">
              <span class="text-danger" v-if="errors.n_factura">{{errors.n_factura[0]}}</span>
          </div>
          <div class="col-md-6">
              <label>Fecha de factura</label>
              <input type="date" v-model="factura.fecha_factura" class="form-control">
              <span class="text-danger" v-if="errors.n_factura">{{errors.n_factura[0]}}</span>
          </div>
        </div>
        <div class="row pt-4 d-flex justify-content-center">
            <div class="col-md-6">
                <label>N° de resolución factura</label>
                <input type="number" v-model="factura.n_resolucion_factura" class="form-control" placeholder="Ingrese número de resolución">
                <span class="text-danger" v-if="errors.n_resolucion">{{errors.n_resolucion[0]}}</span>
            </div>
            <div class="col-md-6">
                <label>Fecha de resolución factura</label>
                {{factura.fecha_resolucion_factura}}
                <input type="date" v-model="factura.fecha_resolucion_factura" class="form-control">
                <span class="text-danger" v-if="errors.n_factura">{{errors.n_factura[0]}}</span>
            </div>
        </div>
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-6">
              <label>Año académico</label>
              <input type="date" v-model="factura.anio_academico" class="form-control">
              <span class="text-danger" v-if="errors.n_factura">{{errors.n_factura[0]}}</span>
          </div>
          <div class="col-md-6">
              <label>Año arancel/matricula</label><br>
              <el-select
                style="width: 380px;"
                :collapse-tags="true"
                v-model="factura.anios_pago"
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
            <input v-model="factura.monto_total" type="number" class="form-control" placeholder="Monto total factura. (Monto sin puntos)">
            <span class="text-danger" v-if="errors.monto_total">{{errors.monto_total[0]}}</span>
          </div>
          <div class="col-md-6">
            <label>Tipo de factura</label><br>
            <el-select
                style="width: 380px;"
                v-model="factura.tipo_factura"
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
              <select v-model="factura.situacion_factura" class="form-control">
                  <option value="" selected disabled>-- Seleccione situación --</option>
                  <option v-for="(situacion, index) in situacionesFactura" :key="index" :value="situacion.id">{{situacion.nombre}}</option>
              </select>
              <span class="text-danger" v-if="errors.situacion_factura_id">{{errors.situacion_factura_id[0]}}</span>
          </div>
          <div class="col-md-6">
              <label>Fecha de pago</label>
              <input type="date" v-model="factura.fecha_pago" class="form-control">
              <span class="text-danger" v-if="errors.n_factura">{{errors.n_factura[0]}}</span>
          </div>
        </div>
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-6">
            <label class="required">Centro formador/Universidad</label>
            <select class="form-control" v-model="factura.centro_formador" :disabled="factura.convenio.especialidad">
                <option value="">-- Seleccione convenio --</option>
                <option v-for="(centro, index) in centrosFormadores" :key="index" :value="centro.id">{{centro.nombre}}</option>
            </select>
            <span class="text-danger" v-if="errors.centro_formador_id">{{errors.centro_formador_id[0]}}</span>
          </div>
          <div class="col-md-6">
              <label class="required">Red hospitalaria</label>
              <select class="form-control" v-model="factura.red_hospitalaria">
                  <option value="" selected disabled>-- Seleccione red --</option>
                  <option v-for="(red, index) in redesHospitalariasUserAuth" :key="index" :value="red.id">{{red.nombre}}</option>
              </select>
              <span class="text-danger" v-if="errors.red_hospitalaria_id">{{errors.red_hospitalaria_id[0]}}</span>
          </div>
        </div>
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-6">
            <label>Tipo de contrato profesional</label>
            <select class="form-control" v-model="factura.tipo_contrado">
                <option value="" selected disabled>-- Seleccione horas --</option>
                <option v-for="(hora, index) in tipoContratos" :key="index" :value="hora.id">{{hora.nombre}}</option>
            </select>
            <span class="text-danger" v-if="errors.tipo_contrado_id">{{errors.tipo_contrado_id[0]}}</span>
          </div>
          <div class="col-md-6">
              <label>Fecha vencimiento factura</label>
              <input type="date" v-model="factura.fecha_vencimiento_factura" class="form-control">
              <span class="text-danger" v-if="errors.n_factura">{{errors.n_factura[0]}}</span>
          </div>
        </div>
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-6">
            <label>Envío finanzas</label><br>
            <input type="checkbox" v-model="factura.envio_finanza"> <span>{{ factura.envio_finanza != true ? 'No' : 'Si' }}</span>
          </div>
          <div class="col-md-6">
              <label>Cargo al ítem</label>
              <input type="text" v-model="factura.cargo_item" class="form-control" placeholder="Ingrese ítem">
              <span class="text-danger" v-if="errors.cargo_item">{{errors.cargo_item[0]}}</span>
          </div>
        </div>
      </section>
      <section v-if="factura_pasos === 3">
        <div class="row pt-4 d-flex justify-content-center">
          <div class="col-md-12">
            <label>Observaciones</label>
            <textarea v-model="factura.observacion" style="resize:none;" cols="10" rows="6" class="form-control" placeholder="Ingrese observación..."></textarea>
          </div>
        </div>
      </section>
    <template #modal-footer>
        <div class="w-100">
            <button :disabled="factura_pasos == 0" @click.prevent="factura_pasos_volver" class="mt-3 btn btn-default float-left"><i class="fas fa-arrow-left"></i> Volver</button>
            <button v-show="factura_pasos != 3"  @click.prevent="factura_pasos_siguiente" class="mt-3 btn btn-primary float-right">Siguiente <i class="fas fa-arrow-right"></i></button>
            <button v-show="factura_pasos == 3" class="mt-3 btn btn-success float-right" @click.prevent="addFactura" v-loading.fullscreen.lock="fullscreenLoading">Añadir factura <i class="fas fa-plus"></i></button>
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
      fullscreenLoading:false,
      factura_pasos:0,
      factura:{
        convenio:'',
        centro_formador:'',
        n_resolucion_convenio:'',
        fecha_resolucion_convenio:'',
        n_factura:'',
        fecha_factura:'',
        anios_pago:'',
        anio_academico:'',
        n_resolucion_factura:'',
        fecha_resolucion_factura:'',
        monto_total:'',
        tipo_factura:'',
        situacion_factura:'',
        fecha_pago:'',
        cargo_item:'',
        red_hospitalaria:'',
        tipo_contrado:'',
        envio_finanza:false,
        fecha_vencimiento_factura:'',
        observacion:''
      },
      errors:{}
    };
  },
  mounted(){
      this.getSituacionesFactura();
      this.getTiposFactura();
      this.getTipoContratos();
      this.getRedesHospitalariasUserAuth();
      this.getAnios();
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
  },
  methods:{
    ...mapMutations({
      addFacturaAction:'facturas/ADD_FACTURA'
    }),
    ...mapActions({
      getSituacionesFactura:'mantenedores/getSituacionesFactura',
      getTiposFactura:'mantenedores/getTiposFactura',
      getTipoContratos:'mantenedores/getTipoContratos',
      getRedesHospitalariasUserAuth:'mantenedores/getRedesHospitalariasUserAuth',
      getAnios:'mantenedores/getAnios'
    }),
    selectConvenio(){
      if(this.factura.convenio){
        this.factura.n_resolucion_convenio      = this.factura.convenio != '' ? this.factura.convenio.n_resolucion : '';
        this.factura.fecha_resolucion_convenio  = this.factura.convenio != '' ? this.factura.convenio.fecha_resolucion : '';
        this.factura.centro_formador            = this.factura.convenio != '' ? this.factura.convenio.especialidad != null ? this.factura.convenio.especialidad.centro_formador.id : '' : '';
      }
    },
    async addFactura(){
      try {
        this.fullscreenLoading = !this.fullscreenLoading;
        const url = '/api/profesionales/profesional/documentos/factura/add-factura';

        const data = {
          profesional_uuid:this.$route.params.id,
          n_resolucion: this.factura.n_resolucion_factura,
          fecha_resolucion:this.factura.fecha_resolucion_factura,
          n_resolucion_convenio:this.factura.n_resolucion_convenio,
          fecha_convenio:this.factura.fecha_resolucion_convenio,
          envio_finanza:this.factura.envio_finanza,
          fecha_pago:this.factura.fecha_pago,
          anio_academico:this.factura.anio_academico,
          n_factura:this.factura.n_factura,
          fecha_emision_factura:this.factura.fecha_factura,
          fecha_vencimiento_factura:this.factura.fecha_vencimiento_factura,
          cargo_item:this.factura.cargo_item,
          anios_pago:this.factura.anios_pago,
          monto_total:this.factura.monto_total,
          tipo_contrado_id:this.factura.tipo_contrado,
          situacion_factura_id:this.factura.situacion_factura,
          convenio_id:this.factura.convenio != '' ? this.factura.convenio.id : '',
          red_hospitalaria_id:this.factura.red_hospitalaria,
          tipo_factura:this.factura.tipo_factura,
          centro_formador_id:this.factura.centro_formador,
          observacion:this.factura.observacion
        };

        this.$axios.$post(url, data).then(response => {
          console.log(response);
          this.fullscreenLoading = !this.fullscreenLoading;
          if(response[0] === true){
            this.addFacturaAction(response[1]);
            this.$message({
              message: 'Factura ingresada con éxito.',
              type: 'success'
            });
            this.clearAllModal();
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
        });
      } catch (error) {
        this.fullscreenLoading = !this.fullscreenLoading;
        console.log(error);
      }
    },
    clearAllModal(){
      for(let key in this.factura){
        this.factura[key] = '';
      }
      this.factura.envio_finanza = false;
      this.factura_pasos = 0;
      this.$root.$emit('bv::hide::modal', 'modal-add-factura', '#btnShow');
      this.errors = {};
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
