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
  pagination:{
    total:0,
    current_page:0,
    per_page:0,
    last_page:0,
    from:0,
    to:0
  },
  search:{
    input:'',
    perfeccion:[],
    f_ed:[],
    f_ef:[],
    f_pao:[],
    checkedEtapas:[],
    red:'',
    establecimiento:[],
    active_filtro_avanzado:false
  },
  offset: 3,
  openModal:false,
  fullscreenLoading:false
});

//para actualizar/sobrescribir lo que esta en state
export const mutations = {
  SET_LOADING(state){
    state.fullscreenLoading = !state.fullscreenLoading;
  },
  OPEN_MODAL(state){
    state.openModal = !state.openModal;
  },
  SET_PROFESIONALES(state, profesionales){
    state.profesionales = profesionales;
  },
  SET_PAGINATION_PROFESIONALES(state, pagination){
    state.pagination = pagination;
  },
  SET_CURRENT_PAGE(state, page){
    state.pagination.current_page = page;
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
  },
  SET_INPUT_SEARCH(state, value){
    state.search.input = value;
  },
  SET_ETAPAS(state, value){
    state.search.checkedEtapas = value;
  },
  SET_PERFECCION(state, value){
    state.search.perfeccion = value;
  },
  SET_FECHA_ETAPA_DESTINACION(state, value){
    state.search.f_ed = value;
  },
  SET_FECHA_ETAPA_FORMACION(state, value){
    state.search.f_ef = value;
  },
  SET_RED(state, value){
    state.search.red = value;
  },
  SET_ESTABLECIMIENTO(state, value){
    state.search.establecimiento = value;
  },
  SET_FECHA_PAO(state, value){
    state.search.f_pao = value;
  },
  REFRESH_ESTABLECIMIENTO(state){
    state.search.establecimiento = '';
  },
  SET_ACTIVE_FILTRO_AVANZADO(state, value){
    state.search.active_filtro_avanzado = value;
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
  },
  modalStatus(state){
    return state.openModal;
  },
  inputSearch(state){
    return state.search.input;
  },
  checkedEtapas(state){
    return state.search.checkedEtapas;
  },
  perfeccion(state){
    return state.search.perfeccion;
  },
  fechaEtapaDestinacion(state){
    return state.search.f_ed;
  },
  fechaEtapaFormacion(state){
    return state.search.f_ef;
  },
  red(state){
    return state.search.red;
  },
  establecimiento(state){
    return state.search.establecimiento;
  },
  fechaPao(state){
    return state.search.f_pao;
  },
  activeFiltroAvanzado(state){
    return state.search.active_filtro_avanzado;
  }
};

//metodos para interactuar con la api
export const actions = {
  async getProfesionales({ commit }, object){
    commit('SET_LOADING');
    let search      = (object != undefined) ? object.search : '';
    let page        = (object != undefined) ? object.page : '';
    const response  = await this.$axios.$get(`/api/profesionales/profesional/get-profesionales?page=${page}`, {params: search});

    if(response){
      commit('SET_LOADING');
    }

    commit('SET_PROFESIONALES', response.profesionales.data);
    commit('SET_PAGINATION_PROFESIONALES', response.pagination);
  },
  async getProfesional({ commit }, uuid){
    const response = await this.$axios.$get(`/api/profesionales/profesional/get-profesional/${uuid}`);
    commit('SET_PROFESIONAL', response);
    commit('SET_PROFESIONAL_EDIT', response);
  },
  updateModal({ commit }){
    commit('OPEN_MODAL');
  },
  refreshEstablecimiento({commit}){
    commit('REFRESH_ESTABLECIMIENTO');
  },
  loadingApi({commit}){
    commit('SET_LOADING');
  }
};
