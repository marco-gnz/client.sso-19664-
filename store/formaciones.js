export const state = () => ({
  formaciones: []
});

export const mutations = {
  SET_FORMACIONES(state, formaciones){
    state.formaciones = formaciones;
  },
  ADD_FORMACION(state, formacion){
    state.formaciones = [formacion, ...state.formaciones];
  },
  REMOVE_FORMACION(state, id){
    state.formaciones = state.formaciones.filter(f => f.id !== id);
  },
  UPDATE_FORMACION(state, formacion){
    const indice = state.formaciones.findIndex(f => f.id === formacion.id);
    state.formaciones.splice(indice, 1, formacion);
  },
};

export const getters = {
  formaciones(state){
    return state.formaciones;
  }
};

export const actions = {
  async getFormaciones({ commit }, uuid){
    const response = await this.$axios.$get('/api/profesionales/profesional/get-formaciones', {params: {uuid:uuid}});

    commit('SET_FORMACIONES', response);
  }
};
