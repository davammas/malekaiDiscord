const Discord = require('discord.js');
const https = require('https');

exports.run = (bot, msg, params, perms, r = []) => {
  let faq;
  //pricing , general-questions, armor , campaign, campaign-modules,  characters-and-advancement,  economy, combat, crowsandvessels, voxel-farm, embargo, eternal-kingdoms, mounts, parcelbuilder, physics, relics-and-artifacts, skills, strategy, thralls, alpha-and-beta-testing, playtest-support, gifting, 2fa, pledgepackages, trustedtraders
  if(!params[0]){
    /*r.table("crowfallFAQ")
    .filter({
      rowType: 'topic'
    })*/
    return msg.channel.sendMessage("Available options: pricing , general-questions, armor , campaign, campaign-modules,  characters-and-advancement,  economy, combat, crowsandvessels, voxel-farm, embargo, eternal-kingdoms, mounts, parcelbuilder, physics, relics-and-artifacts, skills, strategy, thralls, alpha-and-beta-testing, playtest-support, gifting, 2fa, pledgepackages, trustedtraders");
  }

  let optionsget = {
      host : 'crowfall.com', // here only the domain name
      port : 443,
      path : `/api/faq/en/${params[0]}`, // the rest of the url with parameters if needed
      method : 'GET' // do GET
  };
  let reqGet = https.request(optionsget, function(res) {
      let respContent = '';
      console.log("statusCode: ", res.statusCode);
      // uncomment it for header details
      console.log("headers: ", res.headers);
      res.on('data', function(data) {
        respContent += data.toString() ; //data is a buffer instance
      });
      res.on('end', function(r) {
        faq = JSON.parse(respContent);
        let theQuestions = [];
        faq.forEach(question=>{
          theQuestions.push(question.faqQuestion);
        })
        if(theQuestions!=[])
          msg.channel.sendMessage(theQuestions);
        console.info('\n\nCall completed');
      }) ;
  })
  .on('error', function(e) {
      console.error(e);
  });
  reqGet.end();
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "faq",
  description: "Provides FAQ details from Crowfall website",
  group: 'Research',
  usage: "faq topic"
};
