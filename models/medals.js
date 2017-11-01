const BASE_URL = 'http://ddragon.leagueoflegends.com/cdn/7.20.3/img/';
const ITEM_BASE_URL = 'http://ddragon.leagueoflegends.com/cdn/7.20.3/img/';

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
  {
    name: "Unstoppable",
    info: "Get 3 kills without dying",
    image: BASE_URL + "spell/UndyingRage.png",
  },
  {
    name: "Scout",
    info: "Place 10 wards",
    image: ITEM_BASE_URL + "item/3340.png",
  },
  {
    name: "Rich",
    info: "Earn 15K gold",
    image: BASE_URL + "passive/Draven_passive.png",
  },
  {
    name: "Carnivore",
    info: "Kill 100 jungle monsters",
    image: BASE_URL + "spell/TahmKenchW.png",
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
  largestKillingSpree: {
    name: "Unstoppable",
    info: "Get 3 kills without dying",
    image: BASE_URL + "spell/UndyingRage.png",
  },
  wardsPlaced: {
    name: "Scout",
    info: "Place 10 wards",
    image: ITEM_BASE_URL + "item/3340.png",
  },
  goldEarned: {
    name: "Rich",
    info: "Earn 15K gold",
    image: BASE_URL + "passive/Draven_passive.png",
  },
  neutralMinionsKilled: {
    name: "Carnivore",
    info: "Kill 100 jungle monsters",
    image: BASE_URL + "spell/TahmKenchW.png",
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

  if (data.largestKillingSpree >= 3)
    medals.push(MEDAL_DATA.largestKillingSpree);

  if (data.wardsPlaced >= 10)
    medals.push(MEDAL_DATA.wardsPlaced);

  if (data.goldEarned >= 15000)
    medals.push(MEDAL_DATA.goldEarned);

  if (data.neutralMinionsKilled >= 100)
    medals.push(MEDAL_DATA.neutralMinionsKilled);

  return medals;
}

module.exports = {
  medals: MEDAL_DATA_ARRAY,
  getMedals: getMedals,
};
