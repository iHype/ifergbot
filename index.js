const botconfig = require("./botconfig.json");
var define = require('define-it').definitions;
const ci = require('case-insensitive');
const Client = require('fortnite');
const fortnite = new Client(process.env.FORTNITETRACKER);
var unscramble = require("unscramble")
var Filter = require('bad-words'),
    filter = new Filter({ placeHolder: "x"});
filter.addWords(['niga', 'nogger', 'n1gg4', "n1gga", "nigg4", "nig", "suck my", "niiiiiigggaaa", "niiigeeeeeeeeeer"]);
const google = require("google");
var PastebinAPI = require('pastebin-js')
pastebin = new PastebinAPI(process.env.dev_key_pastebin);
const replace = require('replace-in-file');
const Discord = require("discord.js");
const translate = require('google-translate-api');
const async = require("async");
const fs = require("fs");
const talkedRecently = new Set();
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();


bot.on("ready", async ready => {
  console.log("Bot ready")//;
  bot.user.setActivity('-help\nFergFam', { type: 'WATCHING' })
  .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
})
bot.on("message", async message => {
  var logs = fs.readFileSync("./log.txt", "utf-8");
  if(message.author.bot) return;
  if(message.channel.type === "dm") return message.channel.send("DM commands do not work, to use my bot please join the FergFam to use it\nhttps://www.discord.gg/fergfam");
  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray['0'];
  let args = messageArray.slice(1);
  let translateArg = args.slice(1) || messageArray.slice(2);
  let tragetLanguage = args['0'] || messageArray['1'];
  var commandbans = fs.readFileSync("./commandbans.txt", "utf-8");
  fs.appendFile("./log.txt", message.author + " with username " + message.author.username + " wrote a message at " + message.createdAt +  ":\n" + message + "\nin guild: " + message.guild.name + " in channel: " + message.channel + " with the name: #" + message.channel.name + "\n\n");
  if(cmd.startsWith("-") && commandbans.includes(message.author.id)) {
      message.delete();
      message.author.send(message.author + ": you have been banned from using commands of this bot\nTo regain access please DM <@430447525800181762>, <@299495028756054016>, <@453970692266786816> or any of the Mods/Admins of Ferg.");
      return; }
  
  

 if(cmd == `${prefix}unmute`){
      if(message.author.id == "299495028756054016" || message.author.id == "430447525800181762" || message.author.id == "453970692266786816" || message.author.hasPermission("KICK_MEMBERS")) {
  let muser =  message.mentions.members.first() || message.guild.members.get(args[0]);
        let unmrole = message.guild.roles.find('name', "muted");
        muser.removeRole(unmrole);
        message.delete();
 } }
    
  if(cmd == `${prefix}languagecodes`) {
    message.channel.send(message.author + ", check DM's");
    return message.author.sendMessage("Check https://cloud.google.com/translate/docs/languages for language codes.");
  }
  
    if(cmd == `${prefix}fortnitetrack`){
        let platform = args[0]
        let fortniteTracked = args[1];
        let fortnitetrack = fortnite.user(fortniteTracked, platform);
        message.channel.send(fortnitetrack);
    }
  if (cmd == `${prefix}banlist`) {
  let bannedUsers = commandbans.toString();
  message.channel.send("These are the **id's** of the current banned members from using iFerg Bot\n" + bannedUsers);
  
  }
  
  if(cmd == `${prefix}commandunban`) {
   let userToUnban = message.mentions.members.first();
    let usertounbanid = userToUnban.id;
  if(message.author.id == "299495028756054016" || message.author.id == "430447525800181762" || message.author.id == "453970692266786816" || message.author.id == "341602886935117835"){
      var options = {
        files: './commandbans.txt',
        from: usertounbanid,
        to: '',
      };
      try {
        const changes = replace.sync(options);
        message.channel.send('Successfully unbanned ' + userToUnban + " from using commands.");

      }
      catch (error) {
        console.error('Error occurred:', error);
      }
  }else {return message.channel.send(message.channel.author + ": no premission");}
  }
  if (cmd == `${prefix}commandban`) {
  if (message.author.id == "299495028756054016" || message.author.id == "430447525800181762" || message.author.id == "453970692266786816" || message.author.id == "341602886935117835") {
  let userToBan = message.mentions.members.first();
  let userToBanID = userToBan.id;
  if(!userToBan) {
    return message.channel.send("Couldn't find user.");
  }
    try{
  fs.appendFile("./commandbans.txt", userToBanID + "\n")
      message.channel.send("Successfully added " + userToBan + " to the banned list.");
    }catch(err) {message.channel.send(err)}
  
  } else {return message.channel.send("No permission")}

  } 
 if (cmd == `${prefix}translate`) {
          if(translateArg.includes("@everyone")) {
        translateArg.splice(/@everyone/g, "@everyoné");
        
    }
    if (translateArg.includes("@here")) {
        translateArg.splice(/@here/g,"@heré");
    }
     if(args.includes("<@&282292207367618560>") || args.includes("<@&432602872274747403>") || args.includes("<@&348164686253916172>") || args.includes("<@&333690877044064259>") || args.includes("<@&325775728987865099>") || args.includes("<@&348156399811035167>") || args.includes("<@&439764460379439116>") || args.includes("<@&481534348303007754>")) {
  message.delete();
   message.author.send("Just... why");
    return;
  }  
translate(translateArg + "", {to: tragetLanguage + ""}).then(res => {

        message.channel.send(message.author + ": that translated to " + tragetLanguage + " =\n" + filter.clean(res.text));
    
}).catch(err => {
    console.error(err);
});

     
     return
     }
    if(cmd === `${prefix}define`){
    let wordToDefine = args[0].join(" ").toString();
    define(wordToDefine, function(err, res) {
    if (err) console.error(err);
    if (res) console.log(res);
});
    }
    if(cmd === `${prefix}whitelistword`) {
    if(message.author.id == "299495028756054016" || message.author.id == "437254213689540610" || message.author.id == "430447525800181762" || message.author.id == "341602886935117835" || message.author.id == "393412463153905675" || message.author.id === "453970692266786816"){
        try{
    filter.removeWords(args.join(" ").toString());
        message.channel.send(message.author + ": succesfully whitelisted word(s): " + args);
        }catch(err){
        message.channel.send("Error occurred\n" + err);
            console.log(err)
        }
    }}
     if(cmd === `${prefix}unscramble`) {
     let toUnscramble = args[0];
     message.channel.send(unscramble(toUnscramble).join(" ").toString())
     }
  if(cmd === `${prefix}blacklistword`) {
  if(message.author.id == "299495028756054016" || message.author.id == "437254213689540610" || message.author.id == "430447525800181762" || message.author.id == "341602886935117835" || message.author.id == "393412463153905675" || message.author.id === "453970692266786816"){
  let wordsToBlacklist = args;
      filter.addWords(wordsToBlacklist);
  }
message.channel.send(message.author + ": successfully blacklisted word(s): " + args);
  }

  if(cmd === `${prefix}logs`) {
      if(message.author.id === "430447525800181762" || message.author.id === "299495028756054016" || message.author.id === "453970692266786816") {
message.author.sendFile('./log.txt');
      message.delete(1);
  } }
  
  if(cmd === `${prefix}nick`) {
  if(message.author.id == "299495028756054016" || message.author.id == "437254213689540610" || message.author.id == "430447525800181762" || message.author.id == "341602886935117835" || message.author.id == "393412463153905675" || message.author.id === "453970692266786816"){
    let userNick = message.mentions.members.first();

    userNick.setNickname(translateArg.join(" ").toString())
      message.delete(1);
  }}
  if(cmd === `${prefix}texttobinary`) {
var ABC = {
  toAscii: function(bin) { 
    
  },
  toBinary: function(str, spaceSeparatedOctets) {
    return str.replace(/[\s\S]/g, function(str) {
      str = ABC.zeroPad(str.charCodeAt().toString(2));
      return !1 == spaceSeparatedOctets ? str : str + " "
    })
  },
  zeroPad: function(num) {
    return "00000000".slice(String(num).length) + num
  }
};
  if(args.includes("<@&282292207367618560>") || args.includes("<@&432602872274747403>") || args.includes("<@&348164686253916172>") || args.includes("<@&333690877044064259>") || args.includes("<@&325775728987865099>") || args.includes("<@&348156399811035167>") || args.includes("<@&439764460379439116>") || args.includes("<@&481534348303007754>") || ci(args).includes("nig") || ci(args).includes("nige") || ci(args).includes("nogger") || ci(args).includes("nigga") || ci(args).includes("nigge") || ci(args).includes("nigger") || ci(args).includes("niger")) {
  message.delete();
   message.author.send("Just... why");
    return;
  }  
 var textToBinary = ABC.toBinary(args.join(" "));
        message.channel.send(message.author + ": that translated to binary is:");
        message.channel.send(textToBinary);
    
};
   if(cmd === `${prefix}binarytotext`) {
  var ABC = {
  toAscii: function(bin) {
    return bin.replace(/\s*[01]{8}\s*/g, function(bin) {
      return String.fromCharCode(parseInt(bin, 2))
    })
  },
  toBinary: function(str, spaceSeparatedOctets) {
    return str.replace(/[\s\S]/g, function(str) {
      str = ABC.zeroPad(str.charCodeAt().toString(2));
      return !1 == spaceSeparatedOctets ? str : str + " "
    })
  },
  zeroPad: function(num) {
    return "00000000".slice(String(num).length) + num
  }
};
       if(args.includes("@everyone")) {
        args.splice(/@everyone/g, "@everyoné");
        
    }
       if(args.includes("<@&282292207367618560>") || args.includes("<@&432602872274747403>") || args.includes("<@&348164686253916172>") || args.includes("<@&333690877044064259>") || args.includes("<@&325775728987865099>") || args.includes("<@&348156399811035167>") || args.includes("<@&439764460379439116>") || args.includes("<@&481534348303007754>") || ci(args).includes("nig") || args.includes("nige") || args.includes("nogger") || args.includes("nigga") || args.includes("nigge") || args.includes("nigger") || args.includes("niger")) {
  message.delete();
   message.author.send("Just... why");
    return;
  }  
    if (args.includes("@here")) {
        args.splice(/@here/g,"@heré");
    }
 var binaryToText = ABC.toAscii(args.join(" "));
        message.channel.send(message.author + ": that translated to normal text is:");
        message.channel.send(filter.clean(binaryToText)); }
        
          if(cmd == `${prefix}mute`) {
    if(message.author.id == "299495028756054016" || message.author.id == "430447525800181762" || message.author.id == "453970692266786816" || message.author.hasPermission("KICK_MEMBERS")) {
  let mUser =  message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!mUser) {return}
  let muterole = message.guild.roles.find('name', "muted");
      if(!muterole) {
      try{
        muterole = await message.guild.createRole({
        name: "muted",
        color: "#000000",
        permissions:[]
        })
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(muterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      } catch(err) {console.log(err)}
      }
      let muteroleid = muterole.id;
  await(mUser.addRole(muteroleid));
      message.delete();
  }}

  
  if (cmd == "<@481524871038369803>" || cmd == "<@!481524871038369803>") {
   return message.channel.send(message.author + " no u");
  }
  
    if(cmd == `${prefix}unban` && message.author.id == "430447525800181762") {
    try {
    let ubUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    console.log(ubUser);
    message.guild.unban('482027644406464512');
          message.delete().catch(O_o=>{});
    return;
    } catch(err){return console.error(err);}
  }
  
  if(cmd == `${prefix}ban` && message.author.id == "430447525800181762") {
    try {
    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    console.log(bUser);
    bUser.ban();
          message.delete().catch(O_o=>{});
    return;
    } catch(err){return console.error(err);}
  }

/* if(cmd == `${prefix}setreportchannel`) {
    if(!message.member.hasPermission("VIEW_AUDIT_LOG")) return message.channel.send(message.author + ": You can't do that! You are missing the permission:\nVIEW_AUDIT_LOG");
    global.reportschannel = args["0"];
   message.channel.send(message.author + ": the report channel has been set to " + reportschannel);
 }
if(cmd == `${prefix}translate`) {
    translate(translateArg + "", {to: tragetLanguage + ""}).then(res => {
        message.channel.send(message.author + ": that translated =\n" + res.text);
    }).catch(err => {
        console.error(err);
    });
}
 if(messageArray.includes("<@478957124542529556>")) {
     message.channel.send(message.author + " no u");
 }
*/
 if(cmd === `${prefix}credits`) {
     let botembed = new Discord.RichEmbed()
     .setTitle("Access ranks")
     .setColor("#00ff19")
     .addField("Access level 3: ", "<@430447525800181762>\n<@299495028756054016>\n<@!453970692266786816>")
     .addField("Access level 2:", "** **")
     .addField("Access level 1", "<@!341602886935117835>\n<@!393412463153905675>\n<@437254213689540610>");
     message.channel.send(botembed);
 }
    
    if(cmd === `${prefix}fixyt` && message.author.id === "430447525800181762") {
  let fixit = message.guild.roles.find('name', "Youtuber/Streamer/Pro Player");           
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(fixit, {
            SEND_MESSAGES: null,
            ADD_REACTIONS: null
          });
        });
    message.delete(1);
    }
