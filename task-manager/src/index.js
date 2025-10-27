// Import dependencies
const express = require('express');
const connectDB = require('./db/mongoose');

// Import routers
const usersRouter = require('./routers/users.router');
const tasksRouter = require('./routers/tasks.router');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Import multer for file uploads
const multer = require('multer');
const upload = multer({
  dest: 'images',
  limits: {
    fileSize: 1000000 // 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error('Please upload a Word document'));
    }
    cb(undefined, true);
  }
});

// File upload endpoint
app.post('/upload', upload.single('upload'), (req, res) => {
  res.send();
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message });
});

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

// JWT Demonstration
const jwt = require('jsonwebtoken');
const jwtFunction = async () => {
  const token = jwt.sign({ _id: 'abc123' }, 'mysecret', { expiresIn: '7 days' });
  console.log("Generated JWT:", token);

  const data = jwt.verify(token, 'mysecret');
  console.log("Decoded JWT data:", data);
};

jwtFunction();

console.log("Starting server...");
startServer();