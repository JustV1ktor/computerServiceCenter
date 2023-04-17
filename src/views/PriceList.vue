<template>
  <div class="item">
    <h1>Price List</h1>
    <table class="table">
      <tr class="table-head">
        <th>Service name</th>
        <th>Description</th>
        <th>Price</th>
      </tr>
      <tr class="table-tr" v-for="service in services" :key="service._id">
        <td class="service-label">
          <label>{{ service.name }}</label>
        </td>
        <td>
          <p class="footer-content">{{ service.description }}</p>
        </td>
        <td>
          <label>{{ service.price }} грн</label>
        </td>
        <td>
          <input v-if="userActive === true" type="checkbox" :checked="checkedIDs.includes(service._id)" v-on:change="$event.target.checked ? sendPostAddService(service._id) : sendPostDeleteService(service._id)">
        </td>
      </tr>
    </table>
    <div class="cart-outer" :class="[cart.length >= 1 ? 'show' : '']">
      <div class="cart-inner">
        <h4>Кошик:</h4>
        <div class="cart-item" v-for="item in cart" :key="item._id">
          {{ item }};
        </div>
        <h4>Загальна сума:</h4>
        <h1>{{ totalSum }} грн</h1>
      </div>
    </div>
    <div class="button-row">
      <form v-if="userActive === true" v-on:submit.prevent="sendPostConfirmService(totalSum)">
        <button class="button-content" type="submit">Confirm</button>
      </form>
    </div>
    <a href="/">
      <button class="button-content">back</button>
    </a>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      userActive: Boolean,
      services: [],
      checkedIDs: [],
      cartData: [],
    }
  },
  computed: {

    totalSum() {
      let sum = 0
      for (const serviceID of this.checkedIDs) {
        for (const service of this.services) {
          if (service._id === serviceID) {
            sum = sum + Number(service.price)
          }
        }
      }
      return sum
    },

    cart() {
      let cartData = []
      for (const serviceID of this.checkedIDs) {
        for (const service of this.services) {
          if (service._id === serviceID) {
            cartData.push(service.name)
          }
        }
      }
      return cartData
    }
  },
  mounted() {
    fetch('http://localhost:3000/fetchData')
        .then(res => res.json())
        .then(data => this.services = data)

    fetch('http://localhost:3000/fetchCarts')
        .then(res => res.json())
        .then(data => {
          for (const service of data) {
            this.checkedIDs.push(service['serviceID'])
          }
        })

    fetch('http://localhost:3000/activeUser')
        .then(res => res.json())
        .then(data => this.userActive = data)
  },
  methods: {

    async sendPostAddService(serviceID) {

      this.checkedIDs.push(serviceID)

      try {
        await fetch('http://localhost:3000/AddServiceToCart', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serviceID: serviceID
          })
        })
        this.$router.push('/priceList')

      } catch (err) {
        console.log(err)
      }
    },

    async sendPostDeleteService(serviceID) {

      this.checkedIDs = this.checkedIDs.filter(e => e !== serviceID)

      try {
        await fetch('http://localhost:3000/DeleteService', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serviceID: serviceID
          })
        })
        this.$router.push('/priceList')

      } catch (err) {
        console.log(err)
      }
    },

    async sendPostConfirmService(totalSum) {
      try {
        await fetch('http://localhost:3000/ConfirmServices', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: Date.now(),
            totalSum: totalSum
          })
        })
      } catch (err) {
        console.log(err)
      }
      this.checkedIDs = []
    },
  }
}
</script>

<style scoped>

</style>