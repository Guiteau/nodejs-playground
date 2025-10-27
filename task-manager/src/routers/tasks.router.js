const express = require("express")
const Task = require("../models/task.model");
const auth = require("../middlewares/auth.mid");
const router = new express.Router()

// Endpoints for Tasks
router.post('/task', (req, res) => {
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

router.get('/tasks', auth , async(req, res) => {
  console.log("Fetching tasks for authenticated user...");
  const match = {};
  const sort = {};
  if(req.query.completed){
    match.completed = req.query.completed === 'true';
  }
  if(req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }
  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    console.log("Error fetching tasks for user:", error);
    res.status(500).send();
  }
})

router.get('/task/:id', (req, res) => {
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

router.patch('/task/:id', (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    console.log("Invalid task updates attempted:", updates);
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  const _id = req.params.id;
  console.log(`Updating task with ID: ${_id}`);
  Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true }).then((task) => {
    if (!task) {
      console.log("Task not found for update");
      return res.status(404).send();
    }
    res.send(task);
    console.log("Task updated:", task);
  }).catch((error) => {
    console.log("Error updating task:", error);
    res.status(400).send(error);
  });
});

router.delete('/task/:id', (req, res) => {
  const _id = req.params.id;
  console.log(`Deleting task with ID: ${_id}`);
  Task.findByIdAndDelete(_id).then((task) => {
    if (!task) {
      console.log("Task not found for deletion");
      return res.status(404).send();
    }
    res.send(task);
    console.log("Task deleted:", task);
  }).catch((error) => {
    console.log("Error deleting task:", error);
    res.status(500).send();
  });
});

module.exports = router;