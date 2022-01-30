export const state = () => ({
  openDrawer:false,
  openDrawerEdit:false,
  convenios:[],
  formaciones:[],
  genericos:[],
  anios:[],
  newDocument:{
    tipo_formacion:'',
    formacion:'',
    tipo_documento:0
  },
  convenio:{
    id:'',
    especialidad_id:'',
    anios_arancel:'',
    valor_arancel:'',
    tipo:'',
    n_resolucion:'',
    fecha_resolucion:'',
    observacion:''
  },
  escritura:{
    id:'',
    especialidad_id:'',
    escritura_firmada:'',
    monto_garantia:'',
    n_resolucion:'',
    fecha_resolucion:'',
    observacion:'',
    n_repertorio:'',
    anio_repertorio:''
  },
  generico:{
    id:'',
    tipo:'',
    n_documento:'',
    fecha_documento:'',
    observacion:''
  },
  escrituras:[],
  escritura_firmada:false
});

export const mutations = {
  SET_CONVENIOS(state, convenios){
    state.convenios = convenios;
  },
  ADD_CONVENIO(state, convenio){
    state.convenios = [convenio, ...state.convenios];
  },
  REMOVE_CONVENIO(state, uuid){
    state.convenios = state.convenios.filter(c => c.uuid !== uuid);
  },
  REFRESH_CONVENIO(state, convenioNew){
    const indice = state.convenios.findIndex(c => c.id === convenioNew.id);
    state.convenios.splice(indice, 1, convenioNew);
  },
  PASSING_CONVENIO(state, object){
    state.newDocument.tipo_formacion  = (object.convenio.especialidad != null) ? object.convenio.especialidad.perfeccionamiento.tipo_perfeccionamiento_id : '';
    state.newDocument.formacion       = (object.convenio.especialidad != null) ? object.convenio.especialidad.id : '';
    state.newDocument.tipo_documento  = object.tipo_documento;

    state.convenio.id                 = object.convenio.id;
    state.convenio.especialidad_id    = (object.convenio.especialidad != null) ? object.convenio.especialidad.id : '';
    state.convenio.anios_arancel      = object.convenio.anios_arancel;
    state.convenio.tipo               = object.convenio.tipo_convenio_id;
    state.convenio.valor_arancel      = object.convenio.valor_arancel;
    state.convenio.n_resolucion       = object.convenio.n_resolucion;
    state.convenio.fecha_resolucion   = object.convenio.fecha_resolucion;
    state.convenio.observacion        = object.convenio.observacion;
  },
  OPEN_DRAWER(state){
    state.openDrawer = !state.openDrawer;
  },
  OPEN_DRAWER_EDIT(state){
    state.openDrawerEdit = !state.openDrawerEdit;
  },
  SET_ESCRITURAS(state, escrituras){
    state.escrituras = escrituras;
  },
  ADD_ESCRITURA(state, escritura){
    state.escrituras = [escritura, ...state.escrituras];
  },
  REFRESH_ESCRITURA(state, escrituraNew){
    const indice = state.escrituras.findIndex(e => e.id === escrituraNew.id);
    state.escrituras.splice(indice, 1, escrituraNew);
  },
  ADD_DOCUMENTO_GENERICO(state, documento){
    state.genericos = [documento, ...state.genericos];
  },
  REFRESH_DOCUMENTO_GENERICO(state, newDocumentGenerico){
    const indice = state.genericos.findIndex(d => d.id === newDocumentGenerico.id);
    state.genericos.splice(indice, 1, newDocumentGenerico);
  },
  REMOVE_DOCUMENTO_GENERICO(state, uuid){
    state.genericos = state.genericos.filter(d => d.uuid !== uuid);
  },
  REMOVE_ESCRITURA(state, uuid){
    state.escrituras = state.escrituras.filter(e => e.uuid !== uuid);
  },
  PASSING_ESCRITURA(state, object){
    state.newDocument.tipo_formacion  = object.escritura.especialidad.perfeccionamiento.tipo_perfeccionamiento_id;
    state.newDocument.formacion       = object.escritura.especialidad.id;
    state.newDocument.tipo_documento  = object.tipo_documento;

    state.escritura.id                = object.escritura.id;
    state.escritura.especialidad_id   = object.escritura.especialidad.id;
    state.escritura_firmada = (object.escritura.escritura_firmada != 1) ? false : true;
    state.escritura.monto_garantia    = object.escritura.valor_garantia;
    state.escritura.n_resolucion      = object.escritura.n_resolucion;
    state.escritura.fecha_resolucion  = object.escritura.fecha_resolucion;
    state.escritura.n_repertorio      = object.escritura.n_repertorio;
    state.escritura.anio_repertorio   = object.escritura.anio_repertorio.toString();
    state.escritura.observacion       = object.escritura.observacion;
  },
  PASSING_DOC_GENERICO(state, object){
    state.newDocument.tipo_documento  = object.tipo_documento;

    state.generico.id              = object.documento.id;
    state.generico.tipo            = object.documento.tipo_documento_id;
    state.generico.n_documento     = object.documento.n_documento;
    state.generico.fecha_documento = object.documento.fecha_documento;
    state.generico.observacion     = object.documento.observacion;
  },
  SET_FORMACIONES(state, formaciones){
    if(formaciones.length){
      state.formaciones = formaciones;
    }else{
      state.formaciones = [];
      state.newDocument.formacion = '';
    }
  },
  SET_ANIOS(state, anios){
    if(anios.length){
      state.anios = anios;
    }else{
      state.anios = [];
      state.convenio.anio_arancel = '';
    }
  },
  UPDATE_ESCRITURA_FIRMADA(state){
    state.escritura_firmada = !state.escritura_firmada;
  },

  TIPO_DOCUMENTO(state, newValue){
    state.newDocument.tipo_documento = newValue;
  },
  FECHA_RESOLUCION(state, newValue){
    state.escritura.fecha_resolucion = newValue;
  },
  ESCRITURA_N_REPERTORIO(state, newValue){
    state.escritura.n_repertorio = newValue;
  },
  ESCRITURA_ANIO_REPERTORIO(state, newValue){
    state.escritura.anio_repertorio = newValue;
  },
  ANIOS_ARANCEL(state, newAnios){
    state.convenio.anios_arancel  = newAnios;
  },
  TIPO_CONVENIO(state, newTipo){
    state.convenio.tipo = newTipo;
  },
  FECHA_RESOLUCION_CONVENIO(state, newValue){
    state.convenio.fecha_resolucion = newValue;
  },
  SET_DOC_GENERICOS(state, docGenericos){
    state.genericos = docGenericos;
  },
  TIPO_DOCUMENTO_GENERICO(state, newValue){
    state.generico.tipo = newValue;
  },
  FECHA_DOCUMENTO_GENERICO(state, newValue){
    state.generico.fecha_documento = newValue;
  }
};

