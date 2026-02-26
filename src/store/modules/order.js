import axiosInstance from '@/axiosInstance'

const state = () => ({
  status: 0,
  message: '',
  totalOrders: 0,
  orders: [],
  isLoading: false,
})

const mutations = {
  setOrders(state, data) {
    state.status = data.status
    state.message = data.message ?? data.error ?? ''
    state.totalOrders = data.total_orders
    state.orders = data.orders
  },
  setError(state, error) {
    state.message = error
  },
  setLoading(state, value) {
    state.isLoading = value
  },
}

const actions = {
  async fetchOrders({ commit }) {
    try {
      commit('setLoading', true)
      const resp = await axiosInstance.get('/checkout.php')
      commit('setOrders', resp.data)
    } catch (error) {
      commit('setError', error)
    } finally {
      commit('setLoading', false)
    }
  },
  async placeOrder({ dispatch, state }, payload) {
    try {
      const resp = await axiosInstance.post('/checkout.php', payload)
      return resp.data
    } catch (error) {
      console.log(error)
      return error
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
