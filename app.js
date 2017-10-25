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

// my functions ---------------------------------------------------
const rankColors = {
  bronze: "#bd8e53",
  silver: "#d0cdca",
  gold: "#e0b519",
  platinum: "#74b39f",
  diamond: "#6e9ce0",
  master: "#bd8e53",
  challenger: "#bd8e53",
};

const summonerSpells = {
  "1" : "SummonerBoost",
  "3" : "SummonerExhaust",
  "4" : "SummonerFlash",
  "6" : "SummonerHaste",
  "7" : "SummonerHeal",
  "11" : "SummonerSmite",
  "14" : "SummonerDot",
  "13" : "SummonerMana",
  "12" : "SummonerTeleport",
  "21" : "SummonerBarrier",
};

const queueTypes = {
  "400": "5v5 Draft Pick",
  "420": "5v5 Ranked Solo",
  "430": "5v5 Blind Pick",
  "440": "5v5 Ranked Flex",
};

const getRankColor = rank => rankColors[rank.toLowerCase()];
const getSummonerSpellName = id => summonerSpells[id];
const getQueueName = id => queueTypes[id];

const formatGold = gold => (gold > 999) ? (gold / 1000).toFixed(1) + 'K' : gold;
const getKDA = (k, d, a) => ((k + a) / d).toFixed(1) + " KDA";
const formatTime = time => (time / 60).toFixed();

// gets all the relvant data and passes that to the template engine
function parseSummonerData(summoner) {
  let parsedData = Object.assign({}, summoner.account);
  let playerStats = [];
  let id = summoner.account.accountId;

  summoner.recentGames.forEach((game, index, array) => {
    // find the player's participant id
    let partId;
    game.gameData.participantIdentities.forEach((participant)=>{
      if (participant.player.accountId === summoner.account.accountId) {
        partId = participant.participantId;
      }
    });

    // find player's participant obj
    let playerObj;
    game.gameData.participants.forEach((participant)=>{
      if (participant.participantId === partId) {
        playerObj = participant;
      }
    });

    // grab stats
    let gameStats = {};
    gameStats.championName = game.championName;
    gameStats.queue = game.queue;
    gameStats.lane = game.lane;

    gameStats.win = playerObj.stats.win;
    gameStats.queue = getQueueName(game.gameData.queueId);
    gameStats.time = formatTime(game.gameData.gameDuration);

    gameStats.spell1 = getSummonerSpellName(playerObj.spell1Id);
    gameStats.spell2 = getSummonerSpellName(playerObj.spell2Id);;

    parsedData.rank = playerObj.highestAchievedSeasonTier;
    parsedData.rankColor = getRankColor(playerObj.highestAchievedSeasonTier);

    gameStats.items = [];
    gameStats.items.push(playerObj.stats.item0);
    gameStats.items.push(playerObj.stats.item1);
    gameStats.items.push(playerObj.stats.item2);
    gameStats.items.push(playerObj.stats.item3);
    gameStats.items.push(playerObj.stats.item4);
    gameStats.items.push(playerObj.stats.item5);
    // gameStats.item6 = playerObj.stats.item6;
    gameStats.kills = playerObj.stats.kills;
    gameStats.deaths = playerObj.stats.deaths;
    gameStats.assists = playerObj.stats.assists;
    gameStats.kda = getKDA(gameStats.kills, gameStats.deaths, gameStats.assists);
    gameStats.level = playerObj.stats.champLevel;
    gameStats.cs = playerObj.stats.totalMinionsKilled;
    gameStats.gold = formatGold(playerObj.stats.goldEarned);

    playerStats.push(gameStats);

  });


  parsedData.gameStats = playerStats;
  // return summoner;
  return parsedData;
}

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
    account: "",
    recentGames: ""
  };

  // get summoner info
  fetch(SUMMONER_ENDPOINT(name)).then(res => res.json()).then(data => {
    summoner.account = data;
  }).then(() => {
    fetch(MATCHLIST_ENDPOINT(summoner.account.accountId)).then(res => res.json()).then(data => {
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
          let parsedData = parseSummonerData(summoner);
          res.render('search', parsedData);
          // res.json(parsedData);
        }
      });
    });
  });
});

app.listen(3000, () => console.log('We runnin\'!'));