if(cmd === `${prefix}say`) {
    
    if(args.includes("@everyone")) {
        args.splice(/@everyone/g, "@everyoné");
        
    }

    if(translateArg.includes("@everyone")) {
        translateArg.splice(/@everyone/g, "@everyoné");
        
    }
    if (args.includes("@here")) {
        args.splice(/@here/g,"@heré");
    }     

  
  

  if(args.includes("<@&282292207367618560>") || args.includes("<@&432602872274747403>") || args.includes("<@&348164686253916172>") || args.includes("<@&333690877044064259>") || args.includes("<@&325775728987865099>") || args.includes("<@&348156399811035167>") || args.includes("<@&439764460379439116>") || args.includes("<@&481534348303007754>")) {
  message.delete();
   message.author.send("Just... why");
    return;
  }  
  let argsSay = args.join(" ");  
    message.channel.send(filter.clean(argsSay));
    console.log(message.author + " just made the bot say:\n" + argsSay);
}

 if(cmd === `${prefix}gayrate` && args == "") {
     if (message.author.id == "299495028756054016" || message.author.id == "430447525800181762" || message.author.id == "453970692266786816"  || message.author.id == "424953131386798080" || message.author.id == "341602886935117835" && args == "") {
     let botembed = new Discord.RichEmbed()
    .setTitle("Gayrate machine")
    .setColor("#36393F")
    .setDescription(message.author.username + " is 0% gay. Always");
     return message.channel.send(botembed);
     }
    if(cmd === `${prefix}gayrate` && args == "") {
     if (message.author.id == "440191033591070732" && args == "") {
     let botembed = new Discord.RichEmbed()
    .setTitle("Gayrate machine")
     .setColor("#36393F")
    .setDescription(message.author.username + " is 100% gay. Always");
     return message.channel.send(botembed);
     }
    let randomnumber = Math.random();
    let gayrate = randomnumber.toString().slice([-2]);
    if (gayrate.startsWith("0")) {
        gayrate = randomnumber.toString().slice([-1]);
    }
    let userGayRate = message.author.username;
    let botembed = new Discord.RichEmbed()
    .setTitle("Gayrate machine")
    .setColor("#36393F")
    .setDescription(userGayRate + " is " + gayrate + "% gay");

    message.channel.send(botembed);
 }}
 if(cmd === `${prefix}gayrate`) {
      if (args == "<@299495028756054016>" || args == "<@430447525800181762>" || args == "<@453970692266786816>" || args == "<@!424953131386798080>" || args == "<@!341602886935117835>" || args == "<@341602886935117835>") {
     let botembed = new Discord.RichEmbed()
    .setTitle("Gayrate machine")
    .setColor("#36393F")
    .setDescription(args + " is 0% gay. Always");
     message.channel.send(botembed);
     return
     }else if (args == "<@!440191033591070732>") {
    let botembed = new Discord.RichEmbed()
    .setTitle("Gayrate machine")
    .setColor("#36393F")
    .setDescription(args + " is 100% gay. Always");
     message.channel.send(botembed);
     return
       } else {
         
    let gayrateUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!gayrateUser) return;
    let randomnumber = Math.random();
    let gayrate = randomnumber.toString().slice([-2]);
    if (gayrate.startsWith(0)) {
        gayrate = randomnumber.toString().slice([-1]);
    }
    let botembed = new Discord.RichEmbed()
    .setTitle("Gayrate machine")
    .setColor("#36393F")
    .setDescription(gayrateUser + " is " + gayrate + "% gay.");
    message.channel.send(botembed);
    }}


