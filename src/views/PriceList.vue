<template>
  <div class="item">
    <h1>Прайс лист</h1>
    <label>Пошук по категоріям</label>
    <select class="editor-select" @change="fetchFilteredServices($event)">
      <option v-for="category in categories" :key="category._id" v-bind:value="category._id">{{ category.name }}</option>
    </select>
    <table class="table">
      <thead>
      <tr class="table-head">
        <th>Назва сервісу</th>
        <th class="label-position-off">Категорія</th>
        <th>Опис сервісу</th>
        <th>Ціна</th>
      </tr>
      </thead>
      <tr class="table-tr" v-for="service in filteredServices" :key="service._id">
        <td class="service-label">
          <label>{{ service.name }}</label>
        </td>
        <td class="category-width">
          <label>{{ service.category }}</label>
        </td>
        <td>
          <p class="footer-content">{{ service.description }}</p>
        </td>
        <td>
          <label>{{ service.price }} грн</label>
        </td>
        <td>
          <input v-if="activeUser === true" type="checkbox" :checked="checkedIDs.includes(service._id)" v-on:change="$event.target.checked ? sendPostAddService(service._id) : sendPostDeleteService(service._id)">
        </td>
      </tr>
    </table>
    <div class="cart-outer" :class="[cart.length >= 1 ? 'show' : '', style.red]">
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
      <form v-if="activeUser === true" v-on:submit.prevent="sendPostConfirmService(totalSum)">
        <button class="button-content" type="submit">Замовити!</button>
      </form>
    </div>
    <a href="/">
      <button class="button-content">Повернутись на головну</button>
    </a>
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
import NotificationHandler from "@/components/NotificationHandler";
import {ref} from "vue";

export default {
  name: "App",
  inject: ['refreshUser'],
  components: {
    NotificationHandler
  },
  data() {
    return {
      activeUser: Boolean,
      services: [],
      filteredServices: [],
      selectedCategory: '',
      categories: [],
      checkedIDs: [],
      cartData: [],
      isOpen: ref(false),
      title: '',
      text: ''
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
    },
  },
  mounted() {
    fetch('http://localhost:3000/fetchData')
        .then(res => res.json())
        .then(data => this.filteredServices = this.services = data)
    fetch('http://localhost:3000/fetchCategories')
        .then(res => res.json())
        .then(data => {
          this.categories.push({_id: 0, name: 'всі'}, ...data)
        })
    this.fetchUser()
  },
  methods: {

    fetchFilteredServices(event) {

      let data = []

      if(Number(event.target.value) === 0) {
        this.filteredServices = this.services
      } else {
        for (const service of this.services) {
          if (service['categoryID'] === event.target.value)  {
            data.push({
              _id: service['_id'],
              name: service['name'],
              description: service['description'],
              categoryID: service['categoryID'],
              category: service['category'],
              price: service['price']
            })
          }
        }
        this.filteredServices = data
      }
    },

    fetchUser() {
      if(localStorage.Authorization) {
        this.activeUser = true
        this.fetchCart()
      } else {
        this.activeUser = false
      }
    },

    async fetchCart() {
      fetch('http://localhost:3000/fetchCarts', {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authorization: localStorage.getItem('Authorization')
        }),
        mode: "cors"
      }).then(res => res.json()).then(data => {
        for (const service of data) {
          this.checkedIDs.push(service['serviceID'])
        }
      })
    },

    async sendPostAddService(serviceID) {

      this.checkedIDs.push(serviceID)

      try {
        await fetch('http://localhost:3000/AddServiceToCart', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            authorization: localStorage.getItem('Authorization'),
            serviceID: serviceID
          })
        })
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
            authorization: localStorage.getItem('Authorization'),
            serviceID: serviceID
          })
        })
      } catch (err) {
        console.log(err)
      }
    },

    async sendPostConfirmService(totalSum) {
      if (this.checkedIDs.length >= 1) {
        try {
          await fetch('http://localhost:3000/ConfirmServices', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              authorization: localStorage.getItem('Authorization'),
              totalSum: totalSum
            })
          })

          this.title = "Успіх!"
          this.text = "Дякуємо! Найближчим часом з вами зв'яжеться наш оператор для підтвердження замовлення!"
          this.isOpen = true
        } catch (err) {
          this.title = "Увага!"
          this.text = "Щось пішло не так!"
          this.isOpen = true
        }
      } else {
        this.title = "Увага!"
        this.text = "Ви не вибрали нічого! Виберіть щось і купіть!"
        this.isOpen = true
      }
      this.checkedIDs = []
    },
  }
}
</script>

<style module="style">

/*.red {*/
/*  background-color: red;*/
/*}*/

</style>