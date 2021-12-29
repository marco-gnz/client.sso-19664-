<template>
    <div>
      <div class="content-header pt-4">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 col-xl-12">
              <div class="card shadow">
                <b-card no-body>
                  <b-tabs pills card vertical nav-wrapper-class="w-20">
                    <b-tab disabled :title="`${profesional.nombres} ${profesional.apellidos}`"></b-tab>
                    <b-tab title="Datos personales">
                      <DatosPersonales :profesional="profesional"/>
                    </b-tab>
                    <b-tab :disabled="profesional.etapas_id != 1" title="Formaciones">
                      <IndexFormaciones :profesional="profesional"/>
                    </b-tab>
                    <b-tab :disabled="profesional.etapas_id != 1" title="Registro PAO">
                      <IndexCalculoPao />
                    </b-tab>
                    <b-tab :disabled="profesional.etapas_id != 2" title="Registro EDF">
                      <IndexEdf :profesional="profesional"/>
                    </b-tab>
                    <b-tab title="Otros">
                      <IndexFacturas />
                    </b-tab>
                  </b-tabs>
                </b-card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <IndexDocuemtos />
    </div>
</template>

<script>
import router from 'vue-router';
import {mapActions, mapGetters} from 'vuex';
import DatosPersonales from '../../../components/datos_personales/datos-personales.vue';
import IndexFormaciones from '../../../components/formaciones/index-formaciones.vue';
import IndexCalculoPao from '../../../components/calculo_pao/index-calculo-pao.vue';
import IndexEdf from '../../../components/edf/index-edf.vue';
import IndexDocuemtos from '../../../components/documentos/index-docuemtos.vue';
import IndexFacturas from '../../../components/facturas/index-facturas.vue';
export default {
  middleware: 'auth',
    head(){
      return{
        title: `${this.profesional.rut_completo} | ${this.profesional.nombres}`
      };
    },
    data(){
      return{
          datosPersonalesEdit:{
            id:'',
            rut:'',
            dv:'',
            nombres:'',
            apellidos:'',
            n_contacto:'',
            ciudad:'',
            genero:'',
            email:'',
            planta:'',
            etapa:'',
            calidad:''
        },
      };
    },
    computed: {
        ...mapGetters({
            profesional: "profesionales/profesional"
        })
    },
    mounted() {
        this.getProfesional(this.$route.params.id);
        this.passingDatos();
    },
    methods: {
        ...mapActions({
            getProfesional: "profesionales/getProfesional"
        }),
        passingDatos(){
          this.datosPersonalesEdit.id         = this.profesional.id;
          this.datosPersonalesEdit.rut        = this.profesional.rut;
          this.datosPersonalesEdit.dv         = this.profesional.dv;
          this.datosPersonalesEdit.nombres    = this.profesional.nombres;
          this.datosPersonalesEdit.apellidos  = this.profesional.apellidos;
          this.datosPersonalesEdit.n_contacto = this.profesional.n_contacto;
          this.datosPersonalesEdit.ciudad     = this.profesional.ciudad;
          this.datosPersonalesEdit.genero     = this.profesional.genero_id;
          this.datosPersonalesEdit.email      = this.profesional.email;
          this.datosPersonalesEdit.planta     = this.profesional.planta_id;
          this.datosPersonalesEdit.etapa      = this.profesional.etapas_id;
          this.datosPersonalesEdit.calidad    = this.profesional.calidad_juridica_id;
        },
    },
    components: { DatosPersonales, IndexFormaciones, IndexCalculoPao, IndexEdf, IndexDocuemtos, IndexFacturas }
}
</script>

<style>

</style>
