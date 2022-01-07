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
  redes_hospitalarias:[],
  tipo_contratos:[],
  unidades:[],
  situaciones_factura:[],
  tipos_factura:[],
  redesHospitalariasUserAuth:[],
  tipoDocumentos:[],
  perfeccionamientos:[]
});

export const mutations = {
  SET_PLANTAS(state, plantas){
    state.plantas = plantas;
  },
  SET_CALIDADES(state, calidades){
    state.calidades = calidades;
  },
  SET_CAUSALES(state, causales){
    state.causales = causales;
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
  SET_TIPO_CONTRATOS(state, tipo_contratos){
    state.tipo_contratos = tipo_contratos;
  },
  SET_UNIDADES(state, unidades){
    state.unidades = unidades;
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
  }
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
    async getGeneros({ commit }){
      const response = await this.$axios.$get('/api/mantenedores/generos');

      commit('SET_GENEROS', response);
    },
    async getEtapas({ commit }){
      const response = await this.$axios.$get('/api/mantenedores/etapas');

      commit('SET_ETAPAS', response);
    },
    async getCentrosFormadres({ commit }){
      const response = await this.$axios.$get('/api/mantenedores/centros-formadores');

      commit('SET_CENTROS_FORMADORES', response);
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
    async getUnidades({ commit }){
      const response = await this.$axios.$get('/api/mantenedores/unidades');
      commit('SET_UNIDADES', response);
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
    async getPerfeccionamientosAll({ commit }){
      const response = await this.$axios.$get('/api/mantenedores/perfeccionamiento-all');
      commit('SET_PERFECCIONAMIENTOS', response);
    }
};


