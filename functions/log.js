const moment = require('moment');
const log = (msg) => {
  console.log(`[${moment().format("DD/MM/YY@HH:mmA")}] ${msg}`);
};

exports.cmd = function(guild, logMessage) {
  let defaultChannel = guild.defaultChannel;
  if (guild.channels.find("name", "bot_logs")) {
    defaultChannel = guild.channels.find("name", "bot_logs");
  }
  //if a channel exists, send a log about it
  let timestamp = `[${moment().format("DD/MM/YY@HH:mmA")}] `;
  logMessage = timestamp + "**" + logMessage + "**";
  if (defaultChannel) {
    defaultChannel.sendMessage(logMessage);
  }
  log(logMessage);
}
