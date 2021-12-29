export const state = () => ({
  errors:{}
});

export const mutations = {
  SET_ERRORS(state, errors){
    state.errors = errors;
  }
};

export const getters = {
  errors(state){
    return state.errors;
  }
};

export const actions = {
  async redirectSessionExpired({commit}, status){
    if(status === 401){
      this.$router.replace({name: 'login'});
    }else if(419){
      this.$router.replace({name: 'login'});
      await this.$auth.logout();
    }
  }
};
