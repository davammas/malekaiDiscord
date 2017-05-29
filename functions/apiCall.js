const https = require('https');
exports.cmd = function(options) {
  if (options) {
    let reqGet = https.request(optionsget, function(res) {
        let results = '';
        res.on('data', function(data) {
          results += data.toString();
        });
        res.on('end', function(r) {
          if (results)
            return results;
        });
      })
      .on('error', function(e) {
        return false;
        console.error(e);
      });
    reqGet.end();
  }
}
