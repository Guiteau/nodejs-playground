// Import dependencies
const express = require('express');
const connectDB = require('./db/mongoose');

// Import models
const User = require('./models/user.model');
const Task = require('./models/task.model');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Endpoints
app.post('/user', (req, res) => {
  console.log("Creating user...");
  const user = new User(req.body);
  user.save().then(() => {
    res.status(201).send(user);
  }).catch((error) => {
    res.status(400).send(error);
  });
});

app.get('/users', (req, res) => {
  console.log("Fetching users...");
  User.find({}).then((users) => {
    res.send(users);
    console.log("Users fetched:", users);
  }).catch((error) => {
    console.log("Error fetching users:", error);
    res.status(500).send();
  });
});

app.get('/user/:id', (req, res) => {
  const _id = req.params.id;
  console.log(`Fetching user with ID: ${_id}`);
  User.findById(_id).then((user) => {
    if (!user) {
      console.log("User not found");
      return res.status(404).send();
    }
    res.send(user);
    console.log("User fetched:", user);
  }).catch((error) => {
    console.log("Error fetching user:", error);
    res.status(500).send();
  });
});

app.post('/task', (req, res) => {
  console.log("Creating task...");
  const task = new Task(req.body);
  task.save().then(() => {
    res.status(201).send(task);
    console.log("Task created:", task);
  }).catch((error) => {
    console.log("Error creating task:", error);
    res.status(400).send(error);
  });
});

app.get('/tasks', (req, res) => {
  console.log("Fetching tasks...");
  Task.find({}).then((tasks) => {
    res.send(tasks);
    console.log("Tasks fetched:", tasks);
  }).catch((error) => {
    console.log("Error fetching tasks:", error);
    res.status(500).send();
  });
});

app.get('/task/:id', (req, res) => {
  const _id = req.params.id;
  console.log(`Fetching task with ID: ${_id}`);
  Task.findById(_id).then((task) => {
    if (!task) {
      console.log("Task not found");
      return res.status(404).send();
    }
    res.send(task);
    console.log("Task fetched:", task);
  }).catch((error) => {
    console.log("Error fetching task:", error);
    res.status(500).send();
  });
});

// Start server after connecting to DB
const startServer = async () => {
  try {
    await connectDB(); 
    app.listen(port, () => {
      console.log(`Server is up on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server due to DB connection error.");
  }
};

console.log("Starting server...");
startServer();