const Discord = require('discord.js');
const moment = require('moment');
const fs = require('fs');
const path = require("path");

exports.run = (bot, msg, params, perms = []) => {
  //class list
  bot.db.table("classLibrary").run()
  .then(function(classes){
    msg.channel.send(`Classes: ${classes.length}`);
  })
  .error(function(err){
    console.log(err);
  })
  //disc list
  bot.db.table("disciplineLibrary").run()
  .then(function(disciplines){
    msg.channel.send(`Disciplines: ${disciplines.length}`)
  })
  .error(function(err){
    console.log(err);
  })
  //joined list
  bot.db.table("classLibrary").union(bot.db.table('disciplineLibrary')).run()
  .then(function(results){
    let list = [];
    results.map(function(item){
      list.push(`${item.id}`);
    })
    msg.channel.send(`WITH THEIR POWERS COMBINED!: ${list.length}\n${list.join(", ")}`);
  })
  .error(function(err){
    console.log(err);
  })
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: "jointest",
  description: "Joins two Databases Together!",
  usage: "jointest"
};
