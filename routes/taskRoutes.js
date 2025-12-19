const express = require("express");
const router = express.Router();
const db = require("../db"); // your MySQL connection
const jwt = require("jsonwebtoken");

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ msg: "No token provided" });

  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err) return res.status(401).json({ msg: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
};

// Create a new task
router.post("/add", authMiddleware, (req, res) => {
  const { title, description, priority } = req.body;
  db.query(
    "INSERT INTO tasks (user_id, title, description, priority) VALUES (?, ?, ?, ?)",
    [req.userId, title, description, priority],
    (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      res.status(201).json({ msg: "Task added successfully" });
    }
  );
});

// Get all tasks for a user
router.get("/", authMiddleware, (req, res) => {
  db.query(
    "SELECT * FROM tasks WHERE user_id = ?",
    [req.userId],
    (err, results) => {
      if (err) return res.status(500).json({ msg: err });
      res.json(results);
    }
  );
});

// Delete a task
router.delete("/:id", authMiddleware, (req, res) => {
  const taskId = req.params.id;
  db.query(
    "DELETE FROM tasks WHERE id = ? AND user_id = ?",
    [taskId, req.userId],
    (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      res.json({ msg: "Task deleted successfully" });
    }
  );
});

module.exports = router;
