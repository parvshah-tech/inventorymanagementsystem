<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  data() {
    return {
      address: '',
      error: '',
    }
  },
  computed: {
    ...mapState('order', ['isLoading']),
    ...mapGetters('user', ['fullName']),
    ...mapState('user', ['email', 'phone']),
  },
  methods: {
    ...mapActions('order', ['placeOrder']),
    async checkout() {
      this.error = ''
      if (this.address === '' || !this.address) {
        this.error = 'Address required'
      } else if (this.address.length < 10) {
        this.error = 'Address length must be greater than 10'
      } else {
        const payload = {
          address: this.address,
        }
        const resp = this.placeOrder(payload)
        if (!resp.error) {
          console.log('Order placed')
          this.$router.push('/')
        } else {
          console.log(resp.error)
        }
        this.address = ''
      }
    },
  },
}
</script>

<template>
  <div class="checkout-wrap">
    <div class="sticky-form-card">
      <div class="form-header">
        <h2 class="section-title">Delivery Details</h2>
      </div>

      <form @submit.prevent="checkout">
        <div class="readonly-grid">
          <div class="input-group">
            <label>Full Name</label>
            <div class="disabled-field">{{ fullName }}</div>
          </div>

          <div class="input-group">
            <label>Email Address</label>
            <div class="disabled-field">{{ email }}</div>
          </div>
        </div>

        <div class="input-group">
          <label>Phone Number</label>
          <div class="disabled-field">{{ phone }}</div>
        </div>

        <div class="input-group active-input">
          <label
            >Shipping Address <span class="required">*</span>
            <p class="field-error" v-if="error !== ''">
              {{ error }}
            </p>
          </label>
          <textarea rows="3" v-model="address"></textarea>
          <p class="helper-text">Ensure your address is accurate for timely delivery.</p>
        </div>

        <div class="form-actions">
          <button type="button" class="back-link" @click="$router.push('/')">← Back to Cart</button>
          <button type="submit" class="confirm-order-btn" :disabled="isLoading">
            {{ isLoading ? 'Placing...' : 'Place Order' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.checkout-wrap {
  flex: 1;
}

.sticky-form-card {
  position: sticky;
  top: 40px;
  background: white;
  padding: 35px;
  border-radius: 24px; /* Softer corners */
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.06);
  border: 1px solid hsla(160, 30%, 96%, 1);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: hsla(160, 40%, 15%, 1);
  margin: 0;
}

.readonly-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 700;
  color: hsla(160, 40%, 15%, 0.8);
}

.required {
  color: hsla(0, 100%, 45%, 1);
}

.disabled-field {
  width: 100%;
  padding: 12px 16px;
  background-color: hsla(160, 30%, 98%, 1);
  border: 1px solid hsla(160, 30%, 92%, 1);
  border-radius: 12px;
  font-size: 15px;
  color: hsla(160, 40%, 15%, 0.5);
  cursor: not-allowed;
}

.field-error {
  font-size: 12px;
  display: block;
  color: red;
}

textarea {
  width: 100%;
  padding: 14px;
  border: 2px solid hsla(160, 30%, 90%, 1);
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.2s ease;
  resize: none;
}

textarea:focus {
  outline: none;
  border-color: hsla(160, 100%, 37%, 1);
  background-color: white;
  box-shadow: 0 0 0 4px hsla(160, 100%, 37%, 0.1);
}

.helper-text {
  font-size: 12px;
  color: #888;
  margin-top: 6px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  gap: 20px;
}

.back-link {
  background: none;
  border: none;
  border-radius: 15px;
  color: hsla(0, 100%, 45%, 1);
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  padding: 10px;
  transition: background 0.2s;
}

.back-link:hover {
  background: hsla(0, 100%, 97%, 1);
}

.confirm-order-btn {
  flex: 1;
  padding: 16px;
  font-size: 18px;
  font-weight: 700;
  color: white;
  background-color: hsla(160, 100%, 37%, 1);
  border-radius: 16px;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 20px hsla(160, 100%, 37%, 0.2);
  transition: all 0.3s ease;
}

.confirm-order-btn:hover {
  background-color: hsla(160, 100%, 30%, 1);
  transform: translateY(-3px);
  box-shadow: 0 12px 25px hsla(160, 100%, 37%, 0.3);
}
</style>
