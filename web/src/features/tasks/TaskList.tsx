import { useEffect, useState } from "react"
import type { Event } from "../../domain/event"
import { getAllEvents, addEvent } from "../../data/eventStore"

type Task = {
  id: string
  title: string
  completed: boolean
}

function uuidv4(): string {
  return crypto.randomUUID()
}

function projectTasks(events: Event[]): Task[] {
  const taskMap: Record<string, Task> = {}

  for (const e of events) {
    if (e.entity_type !== "task") continue

    if (e.event_type === "created") {
      const payload = e.payload as { title: string }

      taskMap[e.entity_id] = {
        id: e.entity_id,
        title: payload.title,
        completed: false,
      }
    }

    if (e.event_type === "checked") {
      if (taskMap[e.entity_id]) {
        taskMap[e.entity_id].completed = true
      }
    }
  }

  return Object.values(taskMap)
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    let mounted = true

    async function load() {
      const events = await getAllEvents()
      const projected = projectTasks(events)

      if (mounted) {
        setTasks(projected)
      }
    }

    void load()

    return () => {
      mounted = false
    }
  }, [])

  async function toggleTask(id: string): Promise<void> {
    await addEvent({
      id: uuidv4(),
      entity_id: id,
      entity_type: "task",
      event_type: "checked",
      payload: {},
      device_id: "web-device",
    })

    const events = await getAllEvents()
    setTasks(projectTasks(events))
  }

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => {
              void toggleTask(task.id)
            }}
          />
          {task.title}
        </div>
      ))}
    </div>
  )
}
