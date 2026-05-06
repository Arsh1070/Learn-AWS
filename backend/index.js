const express = require('express');
const db = require('./db');
const fs = require('fs');
const path = require('path');
// const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;
const APP_NAME = process.env.APP_NAME;

// app.use(cors({origin: "http://localhost:5173"}));

app.use(express.json());


app.get('/api', (req, res) => {
  res.send(`Hello from ${APP_NAME} server!`);
});

app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      throw new Error("name and email are required");
    }
    const safeName = name ?? null;
    const safeEmail = email ?? null;
    const safeServer = APP_NAME ?? null;
await db.query(`CREATE DATABASE IF NOT EXISTS testdb`);
        await db.query(`USE testdb`);
        await db.query(`CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          server VARCHAR(255)
        )`);
    const [result] = await db.execute(
      "INSERT INTO users (name, email, server) VALUES (?, ?, ?)",
      [safeName, safeEmail, safeServer]
    );

    res.send({ id: result.insertId, name, email, server: APP_NAME });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/api/users", async (req, res) => {
  try {
    console.log("Fetching users...");
    const [rows] = await db.execute("SELECT * FROM users");
    res.send({ users: rows , source: APP_NAME});
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const { name, email } = req.body;

    await db.execute(
      "UPDATE users SET name=?, email=? WHERE id=?",
      [name, email, req.params.id]
    );

    res.send("Updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    await db.execute("DELETE FROM users WHERE id=?", [req.params.id]);
    res.send("Deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/users/json', async (req, res) => {
  try {
    const { name, email } = req.body;
    const userDir = path.join(__dirname, 'users');
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir);
    }
    const pathToFile = path.join(userDir, `users.json`);
    let users = [];
    if (fs.existsSync(pathToFile)) {
      const usersData = fs.readFileSync(pathToFile, 'utf-8');
      users = JSON.parse(usersData)
    }
    
    users.push({ name, email });
    fs.writeFileSync(pathToFile, JSON.stringify(users));
    res.send({ message: 'User saved to JSON file', user: { name, email } });
    
  } catch (error) {
    console.error('Error saving user to JSON file:', error);
    res.status(500).send({ message: 'Failed to save user to JSON file' });
  }
})
app.get('/api/users/json', async (req, res) => {
  try {
    const userDir = path.join(__dirname, 'users');
    const pathToFile = path.join(userDir, `users.json`);
    if (fs.existsSync(pathToFile)) {
      const usersData = fs.readFileSync(pathToFile, 'utf-8');
      const finalData = JSON.parse(usersData);
      res.send(finalData);
    }
    
  } catch (error) {
    console.error('Error saving user to JSON file:', error);
    res.status(500).send({ message: 'Failed to save user to JSON file' });
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});