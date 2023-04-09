<template>
  <h1>Login</h1>
  <form class="login" v-on:submit.prevent="sendPost">
    <input v-model="login" type="text" placeholder="Login" required/>
    <input v-model="password" type="text" placeholder="Password" required/>
    <button type="submit">login</button>
  </form>
  <a href="/">
    <button>Back</button>
  </a>
  <a href="/register">
    <button>register</button>
  </a>
</template>

<script>
export default {
  name: "App",
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
        this.$router.push('/')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped>

</style>