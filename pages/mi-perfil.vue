<template>
  <div class="container-fluid mt-5">
    <el-tabs v-model="activeName">
    <el-tab-pane label="Mis permisos" name="permisos">
      <div class="row">
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-header py-3">
              <div class="row">
                  <div class="col-md-6">
                      <h6 class="m-0 font-weight-bold text-primary">Mis datos personales</h6>
                  </div>
              </div>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-12">
                  <b-list-group>
                    <b-list-group-item>
                      <div class="row">
                        <div class="col-md-6">
                          <strong>Rut</strong>:
                        </div>
                        <div class="col-md-6">
                          <span>{{$auth.user.rut}}-{{$auth.user.dv}}</span>
                        </div>
                      </div>
                    </b-list-group-item>
                    <b-list-group-item>
                      <div class="row">
                        <div class="col-md-6">
                          <strong>Nombres</strong>:
                        </div>
                        <div class="col-md-6">
                          <span>{{$auth.user.primer_nombre}} {{$auth.user.segundo_nombre}} {{$auth.user.apellido_paterno}} {{$auth.user.apellido_materno}}</span>
                        </div>
                      </div>
                    </b-list-group-item>
                    <b-list-group-item>
                      <div class="row">
                        <div class="col-md-6">
                          <strong>Siglas</strong>:
                        </div>
                        <div class="col-md-6">
                          <span>{{$auth.user.sigla}}</span>
                        </div>
                      </div>
                    </b-list-group-item>
                    <b-list-group-item>
                      <div class="row">
                        <div class="col-md-6">
                          <strong>Correo autenticación</strong>:
                        </div>
                        <div class="col-md-6">
                          <span>{{$auth.user.email}}</span>
                        </div>
                      </div>
                    </b-list-group-item>
                    <b-list-group-item>
                      <div class="row">
                        <div class="col-md-6">
                          <strong>Establecimiento</strong>:
                        </div>
                        <div class="col-md-6">
                          <span>HOSPITAL ...</span>
                        </div>
                      </div>
                    </b-list-group-item>
                  </b-list-group>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-header py-3">
              <div class="row">
                  <div class="col-md-6">
                      <h6 class="m-0 font-weight-bold text-primary">Mis permisos en sistema</h6>
                  </div>
              </div>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-12">
                  <b-list-group>
                    <b-list-group-item>
                      <div class="row">
                        <div class="col-md-6">
                          <strong>Perfiles</strong>:
                        </div>
                        <div class="col-md-6">
                          <span>{{ ($auth.user.roles.length > 0) ? $auth.user.roles.map(r => r).join(' - ') : '--' }}</span>
                        </div>
                      </div>
                    </b-list-group-item>
                    <b-list-group-item>
                      <div class="row">
                        <div class="col-md-6">
                          <strong>Permisos vía Perfiles</strong>:
                        </div>
                        <div class="col-md-6">
                          <span>{{ ($auth.user.permissions_roles.length > 0) ? $auth.user.permissions_roles.map(p => p).join(' - ') : '--' }}</span>
                        </div>
                      </div>
                    </b-list-group-item>
                    <b-list-group-item>
                      <div class="row">
                        <div class="col-md-6">
                          <strong>Permisos extras</strong>:
                        </div>
                        <div class="col-md-6">
                          <span>----</span>
                        </div>
                      </div>
                    </b-list-group-item>
                    <b-list-group-item>
                      <div class="row">
                        <div class="col-md-6">
                          <strong>Redes hospitalarias</strong>:
                        </div>
                        <div class="col-md-6">
                          <span>----</span>
                        </div>
                      </div>
                    </b-list-group-item>
                  </b-list-group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="Mi contraseña" name="contrasena">
      <div class="row pt-lg-4">
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-header py-3">
              <div class="row">
                  <div class="col-md-6">
                      <h6 class="m-0 font-weight-bold text-primary">Mi contraseña</h6>
                  </div>
              </div>
            </div>
            <div class="card-body">
              <Pass />
            </div>
          </div>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import Pass from "../components/perfil/pass.vue";
export default {
    middleware: 'auth',
    components: { Pass },
    data(){
      return{
        activeName:'permisos'
      };
    },
}
</script>

<style>

</style>
