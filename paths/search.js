const https = require('https');
const Discord = require("discord.js");

/* "Search" Route
This is a natural language processing path.
*/
exports.routes = ["show me details on", "explain", "search for", "find", "tell me about", "display"];
exports.run = (bot, msg, search) => {
  if (!search) return msg.reply("No value was given to execute search!");
  let contextLexicon = ["class", "race", "discipline", "power"];
  let apiRoute = `https://api.malekai.network/search?name=${search}`;
  contextLexicon.forEach(function(searchType) {
    if (search.includes(searchType)) {
      search = search.replace(searchType, '').trim();
      apiRoute = `https://api.malekai.network/search?data_type=${searchType}&name=${search}`
    }
  })
  bot.callAPI(apiRoute)
    .then(function(results) {
      let resultObject = JSON.parse(results);
      if (resultObject.length > 2) {
        let resultList = [];
        resultObject.forEach(function(theResult) {
          resultList.push(`${theResult.name} (${theResult.data_type}`)
        })
        return msg.reply(`I found ${resultObject.length} results (too many to show in detail!). Heres a list of what I found;\n${resultList.join(", ")}`)
          .catch(function(err) {
            bot.log(err)
          });
      }
      if (resultObject.length == 2) {
        resultObject.forEach(function(aResult) {
          msg.reply('I found two items matching your request...', {
              embed: createEmbed(aResult)
            })
            .catch(function(err) {
              bot.log(err)
            });
        })
      }
      if (resultObject.length == 1) {
        resultObject.forEach(function(aResult) {
          msg.reply('I found what you were looking for...', {
              embed: createEmbed(aResult)
            })
            .catch(function(err) {
              bot.log(err)
            });
        })
      }
    })
    .catch(function(err) {
      console.log(err);
      msg.reply(`I was unable to find anything that matched your inquiry for ${search}.`)
        .catch(function(err) {
          bot.log(err)
        })
        .then(theReply => {
          theReply.delete({
            timeout: 25000,
            reason: 'Cleaning up after error report.'
          }).catch(function(err) {
            bot.log(err)
          })
        })
    });
  msg.delete({
      timeout: 22500,
      reason: 'Automated Channel Clean-up'
    })
    .catch(function(err) {
      bot.log(err)
    });
}

function createEmbed(object) {
  if (object.data_type == "class")
    return embedClass(object);
  if (object.data_type == "race")
    return embedRace(object);
  if (object.data_type == "discipline")
    return embedDiscipline(object);
  if (object.data_type == "power")
    return embedPower(object);
}

function embedClass(classObject) {
  let newEmbed = new Discord.MessageEmbed();
  newEmbed.setAuthor("Class");
  newEmbed.setColor('GOLD');
  newEmbed.setTitle(classObject.name);
  newEmbed.setDescription(`${classObject.description}.`);
  if (classObject.icon) newEmbed.setThumbnail(classObject.icon);
  if (classObject.races && classObject.races.length > 0) newEmbed.addField("Supported Races", classObject.races.join(", "));
  if (classObject.powers && classObject.powers.length > 0) newEmbed.addField("Starting Powers", classObject.powers.join(", "));
  if (classObject.tags && classObject.tags.length > 0) newEmbed.addField("Tags", classObject.tags.join(", "));
  newEmbed.setTimestamp(Date.now());
  newEmbed.setFooter("Crowfall.wiki", 'https://crowfall.wiki/images/logo-white.png');
  return newEmbed;
}

function embedRace(raceObject) {
  let newEmbed = new Discord.MessageEmbed();
  newEmbed.setColor('GOLD');
  newEmbed.setAuthor("Race");
  newEmbed.setTitle(raceObject.name);
  newEmbed.setDescription(`${raceObject.description}.`);
  if (raceObject.icon) newEmbed.setThumbnail(raceObject.icon);
  if (raceObject.classes) newEmbed.addField("Supported Classes", raceObject.classes.join(", "));
  if (raceObject.tags && raceObject.tags.length > 0) newEmbed.addField("Tags", raceObject.tags.join(", "));
  newEmbed.setTimestamp(Date.now());
  newEmbed.setFooter("Crowfall.wiki", 'https://crowfall.wiki/images/logo-white.png');
  return newEmbed;
}

