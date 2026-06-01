const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 🛡️ URL SHIELD MIDDLEWARE (Prevents %c0 crashing loop)
app.use((req, res, next) => {
  try {
    decodeURIComponent(req.path);
    next();
  } catch (err) {
    if (err instanceof URIError) {
      return res.status(400).send("Bad Request: Invalid URL Format");
    }
    next(err);
  }
});

// Database connection
// Database connection
const db = mysql.createPool({
  host: "mariadb", 
  user: "root",
  password: process.env.DB_PASSWORD,
  port: 3306,
  database: "ETodo",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// DATABASE CONNECTION CHECK
(async () => {
  try {
    // A simple query to test the connection
    await db.query('SELECT 1');
    console.log("Successfully connected to MariaDB!");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    // You can choose to process.exit(1) here if you want the app to stop 
    // when the DB is down.
  }
})();

const path = require("path");

// 1. Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, "build")));

// 2. Put your API Endpoints FIRST so Express can intercept them before the wildcard!

// Fallback route if frontend fetches "/tasks" without an ID
app.get("/tasks", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tasks WHERE user_id = 1");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Get tasks for a specific user
app.get("/tasks/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await db.query("SELECT * FROM tasks WHERE user_id = ?", [userId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Add a new task (Injects default userId 1 if none provided by the frontend)
app.post("/tasks", async (req, res) => {
  try {
    const { userId, title, description, priority, assignee, status } = req.body;
    const finalUserId = userId || 1; 
    const [result] = await db.query(
      "INSERT INTO tasks (user_id, title, description, priority, assignee, status) VALUES (?, ?, ?, ?, ?, ?)",
      [finalUserId, title, description, priority, assignee, status]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Update a task (Handles full updates AND partial status updates)
app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, assignee, status } = req.body;
    
    // COALESCE checks if the incoming value is NULL; if so, it keeps the old value
    await db.query(
      `UPDATE tasks 
       SET title = COALESCE(?, title), 
           description = COALESCE(?, description), 
           priority = COALESCE(?, priority), 
           assignee = COALESCE(?, assignee), 
           status = COALESCE(?, status) 
       WHERE id = ?`,
      [title, description, priority, assignee, status, id]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM tasks WHERE id = ?", [id]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// 3. Put your Wildcard catch-all at the VERY BOTTOM so it handles front-end routing page refreshes last
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(5000, "0.0.0.0", () => console.log("Backend server running on port 5000"));