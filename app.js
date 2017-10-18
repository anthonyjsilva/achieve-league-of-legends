const API_KEY = require('./apikey');
const URL = 'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/fiesta%20clown?api_key=' + API_KEY;

const express = require('express');
const fetch = require('node-fetch');
const mustacheExpress = require('mustache-express');
// const bodyParser = require('body-parser');

const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views')
app.set('view engine', 'mustache')

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  console.log(API_KEY);

  fetch(URL).then(function(res) {
    return res.json();
  }).then(function(json) {
    console.log(json);
    res.render('index', json);
  });

});

app.listen(3000, () => {
  console.log('Successfully started express application!')
});
