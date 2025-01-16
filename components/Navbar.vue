<template>
  <div>
    <!-- menú de navegación -->
    <b-navbar toggleable="lg" type="primary" variant="light" class="is-transparent is-fixed-top" z>
      <b-navbar-brand to="/">
        <img src="~/assets/img/logo-sso.png" style="width:35px; height:35px;" class="d-inline-block align-top"
          alt="SSO">
        <span class="h3 text-gray-900">S19</span>
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="$auth.loggedIn">
          <b-nav-item-dropdown text="PROFESIONAL" class="font-weight-bold" right>
            <b-dropdown-item
              v-if="$auth.user.permissions_roles.includes('ingresar-profesional') || $auth.user.permissions.includes('ingresar-profesional')"
              href="#" to="/ingresar/profesional">Ingresar profesional</b-dropdown-item>
            <b-dropdown-item href="#" to="/profesionales">Lista de profesionales</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item class="font-weight-bold" href="#" to="/redes"
            v-if="$auth.user.permissions_roles.includes('ver-dato-maestro') || $auth.user.permissions.includes('ver-dato-maestro')">MANTENEDORES</b-nav-item>
          <b-nav-item class="font-weight-bold" href="#" to="/usuarios"
            v-if="$auth.user.permissions_roles.includes('ingresar-usuario') || $auth.user.permissions.includes('ingresar-usuario')">USUARIOS
            DEL SISTEMA</b-nav-item>
        </b-navbar-nav>
        <!-- client-only es para que lo que esta dentro de la plantilla html solo se renderice en el cliente y no en server -->
        <client-only>
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right v-if="$auth.loggedIn">
              <template #button-content><strong>{{ $auth.user.primer_nombre }}</strong></template>
              <b-dropdown-item to="/mi-perfil">Mi perfil</b-dropdown-item>
              <b-dropdown-item href="#" @click.prevent="logout" v-loading.fullscreen.lock="fullscreenLoading">Cerrar
                sesión</b-dropdown-item>
            </b-nav-item-dropdown>
            <!-- <template v-if="!$auth.loggedIn">
                <b-nav-item to="/login">Iniciar sesión</b-nav-item>
              </template> -->
          </b-navbar-nav>
        </client-only>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import {mapMutations} from 'vuex';
export default {
  data(){
    return{
      fullscreenLoading:false
    };
  },
  methods:{
    ...mapMutations({
      refreshFiltro:'profesionales/REFRESH_FILTRO'
    }),
    async logout(){
      this.fullscreenLoading = !this.fullscreenLoading;
      await this.$auth.logout();
      this.$router.replace({name: 'login'});
      this.fullscreenLoading = !this.fullscreenLoading;
      this.refreshFiltro();
      localStorage.removeItem('filtros');
      localStorage.removeItem('filtros_usuarios');
    }
  }
}
</script>
