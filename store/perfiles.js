export const state = () => ({
  perfiles:[],
  permisosToPerfil:[],
  permisosExtras:[]
});

export const mutations = {
  SET_PERFILES(state, perfiles){
    state.perfiles = perfiles;
  },
  SET_PERMISOS_TO_PERFIL(state, permisos){
    state.permisosToPerfil = permisos;
  },
  SET_PERMISOS_EXTRAS(state, permisos){
    state.permisosExtras = permisos;
  }
};

export const getters = {
  perfiles(state){
    return state.perfiles;
  },
  permisosToPerfil(state){
    return state.permisosToPerfil;
  },
  permisosExtras(state){
    return state.permisosExtras;
  }
};

export const actions = {
  async getPerfiles({ commit }){
    const response = await this.$axios.$get('/api/perfiles');
    commit('SET_PERFILES', response);
  },
  async getPermisosToPerfil({ commit }, id_perfil){
    const response = await this.$axios.$get('/api/perfil/get-permisos', {params:{id_perfil:id_perfil}});
    commit('SET_PERMISOS_TO_PERFIL', response);
  },
  async getPermisosExtras({ commit }, id_perfil){
    const response = await this.$axios.$get('/api/perfil/get-permisos-extras', {params:{id_perfil:id_perfil}});
    commit('SET_PERMISOS_EXTRAS', response);
  }
};
