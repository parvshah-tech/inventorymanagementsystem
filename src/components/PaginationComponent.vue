<script>
export default {
  props: {
    totalProducts: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      default: 5,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
  },
  emits: ['fetchData'],
  computed: {
    totalPage() {
      return Math.ceil(this.totalProducts / this.limit)
    },
  },
  methods: {
    async changePage(page) {
      const q = {
        page: page,
      }

      await this.$router.push({
        query: q,
      })
      this.$emit('fetchData', true)
    },
  },
}
</script>

<template>
  <div class="pagination-container">
    <a
      v-for="value in totalPage"
      :key="value"
      @click="currentPage === value ? '' : changePage(value)"
      :class="currentPage === value ? 'active' : ''"
    >
      {{ value }}
    </a>
  </div>
</template>

<style scoped>
.pagination-container {
  max-width: 1000px;
  margin: 0 auto;
  margin-top: 32px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 18px;
}

.pagination-container > a {
  padding: 12px 24px;
  cursor: pointer;
}

.active {
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  cursor: not-allowed !important;
}
</style>
