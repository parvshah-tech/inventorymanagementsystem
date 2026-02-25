import axiosInstance from '@/axiosInstance'
import { createStore } from 'vuex'

export const store = createStore({
  state() {
    return {
      status: 0,
      cartProducts: [],
      totalProducts: 0,
      cartErrorMsg: '',
    }
  },
  mutations: {
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
        const resp = await axiosInstance.get('/add_to_cart.php')
        commit('setCartProducts', resp.data)
      } catch (error) {
        commit('setError', error)
      }
    },
    async updateCartProduct({ dispatch }, payload) {
      const product = store.state.cartProducts?.filter((item) => item.pid === payload.pid)[0]
        ?.quantity

      if (product) {
        payload.quantity += Number(product)
      }

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
    async deleteCartProduct({ dispatch }, pid) {
      const payload = {
        pid: Number(pid),
      }

      try {
        const resp = await axiosInstance.delete('/add_to_cart.php', {
          data: payload,
        })
        await dispatch('fetchCart')
        return resp.data
      } catch (error) {
        console.log(error)
        return error
      }
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
