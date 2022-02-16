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
    direccion_residencia:'',
    genero:'',
    email:'',
    planta:'',
    etapa:'',
    calidad:'',
    situacion_actual:''
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
    estados:[],
    perfeccion:[],
    situacion:[],
    f_ed:[],
    f_ef:[],
    f_pao:[],
    checkedEtapas:[],
    red:'',
    establecimiento:[],
    active_filtro_avanzado:false,
    all_perfeccionamiento:false
  },
  offset: 3,
  openModal:false,
  fullscreenLoading:false,
  estados:[
    {value:0, nombre:'Deshabilitado', descripcion:'Deshabilitado en sistema'},
    {value:1, nombre:'Habilitado', descripcion:'Habilitado en sistema'},
  ]
});

//para actualizar/sobrescribir lo que esta en state
export const mutations = {
  SET_LOADING_SEARCH(state){
    state.fullscreenLoading = true;
  },
  SET_LOADING_NOT_SEARCH(state){
    state.fullscreenLoading = false;
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
    state.datosPersonalesEdit.id                        = profesional.id;
    state.datosPersonalesEdit.rut                       = profesional.rut;
    state.datosPersonalesEdit.dv                        = profesional.dv;
    state.datosPersonalesEdit.nombres                   = profesional.nombres;
    state.datosPersonalesEdit.apellidos                 = profesional.apellidos;
    state.datosPersonalesEdit.n_contacto                = (profesional.n_contacto != null) ? profesional.n_contacto : '';
    state.datosPersonalesEdit.ciudad                    = (profesional.ciudad != null) ? profesional.ciudad : '';
    state.datosPersonalesEdit.direccion_residencia      = (profesional.direccion_residencia != null) ? profesional.direccion_residencia : '';
    state.datosPersonalesEdit.genero                    = (profesional.genero_id != null) ? profesional.genero_id : '';
    state.datosPersonalesEdit.email                     = (profesional.email != null) ? profesional.email : '';
    state.datosPersonalesEdit.planta                    = (profesional.planta_id != null) ? profesional.planta_id : '';
    state.datosPersonalesEdit.etapa                     = (profesional.etapas_id != null) ? profesional.etapas_id : '';
    state.datosPersonalesEdit.calidad                   = (profesional.calidad_juridica_id != null) ? profesional.calidad_juridica_id : '';
    state.datosPersonalesEdit.situacion_actual          = (profesional.situacion_actual_id != null) ? profesional.situacion_actual_id : '';
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
  SET_ESTADOS(state, values){
    state.search.estados = values;
  },
  SET_SITUACION_ACTUAL(state, value){
    state.search.situacion = value;
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
  },
  SET_ALL_PERFECCIONAMIENTO(state){
    state.search.all_perfeccionamiento = !state.search.all_perfeccionamiento;
  },
  SET_PARAMS_FILTRO(state, filtroLocalStorage){
    state.search.input                    =  (filtroLocalStorage.input != null) ? filtroLocalStorage.input : '';
    state.search.estados                  = filtroLocalStorage.estados;
    state.search.perfeccion               = filtroLocalStorage.perfeccion;
    state.search.f_ed                     = filtroLocalStorage.f_ed;
    state.search.f_ef                     = filtroLocalStorage.f_ef;
    state.search.f_pao                    = filtroLocalStorage.f_pao;
    state.search.checkedEtapas            = filtroLocalStorage.checkedEtapas;
    state.search.establecimiento          = filtroLocalStorage.establecimiento;
    state.search.active_filtro_avanzado   = filtroLocalStorage.active_filtro_avanzado;
    state.search.situacion                = filtroLocalStorage.situacion;
    state.search.all_perfeccionamiento    = filtroLocalStorage.all_perfeccionamiento;
  },
  REFRESH_FILTRO(state){
    state.search.input                    = '';
    state.search.estados                  = [];
    state.search.perfeccion               = [];
    state.search.f_ed                     = [];
    state.search.f_ef                     = [];
    state.search.f_pao                    = [];
    state.search.checkedEtapas            = [];
    state.search.red                      = '';
    state.search.establecimiento          = [];
    state.search.active_filtro_avanzado   = false;
    state.search.situacion                = [];
    state.search.all_perfeccionamiento    = false;
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
  situacion(state){
    return state.search.situacion;
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
  },
  checkedEstados(state){
    return state.search.estados;
  },
  estados(state){
    return state.estados;
  },
  allPerfeccionamiento(state){
    return state.search.all_perfeccionamiento;
  }
};

//metodos para interactuar con la api
export const actions = {
  async getProfesionales({ commit, state }){
    commit('SET_LOADING_SEARCH');
    const response  = await this.$axios.$get(`/api/profesionales/profesional/get-profesionales?page=${state.pagination.current_page}`,
     {params:
      {
        input:state.search.input,
        perfeccion:state.search.perfeccion,
        f_ed: state.search.f_ed,
        f_ef: state.search.f_ef,
        f_pao: state.search.f_pao,
        checkedEtapas:state.search.checkedEtapas,
        establecimiento:state.search.establecimiento,
        estados:state.search.estados,
        situaciones:state.search.situacion,
        exist_perfeccionamiento:state.search.all_perfeccionamiento
      }
    }
     );

     console.log(response);

    if(response){
      commit('SET_LOADING_NOT_SEARCH');
    }

    commit('SET_PROFESIONALES', response.profesionales);
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
