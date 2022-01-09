export const state = () => ({
  usuarios: [],
  pagination:{
    total:0,
    current_page:0,
    per_page:0,
    last_page:0,
    from:0,
    to:0
  },
  offset: 3,
  search:{
    input:'',
    perfil:''
  },
  screenCargando:false,
  usuario:{
    id:'',
    rut:'',
    dv:'',
    primer_nombre:'',
    segundo_nombre:'',
    apellido_paterno:'',
    apellido_materno:'',
    correo:'',
    genero:'',
    red_admin:'',
    perfil:'',
    permisos_extras:[]
  }
});

export const mutations = {
  SET_LOADING(state){
    state.screenCargando = true;
  },
  SET_LOADING_FALSE(state){
    state.screenCargando = false;
  },
  SET_USUARIOS(state, usuarios){
    state.usuarios = usuarios;
  },
  SET_PAGINATION_USUARIOS(state, pagination){
    state.pagination = pagination;
  },
  SET_CURRENT_PAGE(state, page){
    state.pagination.current_page = page;
  },
  UPDATE_STATUS_USUARIOS(state, object){
    const indice = state.usuarios.findIndex(u => u.id === object.response.id);
    state.usuarios.splice(indice, 1, object.response);
  },
  SET_INPUT_SEARCH(state, value){
    state.search.input = value;
  },
  SET_INPUT_PERFIL(state, value){
    state.search.perfil = value;
  },
  SET_USUARIO(state, usuario){
    state.usuario.id                = usuario.id;
    state.usuario.rut               = usuario.rut;
    state.usuario.dv                = usuario.dv;
    state.usuario.primer_nombre     = usuario.primer_nombre;
    state.usuario.segundo_nombre    = usuario.segundo_nombre;
    state.usuario.apellido_materno  = usuario.apellido_materno;
    state.usuario.apellido_paterno  = usuario.apellido_paterno;
    state.usuario.correo            = usuario.email;
    state.usuario.genero            = usuario.genero_id;
    state.usuario.red_admin         = (usuario.redes_hospitalarias.length) ? usuario.redes_hospitalarias[0].id : '';
    state.usuario.perfil            = (usuario.roles.length) ? usuario.roles[0].id : '';
    state.usuario.permisos_extras   = (usuario.permissions.length) ? usuario.permissions.map(p => p.id) : [];
  },

  //EDIT
  SET_RUT(state, rut){
    state.usuario.rut = rut;
  },
  SET_DV(state, dv){
    state.usuario.dv = dv;
  },
  SET_PRIMER_NOMBRE(state, primer_nombre){
    state.usuario.primer_nombre = primer_nombre;
  },
  SET_SEGUNDO_NOMBRE(state, segundo_nombre){
    state.usuario.segundo_nombre = segundo_nombre;
  },
  SET_APELLIDO_MATERNO(state, apellido_materno){
    state.usuario.apellido_materno = apellido_materno;
  },
  SET_APELLIDO_PATERNO(state, apellido_paterno){
    state.usuario.apellido_paterno = apellido_paterno;
  },
  SET_CORREO(state, correo){
    state.usuario.correo = correo;
  },
  SET_GENERO(state, genero){
    state.usuario.genero = genero;
  },
  SET_REDES_ADMIN(state, redes){
    state.usuario.red_admin = redes;
  },
  SET_PERFIL_ADMIN(state, perfil){
    state.usuario.perfil = perfil;
  },
  SET_PERMISOS_EXTRAS(state, permisos){
    state.usuario.permisos_extras = permisos;
  }
};

export const getters = {
  usuarios(state){
    return state.usuarios;
  },
  inputSearch(state){
    return state.search.input;
  },
  inputPerfil(state){
    return state.search.perfil;
  },
  usuario(state){
    return state.usuario;
  },
  redes_admin(state){
    return state.usuario.red_admin;
  }
};

export const actions = {
  async getUsuarios({ commit }, object){
    let search      = (object != undefined) ? object.search : '';
    let page        = (object != undefined) ? object.page : '';

    await this.$axios.$get(`/api/usuarios?page=${page}`, {params: search}).then(response => {
      commit('SET_USUARIOS', response.usuarios.data);
      commit('SET_PAGINATION_USUARIOS', response.pagination);
    }).catch(error => {
      console.log(error);
    });
  },
  async getUsuario({ commit }, uuid){
    const response = await this.$axios.$get(`/api/usuarios/usuario/${uuid}`);
    commit('SET_USUARIO', response);
  }
};
