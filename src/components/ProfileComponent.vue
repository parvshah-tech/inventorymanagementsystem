<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  async created() {
    this.isLoading = true
    await this.fetchUser()
    this.user.fname = this.fname
    this.user.lname = this.lname
    this.user.phone = this.phone
    this.isLoading = false
  },
  data() {
    return {
      user: {
        fname: '',
        lname: '',
        phone: '',
      },
      error: {
        fname: '',
        lname: '',
        phone: '',
      },
      message: '',
      messageType: '',
      isLoading: false,
      isEditing: false,
    }
  },
  computed: {
    ...mapState('user', ['fname', 'lname', 'email', 'phone']),
    ...mapGetters('user', ['avatarLetter']),
  },
  methods: {
    ...mapActions('user', ['fetchUser', 'updateUser']),
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
      if (this.user.phone === '' || !this.user.phone) {
        this.error.phone = 'Phone No. required'
        isValid = false
      } else if (!/[0-9]{10}/.test(this.user.phone) || /[a-zA-Z]+/.test(this.user.phone)) {
        this.error.phone = 'Invalid phone no.'
        isValid = false
      }

      return isValid
    },
    toggleEdit() {
      this.isEditing = !this.isEditing
      this.message = ''
      this.messageType = ''
    },
    cancel() {
      this.error = {}
      this.isEditing = false
      this.user.fname = this.fname
      this.user.lname = this.lname
      this.user.phone = this.phone
    },
    async update() {
      if (this.validate()) {
        if (
          this.user.fname === this.fname &&
          this.user.lname === this.lname &&
          this.user.phone === this.phone
        ) {
          console.log('No request')
        } else {
          const payload = {
            fname: this.user.fname,
            lname: this.user.lname,
            phone: this.user.phone,
          }
          const resp = await this.updateUser(payload)
          if (resp.message) {
            this.message = resp.message
            this.messageType = 'success'
          } else {
            this.message = resp.error ?? ''
            this.messageType = 'error'
          }
          this.cancel()
        }
      }
    },
  },
}
</script>

<template>
  <div v-if="isLoading" class="loading-wrapper">
    <h1>Loading your profile...</h1>
  </div>
  <div v-else-if="fname" class="profile-container">
    <div class="top-nav">
      <button class="back-home-btn" @click="$router.push('/')">
        <span class="arrow">←</span> Back to Home
      </button>
    </div>
    <div class="profile-header">
      <div class="avatar-wrapper">
        <div class="avatar-circle">{{ avatarLetter }}</div>
      </div>
      <h1 class="profile-title">Your Profile</h1>
      <p class="profile-subtitle">Manage your personal information and security</p>
    </div>

    <form @submit.prevent="update" class="profile-form">
      <div class="form-grid">
        <div class="input-group">
          <label for="fname"
            >First Name
            <span v-if="isEditing">*</span>
          </label>
          <p class="field-error">{{ error.fname }}</p>
          <input
            type="text"
            id="fname"
            v-model="user.fname"
            :disabled="!isEditing"
            :class="{ 'editing-mode': isEditing }"
          />
        </div>

        <div class="input-group">
          <label for="lname"
            >Last Name
            <span v-if="isEditing">*</span>
          </label>
          <p class="field-error">{{ error.lname }}</p>
          <input
            type="text"
            id="lname"
            v-model="user.lname"
            :disabled="!isEditing"
            :class="{ 'editing-mode': isEditing }"
          />
        </div>

        <div class="input-group full-width">
          <label for="email">Email Address</label>
          <input type="email" id="email" v-model="email" disabled="true" />
        </div>

        <div class="input-group full-width">
          <label for="phone"
            >Phone Number
            <span v-if="isEditing">*</span>
          </label>
          <p class="field-error">{{ error.phone }}</p>
          <input
            type="text"
            id="phone"
            v-model="user.phone"
            :disabled="!isEditing"
            :class="{ 'editing-mode': isEditing }"
          />
        </div>
      </div>

      <div class="form-footer">
        <div v-if="message" :class="['status-alert', messageType]">
          <p class="status-text">{{ message }}</p>
        </div>
        <div v-if="isEditing" class="button-group">
          <button type="button" class="btn-cancel" @click="cancel">Cancel</button>
          <button type="submit" class="btn-save">Save Changes</button>
        </div>
        <div v-else>
          <button type="button" class="btn-edit" @click="toggleEdit">Edit Profile</button>
        </div>
      </div>
    </form>
  </div>
  <div v-else class="loading-wrapper" style="color: red">
    <h1>Network error, please try again</h1>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  margin-top: 20px;
  background: white;
  padding: 20px 40px;
  border-radius: 24px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
  border: 1px solid hsla(160, 30%, 96%, 1);
}

