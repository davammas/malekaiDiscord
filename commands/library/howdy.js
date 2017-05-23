const Discord = require('discord.js');
const moment = require('moment');
const fs = require('fs');
const path = require("path");
let classCounter = 0;
let raceCounter = 0;
let disciplineCounter = 0;
let powerCounter = 0;

exports.run = (bot, msg, params, perms = []) => {
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
              id: book.class.name,
              description: book.class.description,
              icon: book.class.icon,
              races: book.class.races
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
              id: book.race.name,
              description: book.race.description,
              icon: book.race.icon,
              races: book.race.classes
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
          bot.db.table("disciplineLibrary")
            .insert({
              id: book.discipline.name,
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
              powers_granted: book.discipline.powers_granted
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
              id: book.power.name,
              source: book.power.source,
              type: book.power.type,
              cast_type: book.power.cast_type,
              duration: book.power.duration,
              cooldown: book.power.cooldown,
              targeting: book.power.targeting,
              max_targets: book.power.max_targets,
              range: book.power.range,
              next_chain: book.power.next_chain,
              cost: book.power.cost,
              tooltip: book.power.tooltip,
              icon: book.power.icon
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
  counterArray.push(`${classCounter} Class "Books" Found.`)
  counterArray.push(`${raceCounter} Race "Books" Found.`)
  counterArray.push(`${disciplineCounter} Discipline "Books" Found.`)
  counterArray.push(`${powerCounter} Power "Books" Found`)
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
