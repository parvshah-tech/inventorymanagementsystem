<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'CartComponent',
  emits: ['closeCart'],
  async created() {
    this.isLoading = true
    await this.fetchCart()
    this.isLoading = false
  },

  data() {
    return {
      isLoading: false,
    }
  },

  computed: {
    ...mapState('cart', ['cartProducts', 'totalProducts', 'cartErrorMsg']),
  },
  methods: {
    ...mapActions('cart', ['fetchCart', 'updateCartProduct', 'clearCart', 'deleteCartProduct']),
    async update(pid, quantity) {
      const payload = {
        pid: pid,
        quantity: quantity,
      }
      if (await this.updateCartProduct(payload)) {
        console.log('Updated')
      }
    },
    async deleteProduct(pid) {
      const resp = await this.deleteCartProduct(pid)
      if (resp.message) {
        console.log('Deleted')
      } else {
        console.log(resp)
      }
    },
    async clear() {
      await this.clearCart()
      this.$emit('closeCart')
    },
    checkout() {
      if (this.cartProducts.length > 0) {
        this.$router.push('/checkout')
      }
    },
  },
}
</script>

<template>
  <h1 v-if="isLoading" class="message">Loading...</h1>
  <template v-else-if="cartProducts">
    <div class="cart-header">
      <div></div>
      <h1>Your Cart</h1>
      <button class="cart-clear-btn" @click="clear">Clear Cart</button>
    </div>
    <div class="cart-body">
      <div v-for="product in cartProducts" class="cart-item" :key="product.pid">
        <div class="item-details">
          <h4 class="item-name">{{ product.pname }}</h4>
          <p class="item-category">{{ product.category }}</p>
          <span class="item-price">₹{{ product.price }}</span>
        </div>

        <div class="quantity-stepper">
          <button
            class="qty-btn decrement"
            aria-label="Decrease quantity"
            @click="
              Number(product.quantity) === 1 ? deleteProduct(product.pid) : update(product.pid, -1)
            "
          >
            −
          </button>
          <span class="qty-number">{{ product.quantity }}</span>
          <button
            class="qty-btn increment"
            aria-label="Increase quantity"
            @click="update(product.pid, 1)"
          >
            +
          </button>
        </div>
        <p class="total-price">₹{{ product.total_price }}</p>
        <button class="remove-item-btn" title="Remove Item" @click="deleteProduct(product.pid)">
          <img src="../assets/images/delete.png" alt="delete" />
        </button>
      </div>
      <div class="cart-footer">
        <button class="cart-clear-btn" @click="$emit('closeCart')">Close</button>
        <button class="checkout-btn" @click="checkout">Checkout</button>
      </div>
    </div>
  </template>
  <h2 v-else class="message">{{ cartErrorMsg }}</h2>
</template>

<style scoped>
.message {
  margin-top: 12px;
  text-align: center;
  color: hsla(160, 100%, 20%, 1);
}

.cart-header {
  position: sticky;
  top: 0px;
  padding: 12px 0;
  background-color: rgba(242, 248, 246, 0.9);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-header > h1 {
  text-align: center;
}

.cart-clear-btn {
  padding: 8px;
  font-size: 18px;
  font-size: 18px;
  color: hsla(160, 100%, 98%, 1);
  background-color: hsla(0, 100%, 45%, 1);
  box-shadow: 0px 4px 12px hsla(0, 100%, 45%, 0.3);
  border-radius: 15px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.cart-clear-btn:hover {
  background-color: white;
  color: hsla(0, 100%, 45%, 1);
  border: 1px solid hsla(0, 100%, 45%, 1);
  box-shadow: 0px 6px 15px hsla(0, 100%, 45%, 0.4);
  transform: translateY(-3px) scale(1.05);
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
}

.item-info {
  flex: 1;
  padding: 0 16px;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: hsla(160, 40%, 15%, 1);
  margin-bottom: 4px;
}

.item-price {
  color: hsla(160, 100%, 37%, 1);
  font-weight: 700;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid hsla(160, 30%, 90%, 1);
  border-radius: 20px;
  overflow: hidden;
}

.qty-btn {
  background: none;
  padding: 8px 12px;
  margin: 0 12px;
  font-size: 20px;
  color: hsla(160, 100%, 98%, 1);
  border-radius: 50%;
  border: 1px solid transparent;
  cursor: pointer;
}

.increment {
  color: hsla(160, 100%, 37%, 1);
  transition: background 0.2s;
}

.increment:hover {
  background: hsla(160, 30%, 96%, 1);
}

.decrement {
  color: hsla(0, 100%, 45%, 1);
  transition: background 0.2s;
}

.decrement:hover,
.remove-item-btn:hover {
  background: hsla(0, 100%, 97%, 1);
}

.qty-number {
  font-weight: 500;
  font-size: 16px;
}

.total-price {
  color: hsla(160, 100%, 37%, 1);
  font-weight: 700;
  font-size: 20px;
}

.remove-item-btn {
  height: 50px;
  width: 50px;
  padding: 8px 12px;
  background: none;
  border: none;
  border-radius: 50%;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.2s;
}

.remove-item-btn > img {
  height: 70%;
  width: auto;
}

.cart-footer {
  margin-top: 18px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.checkout-btn {
  padding: 8px;
  font-size: 18px;
  font-size: 18px;
  color: hsla(160, 100%, 98%, 1);
  background-color: hsla(160, 100%, 37%, 1);
  box-shadow: 0px 2px 4px hsla(160, 100%, 37%, 0.2);
  border-radius: 15px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.checkout-btn:hover {
  background-color: white;
  color: hsla(160, 100%, 37%, 1);
  border: 1px solid hsla(160, 100%, 37%, 1);
  box-shadow: 0px 4px 12px hsla(160, 100%, 37%, 0.2);
  transform: translateY(-3px) scale(1.05);
}
</style>
