const Discord = require("discord.js");
const config = require('./config');
const r = require('rethinkdbdash')({
  host: 'localhost',
  db: 'crowfallData'
});
const malekaiBot = new Discord.Client();
malekaiBot.commands = new Discord.Collection();
malekaiBot.aliases = new Discord.Collection();

//function loading commands
malekaiBot.log = require('./functions/log.js').cmd;
malekaiBot.db = r;
const commandLoader = require('./functions/commandLoader.js');
malekaiBot.commandLoader = commandLoader.cmd;
malekaiBot.commandLoader(malekaiBot, process.cwd() + '/commands');
malekaiBot.permissionsCheck = require('./functions/permissionsCheck').cmd;

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
    if (cmd && currentPermissions && !currentPermissions.hasPermissions(["SEND_MESSAGES", "EMBED_LINKS"]))
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
      if (currentPermissions && currentPermissions.hasPermission("MANAGE_MESSAGES")) {
        msg.delete(4000);
      }
    }
  }
});

malekaiBot.on("ready", () => {
  malekaiBot.log("malekaiBot is ready to recieve commands!");
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
