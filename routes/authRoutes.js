const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db"); // your MySQL connection

// Register a new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: "Please provide username and password" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json({ msg: err });
        res.status(201).json({ msg: "User registered successfully" });
      }
    );
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Login user
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: "Please provide username and password" });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) return res.status(500).json({ msg: err });
      if (results.length === 0) return res.status(400).json({ msg: "User not found" });

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      const token = jwt.sign({ id: user.id }, "your_jwt_secret", { expiresIn: "1h" });
      res.json({ token, user: { id: user.id, username: user.username } });
    }
  );
});

module.exports = router;
