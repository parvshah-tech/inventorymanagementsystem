<script setup>
import { RouterView } from 'vue-router'
import ToastComponent from './components/ToastComponent.vue'
</script>

<template>
  <RouterView />
  <ToastComponent />
</template>

<style>
.container {
  max-width: 500px;
  background-color: hsla(160, 30%, 96%, 1);
  margin: 0 auto;
  margin-top: 32px;
  padding: 18px;
  border-radius: 15px;
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}
</style>
