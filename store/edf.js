export const state = () => ({
  destinaciones: [],
  formaciones: []
});

export const mutations = {
  SET_DESTINACIONES(state, destinaciones){
    state.destinaciones = destinaciones;
  },
  SET_FORMACIONES(state, formaciones){
    state.formaciones = formaciones;
  },
  STORE_DESTINACION(state, destinacion){
    state.destinaciones = [destinacion, ...state.destinaciones];
  },
  REMOVE_DESTINACION(state, uuid){
    state.destinaciones = state.destinaciones.filter(destinacion => destinacion.uuid !== uuid);
  },

  STORE_FORMACION(state, formacion){
    state.formaciones = [formacion, ...state.formaciones];
  },
  REMOVE_FORMACION(state, uuid){
    state.formaciones = state.formaciones.filter(formacion => formacion.uuid !== uuid);
  },
};

export const getters = {
  destinaciones(state){
    return state.destinaciones;
  },
  formaciones(state){
    return state.formaciones;
  }
};

export const actions = {
  async getDestinaciones({ commit }, uuid){
    const response = await this.$axios.$get('/api/profesionales/profesional/edf/get-destinaciones', {params: {uuid: uuid}});

    commit('SET_DESTINACIONES', response);
  },
  async getFormaciones({ commit }, uuid){
    const response = await this.$axios.$get('/api/profesionales/profesional/edf/get-formaciones', {params: {uuid: uuid}});

    commit('SET_FORMACIONES', response);
  }
};
