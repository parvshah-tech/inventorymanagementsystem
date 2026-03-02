<script>
import axiosInstance from '@/axiosInstance'
import PaginationComponent from './PaginationComponent.vue'

export default {
  async created() {
    await this.fetchOrders()
  },

  components: {
    PaginationComponent,
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
  <div v-if="isFetching && !isUpdating" class="status-container">
    <h1 class="message">Loading your orders...</h1>
  </div>

  <div v-else-if="orders?.length > 0" class="orders-wrapper">
    <h1 class="page-title">Your Order History</h1>

    <div v-for="order in orders" :key="order.order_id" class="order-main-card">
      <div class="order-header">
        <div class="header-left">
          <span class="order-label">Order ID</span>
          <h2 class="order-id">#{{ order.order_id }}</h2>
          <p class="order-date">{{ order.placed_at }}</p>
        </div>
        <div class="header-right">
          <span :class="['status-badge', order.order_status.toLowerCase()]">
            {{ order.order_status }}
          </span>
          <h4 class="grand-total">₹{{ order.total_bill }}</h4>
        </div>
      </div>

      <div class="product-list">
        <div v-for="product in order.products" :key="product.pid" class="product-item">
          <div class="product-info">
            <h3 class="product-name">{{ product.pname }}</h3>
            <p class="product-meta">₹{{ product.price }} × {{ product.quantity }}</p>
          </div>
          <div class="product-total">₹{{ product.total_price }}</div>
        </div>
      </div>
    </div>
    <PaginationComponent
      v-if="!isUpdating"
      :total-products="totalOrders"
      :limit="limit"
      @fetch-data="fetchOrders"
      :current-page="currentPage"
    />
  </div>

  <div v-else-if="!isFetching && !isUpdating" class="status-container">
    <h1 class="message">No orders found, shop now</h1>
    <button class="shop-now-btn" @click="$router.push('/')">Explore Products</button>
  </div>
</template>

<style scoped>
.orders-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  color: hsla(160, 40%, 15%, 1);
  font-size: 24px;
  margin-bottom: 30px;
  font-weight: 800;
}

.order-main-card {
  background: white;
  border-radius: 20px;
  border: 1px solid hsla(160, 30%, 94%, 1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  margin-bottom: 25px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.order-main-card:hover {
  transform: translateY(-3px);
  border-color: hsla(160, 100%, 37%, 0.2);
}

.order-header {
  background: hsla(160, 30%, 99%, 1);
  padding: 20px 25px;
  border-bottom: 1px solid hsla(160, 30%, 94%, 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #888;
  font-weight: 700;
}

.order-id {
  font-size: 18px;
  color: hsla(160, 40%, 15%, 1);
  margin: 2px 0;
}

.order-date {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.header-right {
  text-align: right;
}

.grand-total {
  font-size: 20px;
  color: hsla(160, 100%, 37%, 1);
  font-weight: 800;
  margin: 5px 0 0 0;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
}

.status-badge.delivered,
.status-badge.completed {
  background: hsla(160, 100%, 37%, 0.1);
  color: hsla(160, 100%, 37%, 1);
}

.status-badge.pending,
.status-badge.processing {
  background: hsla(35, 100%, 50%, 0.1);
  color: hsla(35, 100%, 40%, 1);
}

.product-list {
  padding: 10px 25px;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid hsla(160, 30%, 96%, 1);
}

.product-item:last-child {
  border-bottom: none;
}

.product-name {
  font-size: 15px;
  font-weight: 600;
  color: hsla(160, 40%, 15%, 0.9);
  margin: 0 0 4px 0;
}

.product-meta {
  font-size: 13px;
  color: #777;
  margin: 0;
}

.product-total {
  font-weight: 700;
  color: hsla(160, 40%, 15%, 1);
}

.status-container {
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.message {
  color: hsla(160, 40%, 15%, 0.6);
  font-size: 20px;
}

.shop-now-btn {
  margin-top: 20px;
  padding: 12px 30px;
  background: hsla(160, 100%, 37%, 1);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s;
}

.shop-now-btn:hover {
  transform: scale(1.05);
  background: hsla(160, 100%, 30%, 1);
}
</style>
