<template>
  <div class="office">
    <h1>Привіт {{ login.name }}! Ваш номер телефона {{ login.phone }}</h1>
    <div>
      <form class="sign-up-content" v-on:submit.prevent="changeLogin">
        <h4 class="office-label">Змінити логін</h4>
        <input class="input-sign-up" v-model="newLogin" type="text" placeholder="Логін" required/>
        <button class="button-content" type="submit">Змінити логін!</button>
      </form>
    </div>
    <div>
      <form class="sign-up-content" v-on:submit.prevent="changePhone">
        <h4 class="office-label">Змінити телефон (пр. 0681234567)</h4>
        <input class="input-sign-up" v-model="phone" type="tel" placeholder="Телефон" pattern="[0-9]{10}" required/>
        <button class="button-content" type="submit">Змінити телефон!</button>
      </form>
    </div>
    <div>
      <form class="sign-up-content" v-on:submit.prevent="changePassword">
        <h4 class="office-label">Змінити пароль</h4>
        <input class="input-sign-up" v-model="newPassword" type="text" placeholder="Пароль" required/>
        <h4 class="office-label">Підтвердити пароль</h4>
        <input class="input-sign-up" v-model="newPasswordToCheck" type="text" placeholder="Пароль" required/>
        <button class="button-content" type="submit">Змінити пароль!</button>
      </form>
    </div>
    <button v-on:click="logOut" class="button-content">Вийти</button>
  </div>

  <div class="root">
    <teleport to="body">
      <div class="modal" v-if="isOpen">
        <NotificationHandler
            @close="isOpen = false"
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
  inject: ['refreshUser', 'refreshRole', 'checkUser'],
  components: {
    NotificationHandler
  },
  data() {
    return {
      token: '',
      login: '',
      phone: '',
      newLogin: '',
      newPassword: '',
      newPasswordToCheck: '',
      isOpen: ref(false),
      title: '',
      text: '',
      nextPage: false
    }
  },

  beforeMount() {
    this.checkActiveUser()
    this.updateUser()
  },

  methods: {
    checkActiveUser() {
      if (this.checkUser() === false) {
        this.$router.push('/ ')
      }
    },

    async updateUser() {
      try {
        this.login = await fetchToServer('currentUser', 0)
      } catch (err) {
        console.log(err)
        this.title = "Увага!"
        this.text = "Щось пішло не так!"
        this.isOpen = true
      }
    },

    async logOut() {
      await fetchToServer('destroy', 1)

      localStorage.removeItem('Authorization')
      localStorage.removeItem('Admin')
      this.refreshUser()
      this.refreshRole()
      this.$router.push('/')
    },

    async changeLogin() {
      try {
        const uniqueLogin = await fetchToServer('checkName', 0, {
          login: this.newLogin
        })

        if (uniqueLogin === true) {
          this.token = await fetchToServer('updateLogin', 0, {
            newLogin: this.newLogin
          })

          localStorage.setItem('Authorization', this.token)
          await this.updateUser()
          this.newLogin = ''

          this.title = "Успіх!"
          this.text = "Ваше ім'я було змінено!"
          this.isOpen = true
        } else {
          this.title = "Увага!"
          this.text = "Такий логін вже використовується! Напишіть новий!"
          this.isOpen = true
        }
      } catch (err) {
        this.title = "Увага!"
        this.text = "Щось пішло не так!"
        this.isOpen = true
      }
    },

    async changePhone() {
      try {

        const uniquePhone = await fetchToServer('checkPhone', 0, {
          phone: "+38" + this.phone
        })

        if (uniquePhone === true) {

          await fetchToServer('updatePhone', 1, {
            phone: "+38" + this.phone
          })

          await this.updateUser()

          this.phone = ''

          this.title = "Успіх!"
          this.text = "Ваш номер був змінений!"
          this.isOpen = true

        } else {
          this.title = "Увага!"
          this.text = "Цей телефон зайнятий!"
          this.isOpen = true
        }

      } catch (err) {
        this.title = "Увага!"
        this.text = "Ваш номер не був змінений!"
        this.isOpen = true
      }
    },

    async changePassword() {
      try {

        if (this.newPassword === this.newPasswordToCheck) {

          if (this.newPassword.length > 7 && REGULAR_EXPRESSIONS.PASSWORD.test(this.newPassword)) {

            await fetchToServer('updatePassword', 1, {
              newPassword: this.newPassword
            })

            this.newPassword = ''
            this.newPasswordToCheck = ''

            this.title = "Успіх!"
            this.text = "Пароль змінено успішно!"
            this.isOpen = true

          } else {
            this.title = "Увага!"
            this.text = "Пароль має містити довжину не менше 8 символів! І мати хоча б 1 малу, велику букви і мати 1 спец символ приклад *?!+=-_"
            this.isOpen = true
          }

        } else {
          this.title = "Помилка!"
          this.text = "Паролі не співпадають! Перевірте паролі!"
          this.isOpen = true
        }

      } catch (err) {
        this.title = "Увага!"
        this.text = "Щось пішло не так!"
        this.isOpen = true
      }
    }
  }
}
</script>