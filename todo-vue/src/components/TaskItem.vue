<script setup lang="ts">
import type { Task } from '@/models/todo'

defineProps<{
  task: Task
}>()

defineEmits<{
  (e: 'toggle', task: Task): void
  (e: 'remove'): void
}>()
</script>

<template>
  <div class="task">
    <label class="content">
      <input
        type="checkbox"
        :checked="task.done"
        @change="$emit('toggle', task)"
      />
      <span :class="{ done: task.done }">
        {{ task.title }}
      </span>
    </label>

    <button class="remove" @click="$emit('remove')">×</button>
  </div>
</template>

<style scoped>
.task {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.35rem 0.25rem;
  border-radius: 6px;
}

.task:hover {
  background: #f3f4f6;
}

.content {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.done {
  text-decoration: line-through;
  color: var(--muted);
}

.remove {
  background: transparent;
  color: var(--muted);
  font-size: 1.1rem;
  padding: 0 0.3rem;
}

.remove:hover {
  color: var(--danger);
}
</style>
