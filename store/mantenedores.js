export const state = () => ({
  plantas: [],
  calidades:[],
  causales:[],
  generos:[],
  etapas:[],
  centros_formadores:[],
  tipo_perfeccionamientos:[],
  establecimientos:[],
  establecimientosGradoComplejidad:[],
  gradosComplejidad:[],
  redes_hospitalarias:[],
  tipo_contratos:[],
  unidades:[],
  situaciones_factura:[],
  tipos_factura:[],
  redesHospitalariasUserAuth:[],
  tipoDocumentos:[],
  perfeccionamientos:[],
  situacionesActual:[],

  pagination:{
    total:0,
    current_page:0,
    per_page:0,
    last_page:0,
    from:0,
    to:0
  },
  offset: 3,

  //edit
  red:{
    id:'',
    cod_sirh:'',
    sigla:'',
    nombre:''
  },
  unidad:{
    id:'',
    cod_sirh:'',
    nombre:''
  },
  centro:{
    id:'',
    cod_sirh:'',
    nombre:''
  },
  perfeccionamiento:{
    id:'',
    cod_sirh:'',
    nombre:'',
    tipo:''
  },
  causal:{
    id:'',
    cod_sirh:'',
    nombre:''
  },
  situacion:{
    id:'',
    cod_sirh:'',
    nombre:''
  },
});

