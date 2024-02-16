const fastify = require("fastify")({ logger: true });
const { v4: uuidv4 } = require("uuid");
const fastifyCors = require("@fastify/cors");

fastify.register(fastifyCors, {
  origin: true, // Change this according to your security requirements
});

// In-memory data storage
const todos = [];

// Create a new todo.
fastify.post("/todos", async (request, reply) => {
  const { title, description } = request.body;
  const id = uuidv4(); // Use uuidv4() to generate a unique ID
  const todo = { id, title, description };
  todos.push(todo);
  reply.send(todo);
});

// Get a todo by ID
fastify.get("/todos/:id", async (request, reply) => {
  const id = request.params.id;
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    reply.code(404).send({ error: "Todo not found" });
    return;
  }
  reply.send(todo);
});

// Get all todos
fastify.get("/todos", async (request, reply) => {
  console.log("Todos: ", todos);
  if (todos.length === 0) {
    reply.code(404).send({ error: "No todo's availble" });
    return;
  }
  reply.send(todos);
});

// Delete a todo by ID
fastify.delete("/todos/:id", async (request, reply) => {
  const id = request.params.id;
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    reply.code(404).send({ error: "Todo not found" });
    return;
  }
  const deletedTodo = todos.splice(index, 1)[0];
  reply.send(deletedTodo);
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({
      port: 4000,
      // You can add other options here if needed
    });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
