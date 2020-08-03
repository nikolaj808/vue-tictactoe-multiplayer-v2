<template>
  <div class="board">
      <div class="flex-row">
          <Square :spot="1" />
          <Square :spot="2" />
          <Square :spot="3" />
      </div>
      <div class="flex-row">
          <Square :spot="4" />
          <Square :spot="5" />
          <Square :spot="6" />
      </div>
      <div class="flex-row">
          <Square :spot="7" />
          <Square :spot="8" />
          <Square :spot="9" />
      </div>
  </div>
</template>

<script>
import Square from './Square.vue'

export default {
    name: 'Board',
    components: {
        Square
    }
}
</script>

<style scoped>
    .board {
        padding: 10px;
    }

    .flex-row {
        display: flex;
    }
</style>