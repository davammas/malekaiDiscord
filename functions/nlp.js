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
  console.log(parsed.out('debug'));
  return parsed;
}

//Crowfall specific terminologies... this will grow to redic lengths.
let lexicon = {
  'centaur': ['Noun', 'Race'],
  'elken': ['Noun', 'Race'],
  'fae': ['Noun', 'Race'],
  'guinecean': ['Noun', 'Race'],
  'half elf': ['Noun', 'Race'],
  'half giant': ['Noun', 'Race'],
  'high elf': ['Noun', 'Race'],
  'human': ['Noun', 'Race'],
  'minotaur': ['Noun', 'Race'],
  'nethari': ['Noun', 'Race'],
  'stoneborn': ['Noun', 'Race'],
  'wood elf': ['Noun', 'Race'],
  'assassin': ['Noun', 'Class'],
  'champion': ['Noun', 'Class'],
  'cleric': ['Noun', 'Class'],
  'confessor': ['Noun', 'Class'],
  'druid': ['Noun', 'Class'],
  'duelist': ['Noun', 'Class'],
  'frostweaver': ['Noun', 'Class'],
  'knight': ['Noun', 'Class'],
  'myrmidon': ['Noun', 'Class'],
  'ranger': ['Noun', 'Class'],
  'templar': ['Noun', 'Class']
}
