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
      <div class="editor-table full-element-width" v-if="editorPage === 3">
        <h3>Редагування існуючих сервісів</h3>

        <div>
          <button class="button-content" v-if="count > 0" @click="newServicesPage(-1)">Попередня</button>
          <label>{{ count + 1 }}</label>
          <button class="button-content" v-if="count < services.pageCount - 1" @click="newServicesPage(1)">Наступна</button>
        </div>

        <table class="full-element-width">
          <tr class="table-head-service">
            <th>ID сервісу</th>
            <th>Назва сервісу</th>
            <th>Категорія</th>
            <th>Опис</th>
            <th>Ціна</th>
          </tr>
          <tr class="editor-table-tr" v-for="service in services.data" :key="service._id">
            <td>
              <label>{{ service._id }}</label>
            </td>
            <td>
            <textarea class="editor-field" v-model="service.name" @focusout="updateService(service._id ,'name', service.name)"/>
            </td>
            <td>
              <select class="editor-select" @change="updateService(service._id,'categoryID', selectedID($event))">
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

        <div>
          <button class="button-content" v-if="count > 0" @click="newServicesPage(-1)">Попередня</button>
          <label>{{ count + 1 }}</label>
          <button class="button-content" v-if="count < services.pageCount - 1" @click="newServicesPage(1)">Наступна</button>
        </div>

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

      <div v-if="editorPage === 4">
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

      <div class="full-element-width" v-if="editorPage === 2">
        <h3>Всі зареєстровані користувачі</h3>
        <h4>Пошук</h4>
        <textarea class="editor-field" v-model="userToFind" @input="findUser(userToFind)"></textarea>
        <table class="editor-table">
          <tr class="table-head-service">
            <th>ID користувача</th>
            <th>Логін користувача</th>
            <th>Роль користувача</th>
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
              <div v-if="checkAdminRole() === true">
                <label v-for="role in roles" :key="role._id">{{ role._id === user.roleID ? role.name : null }}</label>
              </div>
              <select v-if="checkAdminRole() === false" class="editor-select" @change="updateRole(user._id, selectedID($event))">
                <option v-for="role in roles" :key="role._id" :selected="role._id === user.roleID" v-bind:value="role._id">{{ role.name }}
                </option>
              </select>
            </td>
            <td>
              <label>{{ user.phone }}</label>
            </td>
          </tr>
        </table>

        <div>
          <button class="button-content">Поепердня</button>
          <label>{{ count }}</label>
          <button class="button-content">Наступна</button>
        </div>

      </div>

      <div v-if="editorPage === 1">
        <h3>Замовлення</h3>

        <select class="editor-select" @change="filteredStatus($event)">
          <option value="0">Всі</option>
          <option value="очікування">очікувані</option>
          <option value="прийнято">прийняті</option>
          <option value="виконано">виконані</option>
          <option value="відмовлено">відмовлені</option>
        </select>

        <div>
          <button class="button-content" v-if="count > 0" @click="newOrdersPage(-1)">Попередня</button>
          <label>{{ count + 1 }}</label>
          <button class="button-content" v-if="count < allHistory.pageCount - 1" @click="newOrdersPage(1)">Наступна</button>
        </div>

        <table class="editor-table" v-for="history in allHistory.fetchedData" :key="history._id">
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

        <div>
          <button class="button-content" v-if="count > 0" @click="newOrdersPage(-1)">Попередня</button>
          <label>{{ count + 1 }}</label>
          <button class="button-content" v-if="count < allHistory.pageCount - 1" @click="newOrdersPage(1)">Наступна</button>
        </div>

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
      serviceName: '',
      serviceDescription: '',
      servicePrice: '',
      CategoryID: '',
      services: [],
      users: [],
      currentUser: '',
      userToFind: '',
      usersToShow: [],
      categories: [],
      roles: [],
      allHistory: [],
      filter: 0,
      filteredOrders: [],
      newCategoryName: '',
      isOpen: ref(false),
      title: '',
      text: '',
      nextPage: false,
      editorPage: 1,
      count: 0,
      selectedCategory: 0
    }
  },
  mounted() {
    fetch('http://localhost:3000/getUserRole' , {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authorization: localStorage.getItem('Authorization')
      })
    }).then(res => res.json()).then(data => data === true ? '' : this.$router.push('/ '))

    fetch('http://localhost:3000/currentUser', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authorization: localStorage.getItem('Authorization')
      })
    }).then(res => res.json()).then(data => this.currentUser = data)

    fetch('http://localhost:3000/fetchData', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page: 0,
        fetchCategoryID: 0
      })
    }).then(res => res.json()).then(data => this.services = data)

    fetch('http://localhost:3000/fetchCategories')
        .then(res => res.json())
        .then(data => this.categories = data)

    fetch('http://localhost:3000/fetchUsers', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authorization: localStorage.getItem('Authorization')
      })
    }).then(res => res.json()).then(data => this.users = data)

    fetch('http://localhost:3000/fetchRoles', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authorization: localStorage.getItem('Authorization')
      })
    }).then(res => res.json()).then(data => this.roles = data)

    fetch('http://localhost:3000/fetchHistory', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authorization: localStorage.getItem('Authorization'),
        page: 0,
        fetchStatus: 0
      })
    }).then(res => res.json()).then(data => this.allHistory = data)
  },
  methods: {
    selectedID(event) {
      return event.target.value
    },

    fetchCategory(event) {
      this.CategoryID = event.target.value
    },

    findUser(userName) {
      for (const user of this.users) {
        this.usersToShow.push(user['name'].includes(userName))
      }
    },

    checkAdminRole() {
      for (const user of this.users) {
        for (const role of this.roles) {
          if (user['name'] === this.currentUser) {
            if (role['_id'] === user['roleID']) {
              if (role['name'] === 'адмін') {
                return true
              } else {
                return false
              }
            }
          }
        }
      }
    },

    async fetchAllHistory() {
      this.allHistory = await fetch('http://localhost:3000/fetchHistory', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorization: localStorage.getItem('Authorization'),
          page: 0,
          fetchStatus: 0
        })
      }).then(res => res.json())
    },

    async filteredStatus(event) {

      this.filter = event.target.value

      console.log(this.filter)

      this.allHistory = await fetch('http://localhost:3000/fetchHistory', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorization: localStorage.getItem('Authorization'),
          page: 0,
          fetchStatus: this.filter
        })
      }).then(res => res.json())
    },

    async newOrdersPage(value) {

      this.count = this.count + value

      this.allHistory = await fetch('http://localhost:3000/fetchHistory', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorization: localStorage.getItem('Authorization'),
          page: this.count,
          fetchStatus: this.filter
        })
      }).then(res => res.json())
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
        this.services = await fetch('http://localhost:3000/fetchData', {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            page: 0,
            fetchCategoryID: 0
          })
        }).then(res => res.json())

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

    async newServicesPage(page) {
      this.count = this.count + page

      this.services = await fetch('http://localhost:3000/fetchData', {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          page: this.count,
          fetchCategoryID: this.selectedCategory
        })
      }).then(res => res.json())
    },

    changePage(value) {
      this.editorPage = value
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
    async updateRole(userID, roleID) {
      await fetch('http://localhost:3000/updateRole', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorization: localStorage.getItem('Authorization'),
          userID,
          roleID
        }),
      })

      this.users = await fetch('http://localhost:3000/fetchUsers', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorization: localStorage.getItem('Authorization')
        })
      }).then(res => res.json())
    }
  }
}
</script>