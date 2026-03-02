import { createStore } from 'vuex'
import cart from './modules/cart'
import user from './modules/user'
import order from './modules/order'
import toast from './modules/toast'

export const store = createStore({
  modules: {
    cart,
    user,
    order,
    toast,
  },
})