/*
        if(cmd === `${prefix}report`) {
        if(reportschannel.guild !== message.channel.guild) return message.channel.send(message.author +  ": reports channel for this server not set, please use `-setreportschannel` `#channel` to set a reports channel");
        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!rUser) return message.channel.send("Couldn't find user.");
        let rReason  = args.join(" ").slice(22);
        let bicon = rUser.displayAvatarURL;
        let reportEmbed = new Discord.RichEmbed()
        .setColor("#ff0000")
        .setDescription("**REPORT**")
        .addField("Reported user:", `${rUser} with ID: ${rUser.id}`)
        .addField("Reported by:", `${message.author} with ID: ${message.author.id}`)
        .addField("Reason:", rReason)
        .addField("Channel", message.channel)
        .addField("Time", message.createdAt)
        .setThumbnail(bicon);
        message.author.send("This is a copy that has been sent to the staff team");
        message.author.send(reportEmbed);
        message.delete().catch(O_o=>{});
        global.reportschannelID = reportschannel.slice(2, -1);
        bot.channels.get(reportschannelID).send(reportEmbed);
        }
     */

 if(cmd == `${prefix}help`){
    let bicon = bot.displayAvatarURL;
    message.channel.send(`<@${message.author.id}>, check your DM's`);
    let botembed = new Discord.RichEmbed()
    .setColor("#32b0ff")
    .addField("`-help`", "shows this help message containing all commands\n")
    .addField("`-binarytotext` `01110100 01100101 01111000 01110100`","tranlsates the binary provided into readable words/sentences")
    .addField("`texttobinary` `text`","translates the provided text to binary")
    .addField("`unscramble` `etxt`", "unscrambles the text given")
    //.addField("`-setreportchannel`","[requires permission: VIEW_AUDIT_LOG] sets the reports channel to `channel`")
    .addField("`-translate` `target-language` `text to be translated`","\ntranslates `text to be translated` to `target-language` for example: `-translate` `nl` `Hello` this translates `Hello` to `nl` (nl = Dutch)\n")
    //.addField("`-report` `@user` `reason`", "reports @user to the staff with reason provided (please provide proof within ur reason)\n")
    .addField("`-botinfo`", "shows bot info\n")
    //.addField("`-streamtime`", "shows streamtime of iFerg\n")
    .addField("`-gayrate [@user]`", "shows the gayrate of yourself or @user(@user is optional, leave it blank for your own gayrate)")
    .addField("`-credits`","shows credits for the bot e.g. Creator(s)")
    .setThumbnail(bicon);
    message.author.sendMessage(botembed);
    return;
 }

