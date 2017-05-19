const Discord = require("discord.js");
const config = require('./config');
const r = require('rethinkdbdash')({
  host: 'localhost',
  db: 'crowfallData'
});
const murderBot = new Discord.Client();
murderBot.commands = new Discord.Collection();
murderBot.aliases = new Discord.Collection();

//function loading commands
murderBot.log = require('./functions/log.js').cmd;
murderBot.db = r;
const commandLoader = require('./functions/commandLoader.js');
murderBot.commandLoader = commandLoader.cmd;
murderBot.commandLoader(murderBot, process.cwd() + '/commands');
murderBot.permissionsCheck = require('./functions/permissionsCheck').cmd;

murderBot.on("message", msg => {
  let currentPermissions = false;
  if (msg.channel.type !== "dm") {
    currentPermissions = msg.channel.permissionsFor(murderBot.user);
  }
  if (msg.channel.type === "dm" || currentPermissions) {
    if (!msg.content.toLowerCase().startsWith(config.prefix.toLowerCase())) return;
    let command = msg.content.split(" ")[0].slice(config.prefix.length).toLowerCase();
    let params = msg.content.split(" ").slice(1);
    let perms = murderBot.permissionsCheck(msg, config.botCreator); //number from 0 to 2
    murderBot.log(`${config.prefix}${command} ${params.join(" ")} executed with permission level ${perms} by ${msg.author.username}`);
    let cmd = false;
    if (murderBot.commands.has(command)) {
      cmd = murderBot.commands.get(command);
    } else if (murderBot.aliases.has(command)) {
      cmd = murderBot.commands.get(murderBot.aliases.get(command));
    }
    //check to make sure bot can send messages/embeds
    if (cmd && currentPermissions && !currentPermissions.hasPermissions(["SEND_MESSAGES", "EMBED_LINKS"]))
      murderBot.log("murderBot must have BOTH Send Message and Embed Link permissions to use this command!");
    //check if command exists (if so check user permissions) and then run it.
    if (cmd) {
      if (perms < cmd.conf.permLevel) {
        murderBot.log(`${msg.author.toString()} attempted to run an unauthorized command: ${config.prefix}${command}`);
        msg.channel.sendMessage(`${msg.author.toString()} you are not authorized to run ${config.prefix}${command}`);
      } else {
        cmd.run(murderBot, msg, params, perms);
      }
      //clean up after yourself murderBot!
      if (currentPermissions && currentPermissions.hasPermission("MANAGE_MESSAGES")) {
        msg.delete(4000);
      }
    }
  }
});

murderBot.on("ready", () => {
  murderBot.log("murderBot is ready to recieve commands!");
});

murderBot.on("error", (err) => {
  murderBot.log(err);
});

murderBot.on("warn", (warn) => {
  murderBot.log(warn)
});

murderBot.on("disconnect", (disconnect) => {
  murderBot.log(disconnect);
  process.exit();
});

murderBot.on("reconnecting", (restart) => {
  murderBot.log(restart);
  process.exit();
});

murderBot.login(config.botToken);

process.on('unhandledRejection', (error) => {
  murderBot.log(error);
});
