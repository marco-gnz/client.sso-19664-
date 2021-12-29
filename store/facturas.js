export const state = () => ({
  facturas: [],
  facturaEdit:{
    uuid:'',
    situacion_actual:'',
    n_resolucion:''
  },
  factura:{}
});

export const mutations = {
  SET_FACTURAS(state, facturas){
    state.facturas = facturas;
  },
  ADD_FACTURA(state, factura){
    state.facturas = [factura, ...state.facturas];
  },
  REMOVE_FACTURA(state, uuid){
    state.facturas = state.facturas.filter(f => f.uuid !== uuid);
  },

  PASSING_FACTURA_EDIT(state, getValue){
    state.facturaEdit.uuid              = getValue.uuid;
    state.facturaEdit.situacion_actual  = getValue.situacion_factura_id;
    state.facturaEdit.n_resolucion      = getValue.n_resolucion;
  },
  UPDATE_SITUACION_FACTURA(state, newValue){
    state.facturaEdit.situacion_actual = newValue;
  },
  REFRESH_FACTURA(state, newFactura){
    const indice = state.facturas.findIndex(f => f.id === newFactura.id);
    state.facturas.splice(indice, 1, newFactura);
  },
  SHOW_FACTURA(state, factura){
    console.log(factura);
    state.factura = factura;
  }
};

export const getters = {
  facturas(state){
    return state.facturas;
  }
};

export const actions = {
  async getFacturas({ commit }, uuid){
    const response = await this.$axios.$get('/api/profesionales/profesional/documentos/factura/get-facturas', {params: {uuid: uuid}});

    commit('SET_FACTURAS', response);
  }
};
