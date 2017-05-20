const Discord = require('discord.js');
const moment = require('moment');

exports.run = (bot, msg, params, perms = []) => {
  //Loads All Powers
  let librarian = function(currentPath) {
    log("Researching Powers... " + currentPath);
    let files = fs.readdirSync(currentPath);
    for (let i in files) {
      let currentFile = currentPath + '/' + files[i];
      let stats = fs.statSync(currentFile);
      if (stats.isFile()) {
        let book = require(`${currentFile}`);
        if(book.hasOwnProperty('class')){

          //bot.db.table("classLibrary")
          //upsert?

        }
        if(book.hasOwnProperty('race')){

        }

      } else if (stats.isDirectory()) {
        librarian(currentFile);
      }
    }
  };
  librarian('./powers');
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: "build.library",
  description: "Constructs Database with Data stored locally in JSON. Will Upsert ALL Data!",
  usage: "build.library"
};
