<template>
  <div class="sign-up">
    <h1>Register</h1>
    <form class="sign-up-content" v-on:submit.prevent="sendPost">
      <input class="input-sign-up" v-model="login" type="text" placeholder="Login" required/>
      <input class="input-sign-up" v-model="password" type="text" placeholder="Password" required/>
      <button class="button-content" type="submit">Register</button>
    </form>
    <label class="">Зареєстровані? Ввійдіть!</label>
    <a href="/login">
      <button class="button-content">login</button>
    </a>
    <a href="/">
      <button class="button-content">Back</button>
    </a>
  </div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      login: '',
      password: ''
    }
  },
  methods: {
    async sendPost() {
      try {
        await fetch('http://localhost:3000/register', {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            login: this.login,
            password: this.password
          }),
          mode: "cors"
        })
        this.$router.push('/login')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped>

</style>