const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path'); // Import the 'path' module
const { error } = require('console');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'student'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/data", (req, res) => {
  connection.query("SELECT * FROM shapatar", (err, result) => {
    if (err) {
      res.send("Error: API isn't working");
    } else {
      res.send("Working perfectly fine " + JSON.stringify(result));
    }
  });
});

app.post('/submit', (req, res) => {
  const { firstName, lastName, dob, email, phone, password } = req.body;

  const sql = 'INSERT INTO shapatar (firstName, lastName, dob, email, phone, password) VALUES (?, ?, ?, ?, ?, ?)';
 
  const values = [firstName, lastName, dob, email, phone, password];
  connection.query(sql, values , (err, result) => {
  if (err) {
      console.error('Error inserting user:', err);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }
    res.status(201).json({ message: 'User registered successfully' });
  });
  
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`Server is running on port ${PORT}`);
});
