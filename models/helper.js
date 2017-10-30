// const exports = module.exports = {};

// helper functions ---------------------------------------------------

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

module.exports.getRankColor = rank => rankColors[rank.toLowerCase()];
module.exports.getSummonerSpellName = id => summonerSpells[id];
module.exports.getQueueName = id => queueTypes[id];

module.exports.formatGold = gold => (gold > 999) ? (gold / 1000).toFixed(1) + 'K' : gold;
module.exports.getKDA = (k, d, a) => (d === 0) ? "Perfect KDA" : ((k + a) / d).toFixed(1) + " KDA";
module.exports.formatTime = time => (time / 60).toFixed() + 'm';
module.exports.formatLane = lane => lane.charAt(0) + lane.slice(1).toLowerCase();

module.exports.formatName = name => {
  if (name === "MissFortune") {
    return "Ms Fortune"
  }
  else {
    return name;
  }
};
