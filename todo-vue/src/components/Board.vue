<script setup lang="ts">
import Column from './Column.vue'
import ListColumn from './ListColumn.vue'
</script>

<template>
  <main class="board">
    <Column title="Daily Tasks" kind="daily" />
    <Column title="To Dos" kind="todos" />
    <ListColumn />
  </main>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
  padding: 1.25rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
