const state = () => ({
  toast: {
    isActive: false,
    message: '',
    color: '',
    timeout: 3000,
  },
})

const mutations = {
  showToast(state, payload) {
    state.toast.isActive = true
    state.toast.message = payload.message
    state.toast.color = payload.color || 'info'
    state.timeout = payload.timeout || 3000
  },
  hideToast(state) {
    state.toast.isActive = false
  },
}

const actions = {
  triggerToast({ commit }, payload) {
    commit('showToast', payload)

    setTimeout(() => {
      commit('hideToast')
    }, payload.timeout || 3000)
  },
}

const getters = {
  toastState: (state) => state.toast,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
