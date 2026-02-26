<script>
import axiosInstance from '../axiosInstance'
import '../assets/auth.css'

export default {
  data() {
    return {
      user: {
        fname: '',
        lname: '',
        email: '',
        phone: '',
        pwd: '',
        confirm_pwd: '',
      },
      error: {
        fname: '',
        lname: '',
        email: '',
        phone: '',
        pwd: '',
        confirm_pwd: '',
      },
      message: '',
      status: 0,
      isLoading: false,
    }
  },

  methods: {
    validate() {
      let isValid = true
      if (this.user.fname === '' || !this.user.fname) {
        this.error.fname = 'First name required'
        isValid = false
      }
      if (this.user.lname === '' || !this.user.lname) {
        this.error.lname = 'Last name required'
        isValid = false
      }
      if (this.user.email === '' || !this.user.email) {
        this.error.email = 'Email required'
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(this.user.email)) {
        this.error.email = 'Invalid email'
        isValid = false
      }
      if (this.user.phone === '' || !this.user.phone) {
        this.error.phone = 'Phone No. required'
        isValid = false
      } else if (!/[0-9]{10}/.test(this.user.phone) || /[a-zA-Z]+/.test(this.user.phone)) {
        this.error.phone = 'Invalid phone no.'
        isValid = false
      }
      if (this.user.pwd === '' || !this.user.pwd) {
        this.error.pwd = 'Password required'
        isValid = false
      }
      if (this.user.confirm_pwd === '' || !this.user.confirm_pwd) {
        this.error.confirm_pwd = 'Confirm password required'
        isValid = false
      } else if (this.user.pwd !== this.user.confirm_pwd) {
        this.error.confirm_pwd = 'Passwords do not match'
        this.error.pwd = 'Passwords do not match'
        isValid = false
      }

      return isValid
    },
    async register() {
      this.error = {}
      this.message = ''

      if (this.validate()) {
        try {
          this.isLoading = true
          const resp = await axiosInstance.post('/register.php', this.user)
          this.message = resp.data.message
          this.status = resp.data.status
        } catch (error) {
          this.message = error.error
          this.status = error.status
        } finally {
          this.isLoading = false
        }

        this.user = {}
      }
    },
  },
  computed: {
    messageColor() {
      return this.status === 200 ? 'green' : 'red'
    },
    buttonText() {
      return this.isLoading ? 'Registering...' : 'Register'
    },
  },
}
</script>

<template>
  <h1 style="text-align: center">Welcome to IMS</h1>
  <form @submit.prevent="register">
    <div class="name-group">
      <div class="form-group">
        <label for="fname">
          <span style="color: red">*</span>
          First Name:
        </label>
        <input type="text" v-model="user.fname" id="fname" />
        <p class="field-error" v-if="error.fname !== ''">
          {{ error.fname }}
        </p>
      </div>
      <div class="form-group">
        <label for="lname">
          <span style="color: red">*</span>
          Last Name:
        </label>
        <input type="text" v-model="user.lname" id="lname" />
        <p class="field-error" v-if="error.lname !== ''">
          {{ error.lname }}
        </p>
      </div>
    </div>
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
      <label for="phone">
        <span style="color: red">*</span>
        Phone:
      </label>
      <input type="tel" v-model="user.phone" id="phone" />
      <p class="field-error" v-if="error.phone !== ''">
        {{ error.phone }}
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
    <div class="form-group">
      <label for="confirm_pwd">
        <span style="color: red">*</span>
        Confirm Password:
      </label>
      <input type="password" v-model="user.confirm_pwd" id="confirm_pwd" />
      <p class="field-error" v-if="error.confirm_pwd !== ''">
        {{ error.confirm_pwd }}
      </p>
    </div>
    <div style="text-align: center">
      <button type="submit" :disabled="isLoading" class="btn">
        {{ buttonText }}
      </button>
      <p v-if="message !== ''" class="message" :style="{ color: messageColor }">
        {{ message }}
      </p>
      <p>Already have an account, <RouterLink to="/login">Login</RouterLink></p>
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
