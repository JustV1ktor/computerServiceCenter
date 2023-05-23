<template>
  <div class="item-editor">
    <div class="burger-menu">
      <h1>Панель керування</h1>
      <div class="burger-button-container">
        <button class="burger-button card" @click="changePage(1);  fetchAllHistory()">Замовлення</button>
        <button class="burger-button users" @click="changePage(2); fetchUsers(); fetchAllUsers()">Користувачі</button>
        <button class="burger-button list-menu" @click="changePage(3); fetchAllServices(); fetchAllCategories()">Сервіси</button>
        <button class="burger-button list-menu" @click="changePage(4); fetchAllCategories()">Категорії</button>
      </div>
    </div>
    <div class="item foo">
      <div class="editor-table full-element-width" v-if="editorPage === 3">
        <h3>Редагування існуючих сервісів</h3>

        <div>
          <label>Сторінка {{ count + 1 }} з {{ services.pageCount }}</label>
          <div>
            <button class="button-content" v-if="count > 0" @click="newServicesPage(-1)">Попередня</button>
            <button class="button-content" v-if="count < services.pageCount - 1" @click="newServicesPage(1)">Наступна</button>
          </div>
        </div>

        <table class="full-element-width">
          <tr class="table-head-service">
            <th>ID сервісу</th>
            <th>Назва сервісу</th>
            <th>Категорія</th>
            <th class="width">Опис</th>
            <th>Ціна</th>
            <th>Відображення</th>
          </tr>
          <tr class="editor-table-tr" v-for="service in services.data" :key="service._id">
            <td>
              <label>{{ service._id }}</label>
            </td>
            <td>
              <textarea class="editor-field" v-model="service.name" ref="textareaDynamicHeightNodes"
                        @focusout="updateService(service._id ,'name', service.name)"/>
            </td>
            <td>
              <select class="editor-select" @change="updateService(service._id,'categoryID', selectedID($event))">
                <option v-for="category in categories" :key="category._id" :selected="service.category === category.name" v-bind:value="category._id">{{ category.name }}
                </option>
              </select>
            </td>
            <td>
              <textarea class="editor-field width" v-model="service.description" ref="textareaDynamicHeightNodes"
                        @focusout="updateService(service._id ,'description', service.description)"/>
            </td>
            <td>
              <input class="editor-field" type="number" v-model="service.price" @focusout="updateService(service._id ,'price', service.price)">
            </td>
            <td>
              <input type="checkbox" :checked="service.isVisible === true" v-on:change="changeVisibility('services', !service.isVisible, service._id)">
            </td>
          </tr>
        </table>

        <div>
          <label>Сторінка {{ count + 1 }} з {{ services.pageCount }}</label>
          <div>
            <button class="button-content" v-if="count > 0" @click="newServicesPage(-1)">Попередня</button>
            <button class="button-content" v-if="count < services.pageCount - 1" @click="newServicesPage(1)">Наступна</button>
          </div>
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
                <textarea class="editor-field" v-model="serviceName" oninput='this.style.height = ""; this.style.height = this.scrollHeight + "px"' required/>
              </td>
              <td>
                <select class="editor-select" ref="selectCategory" @change="fetchCategory($event)" required>
                  <option></option>
                  <option v-for="category in categories" :key="category._id" v-bind:value="category._id">{{ category.name }}</option>
                </select>
              </td>
              <td>
                <textarea class="editor-field width" v-model="serviceDescription" oninput='this.style.height = ""; this.style.height = this.scrollHeight + "px"' required/>
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
            <input type="checkbox" :checked="category.isVisible === true" v-on:change="changeVisibility('categories', !category.isVisible, category._id)">
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

        <table class="editor-table row" v-if="usersToShow.length > 0">
          <tr>
            <td>
              <h2>Результат пошуку</h2>
            </td>
          </tr>
          <tr class="editor-table-tr user" v-for="user in usersToShow" :key="user._id">
            <td>
              <label>{{ user._id }}</label>
            </td>
            <td>
              <label>{{ user.name }}</label>
            </td>
            <td>
                <label v-for="role in roles" :key="role._id">{{ role._id === user.roleID ? role.name : null }}</label>
            </td>
            <td>
              <label>{{ user.phone }}</label>
            </td>
          </tr>
        </table>

        <div>
          <label>Сторінка {{ count + 1 }} з {{ users.pageCount }}</label>
          <div>
            <button class="button-content" v-if="count > 0" @click="newUsersPage(-1)">Попередня</button>
            <button class="button-content" v-if="count < users.pageCount - 1" @click="newUsersPage(1)">Наступна</button>
          </div>
        </div>

        <table class="editor-table">
          <tr class="table-head-service">
            <th>ID користувача</th>
            <th>Логін користувача</th>
            <th>Роль користувача</th>
            <th>Телефон користувача</th>
          </tr>
          <tr class="editor-table-tr user" v-for="user in users.data" :key="user._id">
            <td>
              <label>{{ user._id }}</label>
            </td>
            <td>
              <label>{{ user.name }}</label>
            </td>
            <td>
              <div v-if="isAdmin === true">
                <label v-for="role in roles" :key="role._id">{{ role._id === user.roleID ? role.name : null }}</label>
              </div>
              <select v-if="isAdmin === false" class="editor-select" @change="updateRole(user._id, selectedID($event))">
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
          <label>Сторінка {{ count + 1 }} з {{ users.pageCount }}</label>
          <div>
            <button class="button-content" v-if="count > 0" @click="newUsersPage(-1)">Попередня</button>
            <button class="button-content" v-if="count < users.pageCount - 1" @click="newUsersPage(1)">Наступна</button>
          </div>
        </div>

      </div>

      <div class="full-element-width" v-if="editorPage === 1">
        <h3>Замовлення</h3>

        <select class="editor-select" @change="filteredStatus($event)">
          <option value="0">Всі</option>
          <option value="очікування">очікувані</option>
          <option value="прийнято">прийняті</option>
          <option value="виконано">виконані</option>
          <option value="відмовлено">відмовлені</option>
        </select>

        <div>
          <label>Сторінка {{ count + 1 }} з {{ allHistory.pageCount }}</label>
          <div>
            <button class="button-content" v-if="count > 0" @click="newOrdersPage(-1)">Попередня</button>
            <button class="button-content" v-if="count < allHistory.pageCount - 1" @click="newOrdersPage(1)">Наступна</button>
          </div>
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
              <label :class="getClassByStatus(history.status)">
                {{ history.status }}
              </label>
            </td>
            <td>
              <label>
                {{ history.totalSum }}
              </label>
            </td>
          </tr>

          <thead>
          <tr class="table-head-service whitesmoke">
            <th class="editor-label-width">Назва сервісу</th>
            <th class="editor-label-width">Категорія</th>
            <th class="editor-p-width">Опис</th>
          </tr>
          </thead>

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
          <label>Сторінка {{ count + 1 }} з {{ allHistory.pageCount }}</label>
          <div>
            <button class="button-content" v-if="count > 0" @click="newOrdersPage(-1)">Попередня</button>
            <button class="button-content" v-if="count < allHistory.pageCount - 1" @click="newOrdersPage(1)">Наступна</button>
          </div>
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
import NotificationHandler from "@/components/NotificationHandler"
import {fetchToServer} from "@/fetchToServer"
import {ref} from "vue"

