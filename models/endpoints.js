// riot games api
const API_KEY = require('./apikey'),
  BASE_API_URL = 'https://na1.api.riotgames.com/lol/';

// url request builders ---------------------------------------------------
module.exports.SUMMONER_ENDPOINT = name => `${BASE_API_URL}summoner/v3/summoners/by-name/${name}?api_key=${API_KEY}`;
module.exports.MATCHLIST_ENDPOINT = id => `${BASE_API_URL}match/v3/matchlists/by-account/${id}/recent?api_key=${API_KEY}`;
module.exports.MATCH_ENDPOINT = gameId => `${BASE_API_URL}match/v3/matches/${gameId}?api_key=${API_KEY}`;
