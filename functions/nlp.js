const moment = require('moment');
const nlp = require("compromise");
/*
Natural Language Processor subroutine. Returns a parsed variable. This file
contains the lexicon needed to assign Crowfall-specific words and terminologies
into the NLP library "dictionary";
*/

exports.cmd = function(msg, bot) {
  let botMember = msg.guild.members.get(bot.user.id);
  let botName = botMember.nickname ? botMember.nickname : bot.user.username;
  let removeBotName = msg.cleanContent.replace(`@${botName}`, "").trim();
  var parsed = nlp(removeBotName, lexicon).dehyphenate();
  return parsed;
}

//Crowfall specific terminologies... this will grow to redic lengths.
let lexicon = {
  'centaur': ['Singular', 'Race'],
  'elken': ['Singular', 'Race'],
  'fae': ['Singular', 'Race'],
  'guinecean': ['Singular', 'Race'],
  'half elf': ['Singular', 'Race'],
  'half giant': ['Singular', 'Race'],
  'high elf': ['Singular', 'Race'],
  'human': ['Singular', 'Race'],
  'minotaur': ['Singular', 'Race'],
  'nethari': ['Singular', 'Race'],
  'stoneborn': ['Singular', 'Race'],
  'wood elf': ['Singular', 'Race'],
  'assassin': ['Singular', 'Class'],
  'champion': ['Singular', 'Class'],
  'cleric': ['Singular', 'Class'],
  'confessor': ['Singular', 'Class'],
  'druid': ['Singular', 'Class'],
  'duelist': ['Singular', 'Class'],
  'frostweaver': ['Singular', 'Class'],
  'knight': ['Singular', 'Class'],
  'myrmidon': ['Singular', 'Class'],
  'ranger': ['Singular', 'Class'],
  'templar': ['Singular', 'Class']
}
