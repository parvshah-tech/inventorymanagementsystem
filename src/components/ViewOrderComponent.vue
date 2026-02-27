<script>
import axiosInstance from '@/axiosInstance'

export default {
  async created() {
    await this.fetchOrders()
  },
  data() {
    return {
      orders: [],
      totalOrders: 0,
      limit: 10,
      currentPage: 1,
      error: '',
      isFetching: false,
      isUpdating: false,
    }
  },
  watch: {
    async limit() {
      await this.$router.push({
        query: {
          page: 1,
        },
      })
      await this.fetchOrders()
    },
  },
  methods: {
    async fetchOrders(pagination = false) {
      const page = this.$route.query?.page ?? 1
      const newLimit = this.limit !== 0 ? '&limit=' + this.limit : ''

      try {
        if (!pagination && !this.isUpdating) {
          this.isFetching = true
        } else {
          this.isUpdating = true
        }
        const resp = await axiosInstance.get(`/checkout.php?pn=${page}${newLimit}`)
        this.orders = resp.data.orders
        this.totalOrders = resp.data.total_orders
        this.currentPage = resp.data.current_page
        console.log(this.orders)
      } catch (error) {
        console.log(error)
      } finally {
        this.isFetching = false
        this.isUpdating = false
      }
    },
  },
}
</script>

<template>
  <h1 v-if="isFetching && !isUpdating">Loading your orders...</h1>
  <template v-else-if="orders?.length > 0">
    <h1>Your Orders</h1>
    <div v-for="order in orders" :key="order.order_id">
      <h2>{{ order.order_id }}</h2>
      <p>{{ order.order_status }}</p>
      <p>{{ order.placed_at }}</p>
      <h4>{{ order.total_bill }}</h4>
      <div v-for="product in order.products" :key="product.pid">
        <h2>{{ product.pname }}</h2>
        <p>{{ product.price }} x {{ product.quantity }}</p>
        <p>{{ product.total_price }}</p>
      </div>
    </div>
  </template>
  <h1 v-else-if="!isFetching && !isUpdating">No orders found, shop now</h1>
</template>
