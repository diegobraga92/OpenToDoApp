import { Task } from "../types/task";

const BASE_URL = "http://localhost:3000";

export async function fetchTodos(): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/todos`);
  return res.json();
}

export async function createTodo(text: string): Promise<Task> {
  const res = await fetch(`${BASE_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res.json();
}

export async function toggleTodo(id: string): Promise<Task> {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: "PUT",
  });
  return res.json();
}

export async function deleteTodo(id: string): Promise<void> {
  await fetch(`${BASE_URL}/todos/${id}`, {
    method: "DELETE",
  });
}