.top-nav {
  margin-bottom: 20px;
}

.back-home-btn {
  background: none;
  border: none;
  color: hsla(160, 40%, 15%, 0.6);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  margin-left: -12px;
}

.back-home-btn:hover {
  color: hsla(160, 100%, 37%, 1);
  background: hsla(160, 100%, 37%, 0.05);
}

.back-home-btn .arrow {
  font-size: 18px;
  transition: transform 0.2s ease;
}

.back-home-btn:hover .arrow {
  transform: translateX(-3px);
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
}

.avatar-wrapper {
  position: relative;
  width: 100px;
  margin: 0 auto 20px;
}

.avatar-circle {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, hsla(160, 100%, 37%, 1), hsla(160, 100%, 25%, 1));
  color: white;
  font-size: 40px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 10px 20px hsla(160, 100%, 37%, 0.2);
}

.profile-title {
  font-size: 28px;
  color: hsla(160, 40%, 15%, 1);
  margin: 0;
}

.profile-subtitle {
  font-size: 14px;
  color: #888;
  margin-top: 5px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.full-width {
  grid-column: span 2;
}

.input-group label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: hsla(160, 40%, 15%, 0.7);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-group label span {
  color: hsla(0, 100%, 45%, 1);
  margin-left: 4px;
}

.field-error {
  font-size: 11px;
  color: hsla(0, 100%, 45%, 1);
  font-weight: 500;
  margin: 0;
}

.field-error {
  font-size: 12px;
  margin-top: 5px;
  display: block;
  color: red;
}

input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 2px solid transparent;
  background: hsla(160, 30%, 98%, 1);
  font-size: 16px;
  color: hsla(160, 40%, 15%, 1);
  transition: all 0.3s ease;
}

input:disabled {
  background: hsla(160, 30%, 98%, 0.5);
  color: hsla(160, 40%, 15%, 0.6);
  cursor: default;
}

input.editing-mode {
  border-color: hsla(160, 30%, 90%, 1);
  background: white;
}

input.editing-mode:focus {
  outline: none;
  border-color: hsla(160, 100%, 37%, 1);
  box-shadow: 0 0 0 4px hsla(160, 100%, 37%, 0.1);
}

.form-footer {
  margin-top: 35px;
  padding-top: 25px;
  border-top: 1px solid hsla(160, 30%, 94%, 1);
}

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

.button-group {
  display: flex;
  gap: 15px;
}

button {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 15px;
}

.btn-edit {
  width: 100%;
  background: white;
  color: hsla(160, 100%, 37%, 1);
  border: 2px solid hsla(160, 100%, 37%, 1);
}

.btn-edit:hover {
  background: hsla(160, 100%, 37%, 0.05);
}

.btn-save {
  flex: 2;
  background: hsla(160, 100%, 37%, 1);
  color: white;
  border: none;
  box-shadow: 0 8px 16px hsla(160, 100%, 37%, 0.2);
}

.btn-save:hover {
  transform: translateY(-2px);
  background: hsla(160, 100%, 32%, 1);
}

.btn-cancel {
  flex: 1;
  background: #f1f3f5;
  color: #495057;
  border: none;
}

.btn-cancel:hover {
  background: #e9ecef;
}
</style>
