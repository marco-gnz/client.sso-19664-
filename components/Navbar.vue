<template>
    <div>
      <!-- menú de navegación -->
      <b-navbar toggleable="lg" type="light" variant="faded" class="is-transparent is-fixed-top">
        <b-navbar-brand to="/">
        <img src="~/assets/img/logo-sso.png" style="width:35px; height:35px;" class="d-inline-block align-top" alt="SSO">
        Ley Médica
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav v-if="$auth.loggedIn">
            <b-nav-item-dropdown text="Profesional" right>
                <b-dropdown-item v-if="$auth.user.permissions_roles.includes('ingresar-profesional') || $auth.user.permissions.includes('ingresar-profesional')" href="#" to="/ingresar/profesional">Ingresar profesional</b-dropdown-item>
                <b-dropdown-item href="#" to="/profesionales">Lista de profesionales</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item href="#" to="/mantenedores" v-if="$auth.user.permissions_roles.includes('ver-dato-maestro') || $auth.user.permissions.includes('ver-dato-maestro')">Mantenedores</b-nav-item>
            <b-nav-item href="#" to="/usuarios" v-if="$auth.user.permissions_roles.includes('ingresar-usuario') || $auth.user.permissions.includes('ingresar-usuario')">Usuarios del sistema</b-nav-item>
          </b-navbar-nav>
          <!-- client-only es para que lo que esta dentro de la plantilla html solo se renderice en el cliente y no en server -->
          <client-only>
            <b-navbar-nav class="ml-auto">
              <b-nav-item-dropdown right v-if="$auth.loggedIn">
                <template #button-content>{{ $auth.user.primer_nombre }}</template>
                <b-dropdown-item to="/mi-perfil">Mi perfil</b-dropdown-item>
                <b-dropdown-item href="#" @click.prevent="logout" v-loading.fullscreen.lock="fullscreenLoading">Cerrar sesión</b-dropdown-item>
              </b-nav-item-dropdown>
              <template v-if="!$auth.loggedIn">
                <b-nav-item to="/login">Iniciar sesión</b-nav-item>
              </template>
            </b-navbar-nav>
          </client-only>
        </b-collapse>
      </b-navbar>
    </div>
</template>

<script>
export default {
  data(){
    return{
      fullscreenLoading:false
    };
  },
  methods:{
    async logout(){
      this.fullscreenLoading = !this.fullscreenLoading;
      await this.$auth.logout();
      this.$router.replace({name: 'login'});
      this.fullscreenLoading = !this.fullscreenLoading;
      localStorage.removeItem('filtros');
    }
  }
}
</script>
