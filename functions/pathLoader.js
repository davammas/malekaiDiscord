//functions library
const fs = require("fs");

exports.cmd = function pathLoader(bot, currentPath) {
  console.log("Loading Natural Language Processing (NLP) Paths... " + currentPath);
  var files = fs.readdirSync(currentPath);
  for (var i in files) {
    var currentFile = currentPath + '/' + files[i];
    var stats = fs.statSync(currentFile);
    if (stats.isFile()) {
      let props = require(`${currentFile}`);
      let alternatePaths = props.aliases.length > 0 ? `(aka ${props.aliases.join(", ")})` : "";
      bot.log(`Path Loaded for ... "${props.action}" ${alternatePaths}.`);
      bot.paths.set(props.action.toLowerCase(), props);
      props.aliases.forEach(alias => {
        bot.altPaths.set(alias, props.action.toLowerCase());
      });
    } else if (stats.isDirectory()) {
      pathLoader(bot, currentFile);
    }
  }
};
