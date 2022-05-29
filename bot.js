"use strict";
require("dotenv").config();
const discord = require("discord.js");
const { off } = require("process");
const badwordsArray = require("badwords/array");
const comSchedule = require("./com1a.json");
const PREFIX = process.env.PREFIX;
const client = new discord.Client({
  intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES],
});
const timeoutMinutes = 5;
let faculties = ["com21a", "com21b"];

client.login(process.env.BOT_TOKEN);
client.on("ready", () => {
  console.log(`${client.user.tag} logged in`);
});

const isValidCommand = (message, commandName) => {
  return message.content.toLowerCase().startsWith(PREFIX + commandName);
};

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  else if (isValidCommand(message, "schedule")) {
    let args = message.content.toLowerCase().substring(10);
    // let { cache } = message.guild.roles;
    // let role = cache.find((role) => role.name.toLowerCase() == args);
    // console.log(role);
    // console.log(args);
    if (faculties.includes(args)) {
      let currentFaculty;
      if (args == "com21a") {
        currentFaculty = comSchedule;
      }
      try {
        let outputString = "";
        for (const [key, value] of Object.entries(currentFaculty)) {
          outputString += `${key}:\n`;
          for (const [class1, time] of Object.entries(value)) {
            outputString += `${class1}: ${time}\n`;
          }
          outputString += "\n";
        }
        message.reply(outputString);
      } catch {
        message.reply("Couldn't get a schedule for this faculty");
      }
    } else {
      message.reply("No such faculty/group");
    }
  } else {
    console.log(message.content);
    for (let word of message.content.split(" ")) {
      for (let badword of badwordsArray) {
        if (word.toLowerCase().startsWith(badword)) {
          message.member
            .timeout(timeoutMinutes * 60 * 1000, "please do not swear")
            .then((value) => {
              client.channels.cache
                .get("978672597459935312")
                .send(
                  `${message.member.displayName} has been timed out for 5 minutes`
                );
            })
            .catch((err) => {
              console.log(err);
            });
          message.delete();
          return;
        }
      }
    }
  }
});

// MUCH WORSE BUT FASTER FILTER
// client.on("messageCreate", (message) => {
//     if(message.author.bot) return;
//     else{
//         console.log(message.content);
//         for(let word of message.content.split(" ")) {
//             if(badwordsArray.includes(word.toLowerCase())) {
//                 message.member.timeout(5 * 60 * 1000, "please do not swear")
//                 .then (value => {
//                     client.channels.cache.get("978672597459935312").send(`${message.member.displayName} has been timed out for 5 minutes`);
//                 })
//                 .catch(err => {
//                     console.log(err);
//                 });
//                 message.delete();
//                 return;
//             };
//         };
//     };
// });
