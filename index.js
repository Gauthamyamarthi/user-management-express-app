// index.js
const express = require("express");
const mysql = require("mysql2");
const methodOverride = require("method-override");
const path = require("path");

const app = express();
const port = 8080;

// MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gautham@09",
  database: "delta_app",
});

connection.connect((err) => {
  if (err) return console.error("DB Connection Error:", err);
  console.log("Connected to MySQL DB!");
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ROUTES
// GET / - show number of users
app.get("/", (req, res) => {
  const q = "SELECT COUNT(*) AS count FROM user";
  connection.query(q, (err, results) => {
    if (err) return res.send("Error fetching count");
    res.send(`Total Users in DB: ${results[0].count}`);
  });
});

// GET /user - list users (username, email)
app.get("/user", (req, res) => {
  const q = "SELECT id, username, email FROM user";
  connection.query(q, (err, results) => {
    if (err) return res.status(500).send("Database Error");
    res.render("users", { users: results });
  });
});

// POST /user - add new user
app.post("/user", (req, res) => {
  const { id, username, email, password } = req.body;
  const q = "INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)";
  connection.query(q, [id, username, email, password], (err) => {
    if (err) return res.send("Insertion Failed");
    res.redirect("/user");
  });
});

// PATCH /user/:id - update username
app.patch("/user/:id", (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  const q = "UPDATE user SET username = ? WHERE id = ?";
  connection.query(q, [username, id], (err) => {
    if (err) return res.send("Update Failed");
    res.redirect("/user");
  });
});

// DELETE /user/:id - delete user
app.delete("/user/:id", (req, res) => {
  const { id } = req.params;
  const q = "DELETE FROM user WHERE id = ?";
  connection.query(q, [id], (err) => {
    if (err) return res.send("Delete Failed");
    res.redirect("/user");
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
