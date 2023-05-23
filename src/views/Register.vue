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
import NotificationHandler from "@/components/NotificationHandler"
import {REGULAR_EXPRESSIONS} from "@/constant/regularExpression"
import {fetchToServer} from "@/fetchToServer"
import {ref} from "vue"

export default {
  name: "App",
  components: {
    NotificationHandler
  },
  inject: ['checkUser'],
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
        const uniqueLogin = await fetchToServer('checkName', 0, {
          login: this.login
        })

        if (uniqueLogin === true) {

          const uniquePhone = await fetchToServer('checkPhone', 0, {
            phone: "+38" + this.phone
          })

          if (uniquePhone === true) {

            let userPhone = "+38" + this.phone

            if (this.password === this.passwordToCheck) {

              if(this.password.length > 7 && REGULAR_EXPRESSIONS.PASSWORD.test(this.password)) {

                await fetchToServer('register', 1, {
                  login: this.login,
                  phone: userPhone,
                  password: this.password
                })

                this.title = "Успіх!"
                this.text = "Ви зареєструвались!"
                this.nextPage = true
                this.isOpen = true

              } else {
                this.title = "Увага!"
                this.text = "Пароль має містити довжину не менше 8 символів! І мати хоча б 1 малу, велику букви і мати 1 спец символ приклад *?!+=-_"
                this.isOpen = true
              }

            } else {
              this.title = "Увага!"
              this.text = "Паролі не співпадають! Перевірте паролі!"
              this.isOpen = true
            }

          } else {
            this.title = "Увага!"
            this.text = "Цей телефон зайнятий!"
            this.isOpen = true
          }

        } else {
          this.title = "Увага!"
          this.text = "Такий логін вже використовується! Напишіть новий!"
          this.isOpen = true
        }

      } catch (err) {
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