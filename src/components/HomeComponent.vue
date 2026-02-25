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
      currentPage: 1,
      error: '',
      isFetching: false,
    }
  },

  computed: {
    ...mapState({
      cartProducts: 'cartProducts',
    }),
  },

  created() {
    this.fetchProducts()
  },

  methods: {
    ...mapActions(['updateCartProduct']),
    async fetchProducts(page = 1) {
      try {
        this.isFetching = true
        const resp = await axiosInstance.get(`/product_list.php?pn=${page}`)
        this.products = resp.data.products
        this.totalProducts = Number(resp.data.count)
        this.currentPage = Number(resp.data.current_page)
      } catch (error) {
        console.log(error)
      } finally {
        this.isFetching = false
      }
    },
  },
  async addToCart(pid, quantity) {
    const product = this.cartProducts.filter((item) => item.pid === pid).quantity
    console.log(product)

    // const payload = {
    //   pid: pid,
    //   quantity: quantity,
    // }

    // if (await this.updateCartProduct(payload)) {
    //   console.log('Added')
    // }
  },
}
</script>

<template>
  <div class="table-container">
    <h1 v-if="isFetching">Loading...</h1>
    <template v-else-if="products.length > 0">
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
          <tr v-for="item in products" :key="item.pid">
            <td>{{ item.pname }}</td>
            <td>{{ item.pdesc }}</td>
            <td>{{ item.price }}</td>
            <td>{{ item.category }}</td>
            <td style="border: none">
              <button class="add-to-cart-btn" @click="addToCart(item.pid)">Add to cart</button>
            </td>
          </tr>
        </tbody>
      </table>
      <PaginationComponent
        :total-products="totalProducts"
        :limit="5"
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

.table-container > h1 {
  text-align: center;
  color: hsla(160, 100%, 20%, 1);
  margin-bottom: 20px;
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
