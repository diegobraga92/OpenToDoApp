export type Event = {
  id: string
  entity_id: string
  entity_type: string
  event_type: string
  payload: unknown
  timestamp: number
  device_id: string
}
