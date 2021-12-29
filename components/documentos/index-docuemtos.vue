<template>
  <div>
    <el-button @click="drawer = true" class="documentos" type="primary" icon="el-icon-document" circle></el-button>
    <el-drawer
    title="Documentación de profesional"
    :visible.sync="drawer"
    :with-header="false"
    size="50%"
    :show-close="true"
    custom-class="doc"
    >

    <!-- docuementos -->
    <div class="container">
      <!-- title -->
      <div class="row pt-lg-2">
          <div class="col-md-12">
              <h3 class="text-center">Documentación de profesional</h3>
          </div>
      </div>
      <div class="row pt-lg-2">
          <div class="col-md-12">
              <el-button class="float-right" @click.prevent="openDocument">Agregar documento</el-button>
          </div>
      </div>
      <div class="row pt-lg-2">
        <div class="col-md-12">
          <AddNewDocument />
          <EditDocument />
        </div>
      </div>
      <div class="row pt-lg-1">
        <div class="col-md-12">
          <h5>Sección convenios</h5>
          <div class="row pt-lg-1">
            <template v-if="convenios.length">
              <div class="col-md-4 pt-lg-3" v-for="(convenio, index) in convenios" :key="index">
                <div class="card border-left-success shadow h-100 py-2">
                  <div class="card-header color-header">
                    <div class="row">
                      <div class="col-md-10">
                          <div class="text-xs font-weight-bold text-success text-uppercase mb-1">{{convenio.especialidad.perfeccionamiento.tipo.nombre}} <i>({{convenio.especialidad.perfeccionamiento.nombre}})</i></div>
                      </div>
                      <div class="col-md-2">
                          <el-dropdown class="float-right">
                              <span class="el-dropdown-link"><i class="el-icon-more"></i>
                              </span>
                              <el-dropdown-menu slot="dropdown">
                                  <el-dropdown-item icon="el-icon-edit" @click.native="editConvenio(convenio, index, 0)">Editar</el-dropdown-item>
                                      <el-popconfirm
                                          @confirm="deleteConvenio(convenio.uuid)"
                                          v-loading.fullscreen.lock="fullscreenLoading"
                                          confirm-button-text='Si, eliminar'
                                          cancel-button-text='No'
                                          icon="el-icon-info"
                                          icon-color="red"
                                          title="¿Eliminar convenio?"
                                          >
                                          <el-dropdown-item slot="reference" icon="el-icon-delete">Eliminar</el-dropdown-item>
                                      </el-popconfirm>
                              </el-dropdown-menu>
                          </el-dropdown>
                      </div>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="row no-gutters align-items-center">
                      <div class="col mr-2">
                        <div class="h6 mb-0 pt-lg-2 text-gray-800">N° {{convenio.n_resolucion}}/{{DateTime.fromISO(convenio.fecha_resolucion).toFormat('dd-LL-yyyy')}}</div>
                        <div class="h5 mb-0 pt-lg-4 font-weight-bold text-gray-800">${{Intl.NumberFormat('de-DE').format(convenio.valor_arancel)}}</div>
                        <div class="h6 mb-0 pt-lg-3 text-gray-800">{{convenio.especialidad.centro_formador.nombre}}</div>
                        <div class="h6 mb-0 pt-lg-3 text-gray-800"><i>Arancel año </i> {{convenio.anios_arancel.map(a => a).join(' - ')}}</div>
                        <div class="mb-0 pt-lg-3 text-gray-800" v-if="convenio.observacion">
                          <el-popover
                            placement="top-start"
                            width="600"
                            trigger="hover"
                            :content="convenio.observacion">
                            <span slot="reference" style="font-size: 10px;" class="observacion">{{convenio.observacion.substring(0, 30)+'...'}}</span>
                          </el-popover>
                        </div>
                      </div>
                      <div class="col-auto">
                          <i class="far fa-handshake fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                  <div class="card-footer color-header">
                      <div class="row">
                          <div class="col-md-12">
                            <i class="el-icon-plus text-success"></i>
                            <el-popover
                              :disabled="!convenio.fecha_update"
                              placement="top-start"
                              width="400"
                              trigger="hover"
                              :content="`Última actualización: ${DateTime.fromSQL(convenio.fecha_update).toFormat('ff')} - MG`">
                              <span slot="reference" :class="convenio.fecha_update ? 'observacion' : '' "><i>{{ DateTime.fromSQL(convenio.fecha_add).toFormat('ff') }} - MG</i></span>
                            </el-popover>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="col-md-12">
                  <el-alert
                      title="No existen convenios asociados al profesional."
                      type="warning"
                      :closable="false"
                      show-icon>
                  </el-alert>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="row pt-lg-5">
        <div class="col-md-12">
          <h5>Sección escrituras</h5>
          <div class="row pt-lg-1">
            <template v-if="escrituras.length">
              <div class="col-md-4 pt-lg-3" v-for="(escritura, index) in escrituras" :key="index">
                  <div class="card border-left-primary shadow h-100 py-2">
                      <div class="card-header color-header">
                              <div class="row">
                                  <div class="col-md-10">
                                      <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">{{escritura.especialidad.perfeccionamiento.tipo.nombre}} <i>({{escritura.especialidad.perfeccionamiento.nombre}})</i></div>
                                  </div>
                                  <div class="col-md-2">
                                      <el-dropdown class="float-right">
                                          <span class="el-dropdown-link"><i class="el-icon-more"></i>
                                          </span>
                                          <el-dropdown-menu slot="dropdown">
                                              <el-dropdown-item icon="el-icon-edit" @click.native="editEscritura(escritura, index, 1)">Editar</el-dropdown-item>
                                                  <el-popconfirm
                                                      @confirm="deleteEscritura(escritura.uuid)"
                                                      confirm-button-text='Si, eliminar'
                                                      cancel-button-text='No'
                                                      icon="el-icon-info"
                                                      icon-color="red"
                                                      title="¿Eliminar escritura?"
                                                      >
                                                      <el-dropdown-item slot="reference" icon="el-icon-delete">Eliminar</el-dropdown-item>
                                                  </el-popconfirm>
                                          </el-dropdown-menu>
                                      </el-dropdown>
                                  </div>
                              </div>
                          </div>
                      <div class="card-body">
                          <div class="row no-gutters align-items-center">
                              <div class="col mr-2">
                                  <!-- n° de resolución - año de resolución -->
                                  <div class="h6 mb-0 pt-lg-2 text-gray-800">N° {{escritura.n_resolucion}}/{{DateTime.fromISO(escritura.fecha_resolucion).toFormat('dd-LL-yyyy')}}</div>
                                  <!-- monto de garantía -->
                                  <div class="h5 mb-0 pt-lg-4 font-weight-bold text-gray-800">{{Intl.NumberFormat('de-DE').format(escritura.valor_garantia)}} UF</div>
                                  <!-- firma: Si / No -->
                                  <div class="h6 mb-0 pt-lg-3 text-gray-800">Firma: {{ (escritura.escritura_firmada != false) ? 'SI' : 'NO' }}</div>
                                  <div class="mb-0 pt-lg-3 text-gray-800" v-if="escritura.observacion">
                                    <el-popover
                                      placement="top-start"
                                      width="600"
                                      trigger="hover"
                                      :content="escritura.observacion">
                                      <span slot="reference" style="font-size: 10px;" class="observacion">{{escritura.observacion.substring(0, 30)+'...'}}</span>
                                    </el-popover>
                                  </div>
                              </div>
                              <div class="col-auto">
                                  <i class="fas fa-file-signature fa-2x text-gray-300"></i>
                              </div>
                          </div>
                      </div>
                      <div class="card-footer color-header">
                          <div class="row">
                              <div class="col-md-12">
                                <i class="el-icon-plus text-primary"></i>
                                <el-popover
                                  :disabled="!escritura.fecha_update"
                                  placement="top-start"
                                  width="400"
                                  trigger="hover"
                                  :content="`Última actualización: ${DateTime.fromSQL(escritura.fecha_update).toFormat('ff')} - MG`">
                                  <span slot="reference" :class="escritura.fecha_update ? 'observacion' : '' "><i>{{ DateTime.fromSQL(escritura.fecha_add).toFormat('ff') }} - MG</i></span>
                                </el-popover>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </template>
            <template v-else>
              <div class="col-md-12">
                  <el-alert
                      title="No existen escrituras asociadas al profesional."
                      type="warning"
                      :closable="false"
                      show-icon>
                  </el-alert>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="row pt-lg-5">
        <div class="col-md-12">
          <h5>Sección facturas</h5>
          <div class="row pt-lg-1">
            <template v-if="facturas.length">
              <div class="col-md-4 pt-lg-3" v-for="(factura, index) in facturas" :key="index">
                <div class="card border-left-info shadow h-100 py-2">
                  <div class="card-header color-header">
                    <div class="row">
                      <div class="col-md-10">
                          <div class="text-xs font-weight-bold text-info text-uppercase mb-1">°{{factura.n_resolucion}} / {{DateTime.fromISO(factura.fecha_resolucion).toFormat('dd-LL-yyyy')}}</div>
                      </div>
                      <div class="col-md-2">
                        <el-dropdown class="float-right">
                            <span class="el-dropdown-link"><i class="el-icon-more"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                    <el-popconfirm
                                        @confirm="deleteFactura(factura.uuid)"
                                        v-loading.fullscreen.lock="fullscreenLoading"
                                        confirm-button-text='Si, eliminar'
                                        cancel-button-text='No'
                                        icon="el-icon-info"
                                        icon-color="red"
                                        title="¿Eliminar factura?"
                                        >
                                        <el-dropdown-item slot="reference" icon="el-icon-delete">Eliminar</el-dropdown-item>
                                    </el-popconfirm>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="row no-gutters align-items-center">
                      <div class="col mr-2">
                        <div class="h6 mb-0 pt-lg-2 text-gray-800">N° {{factura.n_factura}}</div>
                        <div class="h5 mb-0 pt-lg-4 font-weight-bold text-gray-800">${{Intl.NumberFormat('de-DE').format(factura.monto_total)}}</div>
                        <div class="h6 mb-0 pt-lg-3 text-gray-800">{{factura.situacion_actual.nombre}}</div>
                        <div class="h6 mb-0 pt-lg-3 text-gray-800"><i>Año </i> {{factura.anios_pago.map(a => a).join(' - ')}}</div>
                        <div class="mb-0 pt-lg-3 text-gray-800" v-if="factura.observacion">
                          <el-popover
                            placement="top-start"
                            width="600"
                            trigger="hover"
                            :content="factura.observacion">
                            <span slot="reference" style="font-size: 10px;" class="observacion">{{factura.observacion.substring(0, 30)+'...'}}</span>
                          </el-popover>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-footer color-header">
                    <div class="row">
                        <div class="col-md-12">
                          <i class="el-icon-plus text-info"></i>
                          <el-popover
                            :disabled="!factura.fecha_update"
                            placement="top-start"
                            width="400"
                            trigger="hover"
                            :content="`Última actualización: ${DateTime.fromSQL(factura.fecha_update).toFormat('ff')} - MG`">
                            <span slot="reference" :class="factura.fecha_update ? 'observacion' : '' "><i>{{ DateTime.fromSQL(factura.fecha_add).toFormat('ff') }} - MG</i></span>
                          </el-popover>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="col-md-12">
                  <el-alert
                      title="No existen facturas asociadas al profesional."
                      type="warning"
                      :closable="false"
                      show-icon>
                  </el-alert>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="row pt-lg-5">
        <div class="col-md-12">
          <h5>Otros documentos</h5>
          <div class="row pt-lg-1">
            <template v-if="genericos.length">
              <div class="col-md-4 pt-lg-3" v-for="(generico, index) in genericos" :key="index">
                <div class="card border-left-secondary shadow h-100 py-2">
                  <div class="card-header color-header">
                    <div class="row">
                      <div class="col-md-10">
                          <div class="text-xs font-weight-bold text-secondary text-uppercase mb-1">{{generico.tipo_documento.nombre}}</div>
                      </div>
                      <div class="col-md-2">
                          <el-dropdown class="float-right">
                              <span class="el-dropdown-link"><i class="el-icon-more"></i>
                              </span>
                              <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item icon="el-icon-edit" @click.native="editDocumentoGenerico(generico, index, 2)">Editar</el-dropdown-item>
                                  <el-popconfirm
                                      @confirm="deleteDocumentoGenerico(generico.uuid)"
                                      v-loading.fullscreen.lock="fullscreenLoading"
                                      confirm-button-text='Si, eliminar'
                                      cancel-button-text='No'
                                      icon="el-icon-info"
                                      icon-color="red"
                                      title="¿Eliminar documento?"
                                      >
                                      <el-dropdown-item slot="reference" icon="el-icon-delete">Eliminar</el-dropdown-item>
                                  </el-popconfirm>
                              </el-dropdown-menu>
                          </el-dropdown>
                      </div>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="row no-gutters align-items-center">
                      <div class="col mr-2">
                        <div class="h6 mb-0 pt-lg-2 text-gray-800">N° {{generico.n_documento}} / {{DateTime.fromISO(generico.fecha_documento).toFormat('dd-LL-yyyy')}}</div>
                        <div class="mb-0 pt-lg-3 text-gray-800" v-if="generico.observacion">
                          <el-popover
                            placement="top-start"
                            width="600"
                            trigger="hover"
                            :content="generico.observacion">
                            <span slot="reference" style="font-size: 10px;" class="observacion">{{generico.observacion.substring(0, 30)+'...'}}</span>
                          </el-popover>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-footer color-header">
                      <div class="row">
                          <div class="col-md-12">
                            <i class="el-icon-plus text-secondary"></i>
                            <el-popover
                              :disabled="!generico.fecha_update"
                              placement="top-start"
                              width="400"
                              trigger="hover"
                              :content="`Última actualización: ${DateTime.fromSQL(generico.fecha_update).toFormat('ff')} - MG`">
                              <span slot="reference" :class="generico.fecha_update ? 'observacion' : '' "><i>{{ DateTime.fromSQL(generico.fecha_add).toFormat('ff') }} - MG</i></span>
                            </el-popover>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="col-md-12">
                  <el-alert
                      title="No existen otros documentos asociados al profesional."
                      type="warning"
                      :closable="false"
                      show-icon>
                  </el-alert>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    </el-drawer>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
