const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Database connection
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  port: 32768,
  database: "ETodo",
});

// Get tasks for a user
app.get("/tasks/:userId", async (req, res) => {
  const { userId } = req.params;
  const [rows] = await db.query("SELECT * FROM tasks WHERE user_id = ?", [userId]);
  res.json(rows);
});

// Add a new task
app.post("/tasks", async (req, res) => {
  const { userId, title, description, priority, assignee, status } = req.body;
  const [result] = await db.query(
    "INSERT INTO tasks (user_id, title, description, priority, assignee, status) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, title, description, priority, assignee, status]
  );
  res.json({ id: result.insertId });
});

// Update a task
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, assignee, status } = req.body;
  await db.query(
    "UPDATE tasks SET title = ?, description = ?, priority = ?, assignee = ?, status = ? WHERE id = ?",
    [title, description, priority, assignee, status, id]
  );
  res.sendStatus(200);
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM tasks WHERE id = ?", [id]);
  res.sendStatus(200);
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));