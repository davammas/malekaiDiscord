//functions library
exports.cmd = function(msg, botCreator) {
  if (msg.author.id === botCreator) return 2; //highest permission level, bot creator detected
  if (msg.guild && msg.guild.ownerID === msg.author.id) return 1; //server owner will always have perms
  if (!msg.guild || !msg.member) return 0 //this is a direct message, no permissions
  return 0; //user qualified for no permissions
};
