// gets all the relvant data and passes that to the template engine
function parseSummonerData(summoner) {
  let parsedData = Object.assign({}, summoner.account);
  let playerStats = [];
  let id = summoner.account.accountId;

  summoner.recentGames.forEach((game, index, array) => {
    // find the player's participant id
    let partId;
    game.gameData.participantIdentities.forEach((participant) => {
      if (participant.player.accountId === summoner.account.accountId) {
        partId = participant.participantId;
      }
    });

    // find player's participant obj
    let playerObj;
    game.gameData.participants.forEach((participant) => {
      if (participant.participantId === partId) {
        playerObj = participant;
      }
    });

    // grab stats
    let gameStats = {
      partId: partId
    };
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
    if (playerObj.highestAchievedSeasonTier !== 'UNRANKED') {

      parsedData.rankColor = HELPER.getRankColor(playerObj.highestAchievedSeasonTier);
    }

    gameStats.items = [
      playerObj.stats.item0,
      playerObj.stats.item1,
      playerObj.stats.item2,
      playerObj.stats.item3,
      playerObj.stats.item4,
      playerObj.stats.item5
    ].filter(item => item !== 0);

    gameStats.kills = playerObj.stats.kills;
    gameStats.deaths = playerObj.stats.deaths;
    gameStats.assists = playerObj.stats.assists;
    gameStats.kda = HELPER.getKDA(gameStats.kills, gameStats.deaths, gameStats.assists);
    gameStats.level = playerObj.stats.champLevel;
    gameStats.cs = playerObj.stats.totalMinionsKilled;
    gameStats.gold = HELPER.formatGold(playerObj.stats.goldEarned);
    gameStats.goldEarned = playerObj.stats.goldEarned;
    gameStats.firstBloodKill = playerObj.stats.firstBloodKill;
    gameStats.firstTowerKill = playerObj.stats.firstTowerKill;
    gameStats.largestKillingSpree = playerObj.stats.largestKillingSpree;
    gameStats.wardsPlaced = playerObj.stats.wardsPlaced;
    gameStats.neutralMinionsKilled = playerObj.stats.neutralMinionsKilled;
    gameStats.medals = MEDALS.getMedals(gameStats);

    playerStats.push(gameStats);
  });
  parsedData.gameStats = playerStats;
  // return summoner;
  return parsedData;
}
