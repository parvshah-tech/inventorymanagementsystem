<script>
import axiosInstance from '@/axiosInstance'
import PaginationComponent from './PaginationComponent.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    PaginationComponent,
  },
  data() {
    return {
      products: [],
      totalProducts: 0,
      limit: 5,
      currentPage: 1,
      error: '',
      isFetching: false,
      isUpdating: false,
      filterValue: '',
    }
  },

  watch: {
    async filterValue(newVal) {
      this.isUpdating = true
      if (newVal !== '') {
        await this.$router.push({
          query: {
            filter: newVal,
          },
        })
      } else {
        await this.$router.push('/')
      }
      this.isUpdating = true
      await this.fetchProducts()
      this.isUpdating = false
    },
  },

  async created() {
    await this.fetchProducts()
    this.filterValue = this.$route.query?.filter
  },

  methods: {
    ...mapActions('cart', ['updateCartProduct']),
    async fetchProducts() {
      const page = this.$route.query?.page ?? 1
      const filter = this.$route.query.filter && '&filter=' + this.$route.query?.filter

      try {
        if (!filter) {
          this.isFetching = true
        }
        const resp = await axiosInstance.get(`/product_list.php?pn=${page}${filter}`)
        this.products = resp.data.products
        this.totalProducts = Number(resp.data.count)
        this.currentPage = Number(resp.data.current_page)
      } catch (error) {
        console.log(error)
      } finally {
        this.isFetching = false
      }
    },
    async addToCart(pid, quantity) {
      const payload = {
        pid: pid,
        quantity: quantity,
      }

      if (await this.updateCartProduct(payload)) {
        console.log('Added')
      }
    },
  },
}
</script>

<template>
  <div class="table-container">
    <h1 v-if="isFetching">Loading products...</h1>
    <template v-else-if="products?.length > 0">
      <select name="filter" id="filter" v-model="filterValue">
        <option value="">Category</option>
        <option value="games">Games</option>
        <option value="study">Study</option>
        <option value="sports">Sports</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th style="border: none"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isUpdating">
            <td colspan="5"><h1>Loading...</h1></td>
          </tr>
          <tr v-else v-for="item in products" :key="item.pid">
            <td>{{ item.pname }}</td>
            <td>{{ item.pdesc }}</td>
            <td>₹{{ item.price }}</td>
            <td>{{ item.category }}</td>
            <td style="border: none">
              <button class="add-to-cart-btn" @click="addToCart(item.pid, 1)">Add to cart</button>
            </td>
          </tr>
        </tbody>
      </table>
      <PaginationComponent
        :total-products="totalProducts"
        :limit="limit"
        @fetch-data="fetchProducts"
        :current-page="currentPage"
      />
    </template>
    <h1 v-else>No Products Found!</h1>
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

select#filter {
  display: block;
  width: fit-content;
  margin: 0 auto 20px 5%; /* Aligns with the 90% width table */
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
}

select#filter:focus {
  box-shadow: 0 0 0 3px hsla(160, 100%, 37%, 0.2);
  border-color: hsla(160, 100%, 25%, 1);
}

select#filter option {
  background-color: white;
  color: hsla(160, 40%, 15%, 1);
  padding: 10px;
}

table {
  width: 90%;
  margin: 0 auto;
  border-collapse: collapse;
  font-size: 18px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

th {
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  text-align: left;
  font-weight: 600;
  padding: 16px 12px;
}

td {
  padding: 14px 12px;
  border-bottom: 1px solid hsla(160, 30%, 90%, 1);
  color: hsla(160, 40%, 15%, 1);
}
tr:nth-child(even) {
  background-color: hsla(160, 100%, 98%, 1);
}

tr:hover {
  background-color: hsla(160, 100%, 95%, 1);
  transition: background 0.2s ease;
}

tr:last-child td {
  border-bottom: none;
}

.add-to-cart-btn {
  width: 50%;
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
</style>
