<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('toast', ['toastState']),
    toast() {
      return this.toastState
    },
  },
}
</script>

<template>
  <div v-if="toast.isActive" :class="['toast', toast.color]">
    <span>{{ toast.message }}</span>
  </div>
</template>

<style scoped>
.toast {
  min-width: 250px;
  position: fixed;
  bottom: 20px;
  right: -64px;
  transform: translateX(-50%);
  padding: 15px;
  border-radius: 5px;
  text-align: left;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.toast.info {
  background-color: #2196f3;
}
.toast.success {
  background-color: #4caf50;
}
.toast.error {
  background-color: #f44336;
}
</style>