export const getters = {
  convenios(state){
    return state.convenios;
  },
  drawerStatus(state){
    return state.openDrawer;
  },
  drawerStatusEdit(state){
    return state.openDrawerEdit;
  },
  formaciones(state){
    return state.formaciones;
  },
  anios(state){
    return state.anios;
  },
  escrituras(state){
    return state.escrituras;
  },
  escrituraFirmada(state){
    return state.escritura_firmada;
  },
  genericos(state){
    return state.genericos;
  }
};

export const actions = {
  async getConvenios({ commit }, uuid){
    const response = await this.$axios.$get('/api/profesionales/profesional/documentos/get-convenios', {params:{uuid:uuid}});
    commit('SET_CONVENIOS', response);
  },
  async selectTiposFormacion({ commit }, data){
    const response = await this.$axios.$get('/api/profesionales/profesional/get-formaciones-doc', {params:{uuid:data.uuid, tipo:data.tipo}});
    commit('SET_FORMACIONES', response);
  },
  async selectAnios({ commit }, especialidad_id){
    const response = await this.$axios.$get('/api/profesionales/profesional/get-formaciones-doc/anios', {params:{especialidad_id:especialidad_id}});
    commit('SET_ANIOS', response);
  },
  async getEscrituras({ commit }, uuid){
    const response = await this.$axios.$get('/api/profesionales/profesional/documentos/get-escrituras', {params:{uuid:uuid}});
    commit('SET_ESCRITURAS', response);
  },
  async getDocGenericos({ commit }, uuid){
    const response = await this.$axios.$get('/api/profesionales/profesional/documentos/generico/get-docs-generico', {params:{uuid:uuid}});
    commit('SET_DOC_GENERICOS', response);
  },
  updateDrawer({ commit }){
    commit('OPEN_DRAWER');
  },
  updateDrawerEdit({ commit }){
    commit('OPEN_DRAWER_EDIT');
  },
  updateEscrituraFirmada({ commit }){
    commit('UPDATE_ESCRITURA_FIRMADA');
  }
};
