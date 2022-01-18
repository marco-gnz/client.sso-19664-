export const state = () => ({
  establecimientos:[],
  establecimiento:{
    id:'',
    cod_sirh:'',
    sigla:'',
    nombre:'',
    red:'',
    grado:''
  }
});

export const mutations = {
  SET_ESTABLECIMIENTOS(state, establecimientos){
    state.establecimientos = establecimientos;
  },
  ADD_ESTABLECIMIENTO(state, newEstablecimiento){
    state.establecimientos.unshift(newEstablecimiento);
  },
  PASSING_ESTABLECIMIENTO(state, establecimiento){
    state.establecimiento.id        = establecimiento.id;
    state.establecimiento.cod_sirh  = establecimiento.cod_sirh;
    state.establecimiento.sigla     = establecimiento.sigla;
    state.establecimiento.nombre    = establecimiento.nombre;
    state.establecimiento.red       = establecimiento.red_hospitalaria_id;
    state.establecimiento.grado     = (establecimiento.grado_complejidad_id != null) ? establecimiento.grado_complejidad_id : '';
  },
  ESTABLECIMIENTO_COD_SIRH(state, cod_sirh){
    state.establecimiento.cod_sirh = cod_sirh;
  },
  ESTABLECIMIENTO_SIGLA(state, sigla){
    state.establecimiento.sigla = sigla;
  },
  ESTABLECIMIENTO_NOMBRE(state, nombre){
    state.establecimiento.nombre = nombre;
  },
  ESTABLECIMIENTO_RED(state, red){
    state.establecimiento.red = red;
  },
  ESTABLECIMIENTO_GRADO(state, grado){
    state.establecimiento.grado = grado;
  },
  UPDATE_ESTABLECIMIENTO(state, establecimiento){
    const indice = state.establecimientos.findIndex(e => e.id === establecimiento.id);
    state.establecimientos.splice(indice, 1, establecimiento);
  }
};

export const getters = {
  establecimientos(state){
    return state.establecimientos;
  }
};

export const actions = {
  async getEstablecimientos({ commit }){
    const response = await this.$axios.$get('/api/admin/mantenedores/establecimientos');
    commit('SET_ESTABLECIMIENTOS', response);
  }
};
