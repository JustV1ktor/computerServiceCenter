<template>
  <div class="sign-up">
    <h1>Login</h1>
    <form class="sign-up-content" v-on:submit.prevent="sendPost">
      <input class="input-sign-up" v-model="login" type="text" placeholder="Login" required/>
      <input class="input-sign-up" v-model="password" type="text" placeholder="Password" required/>
      <a href="/">
        <button class="button-content" type="submit">login</button>
      </a>
    </form>
    <label class="">Не зареєстровані? Зареєструйтксь!</label>
    <a href="/register">
      <button class="button-content">register</button>
    </a>
    <a href="/">
      <button class="button-content">Повернутись</button>
    </a>
  </div>
</template>

<script>
export default {
  name: "App",
  inject: ['refreshUser'],
  data() {
    return {
      login: '',
      password: '',
    }
  },
  methods: {
    async sendPost() {
      try {
        await fetch('http://localhost:3000/login', {
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
        this.refreshUser()
        this.$router.push('/')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>