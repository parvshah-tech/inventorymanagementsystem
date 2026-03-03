<script>
import axiosInstance from '@/axiosInstance'
import PaginationComponent from './PaginationComponent.vue'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    PaginationComponent,
  },
  data() {
    return {
      products: [],
      totalProducts: 0,
      limit: 12,
      currentPage: 1,
      error: '',
      isFetching: false,
      isUpdating: false,
      filterValue: '',
      sortValue: '',
      desc: 0,
    }
  },

  watch: {
    async filterValue() {
      await this.$router.push({
        query: {
          page: 1,
        },
      })
      await this.fetchProducts()
    },
    async limit() {
      await this.$router.push({
        query: {
          page: 1,
        },
      })
      await this.fetchProducts(true)
    },
    async sortValue() {
      this.sortDir = 0
      await this.$router.push({
        query: {
          page: 1,
        },
      })
      await this.fetchProducts(true)
    },
  },

  async created() {
    await this.fetchProducts()
  },

  computed: {
    ...mapState('cart', {
      isUpdatingCart: 'isLoading',
    }),
  },

  methods: {
    ...mapActions('cart', ['updateCartProduct']),
    ...mapActions('toast', ['triggerToast']),
    async fetchProducts(pagination = false) {
      const page = this.$route.query?.page ?? 1
      const newLimit = this.limit !== 0 ? '&limit=' + this.limit : ''
      const filter = this.filterValue !== '' ? '&filter=' + this.filterValue : ''
      const sortDir = this.desc === 0 ? 'ASC' : 'DESC'
      const sort = this.sortValue !== '' ? '&sort=' + this.sortValue + '&sort_dir=' + sortDir : ''

      try {
        if (filter === '' && sort === '') {
          if (!pagination && !this.isUpdating) {
            this.isFetching = true
          } else {
            this.isUpdating = true
          }
        } else {
          this.isUpdating = true
        }
        const resp = await axiosInstance.get(
          `/product_list.php?pn=${page}${newLimit}${filter}${sort}`,
        )
        this.products = resp.data.products
        this.totalProducts = Number(resp.data.count)
        this.currentPage = Number(resp.data.current_page)
      } catch (error) {
        console.log(error)
        this.triggerToast({
          message: 'Network Error, please try again',
          color: 'error',
        })
      } finally {
        this.isFetching = false
        this.isUpdating = false
      }
    },
    async addToCart(pid, quantity) {
      const payload = {
        pid: pid,
        quantity: quantity,
      }

      if (await this.updateCartProduct(payload)) {
        this.triggerToast({
          message: 'Added to cart',
          color: 'success',
          timeout: 500,
        })
      }
    },
    async toggleSort() {
      this.desc = Number(!this.desc)
      await this.fetchProducts(true)
    },
  },
}
</script>

<template>
  <div class="table-container">
    <h1 v-if="isFetching && !isUpdating">Loading products...</h1>
    <template v-else-if="products?.length > 0">
      <div class="option-container">
        <select name="limit" id="limit" class="tool-select" v-model="limit">
          <option :value="6">6 per page</option>
          <option :value="12">12 per page</option>
          <option :value="24">24 per page</option>
        </select>

        <div class="sort-group">
          <button
            v-if="sortValue"
            class="direction-btn"
            @click="toggleSort"
            :title="desc ? 'Descending' : 'Ascending'"
          >
            <span class="arrow" :class="{ 'is-up': !desc }">↓</span>
          </button>
          <select name="sort" id="sort" class="tool-select sort-select" v-model="sortValue">
            <option value="">Sort By</option>
            <option value="pname">Name</option>
            <option value="price">Price</option>
          </select>
        </div>

        <select name="filter" id="filter" class="tool-select" v-model="filterValue">
          <option value="">All Categories</option>
          <option value="games">Games</option>
          <option value="study">Study</option>
          <option value="sports">Sports</option>
        </select>
      </div>
      <div class="product-grid">
        <div v-if="isUpdating" class="loading-overlay">
          <h1>Loading...</h1>
        </div>

        <div v-for="item in products" :key="item.pid" class="product-card">
          <div class="card-header">
            <h3>{{ item.pname }}</h3>
            <span class="category-tag">{{ item.category }}</span>
          </div>

          <div class="card-body">
            <p class="description">{{ item.pdesc }}</p>
            <div class="price-row">
              <span class="price">₹{{ item.price }}</span>
              <button
                class="add-to-cart-btn"
                @click="addToCart(item.pid, 1)"
                :disabled="isUpdatingCart"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <PaginationComponent
        v-if="!isUpdating"
        :total-products="totalProducts"
        :limit="limit"
        @fetch-data="fetchProducts"
        :current-page="currentPage"
      />
    </template>
    <h1 v-else-if="!isFetching && !isUpdating">No Products Found!</h1>
  </div>
</template>

<style scoped>
.table-container {
  max-width: 2560px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 12px;
}

.table-container > h1,
tbody h1 {
  text-align: center;
  color: hsla(160, 100%, 20%, 1);
  margin-bottom: 20px;
}

.option-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  width: 90%;
  margin: 0 auto 30px auto;
}

.tool-select {
  display: block;
  padding: 10px 15px;
  font-size: 16px;
  color: hsla(160, 100%, 20%, 1);
  background-color: white;
  border: 2px solid hsla(160, 100%, 37%, 1);
  border-radius: 8px;
  cursor: pointer;
  outline: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  min-width: 120px;
}

.tool-select:focus {
  box-shadow: 0 0 0 3px hsla(160, 100%, 37%, 0.2);
  border-color: hsla(160, 100%, 25%, 1);
}

.sort-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.direction-btn {
  background: hsla(160, 100%, 37%, 0.2);
  border: none;
  color: hsla(160, 100%, 25%, 1);
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.direction-btn:hover {
  background: hsla(160, 100%, 25%, 1);
  transform: scale(1.05);
}

.direction-btn .arrow {
  font-size: 20px;
  transition: transform 0.3s ease;
}

.direction-btn .arrow.is-up {
  transform: rotate(180deg);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  width: 90%;
  margin: 0 auto;
}

.product-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: hsla(160, 100%, 37%, 1);
  padding: 15px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.category-tag {
  font-size: 0.8rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
}

.card-body {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.description {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 20px;
  line-height: 1.5;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-weight: 700;
  font-size: 1.2rem;
  color: hsla(160, 100%, 25%, 1);
}

.add-to-cart-btn {
  padding: 8px;
  font-size: 18px;
  font-size: 18px;
  color: hsla(160, 100%, 98%, 1);
  background-color: hsla(160, 100%, 37%, 1);
  box-shadow: 0px 2px 4px hsla(160, 100%, 37%, 0.2);
  border-radius: 15px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.add-to-cart-btn:hover {
  background-color: white;
  color: hsla(160, 100%, 37%, 1);
  border: 1px solid hsla(160, 100%, 37%, 1);
  box-shadow: 0px 4px 12px hsla(160, 100%, 37%, 0.2);
  transform: translateY(-3px) scale(1.05);
}

@media (max-width: 600px) {
  .option-container {
    /* flex-direction: column;
    align-items: end; */
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
