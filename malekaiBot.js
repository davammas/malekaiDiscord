const Discord = require("discord.js");
const nlp = require('natural');

const r = require('rethinkdbdash')({
  host: 'localhost',
  db: 'crowfallData',
  buffer: 5,
  max: 10
});

//discord stuff ;)
let config = require('./config');
const malekaiBot = new Discord.Client();
malekaiBot.config = config;
malekaiBot.commands = new Discord.Collection();
malekaiBot.aliases = new Discord.Collection();
malekaiBot.paths = new Discord.Collection();
malekaiBot.altPaths = new Discord.Collection();

//console logging with timestamps available across the bot's many tendrils.
malekaiBot.log = require('./functions/log.js').cmd;

//api-call to the api.crowfall.wiki service
malekaiBot.callAPI = require('./functions/callAPI.js').cmd;

//creates link to database and assigns it to a parameter of the bot instance.
malekaiBot.db = r;

//loads all commands into the bot (recursively scans the /command folder)
malekaiBot.commandLoader = require('./functions/commandLoader.js').cmd;
malekaiBot.commandLoader(malekaiBot, process.cwd() + '/commands');
malekaiBot.permissionsCheck = require('./functions/permissionsCheck').cmd;

//loads all natural language processing "paths" into bot.
malekaiBot.pathLoader = require('./functions/pathLoader.js').cmd;
malekaiBot.pathLoader(malekaiBot, process.cwd() + '/paths');

//this is the new natural language processing path for using malekaiBot
malekaiBot.on("message", msg => {
  //looks to see if MalekaiBot was referenced in a mention, he will only respond if he was.
  if (msg.mentions.members.get(malekaiBot.user.id)) {
    let scrubbed = msg.cleanContent.trim().replace(malekaiBot.user.username, '').replace(/[^\w\s-]/g, '').toLowerCase();
    let thePath = false;
    malekaiBot.paths.forEach((command, path) => {
      if (scrubbed.includes(path)) {
        thePath = malekaiBot.paths.get(path);
        //lets clean up the known part of the sentence we don't need anymore
        scrubbed = scrubbed.replace(path, '').trim();
        malekaiBot.log(msg, path, scrubbed);
      }
    })
    if (thePath) {
      //lets substract out the search route string, we no longer need it!
      return thePath(malekaiBot, msg, scrubbed);
    } else {
      //replace with default help message for unfound nlp sentences.
      return msg.reply("I did not understand you. (Try: 'search for', 'tell me about', or 'explain')");
    }
  }
})

//this is the old called-command routing processor, looks for specific cf!commands
malekaiBot.on("message", msg => {
  let currentPermissions = false;
  if (msg.channel.type !== "dm") {
    currentPermissions = msg.channel.permissionsFor(malekaiBot.user);
  }
  if (msg.channel.type === "dm" || currentPermissions) {
    if (!msg.content.toLowerCase().startsWith(malekaiBot.config.prefix.toLowerCase())) return;
    let command = msg.content.split(" ")[0].slice(malekaiBot.config.prefix.length).toLowerCase();
    let params = msg.content.split(" ").slice(1);
    let perms = malekaiBot.permissionsCheck(msg, malekaiBot.config.botCreator); //number from 0 to 2
    malekaiBot.log(`${malekaiBot.config.prefix}${command} ${params.join(" ")} executed with permission level ${perms} by ${msg.author.username}`);
    let cmd = false;
    if (malekaiBot.commands.has(command)) {
      cmd = malekaiBot.commands.get(command);
    } else if (malekaiBot.aliases.has(command)) {
      cmd = malekaiBot.commands.get(malekaiBot.aliases.get(command));
    }
    //check to make sure bot can send messages/embeds
    if (cmd && currentPermissions && !currentPermissions.has(["SEND_MESSAGES", "EMBED_LINKS"]))
      malekaiBot.log("malekaiBot must have BOTH Send Message and Embed Link permissions to use this command!");
    //check if command exists (if so check user permissions) and then run it.
    if (cmd) {
      if (perms < cmd.conf.permLevel) {
        malekaiBot.log(`${msg.author.toString()} attempted to run an unauthorized command: ${malekaiBot.config.prefix}${command}`);
        msg.channel.sendMessage(`${msg.author.toString()} you are not authorized to run ${malekaiBot.config.prefix}${command}`);
      } else {
        cmd.run(malekaiBot, msg, params, perms);
      }
      //clean up after yourself malekaiBot!
      if (currentPermissions && currentPermissions.has("MANAGE_MESSAGES")) {
        msg.delete(4000);
      }
    }
  }
});

malekaiBot.on("ready", () => {
  malekaiBot.log("malekaiBot is ready to recieve commands!");
  //force this name across all servers (i'm picky)
  malekaiBot.guilds.forEach(function(aGuild) {
    aGuild.members.get(malekaiBot.user.id).setNickname("malekaiBot");
  })
  //load per guild settings
  malekaiBot.db.table("malekaiBot")
    .filter({
      rowType: 'setting'
    })
    .then(function(botSettings) {
      let issuesChannel = botSettings.filter(function(search) {
        return search.name == "IssuesDestination"
      })
      //setings loader
      malekaiBot.issuesChannel = malekaiBot.channels.get(issuesChannel[0].value) ? malekaiBot.channels.get(issuesChannel[0].value) : false;
      malekaiBot.twitter = [];
      let subscriptions = botSettings.filter(function(search) {
        return search.rowType == "subscription"
      })
      subscriptions.forEach(function(subscription) {
        if (subscription.name == 'twitter')
          malekaiBot.twitter.push(subscription.value);
      })
    })
});

malekaiBot.on("error", (err) => {
  malekaiBot.log(err);
  process.exit();
});

malekaiBot.on("warn", (warn) => {
  malekaiBot.log(warn)
});

malekaiBot.on("disconnect", (disconnect) => {
  malekaiBot.log(disconnect);
  process.exit();
});

malekaiBot.on("reconnecting", (restart) => {
  malekaiBot.log(restart);
  process.exit();
});

malekaiBot.login(config.botToken);

process.on('unhandledRejection', (error) => {
  malekaiBot.log(error);
  process.exit();
});
