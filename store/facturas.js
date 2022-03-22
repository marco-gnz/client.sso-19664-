export const state = () => ({
  facturas: [],
  facturaEdit:{
    uuid:'',
    situacion_actual:'',

    convenio_id:'',
    convenio:'',
    centro_formador:'',
    n_resolucion_convenio:'',
    fecha_resolucion_convenio:'',
    n_factura:'',
    fecha_factura:'',
    anios_pago:'',
    anio_academico:'',
    n_resolucion_factura:'',
    fecha_resolucion_factura:'',
    monto_total:'',
    tipo_factura:'',
    situacion_factura:'',
    fecha_pago:'',
    cargo_item:'',
    red_hospitalaria:'',
    tipo_contrado:'',
    envio_finanza:false,
    fecha_vencimiento_factura:'',
    observacion:''
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
    console.log(getValue);
    state.facturaEdit.uuid              = getValue.uuid;
    state.facturaEdit.situacion_actual  = getValue.situacion_factura_id;

    state.facturaEdit.convenio_id                 = getValue.convenio_id != null ? getValue.convenio_id  : '';
    state.facturaEdit.convenio                    = getValue.convenio != null ? getValue.convenio : '';
    state.facturaEdit.centro_formador             = getValue.centro_formador_id != null ? getValue.centro_formador_id  : '';
    state.facturaEdit.n_resolucion_convenio       = getValue.n_resolucion_convenio != null ? getValue.n_resolucion_convenio  : '';
    state.facturaEdit.fecha_resolucion_convenio   = getValue.fecha_convenio != null ? getValue.fecha_convenio  : '';
    state.facturaEdit.n_factura                   = getValue.n_factura != null ? getValue.n_factura  : '';
    state.facturaEdit.fecha_factura               = getValue.fecha_emision_factura != null ? getValue.fecha_emision_factura  : '';
    state.facturaEdit.anios_pago                  = getValue.anios_pago != null ? getValue.anios_pago  : '';
    state.facturaEdit.anio_academico              = getValue.anio_academico != null ? getValue.anio_academico  : '';
    state.facturaEdit.n_resolucion_factura        = getValue.n_resolucion != null ? getValue.n_resolucion  : '';
    state.facturaEdit.fecha_resolucion_factura    = getValue.fecha_resolucion != null ? getValue.fecha_resolucion  : '';
    state.facturaEdit.monto_total                 = getValue.monto_total != null ? getValue.monto_total  : '';
    state.facturaEdit.tipo_factura                = getValue.tipos != null ? getValue.tipos.map(f => f.id)  : '';
    state.facturaEdit.situacion_factura           = getValue.situacion_factura_id != null ? getValue.situacion_factura_id  : '';
    state.facturaEdit.fecha_pago                  = getValue.fecha_pago != null ? getValue.fecha_pago  : '';
    state.facturaEdit.cargo_item                  = getValue.cargo_item != null ? getValue.cargo_item  : '';
    state.facturaEdit.red_hospitalaria            = getValue.red_hospitalaria_id != null ? getValue.red_hospitalaria_id  : '';
    state.facturaEdit.tipo_contrado               = getValue.tipo_contrado_id != null ? getValue.tipo_contrado_id  : '';
    state.facturaEdit.envio_finanza               = getValue.envio_finanza != 1 ? false : true;
    state.facturaEdit.fecha_vencimiento_factura   = getValue.fecha_vencimiento_factura != null ? getValue.fecha_vencimiento_factura  : '';
    state.facturaEdit.observacion                 = getValue.observacion != null ? getValue.observacion  : '';
  },
  UPDATE_SITUACION_FACTURA(state, newValue){
    state.facturaEdit.situacion_actual = newValue;
  },
  REFRESH_FACTURA(state, newFactura){
    const indice = state.facturas.findIndex(f => f.id === newFactura.id);
    state.facturas.splice(indice, 1, newFactura);
  },
  SHOW_FACTURA(state, factura){
    state.factura = factura;
  },

  FACTURA_CONVENIO(state, convenio){
    console.log(convenio);

    state.facturaEdit.convenio                    = convenio != null || convenio != undefined ? convenio : '';
    state.facturaEdit.convenio_id                 = convenio != null || convenio != undefined ? convenio.id : '';

    state.facturaEdit.n_resolucion_convenio       = convenio != null || convenio != undefined  ? convenio.n_resolucion != null ? convenio.n_resolucion  : '' : '';
    state.facturaEdit.fecha_resolucion_convenio   = convenio != null || convenio != undefined  ? convenio.fecha_resolucion != null ? convenio.fecha_resolucion  : '' : '';

    state.facturaEdit.centro_formador             = convenio != null || convenio != undefined  ? convenio.especialidad != null ? convenio.especialidad.centro_formador.id : '' : '';
  },
  FACTURA_N_RESOLUCION_CONVENIO(state, newValue){
    state.facturaEdit.n_resolucion_convenio = newValue;
  },
  FACTURA_FECHA_RESOLUCION_CONVENIO(state, newValue){
    state.facturaEdit.fecha_resolucion_convenio = newValue;
  },
  FACTURA_N_FACTURA(state, newValue){
    state.facturaEdit.n_factura = newValue;
  },
  FACTURA_FECHA_FACTURA(state, newValue){
    state.facturaEdit.fecha_factura = newValue;
  },
  FACTURA_N_RESOLUCION(state, newValue){
    state.facturaEdit.n_resolucion_factura = newValue;
  },
  FACTURA_FECHA_RESOLUCION(state, newValue){
    state.facturaEdit.fecha_resolucion_factura = newValue;
  },
  FACTURA_ANIO_ACADEMICO(state, newValue){
    state.facturaEdit.anio_academico = newValue;
  },
  FACTURA_ANIOS_PAGO(state, newValue){
    state.facturaEdit.anios_pago = newValue;
  },
  FACTURA_MONTO_TOTAL(state, newValue){
    state.facturaEdit.monto_total = newValue;
  },
  FACTURA_TIPO_FACTURA(state, newValue){
    state.facturaEdit.tipo_factura = newValue;
  },
  FACTURA_SITUACION(state, newValue){
    state.facturaEdit.situacion_factura = newValue;
  },
  FACTURA_FECHA_PAGO(state, newValue){
    state.facturaEdit.fecha_pago = newValue;
  },
  FACTURA_CENTRO_FORMADOR(state, newValue){
    state.facturaEdit.centro_formador = newValue;
  },
  FACTURA_RED_HOSPITALARIA(state, newValue){
    state.facturaEdit.red_hospitalaria = newValue;
  },
  FACTURA_TIPO_CONTRATO(state, newValue){
    state.facturaEdit.tipo_contrado = newValue;
  },
  FACTURA_FECHA_VENCIMIENTO_FACTURA(state, newValue){
    state.facturaEdit.fecha_vencimiento_factura = newValue;
  },
  FACTURA_ENVIO_FINANZA(state, newValue){
    state.facturaEdit.envio_finanza = newValue;
  },
  FACTURA_CARGO_ITEM(state, newValue){
    state.facturaEdit.cargo_item = newValue;
  },
  FACTURA_OBSERVACION(state, newValue){
    state.facturaEdit.observacion = newValue;
  },
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