export const mutations = {
  SET_PAGINATION(state, pagination){
    state.pagination = pagination;
  },
  SET_CURRENT_PAGE(state, page){
    state.pagination.current_page = page;
  },
  SET_PLANTAS(state, plantas){
    state.plantas = plantas;
  },
  SET_CALIDADES(state, calidades){
    state.calidades = calidades;
  },
  SET_CAUSALES(state, causales){
    state.causales = causales;
  },
  ADD_CAUSAL(state, causal){
    state.causales.unshift(causal);
  },
  UPDATE_CAUSAL(state, causal){
    const indice = state.causales.findIndex(c => c.id === causal.id);
    state.causales.splice(indice, 1, causal);
  },
  PASSING_CAUSAL(state, causal){
    state.causal.id        = causal.id;
    state.causal.cod_sirh  = causal.cod_sirh;
    state.causal.nombre    = causal.nombre;
  },
  CAUSAL_COD_SIRH(state, cod_sirh){
    state.causal.cod_sirh = cod_sirh;
  },
  CAUSAL_NOMBRE(state, nombre){
    state.causal.nombre = nombre;
  },
  SET_GENEROS(state, generos){
    state.generos = generos;
  },
  SET_ETAPAS(state, etapas){
    state.etapas = etapas;
  },
  SET_CENTROS_FORMADORES(state, centros_formadores){
    state.centros_formadores = centros_formadores;
  },
  ADD_CENTRO_FORMADOR(state, centro){
    state.centros_formadores.unshift(centro);
  },
  PASSING_CENTRO(state, centro){
    state.centro.id        = centro.id;
    state.centro.cod_sirh  = centro.cod_sirh;
    state.centro.nombre    = centro.nombre;
  },
  CENTRO_COD_SIRH(state, cod_sirh){
    state.centro.cod_sirh = cod_sirh;
  },
  CENTRO_NOMBRE(state, nombre){
    state.centro.nombre = nombre;
  },
  UPDATE_CENTRO(state, newCentro){
    const indice = state.centros_formadores.findIndex(c => c.id === newCentro.id);
    state.centros_formadores.splice(indice, 1, newCentro);
  },
  SET_TIPO_PERFECCIONAMIENTOS(state, tipo_perfeccionamientos){
    state.tipo_perfeccionamientos = tipo_perfeccionamientos;
  },
  SET_ESTABLECIMIENTOS(state, establecimientos){
    state.establecimientos = establecimientos;
  },
  SET_ESTABLECIMIENTOS_GRADO_COMPLEJIDAD(state, establecimientos){
    state.establecimientosGradoComplejidad = establecimientos;
  },
  SET_REDES_HOSPITALARIAS(state, redes_hospitalarias){
    state.redes_hospitalarias = redes_hospitalarias;
  },
  ADD_RED(state, red){
    state.redes_hospitalarias = [red, ...state.redes_hospitalarias];
  },
  PASSING_RED(state, red){
    state.red.id        = red.id;
    state.red.cod_sirh  = red.cod_sirh;
    state.red.nombre    = red.nombre;
    state.red.sigla     = red.sigla;
  },
  UPDATE_RED(state, newRed){
    const indice = state.redes_hospitalarias.findIndex(r => r.id === newRed.id);
    state.redes_hospitalarias.splice(indice, 1, newRed);
  },
  RED_COD_SIRH(state, cod_sirh){
    state.red.cod_sirh = cod_sirh;
  },
  RED_NOMBRE(state, nombre){
    state.red.nombre = nombre;
  },
  RED_SIGLA(state, sigla){
    state.red.sigla = sigla;
  },
  SET_TIPO_CONTRATOS(state, tipo_contratos){
    state.tipo_contratos = tipo_contratos;
  },
  SET_UNIDADES(state, unidades){
    state.unidades = unidades;
  },
  ADD_UNIDAD(state, unidad){
    state.unidades.unshift(unidad);
  },
  PASSING_UNIDAD(state, unidad){
    state.unidad.id        = unidad.id;
    state.unidad.cod_sirh  = unidad.cod_sirh;
    state.unidad.nombre    = unidad.nombre;
  },
  UNIDAD_COD_SIRH(state, cod_sirh){
    state.unidad.cod_sirh = cod_sirh;
  },
  UNIDAD_NOMBRE(state, nombre){
    state.unidad.nombre = nombre;
  },
  UPDATE_UNIDAD(state, newUnidad){
    const indice = state.unidades.findIndex(u => u.id === newUnidad.id);
    state.unidades.splice(indice, 1, newUnidad);
  },
  SET_SITUACIONES_FACTURA(state, situaciones_factura){
    state.situaciones_factura = situaciones_factura;
  },
  SET_TIPOS_FACTURA(state, tipos_factura){
    state.tipos_factura = tipos_factura;
  },
  SET_REDES_HOSPITALARIAS_AUTH_USER(state, redes){
    state.redesHospitalariasUserAuth = redes;
  },
  SET_TIPO_DOCUMENTOS(state, tipoDocumentos){
    state.tipoDocumentos = tipoDocumentos;
  },
  SET_PERFECCIONAMIENTOS(state, perfeccionamientos){
    state.perfeccionamientos = perfeccionamientos;
  },
  ADD_PERFECCIONAMIENTO(state, perfeccionamiento){
    state.perfeccionamientos.unshift(perfeccionamiento);
  },
  PASSING_PERFECCIONAMIENTO(state, perfeccionamiento){
    state.perfeccionamiento.id        = perfeccionamiento.id;
    state.perfeccionamiento.cod_sirh  = perfeccionamiento.cod_sirh;
    state.perfeccionamiento.nombre    = perfeccionamiento.nombre;
    state.perfeccionamiento.tipo      = perfeccionamiento.tipo_perfeccionamiento_id;
  },
  PERFECCIONAMIENTO_COD_SIRH(state, cod_sirh){
    state.perfeccionamiento.cod_sirh = cod_sirh;
  },
  PERFECCIONAMIENTO_NOMBRE(state, nombre){
    state.perfeccionamiento.nombre = nombre;
  },
  PERFECCIONAMIENTO_TIPO(state, tipo){
    state.perfeccionamiento.tipo = tipo;
  },
  UPDATE_PERFECCIONAMIENTO(state, newPerfeccionamiento){
    const indice = state.perfeccionamientos.findIndex(p => p.id === newPerfeccionamiento.id);
    state.perfeccionamientos.splice(indice, 1, newPerfeccionamiento);
  },
  SET_GRADO_COMPLEJIDAD(state, grados){
    state.gradosComplejidad = grados;
  },
  SET_SITUACIONES_ACTUALES(state, situaciones){
    state.situacionesActual = situaciones;
  },
  ADD_SITUACION(state, situacion){
    state.situacionesActual.unshift(situacion);
  },
  UPDATE_SITUACION(state, newSituacion){
    const indice = state.situacionesActual.findIndex(s => s.id === newSituacion.id);
    state.situacionesActual.splice(indice, 1, newSituacion);
  },
  PASSING_SITUACION(state, situacion){
    state.situacion.id        = situacion.id;
    state.situacion.cod_sirh  = situacion.cod_sirh;
    state.situacion.nombre    = situacion.nombre;
  },
  SITUACION_COD_SIRH(state, cod_sirh){
    state.situacion.cod_sirh = cod_sirh;
  },
  SITUACION_NOMBRE(state, nombre){
    state.situacion.nombre = nombre;
  },
};

export const getters = {
  plantas(state){
    return state.plantas;
  },
  calidades(state){
    return state.calidades;
  },
  causales(state){
    return state.causales;
  },
  generos(state){
    return state.generos;
  },
  etapas(state){
    return state.etapas;
  },
  centrosFormadores(state){
    return state.centros_formadores;
  },
  tipoPerfeccionamientos(state){
    return state.tipo_perfeccionamientos;
  },
  establecimientos(state){
    return state.establecimientos;
  },
  establecimientosGradoComplejidad(state){
    return state.establecimientosGradoComplejidad;
  },
  redesHospitalarias(state){
    return state.redes_hospitalarias;
  },
  tipoContratos(state){
    return state.tipo_contratos;
  },
  unidades(state){
    return state.unidades;
  },
  situacionesFactura(state){
    return state.situaciones_factura;
  },
  tiposFactura(state){
    return state.tipos_factura;
  },
  redesHospitalariasUserAuth(state){
    return state.redesHospitalariasUserAuth;
  },
  tipoDocumentos(state){
    return state.tipoDocumentos;
  },
  perfeccionamientos(state){
    return state.perfeccionamientos;
  },
  gradosComplejidad(state){
    return state.gradosComplejidad;
  },
  situacionesActual(state){
    return state.situacionesActual;
  }
};

