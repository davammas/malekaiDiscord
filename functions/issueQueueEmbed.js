const https = require('https');
const Discord = require("discord.js");

exports.opened = function(issueObject) {
  if (!issueObject) return false;
  let newEmbed = new Discord.MessageEmbed();
  newEmbed.setAuthor(`The Malekai Project`, `https://malekai.network`, `https://malekai.network/images/MalekaiBot-Avatar.jpg`);
  newEmbed.setColor('DARKER_GREY');
  newEmbed.setTitle(`New Data Integrity Issue Added`);
  let submittedBy = issueObject.error_user ? issueObject.error_user : issueObject.error_ip;
  let type = issueObject.data_type ? issueObject.data_type : 'unknown';
  let data_id = issueObject.data_id ? issueObject.data_id : 'unknown';
  let error_date = issueObject.error_date ? issueObject.error_date : 'unknown';
  let error_source = issueObject.error_source ? issueObject.error_source : 'unknown';
  let error_message = issueObject.error_message ? issueObject.error_message : '';
  newEmbed.setDescription(`${type} with id: ${data_id} was added to queue by user '${submittedBy}' via ${error_source}. ${error_message}`);
  newEmbed.setTimestamp(error_date);
  return newEmbed;
}

exports.closed = function(issueObject) {
  if (!issueObject) return false;
  let newEmbed = new Discord.MessageEmbed();
  newEmbed.setAuthor(`The Malekai Project`, `https://malekai.network`, `https://malekai.network/images/MalekaiBot-Avatar.jpg`);
  newEmbed.setColor('DARKER_GREY');
  newEmbed.setTitle(`Data Integrity Issue Resolved`);
  let type = issueObject.data_type ? issueObject.data_type : 'unknown';
  let data_id = issueObject.data_id ? issueObject.data_id : 'unknown';
  let error_date = issueObject.error_date ? issueObject.error_date : 'unknown';
  newEmbed.setDescription(`${type} with id: ${data_id} was updated to reflect current values.`);
  newEmbed.setTimestamp(error_date);
  return newEmbed;
}
