import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory store (temporary)
let todos = [];

// GET all todos
app.get("/todos", (req, res) => {
  res.json(todos);
});

// CREATE todo
app.post("/todos", (req, res) => {
  const todo = {
    id: crypto.randomUUID(),
    text: req.body.text,
    done: false,
  };

  todos.push(todo);
  res.status(201).json(todo);
});

// TOGGLE todo
app.patch("/todos/:id", (req, res) => {
  const todo = todos.find(t => t.id === req.params.id);
  if (!todo) return res.sendStatus(404);

  todo.done = !todo.done;
  res.json(todo);
});

// DELETE todo
app.delete("/todos/:id", (req, res) => {
  todos = todos.filter(t => t.id !== req.params.id);
  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
