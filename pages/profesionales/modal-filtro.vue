<template>
  <div>
    <el-dialog title="Seleccione filtros" width="55%" :lock-scroll="false" :center="true" :visible.sync="filterDialog">
      <div class="row">
        <div class="col-md-6">
          <label>Etapa de profesional</label>
          <div class="form-group">
            <template>
              <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Marcar todas</el-checkbox> -->
              <!--@change="handleCheckedCitiesChange"-->
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="search.checkedEtapas">
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
              :disabled="!search.checkedEtapas.length"
              style="width:350px;"
              v-model="search.perfeccion"
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
        <template v-if="search.checkedEtapas.includes(2)">
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-6">
                <label>Etapa destinación (ED)</label>
                <div class="form-group">
                  <el-date-picker
                    v-model="search.f_ed"
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
                    v-model="search.f_ef"
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
            <div class="row">
              <div class="col-md-6">
                <label>Seleccione Red</label>
                <div class="form-group">
                  <el-select v-model="search.red" placeholder="Seleccione" style="width:300px;" @change="getEstablecimientosChange">
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
                <label>Seleccione establecimiento</label>
                <div class="form-group">
                  <el-select :disabled="search.red === '' || establecimientos.length === 0" v-model="search.establecimiento" placeholder="Seleccione" style="width:300px;">
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
          </div>
        </template>
        <template v-if="search.checkedEtapas.includes(1)">
          <div class="col-md-6">
            <label>Etapa devolución (PAO)</label>
            <div class="form-group">
              <el-date-picker
                v-model="search.f_pao"
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
          <button @click.prevent="searchProfesionales" type="submit" class="btn btn-primary btn-user float-right">Aplicar filtro</button>
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
      search:{
        perfeccion:[],
        f_ed:[],
        f_ef:[],
        f_pao:[],
        checkedEtapas:[],
        red:'',
        establecimiento:''
      },
      isIndeterminate: true,
      checkAll: false,
    };
  },
  mounted(){
    this.getEtapas();
    this.getPerfeccionamientosAll();
    this.getRedesHospitalariasUserAuth();
    this.setFiltro();
  },
  computed:{
    filterDialog:{
      get() {
        return this.$store.getters['profesionales/modalStatus']
      },
      set(value) {
        this.$store.dispatch('profesionales/updateModal')
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
    }),
    getEstablecimientosChange(){
      this.search.establecimiento = '';
      this.getEstablecimientosAction(this.search.red);
    },
    setFiltro(){
      let filtro = JSON.parse(localStorage.getItem('filtro_avanzado'));
      if(filtro){
        this.search.perfeccion        = (filtro.perfeccion != '') ? filtro.perfeccion : '';
        this.search.f_ed              = (filtro.f_ed != '') ? filtro.f_ed : '';
        this.search.f_ef              = (filtro.f_ef != '') ? filtro.f_ef : '';
        this.search.f_pao             = (filtro.f_pao != '') ? filtro.f_pao : '';
        this.search.checkedEtapas     = (filtro.checkedEtapas != '') ? filtro.checkedEtapas : '';
        this.search.red               = (filtro.red != '') ? filtro.red : '';
        this.search.establecimiento   = (filtro.establecimiento != '') ? filtro.establecimiento : '';
      }
    },
    searchProfesionales(){
      localStorage.setItem('filtro_avanzado', JSON.stringify(this.search));
      let object = {search: this.search};
      this.getProfesionales(object);
      this.open();
    },
    refreshCampos(){
      this.search.perfeccion   = [];
      this.search.f_ed         = [];
      this.search.f_ef         = [];
      this.search.f_pao        = [];
      this.search.checkedEtapas= [];
      this.getProfesionales();
      localStorage.removeItem('filtro_avanzado');
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
