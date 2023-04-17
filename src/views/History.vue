<template>
  <div class="item">
    <h1>History</h1>
    <table class="table" v-for="info in history" :key="info._id">
      <tr class="table-head info">
        <th>Date purchased</th>
        <th>Price</th>
      </tr>

      <tr class="table-tr">
        <td>
          <label>{{`${new Date(Date.parse(info.date)).toLocaleDateString()}  ${new Date(Date.parse(info.date)).toLocaleTimeString()}` }}</label>
        </td>
        <td>
          <label>{{ info.totalSum }} грн</label>
        </td>
      </tr>

      <tr class="table-head">
        <th>Service name</th>
        <th>Description</th>
      </tr>

      <tr class="table-tr" v-for="service in info['services']" :key="service._id">
        <td class="service-label">
          <label>{{ service.name }}</label>
        </td>
        <td>
          <p class="footer-content">{{ service.description }}</p>
        </td>
      </tr>

    </table>
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
      history: []
    }
  },
  mounted() {
    fetch('http://localhost:3000/fetchHistory')
        .then(res => res.json())
        .then(data => this.history = data);
  },
}
</script>

<style>

</style>