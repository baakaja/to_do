const mysql = require("mysql2");

// Create connection pool
const db = mysql.createPool({
  host: "localhost",      // usually localhost
  user: "root",           // your MySQL username
  password: "sindhu@12027sql", // your MySQL password
  database: "smart_todo", // your database name
});

// Test connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to MySQL database!");
    connection.release(); // release connection back to pool
  }
});

module.exports = db;
