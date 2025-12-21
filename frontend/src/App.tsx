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

interface Task {
  id: string;
  title: string;
  done: boolean;
}

interface Payload {
  tasks: Task[];
}

export default function App() {
  const [apiUrl, setApiUrl] = useState("http://localhost:8080/process");

  const reqPayload: Payload = {
    tasks: [
      { id: "1", title: "Buy milk", done: true },
      { id: "2", title: "Walk dog", done: false },
      { id: "3", title: "Wash car", done: true },
    ],
  };

  const [response, setResponse] = useState("Waiting...");

  const sendRequest = async () => {
    setResponse("Sending...");

    try {
      const r = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqPayload),
      });

      if (!r.ok) {
        const text = await r.text();
        setResponse(`HTTP ${r.status}\n\n${text}`);
        return;
      }

      const json = await r.json();
      setResponse(JSON.stringify(json, null, 2));
    } catch (err: unknown) {
      setResponse("Request failed:\n" + (err instanceof Error ? err.message : String(err)));
    }
  };

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
    <div style={{ fontFamily: "system-ui", padding: 20 }}>
      <h1>OpenToDoApp – Backend/Rust Integration Test</h1>

      <div style={{ marginBottom: 20 }}>
        <p>Backend URL:</p>
        <input
          style={{ width: 300 }}
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
        />
        <br /><br />
        <button onClick={sendRequest}>Send test request</button>
      </div>

      <h3>Request Payload</h3>
      <pre>{JSON.stringify(reqPayload, null, 2)}</pre>

      <h3>Response</h3>
      <pre>{response}</pre>
      
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

    </div>

    
  );
}
