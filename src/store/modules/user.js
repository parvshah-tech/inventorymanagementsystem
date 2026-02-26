import axiosInstance from '@/axiosInstance'

const state = () => ({
  status: 0,
  message: '',
  fname: '',
  lname: '',
  email: '',
  phone: '',
  isLoading: false,
})

const getters = {
  fullName: (state, getters) => {
    return state.fname + ' ' + state.lname
  },
  avatarLetter: (state, getters) => {
    return state.fname[0]
  },
}

const mutations = {
  setUser(state, data) {
    state.status = data.status
    state.message = data.message ?? data.error ?? ''
    state.fname = data.user_details.fname
    state.lname = data.user_details.lname
    state.email = data.user_details.email
    state.phone = data.user_details.phone
  },
  setError(state, error) {
    state.message = error
  },
}

const actions = {
  async fetchUser({ commit }) {
    try {
      const resp = await axiosInstance.get('/update_profile.php')
      commit('setUser', resp.data)
    } catch (error) {
      commit('setError', error)
    }
  },
  async updateUser({ dispatch, state }, payload) {
    try {
      const resp = await axiosInstance.post('/update_profile.php', payload)
      await dispatch('fetchUser')
      return resp.data
    } catch (error) {
      console.log(error)
      return false
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
