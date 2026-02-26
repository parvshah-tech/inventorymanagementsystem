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
          this.message = resp.data.message
          this.status = resp.data.status
          Cookies.set('token', resp.data.token)
          window.location.href = '/'
          this.user = {}
        } catch (error) {
          this.message = error.error
          this.status = error.status
        } finally {
          this.isLoading = false
        }
      }
    },
  },
  computed: {
    messageType() {
      return this.status === 200 ? 'success' : 'error'
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
      <div v-if="message !== ''" :class="['status-alert', messageType]">
        <p class="status-text">{{ message }}</p>
      </div>
      <button type="submit" :disabled="isLoading" class="btn">
        {{ buttonText }}
      </button>
      <p>Don't have an account, <RouterLink to="/register">Register</RouterLink></p>
    </div>
  </form>
</template>

<style scoped>
.status-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  border-left: 4px solid transparent;
}

.status-text {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.status-alert.success {
  background-color: hsla(160, 100%, 37%, 0.1);
  color: hsla(160, 100%, 25%, 1);
  border-left-color: hsla(160, 100%, 37%, 1);
}

.status-alert.error {
  background-color: hsla(0, 100%, 45%, 0.05);
  color: hsla(0, 100%, 45%, 1);
  border-left-color: hsla(0, 100%, 45%, 1);
}

.name-group {
  display: flex;
  justify-content: space-between;
}
</style>
