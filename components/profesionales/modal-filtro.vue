<template>
  <div>
    <el-dialog title="Seleccione filtros para buscar profesionales" width="55%"  :lock-scroll="false" :center="true" :visible.sync="filterDialog">
      <div class="row">
        <div class="col-md-6">
          <div class="card-body">
            <div class="form-group">
              <label class="required">Etapa de profesional</label>
              <el-checkbox-group v-model="checkedEtapas">
                <el-checkbox v-for="etapa in etapas" :label="etapa.id" :key="etapa.id">
                  <el-popover transition="el-fade-in-linear" placement="top-start" width="300" trigger="hover" :content="etapa.nombre"><span slot="reference">{{etapa.sigla}}</span></el-popover>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card-body">
            <div class="form-group">
              <label class="required">Estado de profesional</label>
              <el-checkbox-group v-model="estadosSelect">
                <el-checkbox v-for="estado in estados" :label="estado.value" :key="estado.value">
                  <el-popover transition="el-fade-in-linear" placement="top-start" width="220" trigger="hover" :content="estado.descripcion"><span slot="reference">{{estado.nombre}}</span></el-popover>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
      <template>
        <div class="row">
          <div class="col-md-6">
            <div class="card-body">
              <div class="form-group">
                <label>Situación actual</label>
                <el-select
                  :disabled="checkedEtapas.length === 0"
                  size="mini"
                  style="width:300px;"
                  v-model="situacion"
                  multiple
                  filterable
                  collapse-tags
                  placeholder="Seleccione">
                  <el-option
                    v-for="situacionActual in situacionesActual"
                    :key="situacionActual.id"
                    :value="situacionActual.id"
                    :label="situacionActual.nombre">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card-body">
              <div class="form-group">
                <label>Perfeccionamiento</label>
                <el-select
                  size="mini"
                  style="width:300px;"
                  :disabled="!checkedEtapas.length"
                  v-model="perfeccion"
                  multiple
                  filterable
                  collapse-tags
                  placeholder="Seleccione">
                  <el-option
                    v-for="perfeccionamiento in perfeccionamientos"
                    :key="perfeccionamiento.id"
                    :value="perfeccionamiento.id"
                    :label="perfeccionamiento.nombre">
                    <span style="float: left">{{ perfeccionamiento.nombre }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ perfeccionamiento.tipo.nombre }}</span>
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="checkedEtapas.includes(2)">
        <div class="row">
          <div class="col-md-6">
            <div class="card-body">
              <div class="form-group">
                <label>Etapa destinación (ED)</label>
                <el-date-picker
                  size="mini"
                  v-model="fechaEtapaDestinacion"
                  type="monthrange"
                  format="MM-yyyy"
                  value-format="yyyy-MM-dd"
                  range-separator="/"
                  start-placeholder="Inicio"
                  end-placeholder="Término">
                </el-date-picker>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card-body">
              <div class="form-group">
                <label>Etapa formación (EF)</label>
                <el-date-picker
                  size="mini"
                  v-model="fechaEtapaFormacion"
                  type="monthrange"
                  format="MM-yyyy"
                  value-format="yyyy-MM-dd"
                  range-separator="/"
                  start-placeholder="Inicio"
                  end-placeholder="Término">
                </el-date-picker>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="checkedEtapas.some(e => checkedEtapas.includes(e))">
        <div class="row">
          <div class="col-md-6">
            <div class="card-body">
              <div class="form-group">
                <label>Seleccione Red</label>
                <el-select size="mini" style="width:300px;" v-model="red" placeholder="Seleccione red" @change="getEstablecimientosChange">
                  <el-option
                    v-for="red in redesHospitalariasUserAuth"
                    :key="red.id"
                    :label="red.nombre"
                    :value="red.id">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card-body">
              <div class="form-group">
                <label>Establecimiento <i>dest./devolu./desempeño</i></label>
                <el-select
                size="mini"
                style="width:300px;"
                :disabled="red === '' || establecimientos.length === 0"
                v-model="establecimiento"
                multiple
                filterable
                collapse-tags
                placeholder="Seleccione">
                  <el-option
                    v-for="establecimiento in establecimientos"
                    :key="establecimiento.id"
                    :label="establecimiento.nombre"
                    :value="establecimiento.id">
                    <span style="float: left; font-size: 12px;">{{ establecimiento.nombre }}</span>
                    <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ (establecimiento.grado_complejidad != null) ? `°${establecimiento.grado_complejidad.grado}` : '--' }}</span> -->
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="checkedEtapas.includes(1)">
        <div class="row">
          <div class="col-md-6">
            <div class="card-body">
              <div class="form-group">
                <label>Etapa devolución (PAO)</label>
                <el-date-picker
                  size="mini"
                  v-model="fechaPao"
                  type="monthrange"
                  format="MM-yyyy"
                  value-format="yyyy-MM-dd"
                  range-separator="/"
                  start-placeholder="Inicio"
                  end-placeholder="Término">
                </el-date-picker>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div class="row">
        <div class="col-md-8">
          <span style="font-size: 11px; text-align: center;" class="text-center">Si requiere exportar (Excel) todos los profesionales, debe seleccionar todas las opciones en "Etapa de profesional".</span>
        </div>
        <div class="col-md-4">
          <el-link v-if="checkedEtapas.length" @click.prevent="excelReport" class="float-right" type="success" icon="el-icon-download">Descargar Excel</el-link>
        </div>
      </div>
      <div class="row pt-lg-5">
        <div class="col-md-6">
          <button @click.prevent="refreshCampos" type="submit" class="btn btn-warning btn-user float-left">Refrescar campos</button>
        </div>
        <div class="col-md-6">
          <button :disabled="searchAll.checkedEtapas.length === 0 || searchAll.estados.length === 0" @click.prevent="searchProfesionales" type="submit" class="btn btn-primary btn-user float-right" v-loading.fullscreen.lock="loading">Aplicar filtro</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
