import axiosInstance from '@/axiosInstance'

const state = () => ({
  status: 0,
  cartProducts: [],
  totalProducts: 0,
  totalBill: 0,
  cartErrorMsg: '',
})

const mutations = {
  setCartProducts(state, data) {
    state.status = data.status
    state.cartProducts = data.products
    state.totalProducts = data.total_products
    state.totalBill = data.total_bill
    state.cartErrorMsg = data.error || ''
  },
  setError(state, error) {
    state.errorMsg = error
  },
}

const actions = {
  async fetchCart({ commit }) {
    try {
      const resp = await axiosInstance.get('/add_to_cart.php')
      commit('setCartProducts', resp.data)
    } catch (error) {
      commit('setError', error)
    }
  },
  async updateCartProduct({ dispatch, state }, payload) {
    const product = state.cartProducts?.filter((item) => item.pid === payload.pid)[0]?.quantity

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
  async clearCart({ commit, dispatch }) {
    try {
      const resp = await axiosInstance.delete('/clear_cart.php')
      commit('setCartProducts', {
        status: resp.data.status,
        products: [],
        total_products: 0,
        total_bill: 0,
      })
      await dispatch('fetchCart')
    } catch (error) {
      state.errorMsg = error
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
