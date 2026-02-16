import { dbPromise } from "./db"
import type { Event } from "../domain/event"

type NewEvent = Omit<Event, "timestamp">

export async function addEvent(event: NewEvent): Promise<void> {
  const db = await dbPromise

  const fullEvent: Event = {
    ...event,
    timestamp: Date.now(), // timestamp created outside React
  }

  await db.put("events", fullEvent)
}

export async function getAllEvents(): Promise<Event[]> {
  const db = await dbPromise
  return await db.getAll("events")
}

export async function getEventsSince(timestamp: number): Promise<Event[]> {
  const events = await getAllEvents()
  return events.filter((e) => e.timestamp > timestamp)
}

export async function saveLastSync(timestamp: number): Promise<void> {
  const db = await dbPromise
  await db.put("meta", { key: "lastSync", value: timestamp })
}

export async function getLastSync(): Promise<number> {
  const db = await dbPromise
  const result = await db.get("meta", "lastSync")
  return result?.value ?? 0
}
