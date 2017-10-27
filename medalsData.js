const BASE_URL = 'http://ddragon.leagueoflegends.com/cdn/7.20.3/img/';

// array of medals
const MEDALS = {
  speedrunner : {
    name: "Speed Runner",
    info: "Win in under 22 minutes.",
    image: BASE_URL + "spell/ZileanW.png",
  },
  ascended : {
    name: "Ascended",
    info: "Reach max level.",
    image: BASE_URL + "passive/Zilean_Passive.png",
  },
  invincible : {
    name: "Invincible",
    info: "End the game without dying.",
    image: BASE_URL + "passive/ViPassive.png",
  },
};
module.exports = MEDALS;
