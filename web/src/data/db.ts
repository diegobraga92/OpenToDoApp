import { openDB } from "idb"

export const dbPromise = openDB("todo-db", 1, {
  upgrade(db) {
    db.createObjectStore("events", { keyPath: "id" })
    db.createObjectStore("meta", { keyPath: "key" })
  },
})
