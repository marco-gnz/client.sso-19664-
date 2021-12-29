<template>
    <div>
      <div class="row">
        <div class="col-md-6">
          <h6>Lista de formaciones</h6>
        </div>
        <div class="col-md-6">
          <button v-b-modal.modal-add-especialidad class="btn btn-success float-right">Ingresar formación</button>
        </div>
      </div>
      <div class="row pt-lg-3">
        <div class="col-md-12">
          <template v-if="formaciones.length">
              <table class="table table-xs pt-2">
                <thead>
                      <tr>
                          <th>Origen</th>
                          <th>Centro</th>
                          <th>Tipo</th>
                          <th>Perfeccionamiento</th>
                          <th>Registro</th>
                          <th>Periodo de formación</th>
                          <th>&nbsp;</th>
                      </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(especialidad, index) in formaciones" :key="index">
                      <td>{{especialidad.origen}}</td>
                      <td>{{especialidad.centro_formador.nombre}}</td>
                      <td>{{especialidad.perfeccionamiento.tipo.nombre}}</td>
                      <td>{{especialidad.perfeccionamiento.nombre}}</td>
                      <td>{{DateTime.fromISO(especialidad.fecha_registro).toFormat('dd-LL-yyyy')}}</td>
                      <td>{{DateTime.fromISO(especialidad.inicio_formacion).toFormat('dd-LL-yyyy')}} a {{DateTime.fromISO(especialidad.termino_formacion).toFormat('dd-LL-yyyy')}}</td>
                      <td @click.stop="">
                          <el-dropdown>
                              <span class="el-dropdown-link">
                                  Acción<i class="el-icon-arrow-down el-icon--right"></i>
                              </span>
                              <el-dropdown-menu slot="dropdown">
                                  <!-- <el-dropdown-item icon="el-icon-edit" v-b-modal.modal-edit-devolucion>Editar</el-dropdown-item> -->
                                  <el-dropdown-item icon="el-icon-delete" @click.native="deleteEspecialidad(especialidad.uuid)">Eliminar</el-dropdown-item>
                              </el-dropdown-menu>
                          </el-dropdown>
                      </td>
                    </tr>
                  </tbody>
              </table>
          </template>
          <template v-else>
            <el-alert
              title="El profesional no tiene registro de formaciones..."
              type="warning"
              show-icon
              :closable="false"
              >
            </el-alert>
          </template>
        </div>
      </div>
      <ModalCreate :profesional="profesional" />
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import ModalCreate from "./modals/ModalCreate.vue";
export default {
    props: ['profesional'],
    data() {
        return {

        };
    },
    computed:{
      ...mapGetters({
        formaciones: 'formaciones/formaciones'
      })
    },
    methods:{
        ...mapActions({
          getFormacionesAction: 'formaciones/getFormaciones',
          removeFormacionAction: 'formaciones/removeFormacion'
        }),
        deleteEspecialidad(uuid){
          this.$confirm('¿Eliminar formación?. Se eliminará todo registro asociado a la formación (Devoluciones PAO, documentos, etc...)', 'Alerta', {
          confirmButtonText: 'Si, eliminar',
          cancelButtonText: 'Cancelar',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: 'Formación eliminada con éxito.'
          });
          this.removeFormacionAction(uuid);
        })
        }
    },
    mounted(){
      this.getFormacionesAction(this.$route.params.id);
    },
    components: { ModalCreate }
}
</script>

<style>

</style>
