const Discord = require('discord.js');
const moment = require('moment');
const fs = require('fs');
const path = require("path");

exports.run = (bot, msg, params, perms = []) => {
  bot.db.table("classLibrary")
    .delete()
    .run()
    .error(function(err) {
      bot.log(err);
    })
  //racial data loader
  bot.db.table("raceLibrary")
    .delete()
    .run()
    .error(function(err) {
      bot.log(err);
    })
  //discipline data loader
  bot.db.table("disciplineLibrary")
    .delete()
    .run()
    .error(function(err) {
      bot.log(err);
    })
  bot.db.table("powerLibrary")
    .delete()
    .run()
    .error(function(err) {
      bot.log(err);
    })
  msg.channel.send("The library was burned to its foundation. Nothing survived.");
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: "arson",
  description: "Deletes the contents of all Databases.",
  usage: "arson"
};
