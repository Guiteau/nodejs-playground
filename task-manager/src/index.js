// Import dependencies
const express = require('express');
const connectDB = require('./db/mongoose');

// Import routers
const usersRouter = require('./routers/users.router');
const tasksRouter = require('./routers/tasks.router');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
// Use routers
app.use(usersRouter);
app.use(tasksRouter);

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