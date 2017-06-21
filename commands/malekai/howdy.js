const Discord = require('discord.js');
const moment = require('moment');
const fs = require('fs');
const path = require("path");

exports.run = (bot, msg, params, perms = []) => {
  let classCounter = 0;
  let raceCounter = 0;
  let disciplineCounter = 0;
  let powerCounter = 0;
  //Loads All Powers
  let scribe = function(currentPath) {
    let files = fs.readdirSync(currentPath);
    files.map(function(file) {
      return path.join(currentPath, file);
    }).forEach(function(file) {
      let stats = fs.statSync(file);
      if (stats.isFile()) {
        //so, this is two directories above root, don't ask how i figured this fucking directory nonsense out.
        let book = require(`../../${file}`);
        //lets figure out what kind of data we have, and add it to corresponding db
        //class data loader
        if (book.hasOwnProperty('class')) {
          classCounter++;
          bot.db.table("classLibrary")
            .insert({
              id: book.class.name.replace(/\W/g, '').trim().split(' ').join('-').toLowerCase(),
              data_type: 'class',
              name: book.class.name,
              description: book.class.description,
              icon: book.class.icon,
              races: book.class.races,
              tags: findTags(book.class.description)
            }, {
              conflict: 'replace'
            })
            .error(function(err) {
              bot.log(err);
            })
        }
        //racial data loader
        if (book.hasOwnProperty('race')) {
          raceCounter++;
          bot.db.table("raceLibrary")
            .insert({
              id: book.race.name.replace(/\W/g, '').trim().split(' ').join('-').toLowerCase(),
              data_type: 'race',
              name: book.race.name,
              description: book.race.description,
              icon: book.race.icon,
              classes: book.race.classes,
              tags: findTags(book.race.description)
            }, {
              conflict: 'replace'
            })
            .error(function(err) {
              bot.log(err);
            })
        }
        //discipline data loader
        if (book.hasOwnProperty('discipline')) {
          disciplineCounter++
          let tagSearchString = book.discipline.description + " " + book.discipline.stats_granted.join(' ');
          bot.db.table("disciplineLibrary")
            .insert({
              id: book.discipline.name.replace(/\W/g, '').trim().split(' ').join('-').toLowerCase(),
              data_type: 'discipline',
              name: book.discipline.name,
              type: book.discipline.type,
              description: book.discipline.description,
              icon: book.discipline.icon,
              can_equip: book.discipline.can_equip,
              stats_granted: book.discipline.stats_granted,
              stats_values: book.discipline.stats_values,
              equips_granted: book.discipline.equips_granted,
              slots_granted: book.discipline.slots_granted,
              slots_removed: book.discipline.slots_removed,
              trays_granted: book.discipline.trays_granted,
              trays_removed: book.discipline.trays_removed,
              powers_granted: book.discipline.powers_granted,
              tags: findTags(tagSearchString)
            }, {
              conflict: 'replace'
            })
            .error(function(err) {
              bot.log(err);
            })
        }
        //power data loader
        if (book.hasOwnProperty('power')) {
          powerCounter++
          bot.db.table("powerLibrary")
            .insert({
              id: book.power.name.replace(/\W/g, '').trim().split(' ').join('-').toLowerCase(),
              data_type: 'power',
              name: book.power.name,
              sources: book.power.sources,
              type: book.power.type,
              cast_type: book.power.cast_type,
              duration: book.power.duration,
              cooldown: book.power.cooldown,
              targeting: book.power.targeting,
              max_targets: book.power.max_targets,
              range: book.power.range,
              next_chain: book.power.next_chain,
              cost: book.power.cost,
              description: book.power.tooltip,
              icon: book.power.icon,
              tags: findTags(book.power.tooltip)
            }, {
              conflict: 'replace'
            })
            .error(function(err) {
              bot.log(err);
            })
        }
      } else if (stats.isDirectory()) {
        scribe(file);
      }
    });
  };
  scribe('./data');
  let counterArray = [];
  counterArray.push("The Crowfall Library was updated...")
  counterArray.push(`${classCounter} Class "Books" are in the collection.`)
  counterArray.push(`${raceCounter} Race "Books" are in the collection.`)
  counterArray.push(`${disciplineCounter} Discipline "Books" are in the collection.`)
  counterArray.push(`${powerCounter} Power "Books" are in the collection.`)
  msg.channel.send(counterArray)
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: "howdy",
  description: "Constructs Database with Data stored locally in JSON. Will Upsert ALL Data!",
  usage: "howdy"
};

//takes a string, returns an array of tags
function findTags(searchString) {
  let lexicon = [
    "Stealth", "Severe Bleed", "Moderate Bleed", "Bleed", "Heal", "Knock Down",
    "Snare", "Stun", "Suppress", "Poison", "Reveal", "Exposed", "Burning",
    "Blind", "Mortal Strike", "Health Regeneration", "Weapon Break",
    "Armor Break", "Sin", "Black Mantle", "Burrow", "Barrier", "Invulnerable",
    "Root", "Lifesteal", "Righteousness", "Slow", "Severe Corruption",
    "Moderate Corruption", "Corruption", "Movement Speed", "Attack Power",
    "Support Power", "Retribution", "Fire", "Perception", "Electric", "Crushing",
    "Piercing", "Slashing", "Block", "Parry", "Chain", "Retaliate"
  ];
  let foundTags = [];
  if (!searchString || searchString.length < 0) {
    return foundTags;
  }
  lexicon.forEach(function(dictionaryWord) {
    if (searchString.toLowerCase().includes(dictionaryWord.toLowerCase())) {
      foundTags.push(dictionaryWord);
    }
  })
  return foundTags;
}
