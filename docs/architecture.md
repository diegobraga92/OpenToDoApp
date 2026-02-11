# System Architecture

## Goals
- Support Web and Mobile clients
- Allow future productivity features
- Avoid early over-engineering

## High-Level Architecture
[diagram here]

## Backend Architecture
- Modular monolith
- Domain-driven structure

## Frontend Architecture
- Shared core logic
- Separate UI layers

## Data Model (Initial)
- User
- List
- Task

## Extension Strategy
How new features (Pomodoro, Focus) are added

```mermaid
graph TD
  Web[Web App] --> API[Backend API]
  Mobile[Mobile App] --> API
  API --> DB[(Database)]
```
## Flowchart
```mermaid
flowchart LR
  Controller --> UseCase
  UseCase --> Domain
  UseCase --> Repository
  Repository --> DB
```
## SEQUENCE
```mermaid
sequenceDiagram
  User->>Web: Click "Complete"
  Web->>API: PATCH /tasks/{id}
  API->>UseCase: CompleteTask
  UseCase->>Task: markCompleted()
  UseCase->>Repository: save(task)
  API->>Web: 200 OK
```