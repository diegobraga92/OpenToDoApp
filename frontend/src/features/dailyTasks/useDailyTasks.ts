import { useEffect, useState } from "react";
import { Task } from "../../types/task";
import { uuid } from "../../utils/uuid";

export function useDailyTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // resets on mount; persistence can later check date
    setTasks([]);
  }, []);

  return {
    tasks,
    addTask: (text: string) =>
      setTasks((t) => [...t, { id: uuid(), text, done: false }]),
    toggleTask: (id: string) =>
      setTasks((t) =>
        t.map((task) =>
          task.id === id ? { ...task, done: !task.done } : task
        )
      ),
  };
}
