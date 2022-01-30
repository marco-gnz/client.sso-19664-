<template>
  <div>
    <el-drawer
    :title="`Editar documento`"
        :append-to-body="true"
        :visible.sync="documentValueEdit">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
            <label>1. Seleccione tipo de documento</label>
            <select v-model="tipoDocumento" disabled class="form-control" @change="selectTipoDoc">
                <option :disabled="!$auth.user.permissions_roles.includes('editar-convenio') || !$auth.user.permissions.includes('editar-convenio')"  :value="0">Convenio</option>
                <option :disabled="!$auth.user.permissions_roles.includes('editar-escritura') || !$auth.user.permissions.includes('editar-escritura')" :value="1">Escritura pública</option>
                <option :disabled="!$auth.user.permissions_roles.includes('editar-documento') || !$auth.user.permissions.includes('editar-documento')" :value="2">Genérico</option>
            </select>
        </div>
      </div>
      <section v-if="documentEdit.tipo_documento != 2">
        <div class="row pt-lg-3">
          <div class="col-md-6">
            <label>2. Tipo de formación</label>
            <select v-model="documentEdit.tipo_formacion" class="form-control" @change="changeTipoFormacion">
                  <option value="" selected disabled>-- Seleccione tipo --</option>
                  <option v-for="(tipo_perfeccionamiento, index) in tipoPerfeccionamientos" :key="index" :value="tipo_perfeccionamiento.id">{{tipo_perfeccionamiento.nombre}}</option>
              </select>
          </div>
          <div class="col-md-6">
              <label>3. Seleccione formación</label>
              <select :disabled="documentEdit.tipo_formacion === '' || perfeccionamientos.length === 0" v-model="documentEdit.formacion" class="form-control">
                  <option value="" selected disabled>-- Seleccione formación --</option>
                  <option v-for="(perfeccionamiento, index) in perfeccionamientos" :key="index" :value="perfeccionamiento.id">{{perfeccionamiento.perfeccionamiento.nombre}} - {{perfeccionamiento.origen}}</option>
              </select>
              <span class="pt-2" v-show="documentEdit.tipo_formacion != '' && perfeccionamientos.length == 0"><i>Profesional sin registros</i></span>
              <span class="text-danger" v-if="errors.especialidad_id">{{errors.especialidad_id[0]}}</span>
          </div>
        </div>
      </section>
      <section v-if="documentEdit.tipo_documento === 0">
        <div class="row pt-lg-3">
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-12">
                <label>4. Seleccione tipo de convenio</label>
                <select v-model="tipoConvenio" class="form-control">
                  <option value="" selected disabled>-- Seleccione tipo de convenio --</option>
                  <option v-for="(tipo, index) in tipoConvenios" :key="index" :value="tipo.id">{{tipo.nombre}}</option>
                </select>
                <span class="text-danger" v-if="errors.tipo_convenio_id">{{errors.tipo_convenio_id[0]}}</span>
              </div>
            </div>
            <div class="row pt-lg-3">
              <div class="col-md-6">
                <label>5. Seleccione año de arancel</label>
                <el-select
                :disabled="documentEdit.formacion === '' || anios.length === 0"
                  v-model="aniosArancel"
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
                <span class="text-danger" v-if="errors.anios_arancel">{{errors.anios_arancel[0]}}</span>
              </div>
              <div class="col-md-6">
                  <label>6. Arancel en pesos <i>(Sin puntos)</i></label>
                  <input v-model="convenioEdit.valor_arancel" type="number" class="form-control" placeholder="Ingrese arancel">
                  <span class="text-danger" v-if="errors.valor_arancel">{{errors.valor_arancel[0]}}</span>
              </div>
            </div>
            <div class="row pt-lg-3">
                <div class="col-md-6">
                    <label>7. N° de resolución</label>
                    <input v-model="convenioEdit.n_resolucion" type="number" class="form-control" placeholder="Ingrese n° de resolución">
                    <span class="text-danger" v-if="errors.n_resolucion">{{errors.n_resolucion[0]}}</span>
                </div>
                <div class="col-md-6">
                    <label>8. Fecha de resolución</label>
                    <el-date-picker
                        v-model="fechaResolucionConvenio"
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
                    <label>9. Ingrese observación <i>(Opcional)</i></label>
                    <textarea cols="10" rows="5" class="form-control" placeholder="Ingrese observación..." v-model="convenioEdit.observacion"></textarea>
                </div>
            </div>
            <div class="row pt-lg-3">
                <div class="col-md-12">
                    <el-button
                        v-if="$auth.user.permissions_roles.includes('editar-convenio') || $auth.user.permissions.includes('editar-convenio')"
                        size="mini"
                        type="primary"
                        class="mt-3 btn btn-primary float-lg-right"
                        @click="editConvenio"
                        v-loading.fullscreen.lock="fullscreenLoading">
                        Editar convenio
                    </el-button>
                </div>
            </div>
          </div>
        </div>
      </section>
      <section v-if="documentEdit.tipo_documento === 1">
        <div class="row pt-lg-3">
          <div class="col-md-12">
            <div class="row">
                <div class="col-md-6">
                    <label>4. ¿Escritura firmada?</label><br>
                    <el-checkbox class="ml-lg-5" v-model="escrituraFirmada">{{ (escrituraFirmada != false) ? 'Si' : 'No' }}</el-checkbox>
                    <span class="text-danger" v-if="errors.escritura_firmada">{{errors.escritura_firmada[0]}}</span>
                </div>
                <div class="col-md-6">
                    <label>5. Monto de garantía <i>(UF)</i></label>
                    <input v-model="escrituraEdit.monto_garantia" type="number" class="form-control" placeholder="Ingrese monto garantía">
                    <span class="text-danger" v-if="errors.valor_garantia">{{errors.valor_garantia[0]}}</span>
                </div>
            </div>
            <div class="row pt-lg-3">
                <div class="col-md-6">
                    <label>6. N° de resolución</label>
                    <input v-model="escrituraEdit.n_resolucion" type="number" class="form-control" placeholder="Ingrese n° de resolución">
                    <span class="text-danger" v-if="errors.n_resolucion">{{errors.n_resolucion[0]}}</span>
                </div>
                <div class="col-md-6">
                    <label>7. Año de resolución</label>
                    <el-date-picker
                        v-model="fechaResolucion"
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
                    <textarea cols="10" rows="5" class="form-control" placeholder="Ingrese observación..." v-model="escrituraEdit.observacion"></textarea>
                </div>
            </div>
            <div class="row pt-lg-3">
                <div class="col-md-12">
                    <el-button
                        v-if="$auth.user.permissions_roles.includes('editar-escritura') || $auth.user.permissions.includes('editar-escritura')"
                        size="mini"
                        type="primary"
                        class="mt-3 btn btn-primary float-lg-right"
                        @click="editEscritura"
                        v-loading.fullscreen.lock="fullscreenLoading">
                        Editar escritura
                    </el-button>
                </div>
            </div>
          </div>
        </div>
      </section>
      <section v-if="documentEdit.tipo_documento === 2">
        <div class="row pt-lg-3">
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-12">
                    <label>2. Seleccione tipo de documentación</label>
                    <select v-model="tipoDocumentoGenerico" class="form-control">
                        <option value="" selected disabled>-- Seleccione tipo --</option>
                        <option v-for="(tipoDoc, index) in tipoDocumentos" :key="index" :value="tipoDoc.id">{{tipoDoc.nombre}}</option>
                    </select>
                  </div>
                </div>
                <div class="row pt-lg-3">
                  <div class="col-md-6">
                    <label>3. N° de resolución/documento</label>
                    <input v-model="docGenericoEdit.n_documento" type="number" class="form-control" placeholder="Ingrese n° de resolución">
                    <span class="text-danger" v-if="errors.n_documento">{{errors.n_documento[0]}}</span>
                  </div>
                  <div class="col-md-6">
                    <label>4. Fecha resolución/documento</label>
                    <el-date-picker
                        v-model="fechaDocumentoGenerico"
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
                      <textarea cols="10" rows="5" class="form-control" placeholder="Ingrese observación..." v-model="docGenericoEdit.observacion"></textarea>
                      <span class="text-danger" v-if="errors.observacion">{{errors.observacion[0]}}</span>
                  </div>
                </div>
                <div class="row pt-lg-3">
                    <div class="col-md-12">
                        <el-button
                            v-if="$auth.user.permissions_roles.includes('editar-documento') || $auth.user.permissions.includes('editar-documento')"
                            size="mini"
                            type="primary"
                            class="mt-3 btn btn-primary float-lg-right"
                            @click="editDocument"
                            v-loading.fullscreen.lock="fullscreenLoading">
                            Editar documento
                        </el-button>
                    </div>
                </div>
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
      errors:{}
    };
  },
  mounted(){
    this.getTipoPerfeccionamientos();
    this.getTipoDocumentos();
    this.selectTipoDoc();
  },
  computed:{
    ...mapGetters({
      tipoPerfeccionamientos:'mantenedores/tipoPerfeccionamientos',
      perfeccionamientos:'documentos/formaciones',
      anios:'documentos/anios',
      tipoDocumentos:'mantenedores/tipoDocumentos',
      tipoConvenios:'mantenedores/tipoConvenios'
    }),
    documentValueEdit:{
      get() {
        return this.$store.getters['documentos/drawerStatusEdit']
      },
      set(value) {
        this.$store.dispatch('documentos/updateDrawerEdit')
      }
    },
    tipoDocumento:{
      get() {
        return this.$store.state.documentos.newDocument.tipo_documento;
      },
      set(newValue) {
        this.$store.commit('documentos/TIPO_DOCUMENTO', newValue);
      }
    },
    //convenio
    aniosArancel:{
      get (){
        return this.$store.state.documentos.convenio.anios_arancel;
      },
      set (newValue){
        this.$store.commit('documentos/ANIOS_ARANCEL', newValue);
      }
    },
    tipoConvenio:{
      get (){
        return this.$store.state.documentos.convenio.tipo;
      },
      set (newValue){
        this.$store.commit('documentos/TIPO_CONVENIO', newValue);
      }
    },
    fechaResolucionConvenio:{
      get(){
        return this.$store.state.documentos.convenio.fecha_resolucion;
      },
      set (newValue){
        this.$store.commit('documentos/FECHA_RESOLUCION_CONVENIO', newValue);
      }
    },


    //escritura
    fechaResolucion:{
      get(){
        return this.$store.state.documentos.escritura.fecha_resolucion;
      },
      set(newValue){
        this.$store.commit('documentos/FECHA_RESOLUCION', newValue);
      }
    },
    escrituraFirmada:{
      get() {
        return this.$store.getters['documentos/escrituraFirmada']
      },
      set() {
        this.$store.dispatch('documentos/updateEscrituraFirmada')
      }
    },

    //doc genérico
    tipoDocumentoGenerico:{
      get(){
        return this.$store.state.documentos.generico.tipo;
      },
      set (newValue){
        this.$store.commit('documentos/TIPO_DOCUMENTO_GENERICO', newValue);
      }
    },
    fechaDocumentoGenerico:{
      get(){
        return this.$store.state.documentos.generico.fecha_documento;
      },
      set (newValue){
        this.$store.commit('documentos/FECHA_DOCUMENTO_GENERICO', newValue);
      }
    },
    documentEdit(){
      return {...this.$store.state.documentos.newDocument}
    },
    convenioEdit(){
      return {...this.$store.state.documentos.convenio}
    },
    escrituraEdit(){
      return {...this.$store.state.documentos.escritura}
    },
    docGenericoEdit(){
      return {...this.$store.state.documentos.generico}
    }
  },
  methods:{
    ...mapMutations({
      refreshConvenioAction:'documentos/REFRESH_CONVENIO',
      refreshEscrituraAction:'documentos/REFRESH_ESCRITURA',
      refreshDocumentoGenericoAction:'documentos/REFRESH_DOCUMENTO_GENERICO'
    }),
    ...mapActions({
      getTipoPerfeccionamientos:'mantenedores/getTipoPerfeccionamientos',
      selectTiposFormacionAction:'documentos/selectTiposFormacion',
      changeSelectAnios:'documentos/selectAnios',
      openEdit: "documentos/updateDrawerEdit",
      openEditEscritura:'documentos/updateEscrituraFirmada',
      getTipoDocumentos:'mantenedores/getTipoDocumentos',
      getTipoConvenio:'mantenedores/getTipoConvenio'
    }),
    changeTipoFormacion(){
      let data = {
        uuid: this.$route.params.id,
        tipo: this.documentEdit.tipo_formacion
      };
      this.selectTiposFormacionAction(data);
    },
    selectTipoDoc(){
      this.changeSelectAnios(this.convenioEdit);
    },
    async editConvenio(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/profesionales/profesional/documentos/update-convenio/${this.convenioEdit.id}`;
      const data = {
        anios_arancel: this.aniosArancel,
        valor_arancel:this.convenioEdit.valor_arancel,
        n_resolucion:this.convenioEdit.n_resolucion,
        fecha_resolucion:this.convenioEdit.fecha_resolucion,
        observacion:this.convenioEdit.observacion,
        especialidad_id:this.documentEdit.formacion,
        tipo_convenio_id:this.tipoConvenio
      };

      await this.$axios.$put(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.openEdit();
          this.refreshConvenioAction(response[1]);
          this.$notify({
              message: 'Convenio editado con éxito.',
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
    async editEscritura(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/profesionales/profesional/documentos/update-escritura/${this.escrituraEdit.id}`;
      const data = {
        especialidad_id: this.documentEdit.formacion,
        escritura_firmada: this.escrituraFirmada,
        valor_garantia: parseInt(this.escrituraEdit.monto_garantia),
        n_resolucion: parseInt(this.escrituraEdit.n_resolucion),
        fecha_resolucion: this.escrituraEdit.fecha_resolucion,
        observacion: this.escrituraEdit.observacion
      };

      await this.$axios.$put(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.refreshEscrituraAction(response[1]);
          this.$notify({
              message: 'Escritura editada con éxito.',
              type: 'success'
          });
          this.openEdit();
        }else{
          this.$message.error("Error de servidor");
        }
      }).catch(error => {
        this.fullscreenLoading = !this.fullscreenLoading;
        console.log(error);
        this.errors = error.response.data.errors;
      });
    },
    async editDocument(){
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = `/api/profesionales/profesional/documentos/generico/edit-doc-generico/${this.docGenericoEdit.id}`;
      const data = {
        tipo_documento_id:this.tipoDocumentoGenerico,
        n_documento:this.docGenericoEdit.n_documento,
        fecha_documento:this.fechaDocumentoGenerico,
        observacion:this.docGenericoEdit.observacion
      };

      await this.$axios.$put(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        if(response[0] === true){
          this.refreshDocumentoGenericoAction(response[1]);
          this.$notify({
              message: 'Documento editado con éxito.',
              type: 'success'
          });
          this.openEdit();
        }else{
          this.$message.error("Error de servidor");
        }
      }).catch(error => {
        console.log(error);
        this.fullscreenLoading = !this.fullscreenLoading;
        this.errors = error.response.data.errors;
      });
    },
    selectTipoDoc(){
       if(this.documentEdit.tipo_documento === 0){
          this.getTipoConvenio();
        }
    }
  }
}
</script>

<style>

</style>
