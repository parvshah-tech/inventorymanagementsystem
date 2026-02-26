<script>
import axiosInstance from '@/axiosInstance'
import Cookies from 'js-cookie'
import CartComponent from './CartComponent.vue'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  created() {
    this.fetchCart()
    this.fetchUser()
  },
  components: {
    CartComponent,
  },
  data() {
    return {
      profileActive: false,
      cartActive: false,
    }
  },

  computed: {
    ...mapState('cart', {
      totalCartProducts: 'totalProducts',
    }),
    ...mapGetters('user', {
      avatar: 'avatarLetter',
    }),
  },

  methods: {
    ...mapActions('cart', ['fetchCart']),
    ...mapActions('user', ['fetchUser']),
    toggleProfileMenu() {
      this.profileActive = !this.profileActive

      if (this.cartActive) this.cartActive = false
    },
    toggleCartMenu() {
      this.cartActive = !this.cartActive

      if (this.profileActive) this.profileActive = false
    },
    async logout() {
      await axiosInstance.get('/logout.php')
      Cookies.remove('token')
      window.location.href = '/login'
    },
  },
}
</script>

<template>
  <header>
    <div class="container">
      <div></div>
      <h1>Inventory Management System</h1>
      <div class="btn-group">
        <div class="cart-dropdown">
          <div class="cart-wrapper">
            <span class="cart-badge" v-if="totalCartProducts > 0">
              {{ totalCartProducts }}
            </span>
            <button class="cart-btn" @click="toggleCartMenu">
              <img src="../assets/images/cart.png" alt="cart" />
            </button>
          </div>
          <div v-if="cartActive" class="cart-content">
            <CartComponent @close-cart="toggleCartMenu" />
          </div>
        </div>
        <div class="profile-dropdown">
          <button class="profile-btn" @click="toggleProfileMenu">
            <p class="avatar" v-if="avatar">{{ avatar }}</p>
            <img src="../assets/images/user.png" alt="user" v-else />
          </button>
          <div v-if="profileActive" class="dropdown-content">
            <a href="/profile">Update Profile</a>
            <div class="divider"></div>
            <a href="/orders">View Orders</a>
            <div class="divider"></div>
            <a @click="logout" class="logout-link">Logout</a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.container {
  background-color: hsla(160, 30%, 96%, 1);
  max-width: 2560px;
  margin: 0 auto;
  margin-bottom: 12px;
  border-radius: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.container > h1 {
  color: hsla(160, 15%, 35%, 1);
}

.btn-group {
  margin-right: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.cart-wrapper {
  position: relative;
  display: inline-block;
}

.cart-badge {
  position: absolute;
  top: -12px;
  left: -12px;

  background-color: hsla(0, 100%, 45%, 1);
  color: white;
  font-size: 14px;
  font-weight: bold;
  min-width: 30px;
  height: 30px;
  padding: 0 4px;

  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px solid white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.cart-btn {
  padding: 0;
  padding-top: 5px;
  padding-right: 5px;
  height: 60px;
  width: 60px;
  font-size: 18px;
  background-color: hsla(160, 100%, 37%, 1);
  box-shadow: 0px 2px 4px hsla(160, 100%, 37%, 0.2);
  border-radius: 50%;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.25s ease;
}

.cart-btn:hover {
  background-color: white;
  color: hsla(160, 100%, 37%, 1);
  border: 1px solid hsla(160, 100%, 37%, 1);
  box-shadow: 0px 4px 12px hsla(160, 100%, 37%, 0.2);
  transform: translateY(-3px) scale(1.05);
}

.cart-btn > img {
  height: 75%;
  width: auto;
}

.profile-btn {
  padding: 0;
  width: 60px;
  height: 60px;
  border: none;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.24);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.25s ease;
}

.profile-btn:hover {
  transform: translateY(-3px) scale(1.05);
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
}

.avatar {
  font-size: 1.8rem;
  text-transform: uppercase;
}

.profile-btn > img {
  height: 70%;
  width: auto;
}

.profile-dropdown,
.cart-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: block;
  position: absolute;
  right: 0;
  min-width: 180px;
  background-color: hsla(160, 30%, 96%, 1);
  border-radius: 15px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
  z-index: 100;
  overflow: hidden;
  margin-top: 16px;
  border: 1px solid rgba(0, 128, 0, 0.1);
}

.dropdown-content a {
  color: hsla(160, 40%, 15%, 1);
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  font-size: 14px;
  border-radius: 0;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-content a:hover {
  background-color: hsla(160, 100%, 37%, 0.1);
  color: hsla(160, 100%, 37%, 1);
}

.logout-link:hover {
  background-color: rgba(255, 0, 0, 0.05) !important;
  color: #d32f2f !important;
}

.divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.05);
  margin: 4px 0;
}

.cart-content {
  max-height: 500px;
  padding: 12px;
  padding-top: 0;
  display: block;
  position: absolute;
  right: 0;
  min-width: 600px;
  background-color: hsla(160, 30%, 96%, 1);
  border-radius: 15px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
  z-index: 100;
  overflow-y: auto;
  margin-top: 14px;
  border: 1px solid rgba(0, 128, 0, 0.1);
}

.cart-content::-webkit-scrollbar {
  width: 6px;
}
.cart-content::-webkit-scrollbar-thumb {
  background: hsla(160, 100%, 37%, 0.2);
  border-radius: 10px;
}
.cart-content::-webkit-scrollbar-thumb:hover {
  background: hsla(160, 100%, 37%, 0.5);
}
</style>
