<script setup>
const beforeEnter = (el) => {
  el.style.height = '0'
  el.style.opacity = '0'
}

const enter = (el) => {
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
}

const afterEnter = (el) => {
  el.style.height = 'auto'
}

const beforeLeave = (el) => {
  el.style.height = el.scrollHeight + 'px'
}

const leave = (el) => {
  el.style.height = '0'
  el.style.opacity = '0'
}
</script>

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
      selectedOrderId: null,
      totalOrders: 0,
      limit: 3,
      currentPage: 1,
      sortValue: '',
      sortDir: 0,
      error: '',
      isFetching: false,
      isUpdating: false,
    }
  },
  watch: {
    async sortValue() {
      await this.$router.push({
        query: {
          page: 1,
        },
      })
      await this.fetchOrders(true)
    },
    async limit() {
      await this.$router.push({
        query: {
          page: 1,
        },
      })
      await this.fetchOrders(true)
    },
  },
  methods: {
    async fetchOrders(pagination = false) {
      const page = this.$route.query?.page ?? 1
      const newLimit = this.limit < 1 ? 3 : this.limit
      const sort = this.sortValue === '' ? 'placed_at' : this.sortValue
      const sortDir = this.sortDir === 1 ? 'DESC' : 'ASC'

      try {
        if (!pagination && !this.isUpdating) {
          this.isFetching = true
        } else {
          this.isUpdating = true
        }
        const resp = await axiosInstance.get(
          `/checkout.php?pn=${page}&limit=${newLimit}&sort=${sort}&sort_dir=${sortDir}`,
        )
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
    toggleOrder(id) {
      this.selectedOrderId = this.selectedOrderId === id ? null : id
    },
    async toggleSort() {
      this.sortDir = Number(!this.sortDir)
      await this.fetchOrders(true)
    },
  },
}
</script>

<template>
  <div v-if="isFetching && !isUpdating" class="status-container">
    <h1 class="message">Loading your orders...</h1>
  </div>

  <div v-else-if="orders?.length > 0" class="orders-wrapper">
    <div class="header">
      <h1 class="page-title">Order History</h1>

      <div class="sort-wrapper">
        <div class="sort-controls">
          <!-- Sort Direction Toggle -->
          <button
            v-if="sortValue"
            class="direction-btn"
            @click="toggleSort"
            :title="sortDir ? 'Descending' : 'Ascending'"
          >
            <span class="arrow" :class="{ 'is-up': !sortDir }">↓</span>
          </button>

          <!-- Custom Select -->
          <div class="select-container">
            <select name="sort" id="sort" v-model="sortValue">
              <option value="">Sort By</option>
              <option value="order_id">Order ID</option>
              <option value="total_bill">Total Bill</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div v-for="order in orders" :key="order.order_id" class="order-main-card">
      <div
        class="order-header"
        @click="toggleOrder(order.order_id)"
        :class="{ 'is-active': selectedOrderId === order.order_id }"
      >
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
          <span class="chevron" :class="{ rotate: selectedOrderId === order.order_id }">▼</span>
        </div>
      </div>

      <Transition
        name="expand"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
        @before-leave="beforeLeave"
        @leave="leave"
      >
        <div v-show="selectedOrderId === order.order_id" class="product-list">
          <div v-for="product in order.products" :key="product.pid" class="product-item">
            <div class="product-info">
              <h3 class="product-name">{{ product.pname }}</h3>
              <p class="product-meta">₹{{ product.price }} × {{ product.quantity }}</p>
            </div>
            <div class="product-total">₹{{ product.total_price }}</div>
          </div>
        </div>
      </Transition>
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.page-title {
  color: hsla(160, 40%, 15%, 1);
  font-size: 24px;
  font-weight: 800;
  margin: 0;
}

.sort-controls {
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid hsla(160, 100%, 37%, 0.2);
  border-radius: 12px;
  padding: 4px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.sort-controls:focus-within {
  border-color: hsla(160, 100%, 37%, 1);
  box-shadow: 0 0 0 4px hsla(160, 100%, 37%, 0.1);
}

.direction-btn {
  background: hsla(160, 100%, 37%, 0.1);
  border: none;
  color: hsla(160, 100%, 25%, 1);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 4px;
}

.direction-btn:hover {
  background: hsla(160, 100%, 37%, 0.2);
}

.direction-btn .arrow {
  font-size: 18px;
  font-weight: bold;
  display: inline-block;
  transition: transform 0.3s ease;
}

.direction-btn .arrow.is-up {
  transform: rotate(180deg);
}

.select-container {
  position: relative;
}

select#sort {
  padding: 8px 30px 8px 12px;
  font-size: 14px;
  font-weight: 600;
  color: hsla(160, 40%, 15%, 1);
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  appearance: none;
}

.select-container::after {
  content: '▾';
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: hsla(160, 100%, 37%, 1);
  font-size: 12px;
}

select#sort option {
  background-color: white;
  color: hsla(160, 40%, 15%, 1);
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

.order-header {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
}

.order-header:hover {
  background: hsla(160, 30%, 96%, 1);
}

.order-header.is-active {
  background: hsla(160, 30%, 96%, 1);
  border-bottom-color: hsla(160, 30%, 90%, 1);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.chevron {
  font-size: 10px;
  color: #888;
  transition: transform 0.3s ease;
  margin-left: 10px;
}

.chevron.rotate {
  transform: rotate(180deg);
  color: hsla(160, 100%, 37%, 1);
}

.expand-enter-active,
.expand-leave-active {
  transition:
    height 0.7s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.5s ease;
  overflow: hidden;
}

.product-list {
  padding: 0 25px;
}

.product-item:first-child {
  padding-top: 15px;
}
.product-item:last-child {
  padding-bottom: 15px;
}
</style>
