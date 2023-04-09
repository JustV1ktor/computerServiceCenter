<template>
<!--    <link rel="stylesheet" href="public/style.css">-->
  <header class="header">
    <h1 class="logo">Computer Service</h1>
    <div class="header-container">
      <a href="/">
        <button class="button-head">main page</button>
      </a>
      <a href="/priceList">
        <button class="button-head">price list</button>
      </a>
      <a href="/about">
        <button class="button-head">about</button>
      </a>
      <a href="/login">
        <button class="button-head">sign in</button>
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
            <li>
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
  name: "App"
}
</script>

<style src="./style.css">
</style>