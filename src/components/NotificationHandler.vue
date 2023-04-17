<template>
  <transition name="notification-animation">
    <div v-show="isOpen" class="modal">
      <transition name="notification-animation-inner">
        <div v-show="isOpen" class="modal-inner">
          <slot/>
          <button>Закрити</button>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import {ref} from "vue";

export default {
  name: "App",
  data() {
    return {
      textToShow: 'привіт',
      isOpen: ref(false)
    }
  }
}
</script>

