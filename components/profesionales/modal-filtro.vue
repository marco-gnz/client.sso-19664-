<template>
  <div>
    <el-dialog title="Seleccione filtros para buscar profesionales" width="55%" :lock-scroll="false" :center="true" :visible.sync="filterDialog">
      <div class="row">
        <div class="col-md-6">
          <label>Etapa de profesional</label>
          <div class="form-group">
            <template>
              <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Marcar todas</el-checkbox> -->
              <!--@change="handleCheckedCitiesChange"-->
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="checkedEtapas">
                <el-checkbox v-for="etapa in etapas" :label="etapa.id" :key="etapa.id">
                  <el-popover transition="el-fade-in-linear" placement="top-start" width="300" trigger="hover" :content="etapa.nombre"><span slot="reference">{{etapa.sigla}}</span></el-popover>
                </el-checkbox>
              </el-checkbox-group>
            </template>
          </div>
        </div>
        <div class="col-md-6">
          <label>Tipo de perfeccionamiento</label>
          <div class="form-group">
            <el-select
              :disabled="!checkedEtapas.length"
              style="width:350px;"
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
      <div class="row pt-lg-3">
        <template v-if="checkedEtapas.includes(2)">
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-6">
                <label>Etapa destinación (ED)</label>
                <div class="form-group">
                  <el-date-picker
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
              <div class="col-md-6">
                <label>Etapa formación (EF)</label>
                <div class="form-group">
                  <el-date-picker
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
                <label>Seleccione Red</label>
                <div class="form-group">
                  <el-select v-model="red" placeholder="Seleccione" style="width:300px;" @change="getEstablecimientosChange">
                    <el-option
                      v-for="red in redesHospitalariasUserAuth"
                      :key="red.id"
                      :label="red.nombre"
                      :value="red.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-md-6">
                <label>Establecimiento <i>destinación/devolución</i></label>
                <div class="form-group">
                  <el-select :disabled="red === '' || establecimientos.length === 0" v-model="establecimiento" placeholder="Seleccione" style="width:300px;">
                    <el-option
                      v-for="establecimiento in establecimientos"
                      :key="establecimiento.id"
                      :label="establecimiento.nombre"
                      :value="establecimiento.id">
                      <span style="float: left">{{ establecimiento.nombre }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ (establecimiento.grado_complejidad != null) ? `°${establecimiento.grado_complejidad.grado}` : '--' }}</span>
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
        </template>
        <template v-if="checkedEtapas.includes(1)">
          <div class="col-md-6">
            <label>Etapa devolución (PAO)</label>
            <div class="form-group">
              <el-date-picker
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
        </template>
      </div>
      <div class="row pt-lg-5">
        <div class="col-md-6">
          <button @click.prevent="refreshCampos" type="submit" class="btn btn-warning btn-user float-left">Refrescar campos</button>
        </div>
        <div class="col-md-6">
          <button :disabled="searchAll.checkedEtapas.length === 0" @click.prevent="searchProfesionales" type="submit" class="btn btn-primary btn-user float-right" v-loading.fullscreen.lock="loading">Aplicar filtro</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
  data(){
    return{
      isIndeterminate: true,
      checkAll: false,
    };
  },
  mounted(){
    this.getEtapas();
    this.getPerfeccionamientosAll();
    this.getRedesHospitalariasUserAuth();
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
    })
  },
  methods:{
    ...mapActions({
      getEtapas:'mantenedores/getEtapas',
      getPerfeccionamientosAll:'mantenedores/getPerfeccionamientosAll',
      getProfesionales: "profesionales/getProfesionales",
      getRedesHospitalariasUserAuth:'mantenedores/getRedesHospitalariasUserAuth',
      getEstablecimientosAction: 'mantenedores/getEstablecimientos',
      open: "profesionales/updateModal",
      refresEstablecimientoAction:'profesionales/refreshEstablecimiento'
    }),
    getEstablecimientosChange(){
      /* this.search.establecimiento = ''; */
      this.refresEstablecimientoAction();
      this.getEstablecimientosAction(this.red);
    },
    setFiltro(){
      let filtro = JSON.parse(localStorage.getItem('filtros'));
      if(filtro){
        this.perfeccion               = (filtro.perfeccion != '') ? filtro.perfeccion : '';
        this.fechaEtapaDestinacion    = (filtro.f_ed != '') ? filtro.f_ed : '';
        this.fechaEtapaFormacion      = (filtro.f_ef != '') ? filtro.f_ef : '';
        this.fechaPao                 = (filtro.f_pao != '') ? filtro.f_pao : '';
        this.checkedEtapas            = (filtro.checkedEtapas != '') ? filtro.checkedEtapas : '';
        this.red                      = (filtro.red != '') ? filtro.red : '';
        this.establecimiento          = (filtro.establecimiento != '') ? filtro.establecimiento : '';
      }
    },
    searchProfesionales(){
      this.activeFiltroAvanzado = !this.activeFiltroAvanzado;
      localStorage.setItem('filtros', JSON.stringify(this.searchAll));
      let object = {search: this.searchAll};
      this.getProfesionales(object);
      this.open();
    },
    refreshCampos(){
      this.checkedEtapas          = [];
      this.perfeccion             = [];
      this.fechaEtapaDestinacion  = [];
      this.fechaEtapaFormacion    = [];
      this.fechaPao               = [];
      this.red                    = '';
      this.establecimiento        = '';
      this.activeFiltroAvanzado   = !this.activeFiltroAvanzado;
      this.getProfesionales();
      localStorage.removeItem('filtros');
    },
    handleCheckAllChange(val) {
      this.search.checkedEtapas = val ? this.etapas : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      /* let checkedCount = value.length;
      this.checkAll = checkedCount === this.etapas.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.etapas.length; */
    }
  }
}
</script>

<style>

</style>
