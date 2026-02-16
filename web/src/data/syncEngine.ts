import { getAllEvents, saveLastSync, getLastSync, addEvent } from "./eventStore"
import { pushEvent, fetchEventsSince } from "../services/api"

export async function sync() {
  const lastSync = await getLastSync()

  // Push local events
  const localEvents = await getAllEvents()
  for (const event of localEvents) {
    await pushEvent(event)
  }

  // Pull remote events
  const remoteEvents = await fetchEventsSince(lastSync)

  for (const event of remoteEvents) {
    await addEvent(event)
  }

  if (remoteEvents.length > 0) {
    const latest = Math.max(...remoteEvents.map(e => e.timestamp))
    await saveLastSync(latest)
  }
}
