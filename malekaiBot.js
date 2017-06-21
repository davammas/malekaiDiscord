const Discord = require("discord.js");
const config = require('./config');
const r = require('rethinkdbdash')({
  host: 'localhost',
  db: 'crowfallData',
  buffer: 5,
  max: 10
});

//discord stuff ;)
const malekaiBot = new Discord.Client();
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
malekaiBot.nlp = require('./functions/nlp.js').cmd;
malekaiBot.pathLoader = require('./functions/pathLoader.js').cmd;
malekaiBot.pathLoader(malekaiBot, process.cwd() + '/paths');

//this is the new natural language processing path for using malekaiBot
//work in process... probably wont work ever, sorry for wasting your time.
malekaiBot.on("message", msg => {
  //looks to see if MalekaiBot was referenced in a mention, he will only respond if he was.
  if (msg.mentions.members.get(malekaiBot.user.id)) {
    //we need a returned parse here, need the results to move forward with this handler
    let parsed = malekaiBot.nlp(msg, malekaiBot);
    let theverbs = parsed.normalize().verbs().out('array');
    let path = false;
    theverbs.forEach(function(verb) {
      if (!path) {
        if (malekaiBot.paths.has(verb)) {
          path = malekaiBot.paths.get(verb);
        } else if (malekaiBot.altPaths.has(verb)) {
          path = malekaiBot.paths.get(malekaiBot.altPaths.get(verb));
        }
        console.log(verb);
      }
    })
    if (path) {
      return path.run(malekaiBot, msg, parsed);
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
    if (!msg.content.toLowerCase().startsWith(config.prefix.toLowerCase())) return;
    let command = msg.content.split(" ")[0].slice(config.prefix.length).toLowerCase();
    let params = msg.content.split(" ").slice(1);
    let perms = malekaiBot.permissionsCheck(msg, config.botCreator); //number from 0 to 2
    malekaiBot.log(`${config.prefix}${command} ${params.join(" ")} executed with permission level ${perms} by ${msg.author.username}`);
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
        malekaiBot.log(`${msg.author.toString()} attempted to run an unauthorized command: ${config.prefix}${command}`);
        msg.channel.sendMessage(`${msg.author.toString()} you are not authorized to run ${config.prefix}${command}`);
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
  malekaiBot.guilds.forEach(function(aGuild) {
    aGuild.members.get(malekaiBot.user.id).setNickname("malekaiBot");
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
