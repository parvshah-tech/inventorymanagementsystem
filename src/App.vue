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
  width: 100%;
  min-width: 500px;
  background-color: hsla(160, 30%, 96%, 1);
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

@media only screen and (max-width: 425px) {
  .container {
    margin-top: 25px;
    min-width: 400px;
  }
}

@media only screen and (max-width: 375px) {
  .container {
    margin-top: 25px;
    min-width: 300px;
  }
}
</style>
