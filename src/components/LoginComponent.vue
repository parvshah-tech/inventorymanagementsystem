<script>
import axiosInstance from '../axiosInstance'
import Cookies from 'js-cookie'
import '../assets/auth.css'

export default {
  data() {
    return {
      user: {
        email: '',
        pwd: '',
      },
      error: {
        email: '',
        pwd: '',
      },
      message: '',
      status: 0,
      isLoading: false,
    }
  },

  methods: {
    validate() {
      let isValid = true
      if (this.user.email === '' || !this.user.email) {
        this.error.email = 'Email required'
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(this.user.email)) {
        this.error.email = 'Invalid email'
        isValid = false
      }
      if (this.user.pwd === '' || !this.user.pwd) {
        this.error.pwd = 'Password required'
        isValid = false
      }

      return isValid
    },
    async login() {
      this.error = {}
      this.message = ''

      if (this.validate()) {
        try {
          this.isLoading = true
          const resp = await axiosInstance.post('/login.php', this.user)
          // console.log(resp.data)
          this.message = resp.data.message
          this.status = resp.data.status
          Cookies.set('token', resp.data.token)
          window.location.href = '/'
          this.user = {}
        } catch (error) {
          // console.log(error)
          this.message = error.error
          this.status = error.status
        } finally {
          this.isLoading = false
        }
      }
    },
  },
  computed: {
    messageColor() {
      return this.status === 200 ? 'green' : 'red'
    },
    buttonText() {
      return this.isLoading ? 'Logging...' : 'Login'
    },
  },
}
</script>

<template>
  <h1 style="text-align: center">Welcome back</h1>
  <form @submit.prevent="login">
    <div class="form-group">
      <label for="email">
        <span style="color: red">*</span>
        Email:
      </label>
      <input type="email" v-model="user.email" id="email" />
      <p class="field-error" v-if="error.email !== ''">
        {{ error.email }}
      </p>
    </div>
    <div class="form-group">
      <label for="pwd">
        <span style="color: red">*</span>
        Password:
      </label>
      <input type="password" v-model="user.pwd" id="pwd" />
      <p class="field-error" v-if="error.pwd !== ''">
        {{ error.pwd }}
      </p>
    </div>
    <div style="text-align: center">
      <button type="submit" :disabled="isLoading" class="btn">
        {{ buttonText }}
      </button>
      <p v-if="message !== ''" class="message" :style="{ color: messageColor }">
        {{ message }}
      </p>
      <p>Don't have an account, <RouterLink to="/register">Register</RouterLink></p>
    </div>
  </form>
</template>

<style scoped>
.message {
  font-size: 18px;
}

.name-group {
  display: flex;
  justify-content: space-between;
}
</style>
