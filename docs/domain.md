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
A logical container for tasks.

Types:
- todo: regular task list
- daily: tasks meant to be done today
- collection: groups multiple lists

Rules:
- A list belongs to one user
- A list can contain many tasks
- Task ordering is list-specific

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
