import { useState } from "react"
import { addEvent } from "../../data/eventStore"

type AddTaskProps = {
  onAdd: () => void
}

function uuidv4() {
  return crypto.randomUUID()
}

export default function AddTask({ onAdd }: AddTaskProps) {
  const [title, setTitle] = useState("")

  async function createTask() {
    if (!title.trim()) return

    await addEvent({
      id: uuidv4(),
      entity_id: uuidv4(),
      entity_type: "task",
      event_type: "created",
      payload: { title },
      timestamp: Date.now(),
      device_id: "web-device",
    })

    setTitle("")
    onAdd()
  }

  return (
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={createTask}>Add</button>
    </div>
  )
}
