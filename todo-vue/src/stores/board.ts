import { defineStore } from 'pinia'
import type { Board, Task, List } from '@/models/todo'

function task(title: string): Task {
  return {
    id: crypto.randomUUID(),
    title,
    done: false,
  }
}

export const useBoardStore = defineStore('board', {
  state: (): Board => ({
    daily: [],
    todos: [],
    lists: [],
  }),

  actions: {
    addDaily(title: string) {
      this.daily.push(task(title))
    },

    addTodo(title: string) {
      this.todos.push(task(title))
    },

    toggleTask(task: Task) {
      task.done = !task.done
    },

    removeTask(list: Task[], id: string) {
      const idx = list.findIndex(t => t.id === id)
      if (idx !== -1) list.splice(idx, 1)
    },

    addList(title: string) {
      this.lists.push({
        id: crypto.randomUUID(),
        title,
        items: [],
      })
    },

    addListItem(list: List, title: string) {
      list.items.push(task(title))
    },
  },
})
