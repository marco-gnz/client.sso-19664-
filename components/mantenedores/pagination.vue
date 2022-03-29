<template>
  <div>
    <el-tabs v-model="activeName" tab-position="left" style="height: 400px;" @tab-click="redirect">
      <el-tab-pane :disabled="currentRouteName === 'redes' " name="red" label="Red hospitalaria"></el-tab-pane>
      <el-tab-pane :disabled="currentRouteName === 'establecimientos' " name="establecimiento" label="Establecimiento"></el-tab-pane>
      <el-tab-pane :disabled="currentRouteName === 'campos-clinicos' " name="campo-clinico" label="Campo clínico"></el-tab-pane>
      <el-tab-pane :disabled="currentRouteName === 'unidades' " name="unidad" label="Unidad"></el-tab-pane>
      <el-tab-pane :disabled="currentRouteName === 'centros' " name="centro" label="Centro formador"></el-tab-pane>
      <el-tab-pane :disabled="currentRouteName === 'perfeccionamientos' " name="perfeccionamiento" label="Perfeccionamiento"></el-tab-pane>
      <el-tab-pane :disabled="currentRouteName === 'causales' " name="causal" label="Causal interrup."></el-tab-pane>
      <el-tab-pane :disabled="currentRouteName === 'situaciones' " name="situacion" label="Situación actual"></el-tab-pane>
      <el-tab-pane :disabled="currentRouteName === 'etapas' " name="etapa" label="Etapa profesional"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data(){
    return{
      activeName:''
    };
  },
  computed: {
    currentRouteName() {
        return this.$route.name;
      }
  },
  methods:{
    redirect(){
      if(this.activeName === 'red'){
        this.$router.replace('/redes');
      }else if (this.activeName === 'establecimiento'){
        this.$router.replace('/establecimientos');
      }else if (this.activeName === 'campo-clinico'){
        this.$router.replace('/campos-clinicos');
      }else if (this.activeName === 'perfeccionamiento'){
        this.$router.replace('/perfeccionamientos');
      }else if (this.activeName === 'centro'){
        this.$router.replace('/centros');
      }else if (this.activeName === 'causal'){
        this.$router.replace('/causales');
      }else if (this.activeName === 'unidad'){
        this.$router.replace('/unidades');
      }else if (this.activeName === 'situacion'){
        this.$router.replace('/situaciones');
      }else if (this.activeName === 'etapa'){
        this.$router.replace('/etapas');
      }
    }
  }
}
</script>

<style>

</style>
