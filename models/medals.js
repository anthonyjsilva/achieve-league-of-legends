const BASE_URL = 'http://ddragon.leagueoflegends.com/cdn/7.20.3/img/';

// array of medals
const MEDAL_DATA = {
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

function getMedals(data) {
  let medals = [];
  // fast win
  if (data.time <= 24*60 && data.win)
    medals.push(MEDAL_DATA.speedrunner);
  // max level
  if (data.level >= 12)
    medals.push(MEDAL_DATA.ascended);
  // no deaths
  if (data.deaths === 0)
    medals.push(MEDAL_DATA.invincible);

  return medals;
}

module.exports = {
  getMedals: getMedals,
};
