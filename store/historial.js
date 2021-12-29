export const state = () => ({
    procesos:[],
    showModal:false,
    tipoEspecialidad:'',
    especialidad:'',
    ordenValue:false
});

export const mutations = {
  SET_HISTORIAL(state, response){
    state.procesos  = response;
  },
  CLOSE_MODAL(state){
    state.showModal = !state.showModal;
  },
  ORDER_PROCESOS(state){
    if(state.ordenValue){
      state.procesos.sort(function(a,b){
      return new Date(b.fecha_inicio) - new Date(a.fecha_inicio);
      });
    }else{
      state.procesos.sort(function(a,b){
      return new Date(a.fecha_inicio) - new Date(b.fecha_inicio);
      });
    }
  },
  NAME_ESPECIALIDAD(state, response){
    state.especialidad = response;
  },
  NAME_TIPO_ESPECIALIDAD(state, response){
    state.tipoEspecialidad = response;
  },
  CHANGE_VALUE(state){
    state.ordenValue = !state.ordenValue;
  }
};

export const getters = {
  procesos(state){
    return state.procesos;
  },
  modal(state){
    return state.showModal;
  },
  nameEspecialidad(state){
    return state.especialidad;
  },
  nameTipoEspecialidad(state){
    return state.tipoEspecialidad;
  },
  ordenFechas(state){
    return state.ordenValue;
  }
};

export const actions = {
  async getHistorial({ commit }, pao_id){
    commit('CLOSE_MODAL');
    const response = await this.$axios.$get('/api/profesionales/profesional/historial', {params: {pao_id:pao_id}});
    commit('SET_HISTORIAL', response[0]);
    commit('NAME_ESPECIALIDAD', response[1]);
    commit('NAME_TIPO_ESPECIALIDAD', response[2]);
  },
  updateModal({ commit }){
    commit('CLOSE_MODAL');
  },
  changeOrdenValue({commit}){
    commit('CHANGE_VALUE');
  }
};
