// setup ---------------------------------------------------

// custom imports
  const CHAMPION_DATA = require('./models/championData'),
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
    gameStats.championNameFormatted = HELPER.formatName(game.championName);
    gameStats.queue = game.queue;
    gameStats.lane = HELPER.formatLane(game.lane);

    gameStats.win = playerObj.stats.win;
    gameStats.queue = HELPER.getQueueName(game.gameData.queueId);
    gameStats.time = game.gameData.gameDuration;
    gameStats.timeFormatted = HELPER.formatTime(game.gameData.gameDuration);

    gameStats.spell1 = HELPER.getSummonerSpellName(playerObj.spell1Id);
    gameStats.spell2 = HELPER.getSummonerSpellName(playerObj.spell2Id);;

    parsedData.rank = playerObj.highestAchievedSeasonTier;
    parsedData.rankColor = HELPER.getRankColor(playerObj.highestAchievedSeasonTier);

    gameStats.items = [
      playerObj.stats.item0,
      playerObj.stats.item1,
      playerObj.stats.item2,
      playerObj.stats.item3,
      playerObj.stats.item4,
      playerObj.stats.item5
    ].filter( item => item !== 0);

    gameStats.kills = playerObj.stats.kills;
    gameStats.deaths = playerObj.stats.deaths;
    gameStats.assists = playerObj.stats.assists;
    gameStats.kda = HELPER.getKDA(gameStats.kills, gameStats.deaths, gameStats.assists);
    gameStats.level = playerObj.stats.champLevel;
    gameStats.cs = playerObj.stats.totalMinionsKilled;
    gameStats.gold = HELPER.formatGold(playerObj.stats.goldEarned);
    gameStats.medals = MEDALS.getMedals(gameStats);

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
