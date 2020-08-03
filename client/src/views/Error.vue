<template>
  <div class="error">
    <h1>This is an error page</h1>
    <h6>You did something you were not supposed to do</h6>
    <button @click.prevent="back" class="button-secondary">Return to homepage</button>
  </div>
</template>

<script>
import store from '@/store'

export default {
  store,
  methods: {
    back() {
      this.$router.push({ path: '/' });
    }
  }
}
</script>

<style scoped>
.error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>