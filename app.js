const API_KEY = require('./apikey');

const BASE_API_URL = 'https://na1.api.riotgames.com/lol/';
const SUMMONER_ENDPOINT = 'summoner/v3/summoners/by-name/';
const GET_MATCHES_URL = 'match/v3/matchlists/by-account/215961083/recent';
const CHAMPIONS_API_URL = 'static-data/v3/champions';


const express = require('express'),
  fetch = require('node-fetch'),
  mustacheExpress = require('mustache-express'),
  bodyParser = require('body-parser'),
  app = express();

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache')
app.set('views', './views')

app.use(express.static('./public/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let championList;
function getChampData() {
  fetch(`${BASE_API_URL}${CHAMPIONS_API_URL}?locale=en_US&tags=keys&api_key=${API_KEY}`)
  .then(res => res.json()).then(json => {
    championList = json.keys;
    console.log(championList);
  });
}

const championNameById = id => championList[id];

app.get('/', (req, res) => {
  getChampData();
  res.render('index');
});

app.post('/search', (req, res) => {
  console.log(req.body);
  const data = {};
  const summoner = req.body.name;
  let gameid;

  fetch(`${BASE_API_URL}${SUMMONER_ENDPOINT}${summoner}?api_key=${API_KEY}`).then(res => res.json()).then(json => {
    data.summoner = json;
    fetch(`${BASE_API_URL}match/v3/matchlists/by-account/${data.summoner.accountId}/recent?api_key=${API_KEY}`).then(res => res.json()).then(json => {
      // console.log(json);
      data.matches = json;
      // console.log(data);
      gameid = 2626221414; //json.matches.matches[0].gameId;
      data.matches.matches.forEach((match, index, array) => {

        array[index].char = championNameById(match.champion);
        // console.log(match);
        if (match.queue <= 440 && match.queue >= 400) {
          array[index].relevant = true;
        }

      });

      // console.log(data);
    }).then(() => {
      fetch(`https://na1.api.riotgames.com/lol/match/v3/matches/2626221414?api_key=${API_KEY}`).then(res => res.json()).then(json => {
        data.game = json;
        console.log(data);
        res.render('search', data);
      });
    })

  });
});

app.listen(3000, () => console.log('Successfully started express application!'));
