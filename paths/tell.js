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
  let results = false;
  let races = parsed.match('#Race').out('array');
  let classes = parsed.match('#Class').out('array');

  //races search route
  if (races && races.length == 1) {
    apiOptions = {
      host: 'api.crowfall.wiki',
      port: 443,
      path: `/races/${new Buffer(parsed.match('#Race').out('text')).toString('base64')}`,
      method: 'GET'
    };
  }
  if (races && races.length > 1)
    return msg.channel.send("Alas, in the efforts of preventing spam, I cannot provide information on more than one Crowfall race at time.")

  //classes search route
  if (classes && classes.length == 1) {
    apiOptions = {
      host: 'api.crowfall.wiki',
      port: 80,
      path: `/classes/${new Buffer(parsed.match('#Class').out('text')).toString('base64')}`,
      method: 'GET'
    };
  }
  if (classes && classes.length > 1)
    return msg.channel.send("Alas, in the efforts of preventing spam, I cannot provide information on more than one Crowfall class at time.")

  //generic nouns route;
  //let nouns = `**nouns:** ${parsed.normalize().nouns().toSingular().out()}`;
  //need to figure out how to make this "work" better with our route options

  if (apiOptions) {
    results = bot.callAPI(apiOptions);
    if (results) {
      msg.channel.send(results, {
        code: true
      });
    } else {
      msg.channel.send('No results were found, or a route was not determinable');
    }
  }
}
