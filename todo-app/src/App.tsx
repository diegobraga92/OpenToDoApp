import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Todo } from "./types";

const STORAGE_KEY = "todo-app-items";

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Todo[];
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    const text = newTodo.trim();
    if (!text) return;

    const todo: Todo = {
      id: Date.now(),
      text,
      done: false,
    };
    setTodos((prev) => [todo, ...prev]);
    setNewTodo("");
  }

  function toggleTodo(id: number) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function deleteTodo(id: number) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.done));
  }

  const remainingCount = todos.filter((t) => !t.done).length;

  return (
    <div className="app">
      <header className="app-header">
        <h1>My To-Do List</h1>
        <p>{remainingCount} task(s) left</p>
      </header>

      <form className="todo-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          aria-label="New task"
        />
        <button type="submit">Add</button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.done ? "done" : ""}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
            </label>
            <button
              className="delete-btn"
              type="button"
              onClick={() => deleteTodo(todo.id)}
              aria-label={`Delete ${todo.text}`}
            >
              ✕
            </button>
          </li>
        ))}
        {todos.length === 0 && (
          <li className="empty-state">You have no tasks 😊</li>
        )}
      </ul>

      {todos.some((t) => t.done) && (
        <button className="clear-btn" type="button" onClick={clearCompleted}>
          Clear completed
        </button>
      )}
    </div>
  );
}

export default App;
