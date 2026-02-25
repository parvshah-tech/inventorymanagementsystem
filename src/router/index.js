import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Cookies from 'js-cookie'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/SignupView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/CheckoutView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const isAuthenticated = Cookies.get('token') ? true : false
  // console.log(isAuthenticated)

  const protectedRoute = ['/']

  if (protectedRoute.includes(to) && !isAuthenticated) {
    return '/login'
  } else {
    return true
  }
})

export default router
