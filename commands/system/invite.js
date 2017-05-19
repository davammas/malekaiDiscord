const Discord = require('discord.js');
const moment = require('moment');

exports.run = (bot, msg, params, perms = []) => {
  let msgarr = [];
  msgarr.push("Server Owners can invite murderBot to their server by visiting this link: ...TBD");
  return msg.channel.send(msgarr).catch(console.log);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "invite",
  description: "Invites murderBot to your server!",
  usage: "invite"
};
