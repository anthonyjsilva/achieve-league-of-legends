const API_KEY = require('./apikey');

const express = require('express');
const app = express();


app.get('/', (req, res) => {
  console.log(API_KEY);
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Successfully started express application!')
});
