<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('cart', ['cartProducts', 'totalProducts', 'totalBill']),
  },
}
</script>

<template>
  <div class="checkout-wrap">
    <div v-if="cartProducts && cartProducts?.length > 0" class="order-summary-section">
      <div class="header-flex">
        <h2 class="section-title">Order Summary</h2>
        <span class="item-count">{{ totalProducts }} Items</span>
      </div>

      <div class="scroll-area">
        <div v-for="product in cartProducts" :key="product.pid" class="order-item-card">
          <div class="item-details">
            <h4 class="item-name">{{ product.pname }}</h4>
            <div class="price-breakdown">
              <span class="unit-price">₹{{ product.price }}</span>
              <span class="qty-multiplier">× {{ product.quantity }}</span>
            </div>
          </div>
          <div class="price-wrapper">
            <p class="total-price">₹{{ product.total_price }}</p>
          </div>
        </div>
      </div>

      <div class="grand-total-card">
        <div class="total-label">
          <p>Grand Total</p>
          <span>(Inclusive of all taxes)</span>
        </div>
        <div class="total-amount">₹{{ totalBill }}</div>
      </div>
    </div>

    <div v-else class="status-container">
      <h1 class="message">Your cart is empty</h1>
    </div>
  </div>
</template>

<style scoped>
.checkout-wrap {
  flex: 1;
  padding: 10px;
}

.header-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 15px;
  border-bottom: 2px solid hsla(160, 100%, 37%, 0.1);
  padding-bottom: 10px;
}

.section-title {
  font-size: 22px;
  font-weight: 800;
  color: hsla(160, 40%, 15%, 1);
  margin: 0;
}

.item-count {
  background: hsla(160, 100%, 37%, 0.1);
  color: hsla(160, 100%, 37%, 1);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.scroll-area {
  max-height: 55vh;
  overflow-y: auto;
  padding-right: 8px;
}

.scroll-area::-webkit-scrollbar {
  width: 6px;
}
.scroll-area::-webkit-scrollbar-thumb {
  background: hsla(160, 100%, 37%, 0.2);
  border-radius: 10px;
}
.scroll-area::-webkit-scrollbar-thumb:hover {
  background: hsla(160, 100%, 37%, 0.5);
}

.order-item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border: 1px solid hsla(160, 30%, 92%, 1);
  border-radius: 16px;
  margin-bottom: 10px;
  transition: transform 0.2s ease;
}

.order-item-card:hover {
  transform: translateX(5px);
  border-color: hsla(160, 100%, 37%, 0.3);
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: hsla(160, 40%, 15%, 1);
  margin: 0 0 4px 0;
}

.price-breakdown {
  display: flex;
  gap: 8px;
  font-size: 14px;
}

.unit-price {
  color: #666;
}
.qty-multiplier {
  color: hsla(160, 100%, 37%, 1);
  font-weight: 700;
}

.total-price {
  color: hsla(160, 40%, 15%, 1);
  font-weight: 700;
  font-size: 18px;
  margin: 0;
}

.grand-total-card {
  margin-top: 25px;
  padding: 24px;
  background: linear-gradient(135deg, hsla(160, 100%, 37%, 1), hsla(160, 100%, 25%, 1));
  color: white;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 20px hsla(160, 100%, 37%, 0.2);
}

.total-label p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.total-label span {
  font-size: 13px;
  opacity: 0.7;
}

.total-amount {
  font-size: 28px;
  font-weight: 800;
}
</style>