import AddNewDocument from './add-new-document.vue';
import EditDocument from './edit-document.vue';
export default {
    data() {
        return {
          fullscreenLoading:false,
          drawer: false
        };
    },
    mounted(){
      this.getConvenios(this.$route.params.id);
      this.getEscrituras(this.$route.params.id);
      this.getFacturas(this.$route.params.id);
      this.getDocGenericos(this.$route.params.id);
    },
    computed:{
      ...mapGetters({
        convenios:'documentos/convenios',
        escrituras:'documentos/escrituras',
        facturas:'facturas/facturas',
        genericos:'documentos/genericos'
      }),
      convenioEdit(){
        return {...this.$store.state.documentos.convenio}
      }
    },
    methods: {
        ...mapMutations({
          deleteConvenioAction:'documentos/REMOVE_CONVENIO',
          passingConvenio: 'documentos/PASSING_CONVENIO',
          passingEscritura:'documentos/PASSING_ESCRITURA',
          passingDocGenerico:'documentos/PASSING_DOC_GENERICO',
          deleteEscrituraAction:'documentos/REMOVE_ESCRITURA',
          deleteFacturaAction:'facturas/REMOVE_FACTURA',
          deleteDocumentoGenericoAction:'documentos/REMOVE_DOCUMENTO_GENERICO'
        }),
        ...mapActions({
            open: "documentos/updateDrawer",
            getConvenios:'documentos/getConvenios',
            openEdit: "documentos/updateDrawerEdit",
            selectTiposFormacionAction:'documentos/selectTiposFormacion',
            changeSelectAnios:'documentos/selectAnios',
            getEscrituras:'documentos/getEscrituras',
            getFacturas:'facturas/getFacturas',
            getDocGenericos:'documentos/getDocGenericos'
        }),
        editConvenio(convenio, index, tipo_documento){
          let object = {convenio: convenio, index:index, tipo_documento:tipo_documento}
          this.passingConvenio(object);
          this.openEdit();
          let data = {
              uuid: this.$route.params.id,
              tipo: convenio.especialidad.perfeccionamiento.tipo_perfeccionamiento_id
            };
          this.selectTiposFormacionAction(data);
          this.changeSelectAnios(convenio.especialidad.id);
        },
        async deleteConvenio(uuid){
          this.fullscreenLoading = !this.fullscreenLoading;
          const url = `/api/profesionales/profesional/documentos/delete-convenio/${uuid}`;
          await this.$axios.$delete(url).then(response => {
            this.fullscreenLoading = !this.fullscreenLoading;
            console.log(response);
            if(response === true){
              this.deleteConvenioAction(uuid);
              this.$message({
                message: 'Convenio eliminado con éxito.',
                type: 'success'
              });
            }else{
              this.$message.error("Error. Error de servidor.");
            }
          }).catch(error => {
            this.fullscreenLoading = !this.fullscreenLoading;
            console.log(error);
            this.$message.error("Error. Error de servidor.");
          });
        },
        editEscritura(escritura, index, tipo_documento){
          let object = {escritura: escritura, index:index, tipo_documento:tipo_documento}
          this.passingEscritura(object);
          this.openEdit();
          let data = {
              uuid: this.$route.params.id,
              tipo: escritura.especialidad.perfeccionamiento.tipo_perfeccionamiento_id
            };
          this.selectTiposFormacionAction(data);
        },
        async deleteEscritura(uuid){
          this.fullscreenLoading = !this.fullscreenLoading;
          const url = `/api/profesionales/profesional/documentos/delete-escritura/${uuid}`;
          await this.$axios.$delete(url).then(response => {
            this.fullscreenLoading = !this.fullscreenLoading;
            console.log(response);
            if(response === true){
              this.deleteEscrituraAction(uuid);
              this.$message({
                message: 'Escritura eliminada con éxito.',
                type: 'success'
              });
            }else{
              this.$message.error("Error. Error de servidor.");
            }
          }).catch(error => {
            this.fullscreenLoading = !this.fullscreenLoading;
            console.log(error);
            this.$message.error("Error. Error de servidor.");
          });
        },
        async deleteFactura(uuid){
          this.fullscreenLoading = !this.fullscreenLoading;
          const url = `/api/profesionales/profesional/documentos/factura/delete-factura/${uuid}`;

          await this.$axios.$delete(url).then(response => {
            this.fullscreenLoading = !this.fullscreenLoading;
            if(response === true){
              this.deleteFacturaAction(uuid);
              this.$message({
                message: 'Factura eliminada con éxito.',
                type: 'success'
              });
            }else{
              this.$message.error("Error. Error de servidor.");
            }
          }).catch(error => {
            this.fullscreenLoading = !this.fullscreenLoading;
            console.log(error);
            this.$message.error("Error. Error de servidor.");
          });
        },
        editDocumentoGenerico(documento, index, tipo_documento){
          let object = {documento:documento, index:index, tipo_documento:tipo_documento};
          this.passingDocGenerico(object);
          this.openEdit();
        },
        async deleteDocumentoGenerico(uuid){
          this.fullscreenLoading = !this.fullscreenLoading;
          const url = `/api/profesionales/profesional/documentos/generico/delete-doc-generico/${uuid}`;

          await this.$axios.$delete(url).then(response => {
            this.fullscreenLoading = !this.fullscreenLoading;
            if(response === true){
              this.deleteDocumentoGenericoAction(uuid);
              this.$message({
                message: 'Documento eliminado con éxito.',
                type: 'success'
              });
            }else{
              this.$message.error("Error. Error de servidor.");
            }
          }).catch(error => {
            this.fullscreenLoading = !this.fullscreenLoading;
            console.log(error);
            this.$message.error("Error. Error de servidor.");
          });
        },
        openDocument() {
            this.open();
        }
    },
    components: { AddNewDocument, EditDocument }
}
</script>
<style>
.documentos{
	padding: 18px 30px; /* Relleno del boton */
	position: fixed;
	bottom: 510px;
	right: 10px;
	transition: all 300ms ease 0ms;
	box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
	z-index: 99;
}
.doc{
    background-color: rgb(255,255,255, 0.9)
}
.color-header{
    background-color:white;
}
.observacion:hover{
  cursor: pointer;
  color: darkblue;
}
</style>
