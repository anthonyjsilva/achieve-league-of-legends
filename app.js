const API_KEY = require('./apikey');

const API_URL = 'https://na1.api.riotgames.com/lol/';
const GET_SUMMONER_URL = 'summoner/v3/summoners/by-name/';
const GET_MATCHES_URL ='match/v3/matchlists/by-account/215961083/recent';

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

const CHAMPION_KEYS = 'static-data/v3/champions?locale=en_US&tags=keys&dataById=true&';

let LIST;

fetch('https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&tags=keys&dataById=true&api_key=RGAPI-85aa4d73-d165-421f-bdeb-eba95cde92fc')
  .then(res => res.json())
  .then(json => {
    LIST = json;
    // console.log(LIST);
  });

function convert(id) {
  return LIST.keys[id];
}

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/search', (req, res) => {
  console.log(req.body);
  const data = {};
  const summoner = req.body.name;
  fetch(`${API_URL}${GET_SUMMONER_URL}${summoner}?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(json => {
      data.summoner = json;
      fetch(`${API_URL}match/v3/matchlists/by-account/${data.summoner.accountId}/recent?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(json => {
          // console.log(json);
          data.matches = json;
          // console.log(data);

          data.matches.matches.forEach((match,index) => {
            data.matches.matches[index].char = convert(match.champion);
            console.log(match);
          });
          // console.log(data);

          res.render('search', data);
        });
    });
});

app.listen(3000, () => console.log('Successfully started express application!'));