function embedDiscipline(disciplineObject) {
  let newEmbed = new Discord.MessageEmbed();
  newEmbed.setAuthor(`${disciplineObject.type} Discipline`);
  newEmbed.setColor('GOLD');
  newEmbed.setTitle(disciplineObject.name);
  newEmbed.setDescription(`${disciplineObject.description}.`);
  if (disciplineObject.icon) newEmbed.setThumbnail(disciplineObject.icon);
  if (disciplineObject.classes && disciplineObject.classes.length > 0) newEmbed.addField("Allowed Classes", disciplineObject.classes.join(", "));
  if (disciplineObject.powers && disciplineObject.powers.length > 0) newEmbed.addField("Granted Powers", disciplineObject.powers.join(", "));
  if (disciplineObject.statsGranted && disciplineObject.statsGranted.length > 0) {
    disciplineObject.statsGranted.forEach(function(granted, index) {
      newEmbed.addField(granted, disciplineObject.stats_value[index])
    })
  }
  if (disciplineObject.trays_granted && disciplineObject.trays_granted.length > 0) newEmbed.addField("Trays Granted", disciplineObject.trays_granted.join(", "))
  if (disciplineObject.trays_removed && disciplineObject.trays_removed.length > 0) newEmbed.addField("Trays Removed", disciplineObject.trays_removed.join(", "))
  if (disciplineObject.slots_granted && disciplineObject.slots_granted.length > 0) newEmbed.addField("Slots Granted", disciplineObject.slots_granted.join(", "))
  if (disciplineObject.slots_removed && disciplineObject.slots_removed.length > 0) newEmbed.addField("Slots Removed", disciplineObject.slots_removed.join(", "))
  if (disciplineObject.tags && disciplineObject.tags.length > 0) newEmbed.addField("Tags", disciplineObject.tags.join(", "));
  newEmbed.setTimestamp(Date.now());
  newEmbed.setFooter("Crowfall.wiki", 'https://crowfall.wiki/images/logo-white.png');
  return newEmbed;
}

function embedPower(powerObject) {
  let newEmbed = new Discord.MessageEmbed();
  newEmbed.setAuthor(`${powerObject.type} Power`);
  newEmbed.setColor('GOLD');
  newEmbed.setTitle(powerObject.name);
  newEmbed.setDescription(`${powerObject.description}.`);
  if (powerObject.icon) newEmbed.setThumbnail(powerObject.icon);
  if (powerObject.max_targets && powerObject.max_targets != "") newEmbed.addField("Max Targets", powerObject.max_targets, true);
  if (powerObject.cast_type && powerObject.cast_type != "") newEmbed.addField("Cast Type", powerObject.cast_type, true);
  if (powerObject.targeting && powerObject.targeting != "") newEmbed.addField("Targeting", powerObject.targeting, true);
  if (powerObject.cooldown && powerObject.cooldown != "") newEmbed.addField("Cooldown", powerObject.cooldown, true);
  if (powerObject.duration && powerObject.duration != "") newEmbed.addField("Targeting", powerObject.duration, true);
  // if (powerObject.cost && powerObject.cost.resource) newEmbed.addField("Cost", powerObject.cost.resource, true);
  if (powerObject.tags && powerObject.tags.length > 0) newEmbed.addField("Tags", powerObject.tags.join(", "));
  newEmbed.setTimestamp(Date.now());
  newEmbed.setFooter("Crowfall.wiki", 'https://crowfall.wiki/images/logo-white.png');
  return newEmbed;
}
