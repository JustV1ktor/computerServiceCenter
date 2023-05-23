<template>
  <div class="item" v-if="services">
    <h1>Прайс лист</h1>

    <div class="burger-button-container" v-if="services.data.length > 0">
      <label>Пошук по категоріям</label>
      <select class="editor-select" @change="fetchFilteredServices($event)">
        <option v-for="category in categories" :key="category._id" v-bind:value="category._id">{{ category.name }}</option>
      </select>
    </div>

    <div v-if="services.data.length > 0">
      <label>Сторінка {{ count + 1 }} з {{ services.pageCount }}</label>
      <div>
        <button class="button-content" v-if="count > 0" @click="newPage(-1)">Попередня</button>
        <button class="button-content" v-if="count < services.pageCount - 1" @click="newPage(1)">Наступна</button>
      </div>
    </div>

    <table class="table" v-if="services.data.length > 0">
      <thead>
      <tr class="table-head">
        <th>Назва сервісу</th>
        <th class="label-position-off">Категорія</th>
        <th>Опис сервісу</th>
        <th>Ціна</th>
      </tr>
      </thead>
      <tr class="table-tr" v-for="service in services.data" :key="service._id">
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

    <div v-if="services.data.length === 0">
      <div class="history-no-content">
        <p>
          На даний момент проводяться техічні роботи. <br>
          Будь ласка зачекайте!
        </p>
      </div>
    </div>

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

    <div v-if="services.data.length > 0">
      <label>Сторінка {{ count + 1 }} з {{ services.pageCount }}</label>
      <div>
        <button class="button-content" v-if="count > 0" @click="newPage(-1)">Попередня</button>
        <button class="button-content" v-if="count < services.pageCount - 1" @click="newPage(1)">Наступна</button>
      </div>
    </div>

    <div class="button-row" v-if="activeUser === true && checkedIDs.length > 0">
      <form v-on:submit.prevent="sendPostConfirmService(totalSum)">
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
import NotificationHandler from "@/components/NotificationHandler"
import {fetchToServer} from "@/fetchToServer"
import {ref} from "vue"

export default {
  name: "App",
  inject: ['refreshUser'],
  components: {
    NotificationHandler
  },
  data() {
    return {
      activeUser: Boolean,
      services: null,
      allServices: [],
      selectedCategory: 0,
      categories: [],
      checkedIDs: [],
      cartData: [],
      isOpen: ref(false),
      title: '',
      text: '',
      count: 0
    }
  },
  computed: {

    totalSum() {
      let sum = 0
      for (const serviceID of this.checkedIDs) {
        for (const service of this.allServices) {
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
        for (const service of this.allServices) {
          if (service._id === serviceID) {
            cartData.push(service.name)
          }
        }
      }
      return cartData
    },
  },
  async beforeMount() {
    fetch('http://localhost:3000/fetchAllData')
        .then(res => res.json())
        .then(data => this.allServices = data)

    this.services = await fetchToServer('fetchData', 0,{
      page: 0,
      fetchCategoryID: 0,
      isVisible: true
    })

    const data = await fetchToServer('fetchCategories', 0, {
      isVisible: true
    })

    this.categories.push({_id: 0, name: 'всі'}, ...data)
    this.fetchUser()
  },
  methods: {

    async fetchFilteredServices(event) {
      this.selectedCategory = event.target.value
      this.count = 0

      this.services = await fetchToServer('fetchData', 0, {
        fetchCategoryID: event.target.value,
        isVisible: true
      })
    },

    async newPage(page) {
      this.count = this.count + page

      this.services = await fetchToServer('fetchData', 0, {
        page: this.count,
        fetchCategoryID: this.selectedCategory,
        isVisible: true
      })
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
      const data = await fetchToServer('fetchCarts', 0)
        for (const service of data) {
          this.checkedIDs.push(service['serviceID'])
        }
    },

    async sendPostAddService(serviceID) {

      this.checkedIDs.push(serviceID)

      try {
        await fetchToServer('AddServiceToCart', 1, {
          serviceID
        })
      } catch (err) {
        console.log(err)
      }
    },

    async sendPostDeleteService(serviceID) {

      this.checkedIDs = this.checkedIDs.filter(e => e !== serviceID)

      try {
        await fetchToServer('DeleteService', 1, {
          serviceID
        })
      } catch (err) {
        console.log(err)
      }
    },

    async sendPostConfirmService(totalSum) {
      try {
        await fetchToServer('ConfirmServices', 1, {
          totalSum
        })

        this.title = "Успіх!"
        this.text = "Дякуємо! Найближчим часом з вами зв'яжеться наш оператор для підтвердження замовлення!"
        this.isOpen = true
      } catch (err) {
        this.title = "Увага!"
        this.text = "Щось пішло не так!"
        this.isOpen = true
      }
      this.checkedIDs = []
    },
  }
}
</script>