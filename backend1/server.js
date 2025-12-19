import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sindhu@12027sql", // change this
  database: "smart_todo"
});

db.connect(err => {
  if (err) {
    console.log("DB error:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

// get all tasks
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks ORDER BY id DESC", (err, result) => {
    if (err) res.status(500).json(err);
    else res.json(result);
  });
});

// add task (with today's date)
app.post("/tasks", (req, res) => {
  const { title } = req.body;
  db.query(
    "INSERT INTO tasks (title, created_at) VALUES (?, CURDATE())",
    [title],
    err => {
      if (err) res.status(500).json(err);
      else res.json({ message: "Task added" });
    }
  );
});

// update task
app.put("/tasks/:id", (req, res) => {
  const { title, status } = req.body;
  const id = req.params.id;

  db.query(
    "UPDATE tasks SET title=?, status=? WHERE id=?",
    [title, status, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Task updated" });
    }
  );
});


// delete task
app.delete("/tasks/:id", (req, res) => {
  db.query(
    "DELETE FROM tasks WHERE id=?",
    [req.params.id],
    err => {
      if (err) res.status(500).json(err);
      else res.json({ message: "Task deleted" });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
