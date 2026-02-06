<script setup lang="ts">
import { ref } from 'vue'
import { useBoardStore } from '@/stores/board'

const store = useBoardStore()
const listTitle = ref('')
</script>

<template>
  <section class="column">
    <h2>Lists</h2>

    <div class="add">
      <input
        v-model="listTitle"
        placeholder="New list"
        @keydown.enter="store.addList(listTitle); listTitle = ''"
      />
      <button @click="store.addList(listTitle); listTitle = ''">+</button>
    </div>

    <div v-for="list in store.lists" :key="list.id" class="list">
      <strong>{{ list.title }}</strong>

      <ul>
        <li v-for="item in list.items" :key="item.id">
          {{ item.title }}
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.column {
  background: var(--panel);
  border-radius: var(--radius);
  padding: 1rem;
  border: 1px solid var(--border);
}

.add {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}

.list {
  margin-top: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  background: #f9fafb;
}

.list strong {
  font-size: 0.9rem;
}

.list ul {
  margin: 0.4rem 0 0 0;
  padding-left: 1rem;
}

.list li {
  font-size: 0.85rem;
  color: var(--muted);
}
</style>
