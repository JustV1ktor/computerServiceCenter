<template>
  <header class="header">
    <h1 class="logo">Computer Service</h1>
    <div class="header-container">
      <a href="/">
        <button class="button-head">main page</button>
      </a>
      <a href="/priceList">
        <button class="button-head">price list</button>
      </a>
      <a v-if="userActive === true" href="/history">
        <button class="button-head">history</button>
      </a>
      <a href="/about">
        <button class="button-head">about</button>
      </a>
      <a v-if="userActive === false" href="/login">
        <button class="button-head">sign in</button>
      </a>
      <a v-if="userActive === true" href="/personalOffice">
        <button class="button-head">Office</button>
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer laoreet orci non arcu scelerisque, at
            fringilla risus fermentum. Vestibulum et nisl tempus, tempor risus rutrum, sollicitudin metus. Vivamus
            sagittis eros magna, eu gravida sem faucibus quis. Proin condimentum aliquet nisl, eget tempor ex.
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
              <a class="link" href="/personalOffice">Офіс</a>
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
    }
  },
  provide() {
    return {
      refreshUser: this.refreshUser
    }
  },
  mounted() {
    this.refreshUser()
  },
  methods: {
    refreshUser() {
      fetch('http://localhost:3000/activeUser')
          .then(res => res.json())
          .then(data => this.userActive = data)
    }
  }
}
</script>

<style src="./style.css">
</style>