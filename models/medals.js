const BASE_URL = 'http://ddragon.leagueoflegends.com/cdn/7.20.3/img/';

// array of medals
const MEDAL_DATA_ARRAY = [
  {
    name: "Speed Runner",
    info: "Win in under 22 minutes",
    image: BASE_URL + "spell/ZileanW.png",
  },
  {
    name: "Ascended",
    info: "Reach max level",
    image: BASE_URL + "passive/Zilean_Passive.png",
  },
  {
    name: "Invincible",
    info: "End the game without dying",
    image: BASE_URL + "passive/ViPassive.png",
  },
  {
    name: "First Blood!",
    info: "Get first blood",
    image: BASE_URL + "passive/Darius_PassiveBuff.png",
  },
  {
    name: "Demolition",
    info: "Destroy the first tower",
    image: BASE_URL + "spell/JarvanIVDemacianStandard.png",
  },
];

const MEDAL_DATA = {
  speedRunner : {
    name: "Speed Runner",
    info: "Win in under 22 minutes",
    image: BASE_URL + "spell/ZileanW.png",
  },
  ascended : {
    name: "Ascended",
    info: "Reach max level",
    image: BASE_URL + "passive/Zilean_Passive.png",
  },
  invincible : {
    name: "Invincible",
    info: "End the game without dying",
    image: BASE_URL + "passive/ViPassive.png",
  },
  firstBloodKill: {
    name: "First Blood!",
    info: "Get first blood",
    image: BASE_URL + "passive/Darius_PassiveBuff.png",
  },
  firstTowerKill: {
    name: "Demolition",
    info: "Destroy the first tower",
    image: BASE_URL + "spell/JarvanIVDemacianStandard.png",
  },
};

function getMedals(data) {
  let medals = [];
  // fast win
  if (data.time <= 22*60 && data.win)
    medals.push(MEDAL_DATA.speedRunner);
  // max level
  if (data.level >= 18)
    medals.push(MEDAL_DATA.ascended);
  // no deaths
  if (data.deaths === 0)
    medals.push(MEDAL_DATA.invincible);

  if (data.firstBloodKill)
    medals.push(MEDAL_DATA.firstBloodKill);

  if (data.firstTowerKill)
    medals.push(MEDAL_DATA.firstTowerKill);

  return medals;
}

module.exports = {
  medals: MEDAL_DATA_ARRAY,
  getMedals: getMedals,
};
