const https = require('https');
/* Route: Search
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
  let optionsget = false;
  let races = parsed.match('#Race').out('array');
  let classes = parsed.match('#Class').out('array');

  if (races && races.length == 1) {
    optionsget = {
      host: 'api.crowfall.wiki',
      port: 443,
      path: `/races/${new Buffer(parsed.match('#Race').out('text')).toString('base64')}`,
      method: 'GET'
    };
  }
  if (classes && classes.length == 1) {
    optionsget = {
      host: 'api.crowfall.wiki',
      port: 80,
      path: `/classes/${new Buffer(parsed.match('#Class').out('text')).toString('base64')}`,
      method: 'GET'
    };
  }

  //we need to figure out a way to build out an enriched embed for responding
  //with multiple data points. aka, do we want them to get results for 10 races.
  if (races && races.length > 1)
    return msg.channel.send("Alas, in the efforts of preventing spam, I cannot provide information on more than one Crowfall race at time.")
  if (classes && classes.length > 1)
    return msg.channel.send("Alas, in the efforts of preventing spam, I cannot provide information on more than one Crowfall class at time.")

  //lets do the api request!
  //make sure we have a route to the api selected or get the hell out.
  if (optionsget) {
    let reqGet = https.request(optionsget, function(res) {
        let results = '';
        bot.log("statusCode: ", res.statusCode);
        bot.log("headers: ", res.headers);
        res.on('data', function(data) {
          results += data.toString();
        });
        res.on('end', function(r) {
          if (results)
            msg.channel.send(results, {
              code: true
            });
          bot.log('\nCall completed');
        });
      })
      .on('error', function(e) {
        console.error(e);
      });
    reqGet.end();
  }
}
