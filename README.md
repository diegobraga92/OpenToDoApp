# Checklist App (Android + Web)  
### Using Rust (core), Go (backend), and JavaScript (web)

README Draft created with AI: Will create a proper README later:

Simples ToDo List app for Android and Web, allowing sync and offline usage.

- Supports Daily tasks, single-event tasks, future tasks, and simple lists
- Allows Subitems under items  
- Offline usage and delayed sync  
- Cloud syncing between Android and Web  
- Stack: Shared Rust logic between platforms, A Go backend for synchronization, A JavaScript (React) frontend
- Maybe add Pomodoro
- Maybe include white-noises to Pomodoro

---

# 1. High-Level Architecture

```
Android (Kotlin UI)
           │
           ▼
     Rust core (CRDT + local DB)
           │
  Sync client (Rust HTTP/WebSocket)
           │
           ▼
       Go Sync Server
           ▲
           │
 Web (React + JS/WASM CRDT)
```

**Rust core**  
- Maintains local data, local persistence (SQLite), and sync logic.  
- Exposed to Android via JNI or uniFFI.  
- Compiled to WASM if shared with the web.  

**Go server**  
- Stores changes.  
- Broadcasts updates via WebSocket.  
- Handles authentication and user management.

**Web app**  
- React UI.  
- Uses Automerge JS or Rust core compiled to WASM.  
- Stores data in IndexedDB for offline usage.

---

# 2. Why Use CRDTs

CRDTs enable:

- Automatic conflict resolution  
- Offline editing on multiple devices  
- Concurrent reordering and nested items  
- Stable merges without a manual conflict UI  

Recommended libraries:

- `automerge-rs` (Rust)
- `automerge` (JavaScript)
- Alternatives: Yjs, yrs, diamond-types

---

# 3. Suggested Data Model

Use UUIDs for each item and for operations.

```json
{
  "item_id": "uuid-1",
  "parent_id": null,
  "title": "Buy milk",
  "notes": "2% if available",
  "completed": false,
  "due_date": "2025-11-20T09:00:00Z",
  "order_key": "rk:0001",
  "subitems": ["uuid-2", "uuid-3"],
  "meta": {
    "created_at": "2025-11-17T10:00:00Z",
    "last_modified_at": "2025-11-17T11:05:00Z",
    "actor_id": "device-123"
  },
  "deleted": false
}
```

If using list-type CRDTs, `order_key` and explicit `subitems:` may not be needed.

---

# 4. Offline-First Sync Model

1. User edits document → CRDT creates a *change patch*.  
2. Patch is stored locally.  
3. When online, client pushes queued patches to the Go server.  
4. Server merges patches into its canonical document.  
5. Server sends back any patches the client hasn’t seen.

This enables **offline usage**, **delayed sync**, and **conflict-free merging**.

---

# 5. Technology Choices

### Rust (client core)
- `automerge-rs`  
- `rusqlite`  
- `reqwest` + `tokio`  
- Android bindings: `uniFFI` / JNI  

### Android
- Jetpack Compose  
- Rust core for logic  
- WorkManager for sync  

### Web (React)
- React + Vite  
- Automerge JS or WASM bindings  
- IndexedDB for offline storage  
- Service Worker for offline shell  

### Go (backend)
- `gin` or `fiber`  
- `gorilla/websocket`  
- Postgres  
- JWT authentication  
- Optional FCM push for Android

---

# 6. REST API Example

```http
POST /sync/changes
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "doc_id": "user-123",
  "actor_id": "device-foo",
  "changes": ["base64-change1", "base64-change2"],
  "last_seq": 42
}
```

**Response:**

```json
{
  "applied": true,
  "server_changes": ["base64-changeA"],
  "new_seq": 50
}
```

---

# 7. Sync Pseudocode

```
onLocalEdit(op):
    change = crdt.apply_local(op)
    localdb.save(change)
    queue.push(change)
    updateUI()

attemptSync():
    if online:
        sendQueued()
        applyServerChanges()
        clearAcked()
```

---

# 8. Subitems & Ordering

Use one of:

### A) Nested CRDT lists  
Each item contains a CRDT list of subitems.

### B) Flat list with `parent_id`  
UI groups items into hierarchy.

---

# 9. Offline Mode

- Queue changes locally  
- Retry sync with backoff  
- Background sync  
- CRDT merges changes automatically  

---

# 10. Android Integration (Rust ↔ Kotlin)

Options:

- `uniFFI` (recommended)
- Plain JNI + C headers via `cbindgen`

Rust handles:

- CRUD operations  
- CRDT merges  
- Local storage  
- Sync logic  

Kotlin UI just calls Rust exposed functions.

---

# 11. Web Implementation

- Use React  
- Automerge JS or WASM CRDT  
- Persist in IndexedDB  
- Use service worker for offline app shell  

---

# 12. Go Server Details

- Store changes in Postgres  
- Store snapshots to speed up load  
- Expose REST + WebSocket  
- Authenticate with JWT  
- Push updates via WebSocket  
- Optional FCM notifications for Android  

---

# 13. Deployment

- Build Android ABI libs (arm64, x86_64)  
- Build Rust core for WASM (if used on web)  
- Go server in Docker  
- Web frontend on CDN  
- DB: managed Postgres  

---

# 14. Development Roadmap (Example)

Week | Work
-----|-----
1–2 | CRDT prototype in Rust
3–4 | Implement Go sync server
5–6 | Web UI + local CRDT sync
7–9 | Android UI + Rust integration
10 | WebSocket push + FCM
11–12 | Testing, security, release

---

# 15. Summary

This stack provides:

- True offline-first architecture  
- Automatic conflict resolution  
- Shared Rust logic between Android and Web  
- Reliable sync via Go backend  
- CRDT-based nested checklists with subitems  

--- 
