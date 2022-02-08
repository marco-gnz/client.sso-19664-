<template>
    <div>
      <div class="content-header pt-4">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 col-xl-12">
              <div class="card shadow">
                <b-card no-body>
                  <b-tabs pills card vertical nav-wrapper-class="w-20">
                    <b-tab class="font-weight-bold" disabled :title="`${profesional.nombres} ${profesional.apellidos}`"></b-tab>
                    <b-tab title="Datos personales">
                      <DatosPersonales :profesional="profesional"/>
                    </b-tab>
                    <b-tab :disabled="!grupoFormaciones.includes(profesional.situacion_actual_id) && profesional.especialidades_count <= 0" title="Formaciones">
                      <IndexFormaciones :profesional="profesional"/>
                    </b-tab>
                    <b-tab :disabled="!grupoCalculoPao.includes(profesional.situacion_actual_id) && profesional.paos_count <= 0" title="Registro PAO">
                      <IndexCalculoPao />
                    </b-tab>
                    <b-tab :disabled="!grupoCalculoEdf.includes(profesional.situacion_actual_id) && profesional.destinaciones_count <= 0" title="Registro EDF">
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
      <IndexDocuemtos :profesional="profesional"/>
    </div>
</template>

<script>

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
          grupoFormaciones:[1, 2, 3,4,6,7,8,9, 11, 12, 13], //formaciones,
          grupoCalculoPao:[4, 6, 7, 8, 9, 10, 11, 12, 13],
          grupoCalculoEdf:[1, 2, 3, 4, 5, 8, 13],
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
