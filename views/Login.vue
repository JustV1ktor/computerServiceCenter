<template>
  <head>
    <meta charset="UTF-8">
    <title>Title</title>
    <h1>Login</h1>
  </head>
  <body>
  <form action="http://localhost:3000/login.html" method="post" class="login">
    <input name="login" type="text" placeholder="Login" required/>
    <input name="password" type="text" placeholder="Password" required/>
    <button type="submit">login</button>
  </form>
  <a href="http://localhost:3000/">
    <button>Back</button>
  </a>
  <a href="http://localhost:3000/register.html">
    <button>register</button>
  </a>
  </body>
</template>

<script>
export default {
  name: "login"
}
</script>

<style scoped>

</style>