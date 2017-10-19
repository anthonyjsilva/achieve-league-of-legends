const API_KEY = require('./apikey');
const URL = 'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/';

const express = require('express');
const fetch = require('node-fetch');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');

const app = express();

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache')
app.set('views', './views')

app.use(express.static('./public/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/', (req, res) => {
  res.render('index');
});

app.post('/search', (req, res) => {
  console.log(req.body);

  fetch(`${URL}${req.body.name}?api_key=${API_KEY}`)
    .then(res => res.json())
      .then(json => {
        console.log(json);
        res.render('search', json);
      });
});

app.listen(3000, () => console.log('Successfully started express application!'));
