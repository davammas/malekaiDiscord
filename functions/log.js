const moment = require('moment');
exports.cmd = function(logMessage) {
  let timestamp = `[${moment().format("DD/MM/YY@HH:mmA")}] `;
  let log = (msg) => {
    console.log(`[${moment().format("DD/MM/YY@HH:mmA")}] ${msg}`);
  };
  logMessage = timestamp + logMessage;
  log(logMessage);
}