export default {
  name: "App",
  inject: ['checkUser'],
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
      allUsers: [],
      userToFind: '',
      usersToShow: [],
      categories: [],
      isAdmin: Boolean,
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
  updated() {
    for (const textareaNode of this.$refs.textareaDynamicHeightNodes || []) {
      this.refreshTextareaHeight(textareaNode)
    }
  },
  async beforeMount() {
    this.checkActiveUser()

    if (!await fetchToServer('getUserRole', 0)) {
      this.$router.push('/ ')
    }

    this.roles = await fetchToServer('fetchRoles', 0)

    this.fetchAllHistory()
    this.checkAdminRole()
  },
  methods: {
    refreshTextareaHeight(textareaNode) {
      textareaNode.style.height = ""
      textareaNode.style.height = textareaNode.scrollHeight + "px"
    },

    getClassByStatus(status) {
      switch (status) {
        case 'очікування' : return 'yellow'
        case 'відмовлено' : return 'red'
        case 'прийнято' : return 'light-green'
        case 'виконано' : return 'green'
      }
    },

    checkActiveUser() {
      if (this.checkUser() === false) {
        this.$router.push('/ ')
      }
    },

    selectedID(event) {
      return event.target.value
    },

    fetchCategory(event) {
      this.CategoryID = event.target.value
    },

    findUser(value) {
      this.usersToShow = []
      if (value === '') {
        this.usersToShow = []
      } else {
        for (const user of this.allUsers) {
          if (user.name.toLowerCase().includes(value.toLowerCase()) || user.phone.includes(value)) {
            this.usersToShow.push(user)
          }
        }
      }
    },

    async checkAdminRole() {
      this.isAdmin = false

      const currentUser = await fetchToServer('currentUser', 0)

      for (const role of this.roles) {
        if (role['_id'] === currentUser['roleID']) {
          if (role['name'] === 'адміністратор') {
            this.isAdmin = true
            return
          }
        }
      }
    },

    async fetchAllCategories() {
      this.categories = await fetchToServer('fetchCategories', 0, {
        page: 0,
        fetchStatus: 0
      })
    },

    async fetchAllHistory() {
      this.count = 0
      this.allHistory = await fetchToServer('fetchHistory', 0,{
        page: 0,
        fetchStatus: 0
      })
    },

    async fetchAllServices() {
      this.count = 0
      this.services = await fetchToServer('fetchData', 0,{
        page: 0,
        fetchCategoryID: 0
      })
    },

    async fetchUsers() {
      this.count = 0
      this.users = await fetchToServer('fetchUsers', 0,{
        page: 0
      })
    },

    async fetchAllUsers() {
      this.allUsers = await fetchToServer('fetchAllUsers', 0)
    },

    async filteredStatus(event) {

      this.filter = event.target.value

      this.count = 0

      this.allHistory = await fetchToServer('fetchHistory', 0, {
        page: 0,
        fetchStatus: this.filter
      })
    },

    async newOrdersPage(page) {
      this.count = this.count + page

      this.allHistory = await fetchToServer('fetchHistory', 0, {
        page: this.count,
        fetchStatus: this.filter
      })

      if (this.count > this.allHistory.pageCount - 1) {
        this.count = this.count - 1
        this.allHistory = await fetchToServer('fetchHistory', 0, {
          page: this.count,
          fetchStatus: this.filter
        })
      }
    },

    async newUsersPage(page) {
      this.count = this.count + page

      this.users = await fetchToServer('fetchUsers', 0, {
        page: this.count
      })
    },

    async newServicesPage(page) {
      this.count = this.count + page

      this.services = await fetchToServer('fetchData', 0, {
        page: this.count,
        fetchCategoryID: this.selectedCategory
      })
    },

    async createService() {
      try {
        await fetchToServer('createService', 1, {
          name: this.serviceName,
          description: this.serviceDescription,
          price: this.servicePrice,
          categoryID: this.CategoryID
        })
        this.services = await fetchToServer('fetchData', 0, {
            page: 0,
            fetchCategoryID: 0
          })

        this.serviceName = ''
        this.serviceDescription = ''
        this.servicePrice = ''
        this.$refs.selectCategory.value = null

        this.title = "Успіх!"
        this.text = "Новий сервіс створено успішно!"
        this.isOpen = true
      } catch (err) {
        console.log(err)
        this.title = "Увага!"
        this.text = "Щось пішло не так!"
        this.isOpen = true
      }
    },

    async updateService(serviceID, type, value) {
      await fetchToServer('updateService', 1, {
        serviceID,
        type,
        value
      })
    },

    async createCategory() {
      try {
        await fetchToServer('createCategory', 1, {
          name: this.newCategoryName
        })

        this.categories = await fetchToServer('fetchCategories', 0)

        this.newCategoryName = ''

        this.title = "Успіх!"
        this.text = "Нову категорію створено успішно!"
        this.isOpen = true
      } catch (err) {
        this.title = "Увага!"
        this.text = "Щось пішло не так!"
        this.isOpen = true
      }
    },

    async updateCategory(categoryID, name) {
      await fetchToServer('updateCategory', 1, {
        categoryID,
        name
      })

      this.categories = await fetchToServer('fetchCategories', 0)
    },

    async changeVisibility(type, isVisible, ID) {
      await fetchToServer('updateVisibility', 1, {
        type,
        isVisible,
        ID
      })
    },

    changePage(value) {
      this.editorPage = value
    },

    async updateStatus(historyID, value) {
      await fetchToServer('updateStatus', 1, {
        historyID,
        value
      })

      await this.newOrdersPage(0)
    },

    async updateRole(userID, roleID) {
      await fetchToServer('updateRole', 1, {
        userID,
        roleID
      })

      this.users = await fetchToServer('fetchUsers', 0, {
        page: this.count
      })
    }
  }
}
</script>