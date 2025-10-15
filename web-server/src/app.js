const express = require('express');
const path = require('path');

const app = express();
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

app.get('/', (req, res) => {
  res.send('Hello Express!');
});

app.get('/help', (req, res) => {
  res.send('Help page');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.get('*', (req, res) => {
  res.send('404 Page Not Found');
});

module.exports = app;