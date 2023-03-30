<template>
  <head>
    <meta charset="UTF-8">
    <title>service center</title>
  </head>
  <body>
  <h1>Price List</h1>
  <table>
    <tr>
      <th>Service name</th>
      <th></th>
    </tr>
    <tr>
      <td>service 1 Price 100$</td>
      <td>
        <form action="http://localhost:3000/AddServiceToCart" method="post">
          <button type="submit" name="service" value="one">Add to cart 1</button>
        </form>
        <form action="http://localhost:3000/AddServiceToCart" method="post">
          <button type="submit" name="service" value="two">Add to cart 2</button>
        </form>
        <form action="http://localhost:3000/AddServiceToCart" method="post">
          <button type="submit" name="service" value="three">Add to cart 3</button>
        </form>
      </td>
      <td>
        <form action="http://localhost:3000/DeleteService" method="post">
          <button type="submit" name="service" value="one">delete a service from cart</button>
        </form>
        <form action="http://localhost:3000/ConfirmServices" method="post">
          <button type="submit">Confirm</button>
        </form>
      </td>
    </tr>
  </table>
  <a href="http://localhost:3000/">
    <button>back</button>
  </a>
  </body>
</template>

<script>
export default {
  name: "priceList"
}
</script>

<style scoped>

</style>