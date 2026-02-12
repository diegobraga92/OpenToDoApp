# Domain Model

## User
Represents a person using the system.

Responsibilities:
- Owns lists
- Owns tasks indirectly

Attributes:
- id
- email

---

## List
A logical container owned by a user.

Depending on its type, a list may contain tasks or other lists.

Types:
- todo: contains tasks
- daily: derives tasks for the current day
- collection: groups other lists

Rules:
- A list belongs to one user
- A todo or daily list contains tasks
- A collection list contains other lists
- A list may belong to at most one collection

Attributes:
- id
- userId
- name
- type

---

## Task
A unit of work.

Rules:
- A task belongs to exactly one list
- A task can be completed or pending
- A task may have a due date
- A task may recur

Attributes:
- id
- listId
- title
- completed
- order
- dueDate?
- recurrence?

Behavior:
- complete()
- reopen()
- reschedule()

---

## Future Concepts

### FocusSession
Represents a period of focused work.

Notes:
- May be linked to a task
- Used for Pomodoro and analytics

### PomodoroCycle
A structured set of focus sessions and breaks.

Notes:
- Built on top of FocusSession
- Not required for basic task usage

# Diagrams

## Core Domain Relationships

```mermaid
classDiagram
  User "1" --> "many" List : owns
  List "1" --> "many" Task : contains

  class User {
    id
    email
  }

  class List {
    id
    userId
    name
    type
  }

  class Task {
    id
    listId
    title
    completed
    dueDate?
    recurrence?
  }
```

## List Types

```mermaid
classDiagram
  class List {
    type
  }

  class TodoList
  class DailyList
  class CollectionList

  List <|-- TodoList
  List <|-- DailyList
  List <|-- CollectionList
```

## Task Lifecycle

```mermaid
stateDiagram-v2
  [*] --> Pending
  Pending --> Completed : complete()
  Completed --> Pending : reopen()
  Pending --> Pending : reschedule()
```

## Future Domain Extensions

```mermaid
classDiagram
  Task "0..1" --> "many" FocusSession : may relate to
  FocusSession "many" --> "1" PomodoroCycle : part of

  class FocusSession {
    duration
    startedAt
  }

  class PomodoroCycle {
    type
  }
```

### List Diagram

```mermaid
classDiagram
  User "1" --> "many" List : owns

  List <|-- TodoList
  List <|-- DailyList
  List <|-- CollectionList

  CollectionList "1" --> "many" List : groups
  TodoList "1" --> "many" Task : contains
  DailyList "1" --> "many" Task : derives

  class List {
    id
    name
    type
  }
```