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
      let routes = props.routes.join(", ");
      bot.log(`Routes Loaded... "${routes}".`);
      props.routes.forEach(value => {
        bot.paths.set(value.toLowerCase(), props.run);
      });
    } else if (stats.isDirectory()) {
      pathLoader(bot, currentFile);
    }
  }
};