/*
 if(cmd == `${prefix}streamtime`) {
 	let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .addField("Usual stream time:",
"**If there is 1 stream: from 8-9-10 PM UTC+1 untill 12-1-2 AM UTC+1 \nIf there are 2 streams: 1 stream from 3-4-5 PM UTC+1 untill 6-7-8 PM UTC+1 \nand 1 stream from 9-10-11 PM UTC+1 untill 12-1-2 AM UTC+1**")
    .setColor("#15f153")
    .setThumbnail(bicon)
    message.channel.send(botembed);
    }
 	 if (cmd === `${prefix}streamtime` && args === 1) {
 	 	let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .addField("1 stream time",
 	 "	**1 stream: from 8-9-10 PM UTC+1 untill 12-1-2 AM UTC+1**")
 	    .setColor("#15f153")
    .setThumbnail(bicon)
    message.channel.send(botembed);
 	 } */
 
  if(cmd === `${prefix}botinfo`) {

    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .addField("Bot Information", "This is a bot coded in JS made for Ferg :slight_smile:")
    .setColor("#15f153")
    .setThumbnail(bicon)
    .addField("Bot Name", bot.user.username)
    .addField("Created On", bot.user.createdAt);

    message.channel.send(botembed);
}});

bot.login(process.env.BOT_TOKEN);
