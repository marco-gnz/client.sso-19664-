//objectos, arrays, variables, etc...
export const state = () => ({
  profesionales:[],
  profesional: {},
  datosPersonalesEdit:{
    id:'',
    rut:'',
    dv:'',
    nombres:'',
    apellidos:'',
    n_contacto:'',
    ciudad:'',
    genero:'',
    email:'',
    planta:'',
    etapa:'',
    calidad:''
  },
});

//para actualizar/sobrescribir lo que esta en state
export const mutations = {
  SET_PROFESIONALES(state, profesionales){
    state.profesionales = profesionales;
  },
  SET_PROFESIONAL(state, profesional){
    state.profesional = profesional;
  },
  UPDATE_PROFESIONAL(state, profesional){
    state.profesional = profesional;
  },
  SET_PROFESIONAL_EDIT(state, profesional){
    state.datosPersonalesEdit.id         = profesional.id;
    state.datosPersonalesEdit.rut        = profesional.rut;
    state.datosPersonalesEdit.dv         = profesional.dv;
    state.datosPersonalesEdit.nombres    = profesional.nombres;
    state.datosPersonalesEdit.apellidos  = profesional.apellidos;
    state.datosPersonalesEdit.n_contacto = profesional.n_contacto;
    state.datosPersonalesEdit.ciudad     = profesional.ciudad;
    state.datosPersonalesEdit.genero     = profesional.genero_id;
    state.datosPersonalesEdit.email      = profesional.email;
    state.datosPersonalesEdit.planta     = profesional.planta_id;
    state.datosPersonalesEdit.etapa      = profesional.etapas_id;
    state.datosPersonalesEdit.calidad    = profesional.calidad_juridica_id;
  },
  UPDATE_STATUS_PROFESIONAL(state, object){
    const indice = state.profesionales.findIndex(p => p.id === object.response.id);
    state.profesionales.splice(indice, 1, object.response);
  },
  CHAGE_ESTADO(state, value){
      /* console.log(value);
      state.profesionales[value.index].estado = value.newValue; */
  }
};

//para retornar a un componente o pagina lo que este en state
export const getters = {
  profesionales(state){
    return state.profesionales;
  },
  profesional(state){
    return state.profesional;
  },
  profesionalEdit(state){
    return state.datosPersonalesEdit;
  }
};

//metodos para interactuar con la api
export const actions = {
  async getProfesionales({ commit }){
    const response = await this.$axios.$get('/api/profesionales/profesional/get-profesionales');

    //pasamos la respuesta de la api a la mutations

    commit('SET_PROFESIONALES', response);
  },
  async getProfesional({ commit }, uuid){
    const response = await this.$axios.$get(`/api/profesionales/profesional/get-profesional/${uuid}`);
    commit('SET_PROFESIONAL', response);
    commit('SET_PROFESIONAL_EDIT', response);
  }
};
