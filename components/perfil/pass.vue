<template>
  <div class="row">
    <div class="col-md-12">
      <div class="row">
        <div class="col-md-12">
          <label>Ingrese contraseña actual</label>
          <input type="password" v-model="pass.contrasena_actual" class="form-control" placeholder="Ingrese contraseña actual">
          <span class="text-danger" v-if="errors.password">{{errors.password[0]}}</span>
        </div>
      </div>
      <div class="row pt-lg-3">
        <div class="col-md-12">
          <label>Ingrese nueva contraseña</label>
          <input type="password" v-model="pass.nueva_contrasena" class="form-control" placeholder="Ingrese nueva contraseña">
          <span class="text-danger" v-if="errors.new_password">{{errors.new_password[0]}}</span>
        </div>
      </div>
      <div class="row pt-lg-3">
        <div class="col-md-12">
          <label>Confirme nueva contraseña</label>
          <input type="password" v-model="pass.confirm_nueva_contrasena" class="form-control" placeholder="Confirme nueva contraseña">
          <span class="text-danger" v-if="errors.confirm_new_password">{{errors.confirm_new_password[0]}}</span>
        </div>
      </div>
      <div class="row pt-lg-3">
        <div class="col-md-12">
          <button :disabled="!pass.contrasena_actual" class="btn btn-primary btn-user btn-block" v-loading.fullscreen.lock="fullscreenLoading" @click.prevent="modificarPass">Modificar contraseña</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      fullscreenLoading:false,
      pass:{
        contrasena_actual:'',
        nueva_contrasena:'',
        confirm_nueva_contrasena:''
      },
      errors:{}
    };
  },
  methods:{
    async modificarPass(){
      this.errors = {};
      this.fullscreenLoading = !this.fullscreenLoading;
      const url = '/api/changepassword';
      const data = {
        password:this.pass.contrasena_actual,
        new_password:this.pass.nueva_contrasena,
        confirm_new_password:this.pass.confirm_nueva_contrasena
      };
      await this.$axios.$patch(url, data).then(response => {
        this.fullscreenLoading = !this.fullscreenLoading;
        for(let key in this.pass){
          this.pass[key] = '';
        }
        this.$notify({
          message: 'Contraseña modificada con éxito.',
          type: 'success'
        });
      }).catch(error => {
        this.fullscreenLoading = !this.fullscreenLoading;
        this.errors = error.response.data.errors;
        console.log(error);
      });
    }
  }
}
</script>

<style>

</style>
