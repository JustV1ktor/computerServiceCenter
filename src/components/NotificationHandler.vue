<template>
  <div class="sign-up-content">
    <h2>{{ title }}</h2>
    <p class="notification-p">{{ text }}</p>
    <button class="button-content" @click="$emit('close')">закрити</button>
  </div>
</template>

<script>
import { defineEmits } from "vue";

defineEmits("close")
export default {
  name: "App",
  props: ['title', 'text']
}
</script>