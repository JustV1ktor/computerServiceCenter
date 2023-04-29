<template>
  <div class="item">
    <h1>Ваша історія замовлень</h1>

    <div>
      <button class="button-content" v-if="count > 0" @click="newPage(-1)">Попередня</button>
      <label>{{ count + 1 }}</label>
      <button class="button-content" v-if="count < history.pageCount - 1" @click="newPage(1)">Наступна</button>
    </div>

    <table class="table" v-for="info in history.data" :key="info._id">
      <thead>
      <tr class="table-head">
        <th>Дата купівлі</th>
        <th>Статус</th>
        <th>Ціна</th>
      </tr>
      </thead>
      <tr class="table-tr">
        <td>
          <label>{{`${new Date(Date.parse(info.date)).toLocaleDateString()}  ${new Date(Date.parse(info.date)).toLocaleTimeString()}` }}</label>
        </td>
        <td>
          <label :class="[info.status === 'очікування' ? 'yellow' : info.status === 'відмовлено' ? 'red' : info.status === 'прийнято' ? 'light-green' : info.status === 'виконано' ? 'green' : '']">
            {{ info.status }}
          </label>
        </td>
        <td>
          <label>{{ info.totalSum }} грн</label>
        </td>
      </tr>

      <thead>
      <tr class="table-head info">
        <th>Назва сервісу</th>
        <th>Опис</th>
      </tr>
      </thead>

      <tr class="table-tr" v-for="service in info['services']" :key="service._id">
        <td class="service-label">
          <label>{{ service.name }}</label>
        </td>
        <td>
          <p class="footer-content">{{ service.description }}</p>
        </td>
      </tr>

    </table>
    <div v-if="history.length === 0">
      <div class="history-no-content">
        <p>
          На даний момент ви не зробили ніяку покупку. <br>
          Зробіть якусь покупку і воно тут буде виведено!
        </p>
      </div>
    </div>

    <div>
      <button class="button-content" v-if="count > 0" @click="newPage(-1)">Попередня</button>
      <label>{{ count + 1 }}</label>
      <button class="button-content" v-if="count < history.pageCount - 1" @click="newPage(1)">Наступна</button>
    </div>

    <a href="/">
      <button class="button-content">Повернутись на головну</button>
    </a>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      history: [],
      count: 0
    }
  },
  async mounted() {
    this.history = await fetch('http://localhost:3000/fetchCurrentUserHistory', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        authorization: localStorage.getItem('Authorization'),
        page: 0
      }),
      mode: "cors"
    }).then(res => res.json())
  },
  methods: {
    async newPage(page) {
      this.count = this.count + page
      this.history = await fetch('http://localhost:3000/fetchCurrentUserHistory', {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authorization: localStorage.getItem('Authorization'),
          page: this.count
        })
      }).then(res => res.json())
    }
  }
}
</script>

<style>

</style>