export default {
  data(){
    return{
      isIndeterminate: true,
      checkAll: false,
      url:'',
    };
  },
  mounted(){
    this.getEtapas();
    this.getPerfeccionamientosAll();
    this.getRedesHospitalariasUserAuth();
    this.getSituacionesActual();
  },
  computed:{
    searchAll(){
      return {...this.$store.state.profesionales.search}
    },
    loading:{
      get(){
        return this.$store.state.profesionales.fullscreenLoading;
      },
      set (){
        this.$store.commit('profesionales/SET_LOADING');
      }
    },
    filterDialog:{
      get() {
        return this.$store.getters['profesionales/modalStatus']
      },
      set(value) {
        this.$store.dispatch('profesionales/updateModal')
      }
    },

    //filtros
    checkedEtapas:{
      get() {
        return this.$store.getters['profesionales/checkedEtapas']
      },
      set(value) {
        this.$store.commit('profesionales/SET_ETAPAS', value);
      }
    },
    estadosSelect:{
      get() {
        return this.$store.getters['profesionales/checkedEstados']
      },
      set(value) {
        this.$store.commit('profesionales/SET_ESTADOS', value);
      }
    },
    perfeccion:{
      get() {
        return this.$store.getters['profesionales/perfeccion']
      },
      set(value) {
        this.$store.commit('profesionales/SET_PERFECCION', value);
      }
    },
    fechaEtapaDestinacion:{
      get() {
        return this.$store.getters['profesionales/fechaEtapaDestinacion']
      },
      set(value) {
        this.$store.commit('profesionales/SET_FECHA_ETAPA_DESTINACION', value);
      }
    },
    fechaEtapaFormacion:{
      get() {
        return this.$store.getters['profesionales/fechaEtapaFormacion']
      },
      set(value) {
        this.$store.commit('profesionales/SET_FECHA_ETAPA_FORMACION', value);
      }
    },
    fechaPao:{
      get() {
        return this.$store.getters['profesionales/fechaPao']
      },
      set(value) {
        this.$store.commit('profesionales/SET_FECHA_PAO', value);
      }
    },
    red:{
      get() {
        return this.$store.getters['profesionales/red']
      },
      set(value) {
        this.$store.commit('profesionales/SET_RED', value);
      }
    },
    establecimiento:{
      get() {
        return this.$store.getters['profesionales/establecimiento']
      },
      set(value) {
        this.$store.commit('profesionales/SET_ESTABLECIMIENTO', value);
      }
    },
    situacion:{
      get() {
        return this.$store.getters['profesionales/situacion']
      },
      set(value) {
        this.$store.commit('profesionales/SET_SITUACION_ACTUAL', value);
      }
    },
    activeFiltroAvanzado:{
      get() {
        return this.$store.getters['profesionales/establecimiento']
      },
      set(value) {
        this.$store.commit('profesionales/SET_ACTIVE_FILTRO_AVANZADO', value);
      }
    },
    ...mapGetters({
      etapas:'mantenedores/etapas',
      perfeccionamientos:'mantenedores/perfeccionamientos',
      redesHospitalariasUserAuth:'mantenedores/redesHospitalariasUserAuth',
      establecimientos:'mantenedores/establecimientos',
      estados:'profesionales/estados',
      situacionesActual:'mantenedores/situacionesActual'
    })
  },
  methods:{
    ...mapActions({
      getEtapas:'mantenedores/getEtapas',
      getPerfeccionamientosAll:'mantenedores/getPerfeccionamientosAllFiltro',
      getProfesionales: "profesionales/getProfesionales",
      getRedesHospitalariasUserAuth:'mantenedores/getRedesHospitalariasUserAuth',
      getEstablecimientosAction: 'mantenedores/getEstablecimientos',
      open: "profesionales/updateModal",
      refresEstablecimientoAction:'profesionales/refreshEstablecimiento',
      cargando: 'profesionales/loadingApi',
      getSituacionesActual:'mantenedores/getSituacionesActual'
    }),
    ...mapMutations({
      currentPageAction: "profesionales/SET_CURRENT_PAGE",
      refreshFiltro:'profesionales/REFRESH_FILTRO'
    }),
    getEstablecimientosChange(){
      this.refresEstablecimientoAction();
      this.getEstablecimientosAction(this.red);
    },
    searchProfesionales(){
      this.currentPageAction(1);
      this.activeFiltroAvanzado = true;
      localStorage.setItem('filtros', JSON.stringify(this.searchAll));
      this.getProfesionales();
      this.open();
    },
    refreshCampos(){
      this.refreshFiltro();
      localStorage.removeItem('filtros');
      this.getProfesionales();
    },
    handleCheckAllChange(val) {
      this.search.checkedEtapas = val ? this.etapas : [];
      this.isIndeterminate = false;
    },
    async excelReport(){
      this.cargando();
      const url   = '/api/profesionales/excel-search';
      const data  = {
        perfeccion: this.searchAll.perfeccion,
        f_ed: this.searchAll.fechaEtapaDestinacion,
        f_ef:this.searchAll.fechaEtapaFormacion,
        f_pao:this.searchAll.fechaPao,
        checkedEtapas:this.searchAll.checkedEtapas,
        establecimiento:this.searchAll.establecimiento,
        estados:this.searchAll.estados,
        situaciones:this.searchAll.situacion
      }

      await this.$axios.$get(url, {params:data}).then(response => {
        console.log(response);
        this.cargando();
        if(response[0] === true){
          //>0 resultados
          var url = `${process.env.BASE_URL}/api/profesionales/excel-report/${response[1]}/${response[2]}`
          window.open(url, '_blank');
        }else{
          //0 resultados
          this.$notify.error({
            message: 'No se encontraron resultados.'
          });
        }
      }).catch(error => {
        this.cargando();
        console.log(error);
      });
    }
  }
}
</script>

<style>
.required:after {
    content:" *";
    color: red;
  }
</style>
