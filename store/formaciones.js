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
  REMOVE_FORMACION(state, uuid){
    state.formaciones = state.formaciones.filter(formacion => formacion.uuid !== uuid);
  }
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
  },
  async removeFormacion({ commit }, uuid){
    const response = await this.$axios.$delete(`/api/profesionales/profesional/remove-formacion/${uuid}`);
    if(response === true){
      commit('REMOVE_FORMACION', uuid);
    }
  }
};
