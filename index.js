const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());

// In-memory data storage
const todos = [];

// Create a new todo.
app.post("/todos", (req, res) => {
  const { title, description } = req.body;
  const id = uuidv4(); // Use uuidv4() to generate a unique ID
  const todo = { id, title, description };
  todos.push(todo);
  res.status(201).json(todo);
});

// Get a todo by ID
app.get("/todos/:id", (req, res) => {
  const id = req.params.id;
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }
  res.json(todo);
});

// Get all todos
app.get("/todos", (req, res) => {
  if (todos.length === 0) {
    res.status(404).json({ error: "No todos available" });
    return;
  }
  res.json(todos);
});

// Delete a todo by ID
app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }
  const deletedTodo = todos.splice(index, 1)[0];
  res.json(deletedTodo);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
