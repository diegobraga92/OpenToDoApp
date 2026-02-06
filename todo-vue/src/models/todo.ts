export type Task = {
  id: string
  title: string
  done: boolean
}

export type List = {
  id: string
  title: string
  items: Task[]
}

export type Board = {
  daily: Task[]
  todos: Task[]
  lists: List[]
}
