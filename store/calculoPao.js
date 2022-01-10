export const state = () => ({
  paos:[],
  formaciones_profesional: [],
  devolucionEdit:{},
  interrupcionEditModal:{
    index:'',
    id:'',
    uuid:'',
    devolucion:'',
    pao_id:'',
    periodo:[],
    causal:'',
    observacion:'',
    devoluciones:[]
  },
  modalInterrupcion:false,
  id_especialidades:[],
  escrituras:[]
});

export const mutations = {
  SET_PAOS(state, paos){
    state.paos = paos;
    state.paos.forEach(pao => {
      state.id_especialidades = [pao.especialidad.id, ...state.id_especialidades];
    });
  },
  REFRESH_PAO(state, pao){
    const indice = state.paos.findIndex(p => p.id === pao.id);
    state.paos.splice(indice, 1, pao);
  },
  REMOVE_PAO(state, pao){
    console.log(pao);
    state.paos = state.paos.filter(p => p.uuid !== pao.uuid);
    const i = state.id_especialidades.map(id => id).indexOf(pao.especialidad.id);
    state.id_especialidades.splice(i, 1);
    console.log(state.id_especialidades);
  },
  SET_FORMACIONES_PROFESIONAL(state, formaciones_profesional){
    state.formaciones_profesional = formaciones_profesional;
  },
  ADD_CALCULO_PAO(state, pao){
    state.paos = [pao, ...state.paos];
    state.id_especialidades = [pao.especialidad.id, ...state.id_especialidades];
  },
  ADD_FORMACION_TO_PROFESIONAL(state, formacion){
    state.formaciones_profesional = [formacion, ...state.formaciones_profesional];
  },
  ADD_DEVOLUCION_PAO(state, devolucion){
    state.paos[devolucion.pao_index].devoluciones.push(devolucion);
  },
  UPDATE_DEVOLUCION_PAO(state, devolucion){
    const pao = state.paos.map(pao => pao.id).indexOf(devolucion.pao_id);
    state.paos[pao].devoluciones.splice(devolucion.index_devolucion, 1, devolucion);
  },
  REMOVE_DEVOLUCION_PAO(state, devolucion){
    const pao = state.paos.map(pao => pao.id).indexOf(devolucion.pao_id);
    state.paos[pao].devoluciones.splice(devolucion.index_devolucion);

    if(state.paos[pao].interrupciones.length){
      state.paos[pao].interrupciones.filter(i => i.devolucion_id === devolucion.id).forEach(i => state.paos[pao].interrupciones.splice(state.paos[pao].interrupciones.indexOf(i), 1));
    }
  },
  ADD_INTERRUPCION_PAO(state, interrupcion){
    state.paos[interrupcion.pao_index].interrupciones.push(interrupcion);

    const devolucion = state.paos[interrupcion.pao_index].devoluciones.find(d => d.id === interrupcion.devolucion_id);
    devolucion.interrupciones.push(interrupcion);
    console.log(devolucion);
  },
  FRES_TO_DEVOLUCION(state, fresh_devolucion){
    const indice = state.paos[fresh_devolucion.pao_index].devoluciones.map(d => d.id).indexOf(fresh_devolucion.id);

    state.paos[fresh_devolucion.pao_index].devoluciones.splice(indice, 1, fresh_devolucion);
  },
  REMOVE_INTERRUPCION_PAO(state, interrupcion){
    const pao = state.paos.map(pao => pao.id).indexOf(interrupcion.pao_id);
    state.paos[pao].interrupciones.splice(interrupcion.index_interrupcion, 1);
  },

  //modals
  QUERY_INTERRUPCION(state, interrupcion){
    state.modalInterrupcion = !state.modalInterrupcion;

    state.interrupcionEditModal.id            = interrupcion.id;
    state.interrupcionEditModal.index         = interrupcion.index;
    state.interrupcionEditModal.uuid          = interrupcion.uuid;
    state.interrupcionEditModal.devolucion    = interrupcion.devolucion_id;
    state.interrupcionEditModal.pao_id        = interrupcion.pao.id;
    state.interrupcionEditModal.periodo[0]    = interrupcion.inicio_interrupcion;
    state.interrupcionEditModal.periodo[1]    = interrupcion.termino_interrupcion;
    state.interrupcionEditModal.devoluciones  = interrupcion.pao.devoluciones;
    state.interrupcionEditModal.causal        = interrupcion.causal_id;
    state.interrupcionEditModal.observacion   = interrupcion.observacion;
  },
  CLOSE_MODAL(state){
    state.modalInterrupcion = !state.modalInterrupcion;
  },
  FRESH_TO_INTERRUPCION(state, interrupcion){
    const indice = state.paos[interrupcion.pao_index].interrupciones.map(i => i.id).indexOf(interrupcion.id);
    state.paos[interrupcion.pao_index].interrupciones.splice(indice, 1, interrupcion);
  },
  REFRESH_MODAL(state){
    for(let key in state.interrupcionEditModal){
      state.interrupcionEditModal[key] = '';
    }
    state.interrupcionEditModal.periodo = [];
    state.interrupcionEditModal.devoluciones = [];
  },
  SATE_ESCRITURAS(state, escrituras){
    state.escrituras = escrituras;
  }
};

export const getters = {
  paos(state){
    return state.paos;
  },
  formacionesProfesional(state){
    return state.formaciones_profesional;
  },
  interrupcionEdit(state){
    return state.interrupcionEditModal;
  },
  modalInterrupcion(state){
    return state.modalInterrupcion;
  },
  idEspecialidades(state){
    return state.id_especialidades;
  },
  escrituras(state){
    return state.escrituras;
  }
};

export const actions = {
  async getFormacionesProfesional({ commit }, uuid){
    const response = await this.$axios.$get('/api/profesionales/profesional/get-formaciones', {params: {uuid:uuid}});
    commit('SET_FORMACIONES_PROFESIONAL', response);
  },

  async getPaos({ commit }, uuid){
    const response = await this.$axios.$get('/api/profesionales/profesional/get-paos', {params: {uuid:uuid}});
    commit('SET_PAOS', response);
  },
  updateModal({ commit }) {
    commit('CLOSE_MODAL')
  },

  async getEscrituras({ commit }, especialidad_id){
    const response = await this.$axios.$get('/api/profesionales/profesional/add-devolucion/get-escrituras', {params:{especialidad_id:especialidad_id}});
    console.log(response);
    commit('SATE_ESCRITURAS', response);
  }
};
