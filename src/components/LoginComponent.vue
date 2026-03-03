<script>
import axiosInstance from '../axiosInstance'
import Cookies from 'js-cookie'
import '../assets/auth.css'
import { mapActions } from 'vuex'

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
      status: 0,
      isLoading: false,
    }
  },

  methods: {
    ...mapActions('toast', ['triggerToast']),
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

      if (this.validate()) {
        try {
          this.isLoading = true
          const resp = await axiosInstance.post('/login.php', this.user)
          this.status = resp.data.status
          Cookies.set('token', resp.data.token)
          this.triggerToast({
            message: 'Login success',
            color: 'success',
          })
          this.$router.push('/')
          this.user = {}
        } catch (error) {
          this.status = error.status
          this.triggerToast({
            message: 'Network Error, please try again',
            color: 'error',
          })
        } finally {
          this.isLoading = false
        }
      }
    },
  },
  computed: {
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
      <p>Don't have an account, <RouterLink to="/register">Register</RouterLink></p>
    </div>
  </form>
</template>

<style scoped>
.name-group {
  display: flex;
  justify-content: space-between;
}
</style>
