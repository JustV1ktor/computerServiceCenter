<template>
  <div class="item">
    <h1>Price List</h1>
    <table class="table">
      <tr>
        <th>Service name</th>
        <th>Description</th>
      </tr>
      <tr>
        <td>
          <label>service 1 Price 100$</label>
        </td>
        <td>
          <p class="footer-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maximus porttitor
            dignissim. Donec eu commodo leo.
            Suspendisse faucibus viverra consequat. Donec pharetra turpis ligula, at tincidunt massa imperdiet in. Fusce
            justo
            metus, mollis vel congue efficitur, iaculis eget ligula. Vestibulum volutpat leo ut urna consequat, non
            vestibulum
            est maximus.</p>
        </td>
        <td>
          <input type="checkbox" value="one" v-model="service">
        </td>
      </tr>
      <tr>
        <td>
          <label>service 2 Price 200$</label>
        </td>
        <td>
          <p class="footer-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maximus porttitor
            dignissim. Donec eu commodo leo.
            Suspendisse faucibus viverra consequat. Donec pharetra turpis ligula, at tincidunt massa imperdiet in. Fusce
            justo
            metus, mollis vel congue efficitur, iaculis eget ligula. Vestibulum volutpat leo ut urna consequat, non
            vestibulum
            est maximus.</p>
        </td>
        <td>
          <input type="checkbox" value="two" v-model="service">
        </td>
      </tr>
      <tr>
        <td>
          <label>service 3 Price 350$</label>
        </td>
        <td>
          <p class="footer-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maximus porttitor
            dignissim. Donec eu commodo leo.
            Suspendisse faucibus viverra consequat. Donec pharetra turpis ligula, at tincidunt massa imperdiet in. Fusce
            justo
            metus, mollis vel congue efficitur, iaculis eget ligula. Vestibulum volutpat leo ut urna consequat, non
            vestibulum
            est maximus.</p>
        </td>
        <td>
          <input type="checkbox" value="three" v-model="service">
        </td>
      </tr>
      <tr>
        <td></td>
        <td>
          <form v-on:submit.prevent="sendPostAddService">
            <button type="submit">add a service to cart</button>
          </form>
          <form v-on:submit.prevent="sendPostDeleteService">
            <button type="submit">delete a service from cart</button>
          </form>
          <form v-on:submit.prevent="sendPostConfirmService">
            <button type="submit">Confirm</button>
          </form>
        </td>
      </tr>
    </table>
    <a href="/">
      <button>back</button>
    </a>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      service: []
    }
  },
  methods: {
    async sendPostAddService() {
      try {
        await fetch('http://localhost:3000/AddServiceToCart', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service: this.service,
          }),
        })
        this.$router.push('/priceList')

      } catch (err) {
        console.log(err)
      }
    },

    async sendPostDeleteService() {
      try {
        await fetch('http://localhost:3000/DeleteService', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service: this.service
          }),
        })
        this.$router.push('/priceList')

      } catch (err) {
        console.log(err)
      }
    },

    async sendPostConfirmService() {
      try {
        await fetch('http://localhost:3000/ConfirmServices', {
          method: "POST"
        })
        this.$router.push('/priceList')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped>

</style>