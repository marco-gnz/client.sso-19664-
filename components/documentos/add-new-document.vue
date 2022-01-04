<template>
  <div>
    <el-drawer
        :title="`Añadir documento`"
        :append-to-body="true"
        :visible.sync="documentValue">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
                <label>1. Seleccione tipo de documento</label>
                {{!$auth.user.permissions_roles.includes('ingresar-convenio')}}
                <select v-model="newDocument.tipo_documento" class="form-control" @change="selectTipoDoc">
                    <option :disabled="!$auth.user.permissions_roles.includes('ingresar-convenio') || !$auth.user.permissions.includes('ingresar-convenio')" :value="0">Convenio</option>
                    <option :disabled="!$auth.user.permissions_roles.includes('ingresar-escritura') || !$auth.user.permissions.includes('ingresar-escritura')" :value="1">Escritura pública</option>
                    <option :disabled="!$auth.user.permissions_roles.includes('ingresar-documento') || !$auth.user.permissions.includes('ingresar-documento')" :value="2">Genérico</option>
                </select>
            </div>
          </div>
          <section v-if="newDocument.tipo_documento != 2">
            <div class="row pt-lg-3">
              <div class="col-md-6">
                <label>2. Seleccione que tipo de formación</label>
                <select v-model="newDocument.tipo_formacion" class="form-control" @change="selectTiposFormacion">
                      <option value="" selected disabled>-- Seleccione tipo --</option>
                      <option v-for="(tipo_perfeccionamiento, index) in tipoPerfeccionamientos" :key="index" :value="tipo_perfeccionamiento.id">{{tipo_perfeccionamiento.nombre}}</option>
                  </select>
              </div>
              <div class="col-md-6">
                  <label>3. Seleccione formación</label>
                  <select :disabled="newDocument.tipo_formacion === '' || perfeccionamientos.length === 0" v-model="newDocument.formacion" class="form-control" @change="getAnios">
                      <option value="" selected disabled>-- Seleccione formación --</option>
                      <option v-for="(perfeccionamiento, index) in perfeccionamientos" :key="index" :value="perfeccionamiento.id">{{perfeccionamiento.perfeccionamiento.nombre}} - {{perfeccionamiento.origen}}</option>
                  </select>
                  <span class="pt-2" v-if="newDocument.tipo_formacion != '' && perfeccionamientos.length == 0"><i>Profesional sin registros</i></span>
                  <span class="text-danger" v-if="errors.especialidad_id">{{errors.especialidad_id[0]}}</span>
              </div>
            </div>
          </section>
          <section v-if="newDocument.tipo_documento === 0">
            <div class="row pt-lg-3">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-6">
                    <label>4. Seleccione año de arancel</label>
                    <el-select
                    :disabled="newDocument.formacion === '' || anios.length === 0"
                    v-model="convenio.anio_arancel"
                      multiple
                      collapse-tags
                      size="mini"
                      placeholder="Seleccione años de arancel">
                      <el-option
                          v-for="(anio, index) in anios"
                          :key="index"
                          :label="anio"
                          :value="anio">
                      </el-option>
                    </el-select>
                    <span class="text-danger" v-if="errors.anio_arancel">{{errors.anio_arancel[0]}}</span>
                  </div>
                  <div class="col-md-6">
                      <label>5. Arancel en pesos <i>(Sin puntos)</i></label>
                      <input v-model="convenio.valor_arancel" type="number" class="form-control" placeholder="Ingrese arancel">
                      <span class="text-danger" v-if="errors.valor_arancel">{{errors.valor_arancel[0]}}</span>
                  </div>
                </div>
                <div class="row pt-lg-3">
                    <div class="col-md-6">
                        <label>6. N° de resolución</label>
                        <input v-model="convenio.n_resolucion" type="number" class="form-control" placeholder="Ingrese n° de resolución">
                        <span class="text-danger" v-if="errors.n_resolucion">{{errors.n_resolucion[0]}}</span>
                    </div>
                    <div class="col-md-6">
                        <label>7. Fecha de resolución</label>
                        <el-date-picker
                            v-model="convenio.fecha_resolucion"
                            format="dd-MM-yyyy"
                            value-format="yyyy-MM-dd"
                            size="mini"
                            placeholder="Seleccione fecha">
                        </el-date-picker>
                        <span class="text-danger" v-if="errors.fecha_resolucion">{{errors.fecha_resolucion[0]}}</span>
                    </div>
                </div>
                <div class="row pt-lg-3">
                    <div class="col-md-12">
                        <label>8. Ingrese observación <i>(Opcional)</i></label>
                        <textarea cols="10" rows="5" class="form-control" placeholder="Ingrese observación..." v-model="convenio.observacion"></textarea>
                    </div>
                </div>
                <div class="row pt-lg-3">
                    <div class="col-md-12">
                        <el-button
                            :disabled="!$auth.user.permissions_roles.includes('ingresar-convenio') || !$auth.user.permissions.includes('ingresar-convenio')"
                            size="mini"
                            type="primary"
                            class="mt-3 btn btn-primary float-lg-right"
                            @click="addConvenio"
                            v-loading.fullscreen.lock="fullscreenLoading">
                            Añadir convenio
                        </el-button>
                    </div>
                </div>
              </div>
            </div>
          </section>
          <section v-if="newDocument.tipo_documento === 1">
            <div class="row pt-lg-3">
              <div class="col-md-12">
                <div class="row">
                    <div class="col-md-6">
                        <label>4. ¿Escritura firmada?</label><br>
                        <el-checkbox class="ml-lg-5" v-model="escritura.escritura_firmada">{{ (escritura.escritura_firmada != '') ? 'Si' : 'No' }}</el-checkbox>
                        <span class="text-danger" v-if="errors.escritura_firmada">{{errors.escritura_firmada[0]}}</span>
                    </div>
                    <div class="col-md-6">
                        <label>5. Monto de garantía <i>(UF)</i></label>
                        <input v-model="escritura.monto_garantia" type="number" class="form-control" placeholder="Ingrese monto garantía">
                        <span class="text-danger" v-if="errors.valor_garantia">{{errors.valor_garantia[0]}}</span>
                    </div>
                </div>
                <div class="row pt-lg-3">
                    <div class="col-md-6">
                        <label>6. N° de resolución</label>
                        <input v-model="escritura.n_resolucion" type="number" class="form-control" placeholder="Ingrese n° de resolución">
                        <span class="text-danger" v-if="errors.n_resolucion">{{errors.n_resolucion[0]}}</span>
                    </div>
                    <div class="col-md-6">
                        <label>7. Año de resolución</label>
                        <el-date-picker
                            v-model="escritura.fecha_resolucion"
                            format="dd-MM-yyyy"
                            value-format="yyyy-MM-dd"
                            size="mini"
                            placeholder="Seleccione fecha">
                        </el-date-picker>
                        <span class="text-danger" v-if="errors.fecha_resolucion">{{errors.fecha_resolucion[0]}}</span>
                    </div>
                </div>
                <div class="row pt-lg-3">
                    <div class="col-md-12">
                        <label>8. Ingrese observación <i>(Opcional)</i></label>
                        <textarea cols="10" rows="5" class="form-control" placeholder="Ingrese observación..." v-model="escritura.observacion"></textarea>
                    </div>
                </div>
                <div class="row pt-lg-3">
                    <div class="col-md-12">
                        <el-button
                            :disabled="!$auth.user.permissions_roles.includes('ingresar-escritura') || !$auth.user.permissions.includes('ingresar-escritura')"
                            size="mini"
                            type="primary"
                            class="mt-3 btn btn-primary float-lg-right"
                            @click="addEscritura"
                            v-loading.fullscreen.lock="fullscreenLoading">
                            Añadir escritura
                        </el-button>
                    </div>
                </div>
              </div>
            </div>
          </section>
          <section v-if="newDocument.tipo_documento === 2">
            <div class="row pt-lg-3">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-12">
                    <label>2. Seleccione tipo de documentación</label>
                    <select v-model="otroDoc.tipo" class="form-control">
                      <option value="" selected disabled>-- Seleccione tipo --</option>
                      <option v-for="(tipoDoc, index) in tipoDocumentos" :key="index" :value="tipoDoc.id">{{tipoDoc.nombre}}</option>
                  </select>
                  <span class="text-danger" v-if="errors.tipo_documento_id">{{errors.tipo_documento_id[0]}}</span>
                  </div>
                </div>
                <div class="row pt-lg-3">
                  <div class="col-md-6">
                    <label>3. N° de resolución/documento</label>
                    <input v-model="otroDoc.n_documento" type="number" class="form-control" placeholder="Ingrese n° de resolución">
                    <span class="text-danger" v-if="errors.n_documento">{{errors.n_documento[0]}}</span>
                  </div>
                  <div class="col-md-6">
                    <label>4. Fecha resolución/documento</label>
                    <el-date-picker
                        v-model="otroDoc.fecha_documento"
                        format="dd-MM-yyyy"
                        value-format="yyyy-MM-dd"
                        size="mini"
                        placeholder="Seleccione fecha">
                    </el-date-picker>
                    <span class="text-danger" v-if="errors.fecha_documento">{{errors.fecha_documento[0]}}</span>
                  </div>
                </div>
                <div class="row pt-lg-3">
                  <div class="col-md-12">
                      <label>8. Ingrese observación <i>(Opcional)</i></label>
                      <textarea cols="10" rows="5" class="form-control" placeholder="Ingrese observación..." v-model="otroDoc.observacion"></textarea>
                      <span class="text-danger" v-if="errors.observacion">{{errors.observacion[0]}}</span>
                  </div>
                </div>
                <div class="row pt-lg-3">
                    <div class="col-md-12">
                        <el-button
                            :disabled="!$auth.user.permissions_roles.includes('ingresar-documento') || !$auth.user.permissions.includes('ingresar-documento')"
                            size="mini"
                            type="primary"
                            class="mt-3 btn btn-primary float-lg-right"
                            @click="addDocumentoGenerico"
                            v-loading.fullscreen.lock="fullscreenLoading">
                            Añadir documento
                        </el-button>
                    </div>
                </div>
              </div>
            </div>
          </section>
        </div>
    </el-drawer>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';
