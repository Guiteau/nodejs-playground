const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Task = mongoose.model('Task', {
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const newTask = new Task({
  description: 'Learn Mongoose library',
  completed: false
});

newTask.save().then(() => {
  console.log('Task saved:', newTask);
}).catch((error) => {
  console.log('Error saving task:', error);
});

mongoose.disconnect();

module.exports = mongoose;