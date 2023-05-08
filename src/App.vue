<template>
  <header class="header">
    <h1 class="logo">Computer Service</h1>
    <div class="header-container">
      <a href="/">
        <button class="button-head">Головна </button>
      </a>
      <a href="/priceList">
        <button class="button-head">Прайс лист</button>
      </a>
      <a v-if="userActive === true" href="/history">
        <button class="button-head">Історія</button>
      </a>
      <a href="/about">
        <button class="button-head">Про нас</button>
      </a>
      <a v-if="userActive === false" href="/login">
        <button class="button-head">Ввійти</button>
      </a>
      <a v-if="userActive === true" href="/personalOffice">
        <button class="button-head">Кабінет</button>
      </a>
      <a v-if="isAdmin === true" href="/editor">
        <button class="button-head">Панель керування</button>
      </a>
    </div>
  </header>
  <div class="container-wrapper">
    <div class="main-content">
      <router-view>
      </router-view>
    </div>
    <footer class="footer">
      <div class="footer-container">
        <div>
          <p class="footer-content">
            Комп'ютерний сервіс - є авторизованим сервісом по ремонту комп’ютерної техніки по всій Україні! Наші кваліфіковані спеціалісти здійснюють різноманітний спектр послуг.
          </p>
          <p>
            всі права захищені
          </p>
        </div>
        <div>
          <ul class="list">
            <li>
              <h3>Меню</h3>
            </li>
            <li>
              <a class="link" href="/">Головна</a>
            </li>
            <li v-if="userActive === true">
              <a class="link" href="/personalOffice">Кабінет</a>
            </li>
            <li v-if="userActive === false">
              <a class="link" href="/login">Ввійти</a>
            </li>
            <li>
              <a class="link" href="/priceList">Послуги</a>
            </li>
            <li>
              <a class="link" href="/about">Про нас</a>
            </li>
          </ul>
        </div>
        <div>
          <ul class="list">
            <li>+3801234567890</li>
            <li>+3803214567890</li>
            <li>Вул. Карпатської України</li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      userActive: Boolean,
      isAdmin: Boolean
    }
  },
  provide() {
    return {
      refreshUser: this.refreshUser,
      refreshRole: this.refreshRole,
      checkUser: this.checkUser
    }
  },
  mounted() {
    this.refreshUser()
    this.refreshRole()
  },
  methods: {
    refreshUser() {
      this.userActive = !!localStorage.Authorization;
    },
    checkUser() {
      return this.userActive
    },
    refreshRole() {
      this.isAdmin = localStorage.getItem('Admin') === 'true';
    },
  }
}
</script>

<style src="./style.css">
</style>

<style src="./font-awesome.css">
</style>