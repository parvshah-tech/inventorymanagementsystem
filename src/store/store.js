import axiosInstance from '@/axiosInstance'
import { createStore } from 'vuex'

export const store = createStore({
  state() {
    return {
      status: 0,
      cartProducts: [],
      totalProducts: 0,
      isLoading: false,
      cartErrorMsg: '',
    }
  },
  mutations: {
    setLoading(state, val) {
      state.isLoading = val
    },
    setCartProducts(state, data) {
      state.status = data.status
      state.cartProducts = data.products
      state.totalProducts = data.total_products
      state.cartErrorMsg = data.error || ''
    },
    setError(state, error) {
      state.errorMsg = error
    },
  },
  actions: {
    async fetchCart({ commit }) {
      try {
        commit('setLoading', true)
        const resp = await axiosInstance.get('/add_to_cart.php')
        commit('setCartProducts', resp.data)
      } catch (error) {
        commit('setError', error)
      } finally {
        commit('setLoading', false)
      }
    },
    async updateCartProduct({ dispatch }, payload) {
      const updateProduct = {
        pid: Number(payload.pid),
        quantity: Number(payload.quantity),
      }
      try {
        await axiosInstance.post('/add_to_cart.php', updateProduct)
        await dispatch('fetchCart')
        return true
      } catch (error) {
        console.log(error)
        return false
      }
    },
    async deleteCartProduct(pid) {
      console.log(pid)
    },
    async clearCart(state) {
      try {
        const resp = await axiosInstance.delete('/clear_cart.php')
        state.status = resp.data.status
        await this.dispatch('fetchCart')
      } catch (error) {
        state.errorMsg = error
      }
    },
  },
})
