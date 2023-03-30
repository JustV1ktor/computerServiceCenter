<template>
  <head>
    <meta charset="UTF-8">
    <title>Register</title>
    <h1>Register</h1>
  </head>
  <body>
  <form action="http://localhost:3000/register.html" method="post" class="registration">
    <input name="login" type="text" placeholder="Login" required/>
    <input name="password" type="text" placeholder="Password" required/>
    <button type="submit">Register</button>
  </form>
  <a href="http://localhost:3000/">
    <button>Back</button>
  </a>
  <a href="http://localhost:3000/login.html">
    <button>login</button>
  </a>
  </body>
</template>
<script>
export default {
  name: "register"
}
</script>

<style scoped>

</style>