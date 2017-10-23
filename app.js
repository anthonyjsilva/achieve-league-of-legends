// setup ---------------------------------------------------

// riot games api
const BASE_API_URL = 'https://na1.api.riotgames.com/lol/';

// imports
const API_KEY = require('./apikey');
const CHAMPION_DATA = require('./championData');

const express = require('express'),
  fetch = require('node-fetch'),
  mustacheExpress = require('mustache-express'),
  bodyParser = require('body-parser'),
  app = express();

// setup
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache')
app.set('views', './views')

app.use(express.static('./public/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// url request builders ---------------------------------------------------

const SUMMONER_ENDPOINT = name => `${BASE_API_URL}summoner/v3/summoners/by-name/${name}?api_key=${API_KEY}`;
const MATCHLIST_ENDPOINT = id => `${BASE_API_URL}match/v3/matchlists/by-account/${id}/recent?api_key=${API_KEY}`;
const MATCH_ENDPOINT = id => `${BASE_API_URL}match/v3/matches/2626221414?api_key=${API_KEY}`;

// routes ---------------------------------------------------

app.get('/', (req, res) => {
  res.render('index');
});

/*
look up a summoner based on form data,
find that summoners recent games,
find stats on those recent games on a per-game basis
*/
// TODO: get the current version for static data with /realms endpoint
app.post('/search', (req, res) => {

  const data = {};
  const name = req.body.name;
  let gameid;
  // data.summoner.accountId
  fetch(SUMMONER_ENDPOINT(name)).then(res => res.json()).then(json => {
    data.summoner = json;

    fetch(MATCHLIST_ENDPOINT(data.summoner.accountId)).then(res => res.json()).then(json => {
      Object.assign(data, json);

      // TODO: make gameid dynamic
      gameid = 2626221414;

      data.matches.forEach((match, index, array) => {
        array[index].championName = CHAMPION_DATA.getName(match.champion);

        // only show flex 5v5, solo/duo 5v5, draft and blindpick 5v5
        array[index].relevant = true;//(match.queue <= 440 && match.queue >= 400);
      });
    }).then(() => {
      fetch(MATCH_ENDPOINT()).then(res => res.json()).then(json => {
        Object.assign(data, json);
        console.log(data);
        res.render('search', data);
      });
    });
  });
});

app.listen(3000, () => console.log('We runnin baby!'));
