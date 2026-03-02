import axiosInstance from '@/axiosInstance'

const state = () => ({
  status: 0,
  cartProducts: [],
  totalProducts: 0,
  totalBill: 0,
  cartErrorMsg: '',
  isLoading: false,
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
  setLoading(state, value) {
    state.isLoading = value
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
  async updateCartProduct({ dispatch, state, commit }, payload) {
    const product = state.cartProducts?.filter((item) => item.pid === payload.pid)[0]?.quantity

    if (product) {
      payload.quantity += Number(product)
    }

    const updateProduct = {
      pid: Number(payload.pid),
      quantity: Number(payload.quantity),
    }

    try {
      commit('setLoading', true)
      await axiosInstance.post('/add_to_cart.php', updateProduct)
      await dispatch('fetchCart')
      return true
    } catch (error) {
      console.log(error)
      return false
    } finally {
      commit('setLoading', false)
    }
  },
  async deleteCartProduct({ dispatch, commit }, pid) {
    const payload = {
      pid: Number(pid),
    }

    try {
      commit('setLoading', true)
      const resp = await axiosInstance.delete('/add_to_cart.php', {
        data: payload,
      })
      await dispatch('fetchCart')
      return resp.data
    } catch (error) {
      console.log(error)
      return error
    } finally {
      commit('setLoading', false)
    }
  },
  async clearCart({ commit, dispatch }) {
    try {
      commit('setLoading', true)
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
    } finally {
      commit('setLoading', false)
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
