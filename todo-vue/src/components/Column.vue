<script setup lang="ts">
import { ref } from 'vue'
import { useBoardStore } from '@/stores/board'
import TaskItem from './TaskItem.vue'

const props = defineProps<{
  title: string
  kind: 'daily' | 'todos'
}>()

const store = useBoardStore()
const input = ref('')

const list = props.kind === 'daily'
  ? store.daily
  : store.todos

function add() {
  if (!input.value.trim()) return
  props.kind === 'daily'
    ? store.addDaily(input.value)
    : store.addTodo(input.value)
  input.value = ''
}
</script>

<template>
  <section class="column">
    <h2>{{ title }}</h2>

    <div class="add">
      <input
        v-model="input"
        placeholder="Add task"
        @keydown.enter="add"
      />
      <button @click="add">+</button>
    </div>

    <TaskItem
      v-for="task in list"
      :key="task.id"
      :task="task"
      @toggle="store.toggleTask"
      @remove="store.removeTask(list, task.id)"
    />
  </section>
</template>

<style scoped>
.column {
  background: var(--panel);
  border-radius: var(--radius);
  padding: 1rem;
  border: 1px solid var(--border);
}

h2 {
  font-size: 1rem;
  color: var(--muted);
}

.add {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}
</style>
