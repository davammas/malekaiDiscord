//functions library
const fs = require("fs");
const config = require('../config');

exports.cmd = function commandLoader(bot, currentPath) {
  console.log("Searching... " + currentPath);
  var files = fs.readdirSync(currentPath);
  for (var i in files) {
    var currentFile = currentPath + '/' + files[i];
    var stats = fs.statSync(currentFile);
    if (stats.isFile()) {
      let props = require(`${currentFile}`);
      bot.log(`Loading Command: ${config.prefix}${props.help.name} ...`);
      bot.commands.set(props.help.name.toLowerCase(), props);
      props.conf.aliases.forEach(alias => {
        bot.aliases.set(alias, props.help.name);
      });
    } else if (stats.isDirectory()) {
      commandLoader(bot, currentFile);
    }
  }
};
