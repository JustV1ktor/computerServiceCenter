<template>
  <div class="office">
    <h1>Привіт {{ Login }}!</h1>
    <div class="item">
      <h4 class="office-label">Змінити логін</h4>
      <input class="input-sign-up" v-model="newLogin" type="text" placeholder="Login"/>
      <button v-on:click="changeLogin" class="button-content">Змінити логін!</button>
    </div>
    <div class="item">
      <h4 class="office-label">Змінити пароль</h4>
      <input class="input-sign-up" v-model="newPassword" type="text" placeholder="password"/>
      <h4 class="office-label">Підтвердити пароль</h4>
      <input class="input-sign-up" v-model="newPasswordToCheck" type="text" placeholder="password"/>
      <button v-on:click="changePassword" class="button-content">Змінити пароль!</button>
    </div>
    <button v-on:click="logOut" class="button-content">Вийти</button>
  </div>
</template>

<script>
export default {
  name: "App",
  inject: ['refreshUser'],
  data() {
    return {
      Login: '',
      newLogin: '',
      newPassword: '',
      newPasswordToCheck: ''
    }
  },

  mounted() {
    this.updateUser()
  },

  methods: {
    async updateUser() {
      await fetch('http://localhost:3000/currentUser')
          .then(res => res.json())
          .then(data => this.Login = data)
    },

    async logOut() {
      await fetch('http://localhost:3000/destroy')
      this.refreshUser()
      this.$router.push('/')
    },

    async changeLogin() {
      await fetch('http://localhost:3000/updateLogin', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newLogin: this.newLogin,
        }),
      })
      await this.updateUser()
    },

    async changePassword() {
      if (this.newPassword === this.newPasswordToCheck) {
        await fetch('http://localhost:3000/updatePassword', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword: this.newPassword
          }),
        })
      } else {
        console.log("bad password")
      }
    }
  }
}
</script>

<style scoped>

</style>