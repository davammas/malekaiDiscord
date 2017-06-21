const Discord = require('discord.js');
const moment = require('moment');
const fs = require('fs');
const path = require("path");

exports.run = (bot, msg, params, perms = []) => {
  let search = params.join('_').toLowerCase();
  bot.callAPI(`https://api.crowfall.wiki/search?name=${search}`)
    .then(function(results) {
      if (!results) return msg.channel.send("No match was found, Sorry!");
      let theEmbed = new Discord.RichEmbed();

      //General Fields
      theEmbed.setColor(11141396);
      theEmbed.setTitle(`__**${results.name}**__`);
      if (results.description)
        theEmbed.setDescription($ {
          results.description
        });
      if (results.icon != "")
        theEmbed.setThumbnail(results.icon);

      //Discipline Specific Fields
      if (results.stats_granted.length > 0) {
        let statsGranted = [];
        let c = 0;
        results.stats_granted.forEach(function(stat) {
          statsGranted.push(`${stat}: ${stats_values[c]}`);
          c++;
        })
        theEmbed.addField(`__**Stats Granted:**__`, statsGranted, true);
      }
      if (results.data_type == 'discipline' && results.powers_granted)
        theEmbed.addField('__**Powers Added:**__', results.powers_granted.join(', '), false);
      if (results.slots_granted)
        theEmbed.addField('__**Slots Granted:**__', results.slots_granted.join(', '), false);
      if (results.stats_granted.length > 0) {
        let statsGranted = [];
        let c = 0;
        results.stats_granted.forEach(function(stat) {
          statsGranted.push(`${stat}: ${stats_values[c]}`);
          c++;
        })
        theEmbed.addField(`__**Stats Granted:**__`, statsGranted, false);
      }
      if (results.slots_granted)
        theEmbed.addField('__**Slots Granted:**__', results.slots_granted.join(', '), false);
      theEmbed.setFooter(`Powered by the Malekai Project - https://crowfall.wiki​`, bot.user.avatarURL);
    })
    .catch(function(err) {
      console.log(err);
    })
    .error(function(err) {
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
  name: "research",
  description: "Searches API.Crowfall.wiki for a match",
  usage: "research something to search for"
};
