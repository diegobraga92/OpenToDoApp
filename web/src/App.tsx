import TaskList from "./features/tasks/TaskList"
import AddTask from "./features/tasks/AddTask"
import { sync } from "./data/syncEngine"

export default function App() {
  async function handleSync() {
    await sync()
    alert("Synced!")
  }

  return (
    <div>
      <h1>ToDo POC</h1>
      <button onClick={handleSync}>Sync</button>
      <AddTask onAdd={() => window.location.reload()} />
      <TaskList />
    </div>
  )
}
