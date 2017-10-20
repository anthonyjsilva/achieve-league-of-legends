const API_KEY = require('./apikey');

const API_URL = 'https://na1.api.riotgames.com/lol/';
const GET_SUMMONER_URL = 'summoner/v3/summoners/by-name/';
const GET_MATCHES_URL ='match/v3/matchlists/by-account/215961083/recent'

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
  const data = {};

  fetch(`${API_URL}${GET_SUMMONER_URL}${req.body.name}?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(json => {
      data.summoner = json;
      fetch(`${API_URL}${GET_MATCHES_URL}?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(json => {
          console.log(json);
          data.matches = json;
          console.log(data);
          res.render('search', data);
        });
    });
});

app.listen(3000, () => console.log('Successfully started express application!'));
