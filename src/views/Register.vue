<template>
  <div class="sign-up-register">
    <h1>Реєстрація</h1>
    <form class="sign-up-content" v-on:submit.prevent="sendPost">
      <h4 class="office-label">Логін</h4>
      <input class="input-sign-up" v-model="login" type="text" placeholder="Логін" required/>
      <h4 class="office-label">Ваш номер телефона (пр. 0681234567)</h4>
      <input class="input-sign-up" v-model="phone" type="tel" placeholder="Телефон" pattern="[0-9]{10}" required/>
      <h4 class="office-label">Пароль</h4>
      <input class="input-sign-up" v-model="password" type="text" placeholder="Пароль" required/>
      <h4 class="office-label">Підтвердити пароль</h4>
      <input class="input-sign-up" v-model="passwordToCheck" type="text" placeholder="Пароль" required/>
      <button class="button-content" type="submit">Зареєструватись!</button>
    </form>
    <label class="">Зареєстровані? Ввійдіть!</label>
    <a href="/login">
      <button class="button-content">Вхід</button>
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
  data() {
    return {
      login: '',
      phone: '',
      password: '',
      passwordToCheck: '',
      isOpen: ref(false),
      title: '',
      text: '',
      nextPage: false
    }
  },
  methods: {
    async sendPost() {
      try {
        const allUsers = await fetch('http://localhost:3000/fetchUsers').then(res => res.json())
        let uniqueLogin = true

        for (const user of allUsers) {
          if (user['name'] === this.login) {
            uniqueLogin = false
          }
        }

        if (uniqueLogin === true) {

          if (this.phone.length === 10) {

            this.phone = "+38" + this.phone

            if (this.password === this.passwordToCheck) {

              await fetch('http://localhost:3000/register', {
                method: "POST",
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  login: this.login,
                  phone: this.phone,
                  password: this.password
                }),
                mode: "cors"
              })

              this.title = "Успіх!"
              this.text = "Ви зареєструвались!"
              this.nextPage = true
              this.isOpen = true

            } else {
              this.title = "Увага!"
              this.text = "Паролі не співпадають! Перевірте паролі!"
              this.isOpen = true
            }

          } else {
            this.title = "Увага!"
            this.text = "Номер телефона не праивльний! Перевірте телефон!"
            this.isOpen = true
          }

        } else {
          this.title = "Увага!"
          this.text = "Такий логін вже використовується! Напишіть новий!"
          this.isOpen = true
        }

      } catch (err) {
        if (err === 403) {
          this.title = "Увага!"
          this.text = "Ви не зареєструвались! Щось пішло не так"
          this.isOpen = true
        }
        this.title = "Увага!"
        this.text = "Ви не зареєструвались! Щось пішло не так"
        this.isOpen = true
      }
    },

    next() {
      if (this.nextPage) {
        this.$router.push('/login')
      }
    }
  }
}

</script>

<style scoped>

</style>