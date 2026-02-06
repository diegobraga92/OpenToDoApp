import { useEffect, useState } from "react";
import { Task } from "../../types/task";
import {
  fetchTodos,
  createTodo,
  toggleTodo,
  deleteTodo,
} from "../../services/api";

export function useTodos() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTodos().then(setTasks);
  }, []);

  return {
    tasks,

    addTask: async (text: string) => {
      const task = await createTodo(text);
      setTasks((t) => [...t, task]);
    },

    toggleTask: async (id: string) => {
      const updated = await toggleTodo(id);
      setTasks((t) =>
        t.map((task) => (task.id === id ? updated : task))
      );
    },

    deleteTask: async (id: string) => {
      await deleteTodo(id);
      setTasks((t) => t.filter((task) => task.id !== id));
    },
  };
}