export const actions = {
    async getPlantas({ commit }){
      const response = await this.$axios.$get('/api/mantenedores/plantas');

      commit('SET_PLANTAS', response);
    },
    async getCalidades({ commit }){
      const response = await this.$axios.$get('/api/mantenedores/calidades');

      commit('SET_CALIDADES', response);
    },
    async getCausales({ commit }){
      const response = await this.$axios.$get('/api/mantenedores/causales');

      commit('SET_CAUSALES', response);
    },
    async getCausalesAdmin({ commit }, object){
      let search      = (object != undefined) ? object.search : '';
      let page        = (object != undefined) ? object.page : '';
      const response = await this.$axios.$get(`/api/mantenedores/causales-admin?page=${page}`, {params: {buscador:search}});

      commit('SET_CAUSALES', response.causales.data);
      commit('SET_PAGINATION', response.pagination);
    },
    async getGeneros({ commit }){
      const response = await this.$axios.$get('/api/mantenedores/generos');

      commit('SET_GENEROS', response);
    },
    async getEtapas({ commit }){
      const response = await this.$axios.$get('/api/mantenedores/etapas');

      commit('SET_ETAPAS', response);
    },
    async getCentrosFormadres({ commit }, object){
      let search      = (object != undefined) ? object.search : '';
      let page        = (object != undefined) ? object.page : '';
      const response = await this.$axios.$get(`/api/mantenedores/centros-formadores?page=${page}`, {params: {buscador:search}});

      commit('SET_CENTROS_FORMADORES', response.centros.data);
      commit('SET_PAGINATION', response.pagination);
    },
    async getTipoPerfeccionamientos({ commit }){
      const response = await this.$axios.$get('/api/mantenedores/tipo-perfeccionamientos');

      commit('SET_TIPO_PERFECCIONAMIENTOS', response);
    },
    async getRedesHospitalarias({ commit }){
      const response = await this.$axios.$get('/api/mantenedores/redes-hospitalarias');
      commit('SET_REDES_HOSPITALARIAS', response);
    },
    async getEstablecimientos({ commit }, red_hospitalaria){
      const response = await this.$axios.$get('/api/mantenedores/redes-hospitalarias/establecimientos', {params: {red_hospitalaria:red_hospitalaria}});
        commit('SET_ESTABLECIMIENTOS', response);
    },
    async getEstablecimientosGradoComplejidad({ commit }, red_hospitalaria){
      const response = await this.$axios.$get('/api/mantenedores/redes-hospitalarias/establecimientos-grado-complejidad', {params: {red_hospitalaria:red_hospitalaria}});
      commit('SET_ESTABLECIMIENTOS_GRADO_COMPLEJIDAD', response);
    },
    async getTipoContratos({ commit }){
      const response = await this.$axios.$get('/api/mantenedores/tipo-contratos');
      commit('SET_TIPO_CONTRATOS', response);
    },
    async getUnidades({ commit }, object){
      let search     = (object != undefined) ? object.search : '';
      let page       = (object != undefined) ? object.page : '';
      const response = await this.$axios.$get(`/api/mantenedores/unidades?page=${page}`, {params:{buscador:search}});
      commit('SET_UNIDADES', response.unidades.data);
      commit('SET_PAGINATION', response.pagination);
    },
    async getSituacionesFactura({ commit }){
      const response = await this.$axios.$get('/api/mantenedores/situaciones-factura');
      commit('SET_SITUACIONES_FACTURA', response);
    },
    async getTiposFactura({ commit }){
      const response = await this.$axios.$get('/api/mantenedores/tipos-factura');
      commit('SET_TIPOS_FACTURA', response);
    },
    async getRedesHospitalariasUserAuth({ commit }){
      const response = await this.$axios.$get('/api/mantenedores/redes-hospitalarias/auth-user');
      commit('SET_REDES_HOSPITALARIAS_AUTH_USER', response);
    },
    async getTipoDocumentos({ commit }){
      const response = await this.$axios.$get('/api/mantenedores/tipo-documentos');
      commit('SET_TIPO_DOCUMENTOS', response);
    },
    async getPerfeccionamientosAll({ commit }, object){
      let search     = (object != undefined) ? object.search : '';
      let page       = (object != undefined) ? object.page : '';

      const response = await this.$axios.$get(`/api/mantenedores/perfeccionamiento-all?page=${page}`, {params:search});
      commit('SET_PERFECCIONAMIENTOS', response.perfeccionamientos.data);
      commit('SET_PAGINATION', response.pagination);
    },
    async getGradoComplejidad({ commit }){
      const response = await this.$axios.$get('/api/mantenedores/grado-complejidad');
      commit('SET_GRADO_COMPLEJIDAD', response);
    },
    async getSituacionesActual({ commit }){
      const response = await this.$axios.$get('/api/mantenedores/situaciones-actual');
      commit('SET_SITUACIONES_ACTUALES', response);
    },
};


