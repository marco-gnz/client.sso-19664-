export const state = () => ({
  destinaciones: [],
  formaciones: [],
  destinacionEdit:{
    id:'',
    red:'',
    campo_clinico:'',
    grado:'',
    unidad:'',
    periodo:[],
    situacion_profesional:'',
    observacion:'',
    aumentar:false,
    aumentar_observacion:''
  },
  showDestinacion:{},
  formacionEdit:{
    id:'',
    centro_formador:'',
    tipo_perfeccionamiento:'',
    perfeccionamiento:'',
    fecha_registro:'',
    origen:'',
    campo_clinico:'',
    periodo:[],
    situacion_profesional:'',
    observacion:'',
    count_paos:0,
    aumentar:false,
    aumentar_observacion:''
  },
  showFormacion:{}
});

export const mutations = {
  SET_DESTINACIONES(state, destinaciones){
    state.destinaciones = destinaciones;
  },
  SET_FORMACIONES(state, formaciones){
    state.formaciones = formaciones;
  },
  STORE_DESTINACION(state, destinacion){
    state.destinaciones = [destinacion, ...state.destinaciones];
  },
  REMOVE_DESTINACION(state, uuid){
    state.destinaciones = state.destinaciones.filter(destinacion => destinacion.uuid !== uuid);
  },
  PASSING_DESTINACION(state, destinacion){
    state.destinacionEdit.id                        = destinacion.id;
    state.destinacionEdit.red                       = destinacion.establecimiento.red_hospitalaria_id;
    state.destinacionEdit.campo_clinico             = destinacion.establecimiento_id;
    state.destinacionEdit.grado                     = destinacion.grado_complejidad_establecimiento_id;
    state.destinacionEdit.unidad                    = destinacion.unidad_id;
    state.destinacionEdit.periodo[0]                = destinacion.inicio_periodo;
    state.destinacionEdit.periodo[1]                = destinacion.termino_periodo;
    state.destinacionEdit.situacion_profesional     = destinacion.situacion_profesional_id;
    state.destinacionEdit.observacion               = destinacion.observacion;
    state.destinacionEdit.aumentar                  = destinacion.aumentar != 1 ? false : true;
    state.destinacionEdit.aumentar_observacion      = destinacion.aumentar_observacion;
  },
  UPDATE_DESTINACION(state, destinacion){
    const indice = state.destinaciones.findIndex(d => d.id === destinacion.id);
    state.destinaciones.splice(indice, 1, destinacion);
  },
  DESTINACION_RED(state, newValue){
    state.destinacionEdit.red = newValue;
  },
  DESTINACION_CAMPO_CLINICO(state, newValue){
    state.destinacionEdit.campo_clinico = newValue;
  },
  DESTINACION_GRADO(state, newValue){
    state.destinacionEdit.grado = newValue;
  },
  DESTINACION_UNIDAD(state, newValue){
    state.destinacionEdit.unidad = newValue;
  },
  DESTINACION_OBSERVACION(state, newValue){
    state.destinacionEdit.observacion = newValue;
  },
  DESTINACION_PERIODO(state, newValue){
    state.destinacionEdit.periodo = [];
    if(newValue != null){
      state.destinacionEdit.periodo.push(newValue[0]);
      state.destinacionEdit.periodo.push(newValue[1]);
    }else{
      state.destinacionEdit.periodo.push('');
      state.destinacionEdit.periodo.push('');
    }

  },
  DESTINACION_AUMENTAR(state, newValue){
    state.destinacionEdit.aumentar = newValue;
  },
  DESTINACION_AUMENTAR_OBSERVACION(state, newValue){
    state.destinacionEdit.aumentar_observacion = newValue;
  },
  DESTINACION_SITUACION_PROFESIONAL(state, newValue){
    state.destinacionEdit.situacion_profesional = newValue;
  },
  SHOW_DESTINACION(state, destinacion){
    state.showDestinacion = destinacion;
  },

  PASSING_FORMACION(state, formacion){
    state.formacionEdit.id                      = formacion.id;
    state.formacionEdit.centro_formador         = formacion.centro_formador_id;
    state.formacionEdit.tipo_perfeccionamiento  = formacion.perfeccionamiento.tipo_perfeccionamiento_id;
    state.formacionEdit.perfeccionamiento       = formacion.perfeccionamiento_id;
    state.formacionEdit.fecha_registro          = formacion.fecha_registro;
    state.formacionEdit.origen                  = formacion.origen;
    state.formacionEdit.periodo[0]              = (formacion.inicio_formacion != null) ? formacion.inicio_formacion : state.formacionEdit.periodo = [];
    state.formacionEdit.periodo[1]              = (formacion.termino_formacion != null) ? formacion.termino_formacion : state.formacionEdit.periodo = [];
    state.formacionEdit.campo_clinico           = formacion.campo_clinico != null ? formacion.campo_clinico.id : '';
    state.formacionEdit.situacion_profesional   = formacion.situacion_profesional_id != null ? formacion.situacion_profesional_id : '';
    state.formacionEdit.observacion             = formacion.observacion;
    state.formacionEdit.count_paos              = (formacion.paos != null) ? formacion.paos.length : 0;
    state.formacionEdit.aumentar                = formacion.aumentar  != 1 ? false : true;
    state.formacionEdit.aumentar_observacion    = formacion.aumentar_observacion;
  },
  FORMACION_CENTRO_FORMADOR(state, newValue){
    state.formacionEdit.centro_formador  = newValue;
  },
  FORMACION_TIPO_PERFECCIONAMIENTO(state, newValue){
    state.formacionEdit.tipo_perfeccionamiento  = newValue;
  },
  FORMACION_PERFECCIONAMIENTO(state, newValue){
    state.formacionEdit.perfeccionamiento  = newValue;
  },
  FORMACION_FECHA_REGISTRO(state, newValue){
    state.formacionEdit.fecha_registro  = newValue;
  },
  FORMACION_ORIGEN(state, newValue){
    state.formacionEdit.origen = newValue;
  },
  FORMACION_CAMPO_CLINICO(state, newValue){
    state.formacionEdit.campo_clinico = newValue;
  },
  FORMACION_PERIODO(state, newValue){
    state.formacionEdit.periodo = [];
    if(newValue != null){
      state.formacionEdit.periodo.push(newValue[0]);
      state.formacionEdit.periodo.push(newValue[1]);
    }else{
      state.formacionEdit.periodo.push('');
      state.formacionEdit.periodo.push('');
    }
  },
  FORMACION_OBSERVACION(state, newValue){
    state.formacionEdit.observacion  = newValue;
  },
  FORMACION_SITUACION_PROFESIONAL(state, newValue){
    state.formacionEdit.situacion_profesional = newValue;
  },
  FORMACION_AUMENTAR(state, newValue){
    state.formacionEdit.aumentar = newValue;
  },
  FORMACION_AUMENTAR_OBSERVACION(state, newValue){
    state.formacionEdit.aumentar_observacion = newValue;
  },
  STORE_FORMACION(state, formacion){
    state.formaciones = [formacion, ...state.formaciones];
  },
  REMOVE_FORMACION(state, uuid){
    state.formaciones = state.formaciones.filter(formacion => formacion.uuid !== uuid);
  },
  UPDATE_FORMACION(state, formacion){
    const indice = state.formaciones.findIndex(f => f.id === formacion.id);
    state.formaciones.splice(indice, 1, formacion);
  },
  SHOW_FORMACION(state, formacion){
    state.showFormacion = formacion;
  },
};

export const getters = {
  destinaciones(state){
    return state.destinaciones;
  },
  formaciones(state){
    return state.formaciones;
  }
};

export const actions = {
  async getDestinaciones({ commit }, uuid){
    const response = await this.$axios.$get('/api/profesionales/profesional/edf/get-destinaciones', {params: {uuid: uuid}});

    commit('SET_DESTINACIONES', response);
  },
  async getFormaciones({ commit }, uuid){
    const response = await this.$axios.$get('/api/profesionales/profesional/edf/get-formaciones', {params: {uuid: uuid}});

    commit('SET_FORMACIONES', response);
  }
};
