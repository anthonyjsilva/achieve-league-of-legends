// initial setup ---------------------------------------------------

// custom imports
const MY_PARSER = require('./models/myParser'),
  CHAMPION_DATA = require('./models/championData'),
  HELPER = require('./models/helper'),
  ENDPOINTS = require('./models/endpoints'),
  MEDALS = require('./models/medals');

// node_modules imports
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


// routes ---------------------------------------------------
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/list', (req, res) => {
  res.render('list', {medals: MEDALS.medals});
});

app.get('/about', (req, res) => {
  res.render('about');
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
    account: "",
    recentGames: ""
  };

  // get summoner info
  fetch(ENDPOINTS.SUMMONER_ENDPOINT(name)).then(res => res.json()).then(data => {
    summoner.account = data;
  }).then(() => {
    fetch(ENDPOINTS.MATCHLIST_ENDPOINT(summoner.account.accountId)).then(res => res.json()).then(data => {
      // filter recent matches to only store matches we care about
      summoner.recentGames = data.matches.filter((match, index, array) => match.queue <= 440 && match.queue >= 400 && index < 5);
      summoner.recentGames.forEach((match, index, array) => {
        match.championName = CHAMPION_DATA.getName(match.champion);
      });
    }).then(() => {
      // parallel async calls for each game
      async.each(summoner.recentGames, function(match, callback) {
        fetch(ENDPOINTS.MATCH_ENDPOINT(match.gameId)).then(res => res.json()).then(data => {
          match.gameData = data;
          callback();
        });
        //TODO: some error handling here
      }, function(err) {
        if (err)
          console.log('A request failed!');
        else {
          console.log('All requests complete!');
          let parsedData = parseSummonerData(summoner);
          res.render('search', parsedData);
          // res.json(summoner);
        }
      });
    });
  });
});

app.listen(3000, () => console.log('We runnin\'!'));
