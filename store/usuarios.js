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
  screenCargando:false
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
    });

  }
};
