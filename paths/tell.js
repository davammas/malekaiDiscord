const https = require('https');
/* Route: "tell" aka Search Route
This is a natural language processing path.
It is activated when the NLP parse detects a verb with one of the following
"action" verbs in it. When that happens, it searches for the corresponding
crowfalll-specific terms found within a lexicon I defined, and if not, does a
generic, expensive and hopefully avoidable search on every ID in every Library
we have.
*/
exports.action = "tell";
exports.aliases = ["show", "detail", "search"];
exports.run = (bot, msg, parsed) => {
  let apiOptions = false;
  let races = parsed.match('#Race').out('array');
  let classes = parsed.match('#Class').out('array');
  let results;
  console.log(classes, races);
  //races search route
  if (races && races.length == 1) {
    bot.callAPI(`https://api.crowfall.wiki/races/${races[0].split(' ').join('_')}`)
      .then(function(results) {
        msg.channel.send(results, {
          code: true
        });
      })
      .catch(function(err) {
        console.log(err);
      });
  }
  if (races && races.length > 1)
    return msg.channel.send("Alas, in the efforts of preventing spam, I cannot provide information on more than one Crowfall race at time.")

  //classes search route
  if (classes && classes.length == 1) {
    bot.callAPI(`https://api.crowfall.wiki/classes/${classes[0]}`)
      .then(function(results) {
        msg.channel.send(results, {
          code: true
        });
      })
      .catch(function(err) {
        console.log(err);
      });
  }
  if (classes && classes.length > 1)
    return msg.channel.send("Alas, in the efforts of preventing spam, I cannot provide information on more than one Crowfall class at time.")

}
