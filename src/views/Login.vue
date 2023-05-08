<template>
  <div class="sign-up">
    <h1>Вхід до особистого кабінету</h1>
    <form class="sign-up-content" v-on:submit.prevent="sendPost">
      <input class="input-sign-up" v-model="login" type="text" placeholder="Логін" required/>
      <input class="input-sign-up" v-model="password" type="text" placeholder="Пароль" required/>
      <a href="/">
        <button class="button-content" type="submit">Ввійти</button>
      </a>
    </form>
    <label class="">Не зареєстровані? Зареєструйтесь!</label>
    <a href="/register">
      <button class="button-content">Реєстрація</button>
    </a>
    <a href="/">
      <button class="button-content">Повернутись на головну</button>
    </a>
  </div>

  <div class="root">
    <teleport to="body">
      <div class="modal" v-if="isOpen">
        <NotificationHandler
            @close="isOpen = false; next()"
            :title="title"
            :text="text"
        />
      </div>
    </teleport>
  </div>

</template>

<script>
import NotificationHandler from "@/components/NotificationHandler";
import {ref} from "vue";

export default {
  name: "App",
  components: {
    NotificationHandler
  },
  inject: ['refreshUser', 'getUserRole', 'refreshRole', 'checkUser'],
  data() {
    return {
      login: '',
      password: '',
      response: '',
      isOpen: ref(false),
      title: '',
      text: '',
      nextPage: false
    }
  },
  beforeMount() {
    this.checkActiveUser()
  },
  methods: {
    checkActiveUser() {
      if (this.checkUser() === true) {
        this.$router.push('/ ')
      }
    },

    async sendPost() {
      try {
        this.response = await fetch('http://localhost:3000/login', {
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
        }).then(res => res.json())

        localStorage.setItem('Authorization', this.response.accessToken)

        this.refreshUser()

        localStorage.setItem('Admin', this.response.value)

        this.refreshRole()
        this.title = "Успіх!"
        this.text = "Ви ввійшли!"
        this.nextPage = true
        this.isOpen = true
      } catch (err) {
        this.title = "Увага!"
        this.text = "Не правильно введений логін чи пароль!"
        this.isOpen = true
        console.log(err)
      }
    },

    next() {
      if (this.nextPage) {
        this.$router.push('/')
      }
    }
  }
}
</script>