<template>
    <div class="container-fluid mt-5">
      <div class="row justify-content-center">
            <div class="col-xl-10 col-lg-12 col-md-9">
                <div class="card o-hidden border-0 shadow-lg my-5">
                    <div class="card-body p-0">
                        <!-- Nested Row within Card Body -->
                        <div class="row">
                            <div class="col-lg-6 d-none d-lg-block bg-login-image"></div>
                            <div class="col-lg-6">
                                <div class="p-5">
                                    <div class="text-center">
                                        <h1 class="h4 text-gray-900 mb-4">Ingrese sus credenciales</h1>
                                    </div>
                                    <form class="user" @submit.prevent="login" v-loading.fullscreen.lock="fullscreenLoading">
                                        <div class="form-group">
                                            <b-form-input type="email" v-model="form.email" class="form-control form-control-user" placeholder="Ingrese su correo institucional" :state="!errors.email && null"></b-form-input>
                                            <b-form-invalid-feedback v-if="errors.email">{{errors.email[0]}}</b-form-invalid-feedback>
                                        </div>
                                        <div class="form-group">
                                            <b-form-input type="password" v-model="form.password" class="form-control form-control-user" placeholder="Ingrese su contraseña" :state="!errors.password && null"></b-form-input>
                                            <b-form-invalid-feedback v-if="errors.password">{{errors.password[0]}}</b-form-invalid-feedback>
                                        </div>
                                        <button type="submit" class="btn btn-primary btn-user btn-block">Ingresar</button>
                                    </form>
                                    <hr>
                                    <div class="text-center">
                                      <i class="fas fa-search fa-sm"></i>
                                        <a class="small" href="forgot-password.html">Restablecer contraseña</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>

<script>
export default {
    head(){
      return{
        title: 'Autenticación'
      };
    },
    data(){
      return{
        fullscreenLoading:false,
        form:{
          email:'marcoignacio.9637@gmail.com',
          password:'mamasa20'
        },
        errors:{}
      };
    },
    methods:{
      async login(){
        try {
          this.fullscreenLoading = !this.fullscreenLoading;
            await this.$auth.loginWith("laravelSanctum", {
              data: this.form
            });
          this.$router.push('/');
          this.$notify.success({
            message: `Bienvenid${this.$auth.user.genero != 1 ? `o` : `a`} ${this.$auth.user.primer_nombre}!`,
            showClose: true
          });
        } catch (error) {
          console.log(error);
          this.fullscreenLoading = !this.fullscreenLoading;
          if(error.response.status === 422){
            this.errors = error.response.data.errors;
          }else if (error.response.status === 401){
            this.errors = {email: []};
            this.errors.email[0] = 'El correo o la contraseña es incorrecto';
          }
        }
      }
    }
}
</script>

<style>

</style>
