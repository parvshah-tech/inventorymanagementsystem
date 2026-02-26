<script setup>
import CheckoutFormComponent from '@/components/CheckoutFormComponent.vue'
import CheckoutOrdersComponent from '@/components/CheckoutOrdersComponent.vue'
import { mapActions } from 'vuex'
</script>

<script>
export default {
  async created() {
    this.isLoading = true
    // await this.fetchCart()
    // await this.fetchUser()
    await Promise.all([this.fetchCart(), this.fetchUser()])
    this.isLoading = false
  },
  data() {
    return {
      isLoading: false,
    }
  },
  methods: {
    ...mapActions('cart', ['fetchCart']),
    ...mapActions('user', ['fetchUser']),
  },
}
</script>

<template>
  <main>
    <div v-if="isLoading" class="status-container">
      <h1 class="message">Loading your screen...</h1>
    </div>
    <div v-else class="checkout-container">
      <CheckoutOrdersComponent />
      <CheckoutFormComponent />
    </div>
  </main>
</template>

<style scoped>
.status-container {
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.message {
  font-size: 2rem;
  color: hsla(160, 40%, 15%, 0.6);
  font-weight: 500;
}

.checkout-container {
  display: flex;
  max-width: 1440px;
  margin: 0 auto;
  gap: 40px;
  padding: 40px 20px;
  min-height: 100vh;
}

.section-title {
  color: hsla(160, 40%, 15%, 1);
  margin-bottom: 24px;
  font-weight: 700;
}
</style>
