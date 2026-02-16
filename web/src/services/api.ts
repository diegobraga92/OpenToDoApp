import type { Event } from "../domain/event"

const BASE_URL = "http://localhost:3000"

export async function pushEvent(event: Event) {
  await fetch(`${BASE_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  })
}

export async function fetchEventsSince(since: number): Promise<Event[]> {
  const res = await fetch(`${BASE_URL}/events?since=${since}`)
  return await res.json()
}
