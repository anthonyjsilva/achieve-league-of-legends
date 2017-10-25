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
  async = require("async"),
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
const MATCH_ENDPOINT = gameId => `${BASE_API_URL}match/v3/matches/${gameId}?api_key=${API_KEY}`;

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

  const name = req.body.name;
  const summoner = {
    accountInfo: "",
    recentGames: ""
  };

  // get summoner info
  fetch(SUMMONER_ENDPOINT(name)).then(res => res.json()).then(data => {
    summoner.accountInfo = data;
  }).then(() => {
    fetch(MATCHLIST_ENDPOINT(summoner.accountInfo.accountId)).then(res => res.json()).then(data => {
      // filter recent matches to only store matches we care about
      summoner.recentGames = data.matches.filter((match, index, array) => match.queue <= 440 && match.queue >= 400 && index < 5);
      summoner.recentGames.forEach((match, index, array) => {
        match.championName = CHAMPION_DATA.getName(match.champion);
      });
    }).then(() => {
      // parallel async calls for each game
      async.each(summoner.recentGames, function(match, callback) {
        fetch(MATCH_ENDPOINT(match.gameId)).then(res => res.json()).then(data => {
          match.gameData = data;
          callback();
        });
        //TODO: some error handling here
      }, function(err) {
        if (err) console.log('A request failed!');
        else {
          console.log('All requests complete!');
          // res.render('search', summoner);
          res.json(summoner);
        }
      });
    });
  });
});

app.listen(3000, () => console.log('We runnin baby!'));
