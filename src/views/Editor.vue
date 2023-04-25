<template>
  <div class="item-editor">
    <div class="burger-menu">
      <h1>Панель керування</h1>
      <div class="burger-button-container">
        <button class="burger-button card" @click="changePage(1);  fetchAllHistory()">Замовлення</button>
        <button class="burger-button users" @click="changePage(2)">Користувачі</button>
        <button class="burger-button list-menu" @click="changePage(3)">Сервіси</button>
        <button class="burger-button list-menu" @click="changePage(4)">Категорії</button>
      </div>
    </div>
    <div class="item foo">
      <div class="editor-table full-element-width" v-if="page === 3">
        <h3>Редагування існуючих сервісів</h3>
        <table class="full-element-width">
          <tr class="table-head-service">
            <th>ID сервісу</th>
            <th>Назва сервісу</th>
            <th>Категорія</th>
            <th>Опис</th>
            <th>Ціна</th>
          </tr>
          <tr class="editor-table-tr" v-for="service in services" :key="service._id">
            <td>
              <label>{{ service._id }}</label>
            </td>
            <td>
            <textarea class="editor-field" v-model="service.name" @focusout="updateService(service._id ,'name', service.name)"/>
            </td>
            <td>
              <select class="editor-select" @change="updateService(service._id ,'categoryID',selectedCategoryID($event))">
                <option v-for="category in categories" :key="category._id" :selected="service.category === category.name" v-bind:value="category._id">{{ category.name }}
                </option>
              </select>
            </td>
            <td>
            <textarea class="editor-field" v-model="service.description" @focusout="updateService(service._id ,'description', service.description)"/>
            </td>
            <td>
              <input class="editor-field" type="number" v-model="service.price" @focusout="updateService(service._id ,'price', service.price)">
            </td>
          </tr>
        </table>

        <h3>Створення нового сервісу</h3>
        <form v-on:submit.prevent="createService">
          <table class="editor-table">
            <tr class="table-head-service">
              <th>Назва сервісу</th>
              <th>Категорія</th>
              <th>Опис</th>
              <th>Ціна</th>
            </tr>
            <tr class="editor-table-tr">
              <td>
                <textarea class="editor-field" v-model="serviceName" required/>
              </td>
              <td>
                <select class="editor-select" required @change="fetchCategory($event)">
                  <option></option>
                  <option v-for="category in categories" :key="category._id" v-bind:value="category._id">{{ category.name }}</option>
                </select>
              </td>
              <td>
                <textarea class="editor-field" v-model="serviceDescription" required/>
              </td>
              <td>
                <input class="editor-field" type="number" v-model="servicePrice" required>
              </td>
            </tr>
            <tr>
              <td>
                <button class="button-content" type="submit">створити</button>
              </td>
            </tr>
          </table>
        </form>
      </div>

      <div v-if="page === 4">
        <h3>Редагування категорії</h3>
        <div class="sign-up-content">
          <div v-for="category of categories" :key="category._id">
            <input class="editor-field" v-model="category.name" v-on:input="updateCategory(category._id, category.name)">
          </div>
        </div>

        <h3>Створення нової категорії</h3>
        <div>
          <form class="sign-up-content" v-on:submit.prevent="createCategory">
            <input class="editor-field" v-model="newCategoryName">
            <button class="button-content" type="submit">створити</button>
          </form>
        </div>
      </div>

      <div class="full-element-width" v-if="page === 2">
        <h3>Всі зареєстровані користувачі</h3>
        <table class="editor-table">
          <tr class="table-head-service">
            <th>ID користувача</th>
            <th>Логін користувача</th>
            <th>Телефон користувача</th>
          </tr>
          <tr class="editor-table-tr user" v-for="user in users" :key="user._id">
            <td>
              <label>{{ user._id }}</label>
            </td>
            <td>
              <label>{{ user.name }}</label>
            </td>
            <td>
              <label>{{ user.phone }}</label>
            </td>
          </tr>
        </table>
      </div>

      <div v-if="page === 1">
        <h3>Замовлення</h3>

        <select class="editor-select" @change="filteredStatus($event)">
          <option value="0">Всі</option>
          <option value="очікування">очікувані</option>
          <option value="прийнято">прийняті</option>
          <option value="виконано">виконані</option>
          <option value="відмовлено">відмовлені</option>
        </select>

        <table class="editor-table" v-for="history in filteredOrders" :key="history._id">
          <thead>
          <tr class="table-head-service whitesmoke">
            <th>ID замовлення</th>
            <th>Дата створення</th>
            <th>Логін покупця</th>
            <th>Телефон покупця</th>
            <th>Статус</th>
            <th>Ціна</th>
          </tr>
          </thead>

          <tr class="editor-table-service">
            <td>
              <label>
                {{ history._id }}
              </label>
            </td>
            <td>
              <label>
                {{ `${new Date(Date.parse(history.date)).toLocaleDateString()}  ${new Date(Date.parse(history.date)).toLocaleTimeString()}` }}
              </label>
            </td>
            <td>
              <label>
                {{ history.userName }}
              </label>
            </td>
            <td>
              <label>
                {{ history.userPhone }}
              </label>
            </td>
            <td>
              <label :class="[history.status === 'очікування' ? 'yellow' : history.status === 'відмовлено' ? 'red' : history.status === 'прийнято' ? 'light-green' : history.status === 'виконано' ? 'green' : '']">
                {{ history.status }}
              </label>
            </td>
            <td>
              <label>
                {{ history.totalSum }}
              </label>
            </td>
          </tr>

          <tr class="table-head-service whitesmoke">
            <th class="editor-label-width">Назва сервісу</th>
            <th class="editor-label-width">Категорія</th>
            <th class="editor-p-width">Опис</th>
          </tr>


          <tr class="editor-table-service" v-for="service in history.services" :key="service._id">
            <td class="editor-label-width">
              <label>
                {{ service.name }}
              </label>
            </td>
            <td class="editor-label-width">
              <label>
                {{ service.category }}
              </label>
            </td>
            <td class="editor-p-width">
              <label>
                {{ service.description }}
              </label>
            </td>
          </tr>

          <tr>
            <td class="service-buttons">
              <button v-if="history.status === 'очікування'" class="button-content shadow" @click="updateStatus(history._id, 'прийнято')">Прийняти</button>
              <button v-if="history.status === 'прийнято'" class="button-content shadow" @click="updateStatus(history._id, 'виконано')">Виконано</button>
              <button v-if="history.status === 'очікування' || history.status === 'прийнято'" class="button-content shadow" @click="updateStatus(history._id, 'відмовлено')">Відмовити</button>
            </td>
          </tr>
        </table>
      </div>
    </div>
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
  components: {
    NotificationHandler
  },
  data() {
    return {
      activeUser: Boolean,
      serviceName: '',
      serviceDescription: '',
      servicePrice: '',
      CategoryID: '',
      services: [],
      users: [],
      categories: [],
      allHistory: [],
      filter: 0,
      filteredOrders: [],
      newCategoryName: '',
      isOpen: ref(false),
      title: '',
      text: '',
      nextPage: false,
      page: 1
    }
  },
  mounted() {
    fetch('http://localhost:3000/fetchData')
        .then(res => res.json())
        .then(data => this.services = data)
    fetch('http://localhost:3000/fetchCategories')
        .then(res => res.json())
        .then(data => this.categories = data)
    fetch('http://localhost:3000/fetchUsers')
        .then(res => res.json())
        .then(data => this.users = data)
    fetch('http://localhost:3000/fetchHistory')
        .then(res => res.json())
        .then(data => this.filteredOrders = this.allHistory = data)
  },
  methods: {
    selectedCategoryID(event) {
      return event.target.value
    },

    fetchCategory(event) {
      this.CategoryID = event.target.value
    },

    async fetchAllHistory() {
      this.filteredOrders = this.allHistory = await fetch('http://localhost:3000/fetchHistory').then(res => res.json())
    },

    async fetchFilteredHistory() {
      let orders = this.allHistory = await fetch('http://localhost:3000/fetchHistory').then(res => res.json())
      let data = []

      if (this.filter !== 0) {
        for (const order of orders) {
          if (this.filter === order['status']) {
            data.push(order)
            console.log(data)
          }
        }
        this.filteredOrders = data
        console.log(this.filteredOrders)
      } else {
        console.log(1)
        this.filteredOrders = orders
      }
    },

    async createService() {
      try {
        await fetch('http://localhost:3000/createService', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            authorization: localStorage.getItem('Authorization'),
            name: this.serviceName,
            description: this.serviceDescription,
            price: this.servicePrice,
            categoryID: this.CategoryID
          }),
        })
        this.services = await fetch('http://localhost:3000/fetchData').then(res => res.json())

        this.title = "Успіх!"
        this.text = "Новий сервіс створено успішно!"
        this.isOpen = true
      } catch (err) {
        this.title = "Увага!"
        this.text = "Щось пішло не так!"
        this.isOpen = true
      }
    },

    async updateService(serviceID, type, value) {
      await fetch('http://localhost:3000/updateService', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorization: localStorage.getItem('Authorization'),
          serviceID,
          type,
          value
        }),
      })
    },

    async createCategory() {
      try {
        await fetch('http://localhost:3000/createCategory', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            authorization: localStorage.getItem('Authorization'),
            name: this.newCategoryName
          }),
        })
        this.categories = await fetch('http://localhost:3000/fetchCategories').then(res => res.json())

        this.title = "Успіх!"
        this.text = "Нова категорія створено успішно!"
        this.isOpen = true
      } catch (err) {
        this.title = "Увага!"
        this.text = "Щось пішло не так!"
        this.isOpen = true
      }
    },

    async updateCategory(categoryID, name) {
      await fetch('http://localhost:3000/updateCategory', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorization: localStorage.getItem('Authorization'),
          categoryID,
          name
        }),
      })
      this.categories = await fetch('http://localhost:3000/fetchCategories').then(res => res.json())
    },

    changePage(value) {
      this.page = value
    },

    async updateStatus(historyID, value) {
      await fetch('http://localhost:3000/updateStatus', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          historyID,
          value
        }),
      })

      await this.fetchFilteredHistory()
    },

    filteredStatus(event) {

      let data = []

      if(Number(event.target.value) === 0) {
        this.filter = 0
        this.filteredOrders = this.allHistory
      } else {
        this.filter = event.target.value
        for (const order of this.allHistory) {
          if (order['status'] === event.target.value)  {
            data.push({
              _id: order['_id'],
              date: order['date'],
              userName: order['userName'],
              userPhone: order['userPhone'],
              status: order['status'],
              totalSum: order['totalSum'],
              services: order['services'],
            })
          }
        }

        this.filteredOrders = data

      }
    }
  }
}
</script>