<template>
  <div>
    <el-dialog title="Seleccione filtros para buscar profesionales" width="55%"  :lock-scroll="false" :center="true" :visible.sync="filterDialog">
      <div class="row">
        <div class="col-md-6">
          <div class="card-body">
            <div class="form-group">
              <label class="required">Etapa de profesional</label><br>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"><strong>Marcar todas</strong></el-checkbox>
                <el-checkbox-group v-model="checkedEtapas">
                      <el-checkbox v-for="etapa in etapas" :label="etapa.id" :key="etapa.id" class="mb-3 mr-4" @change="handleCheckedCitiesChange">
                        <el-popover transition="el-fade-in-linear" placement="top-start" width="300" trigger="hover" :close-delay="2" :content="etapa.nombre"><span slot="reference">{{etapa.sigla}}</span></el-popover>
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
                <label>Situación actual</label><br>
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
                <div class="row">
                  <div class="col-md-11">
                      <el-select
                        size="mini"
                        style="width:300px;"
                        :disabled="!checkedEtapas.length || perfeccionamiento_value == true"
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
                          <span style="float: right; color: #8492a6; font-size: 10px">{{ perfeccionamiento.tipo.nombre }}</span>
                        </el-option>
                      </el-select>
                  </div>
                  <div class="col-md-1">
                    <el-tooltip class="item" effect="dark" content="Si: Posee una o más especialidades" placement="top-start">
                      <el-checkbox :disabled="!checkedEtapas.length" @change="refreshPerfeccionamiento" v-model="perfeccionamiento_value">Si</el-checkbox>
                    </el-tooltip>
                  </div>
                </div>
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
                <label>Etapa destinación (ED)</label><br>
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
                <label>Etapa formación (EF)</label><br>
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
              <div class="form-group" v-if="checkedEtapas.includes(1)">
                <label>Etapa devolución (PAO)</label><br>
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
          <div class="col-md-6">
            <div class="card-body">
              <div class="form-group">
                <label>Establ. <i>funciones/destinaci./devoluciones</i></label><br>
                <el-select
                size="mini"
                style="width:300px;"
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
                    <span style="float: left; font-size: 12px">{{ establecimiento.nombre.length > 30 ? establecimiento.nombre.substring(0, 30)+'...' : establecimiento.nombre}}</span>
                    <span style="float: right; color: #8492a6; font-size: 12px">{{ establecimiento.red_hospitalaria != null ? establecimiento.red_hospitalaria.sigla : '--' }}</span>
                  </el-option>
                </el-select>
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
      url:''
    };
  },
  mounted(){
    this.getEtapas();
    this.getPerfeccionamientosAll();
    this.getRedesHospitalariasUserAuth();
    this.getSituacionesActual();
    this.getAllEstablecimientos();
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
    perfeccionamiento_value:{
      get() {
        return this.$store.getters['profesionales/allPerfeccionamiento']
      },
      set() {
        this.$store.commit('profesionales/SET_ALL_PERFECCIONAMIENTO');
      }
    },
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
      establecimientos:'mantenedores/allEstablecimientos',
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
      open: "profesionales/updateModal",
      refresEstablecimientoAction:'profesionales/refreshEstablecimiento',
      cargando: 'profesionales/loadingApi',
      getSituacionesActual:'mantenedores/getSituacionesActual',
      getAllEstablecimientos:'mantenedores/getAllEstablecimientos'
    }),
    ...mapMutations({
      currentPageAction: "profesionales/SET_CURRENT_PAGE",
      refreshFiltro:'profesionales/REFRESH_FILTRO'
    }),
    searchProfesionales(){
      this.currentPageAction(1);
      this.activeFiltroAvanzado = true;
      localStorage.setItem('filtros', JSON.stringify(this.searchAll));
      this.getProfesionales();
      this.open();
    },
    handleCheckedCitiesChange(value){
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.etapas.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.etapas.length;
    },
    refreshPerfeccionamiento(){
      if(this.perfeccionamiento_value === true){
          this.perfeccion = [];
      }
    },
    refreshCampos(){
      this.refreshFiltro();
      localStorage.removeItem('filtros');
      this.getProfesionales();
      this.checkAll = false;
    },
    handleCheckAllChange(val) {
      this.checkedEtapas = val ? this.etapas.map(e => e.id) : [];
      this.isIndeterminate = false;
    },
    async excelReport(){
      this.cargando();
      const url   = '/api/profesionales/excel-search';
      const data  = {
        perfeccion: this.searchAll.perfeccion,
        f_ed: this.searchAll.f_ed,
        f_ef:this.searchAll.f_ef,
        f_pao:this.searchAll.f_pao,
        checkedEtapas:this.searchAll.checkedEtapas,
        establecimiento:this.searchAll.establecimiento,
        estados:this.searchAll.estados,
        situaciones:this.searchAll.situacion,
        exist_perfeccionamiento:this.searchAll.all_perfeccionamiento
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