export default {
data(){
  return{
    fullscreenLoading:false,
    newDocument:{
      tipo_formacion:'',
      formacion:'',
      tipo_documento:0
    },
    convenio:{
      anio_arancel:'',
      valor_arancel:'',
      n_resolucion:'',
      fecha_resolucion:'',
      observacion:''
    },
    escritura:{
      escritura_firmada:false,
      monto_garantia:'',
      n_resolucion:'',
      fecha_resolucion:'',
      observacion:''
    },
    otroDoc:{
      tipo:'',
      n_documento:'',
      fecha_documento:'',
      observacion:''
    },
    anios:[],
    perfeccionamientos:[],
    errors:{}
  };
},
mounted(){
  this.getTipoPerfeccionamientos();
  this.getTipoDocumentos();
},
computed:{
    documentValue:{
      get() {
        return this.$store.getters['documentos/drawerStatus']
      },
      set(value) {
        this.$store.dispatch('documentos/updateDrawer')
      }
    },
    ...mapGetters({
      tipoPerfeccionamientos:'mantenedores/tipoPerfeccionamientos',
      tipoDocumentos:'mantenedores/tipoDocumentos'
    })
  },
  methods:{
    ...mapMutations({
      addNewConvenio:'documentos/ADD_CONVENIO',
      addNewEscritura:'documentos/ADD_ESCRITURA',
      addNewDocumentoGenerico:'documentos/ADD_DOCUMENTO_GENERICO'
    }),
    ...mapActions({
      getTipoPerfeccionamientos:'mantenedores/getTipoPerfeccionamientos',
      open: "documentos/updateDrawer",
      getTipoDocumentos:'mantenedores/getTipoDocumentos'
    }),
    async selectTiposFormacion(){
      const url = '/api/profesionales/profesional/get-formaciones-doc';
      const data = {
        uuid: this.$route.params.id,
        tipo: this.newDocument.tipo_formacion
      };

      await this.$axios.$get(url, {params:data}).then(response => {
        if(response.length > 0){
          this.perfeccionamientos = response;
        }else{
          this.perfeccionamientos = [];
          this.newDocument.formacion = '';
        }
      }).catch(error => {
        console.log(error);
      });
    },
    async getAnios(){
        const url = '/api/profesionales/profesional/get-formaciones-doc/anios';
        const data = {especialidad_id:this.newDocument.formacion};

        await this.$axios.$get(url, {params:data}).then(response => {
          if(response.length){
            this.anios = response;
          }else{
            this.anios = [];
            this.newDocument.anios = '';
          }
        }).catch(error => {
          console.log(error);
        });
    },
    async addConvenio(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = '/api/profesionales/profesional/documentos/add-convenio';
      const data = {
        anios_arancel: this.convenio.anio_arancel,
        valor_arancel:parseInt(this.convenio.valor_arancel),
        n_resolucion:this.convenio.n_resolucion,
        fecha_resolucion:this.convenio.fecha_resolucion,
        observacion:this.convenio.observacion,
        especialidad_id:this.newDocument.formacion
      };

      await this.$axios.$post(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        console.log(response);
        if(response[0] === true){
          this.addNewConvenio(response[1]);
          this.$notify({
              message: 'Convenio ingresado con éxito.',
              type: 'success'
          });
          this.open();
          this.clearAllModal();
        }else{
          this.$message.error("Error de servidor");
        }
      }).catch(error => {
        this.fullscreenLoading = !this.fullscreenLoading;
        console.log(error);
        this.errors = error.response.data.errors;
      });
    },
    async addEscritura(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = '/api/profesionales/profesional/documentos/add-escritura';
      const data = {
        especialidad_id: this.newDocument.formacion,
        escritura_firmada: this.escritura.escritura_firmada,
        valor_garantia: parseInt(this.escritura.monto_garantia),
        n_resolucion: parseInt(this.escritura.n_resolucion),
        fecha_resolucion: this.escritura.fecha_resolucion,
        observacion: this.escritura.observacion
      };
      await this.$axios.$post(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.clearAllModal();
          this.addNewEscritura(response[1]);
          this.open();
          this.$notify({
              message: 'Escritura ingresada con éxito.',
              type: 'success'
          });
        }else{
          this.$message.error("Error de servidor");
        }
      }).catch(error => {
        this.fullscreenLoading = !this.fullscreenLoading;
        console.log(error);
        this.errors = error.response.data.errors;
      });
    },
    async addDocumentoGenerico(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = '/api/profesionales/profesional/documentos/generico/add-doc-generico';
      const data = {
        profesional_uuid:this.$route.params.id,
        tipo_documento_id:this.otroDoc.tipo,
        n_documento:this.otroDoc.n_documento,
        fecha_documento:this.otroDoc.fecha_documento,
        observacion:this.otroDoc.observacion
      };

      await this.$axios.$post(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.addNewDocumentoGenerico(response[1]);
          this.clearAllModal();
          this.open();
          this.$notify({
              message: 'Documento ingresado con éxito.',
              type: 'success'
          });
        }else{
          this.$message.error("Error de servidor");
        }
      }).catch(error => {
        this.fullscreenLoading = !this.fullscreenLoading;
        this.errors = error.response.data.errors;
        console.log(error);
      });
    },
    clearAllModal(){
      for(let key in this.convenio){
        this.convenio[key] = '';
      }
      for(let key in this.escritura){
        this.escritura[key] = '';
      }
      for(let key in this.newDocument){
        this.newDocument[key] = '';
      }
      this.newDocument.tipo_documento = 0;
      this.errors = {};
    },
    selectTipoDoc(){

    }
  }
}
</script>

<style>

</style>
