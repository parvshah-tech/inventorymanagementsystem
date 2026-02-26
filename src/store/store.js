import { createStore } from 'vuex'
import cart from './modules/cart'
import user from './modules/user'
import order from './modules/order'

export const store = createStore({
  modules: {
    cart,
    user,
    order,
  },
})
