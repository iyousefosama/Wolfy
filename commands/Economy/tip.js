const discord = require('discord.js');
const moment = require('moment');
const schema = require('../../schema/Economy-Schema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "tip",
    aliases: [],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '[user]',
    group: 'Economy',
    description: 'Send a tip for your friend!',
    cooldown: 30, //seconds(s)
    guarded: false, //or false
    requiresDatabase: true,
    permissions: [],
    examples: [
    '@WOLF',
    '724580315481243668'
    ], 
    async execute(client, message, [user='']) {

        let tipper;
        let Friend;
        try{
            tipper = await schema.findOne({
                userID: message.author.id
            })
            if(!tipper) {
                tipper = await schema.create({
                userID: message.author.id
            })
        }
        } catch(err) {
            console.log(err)
            message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
        }
        
        const now = Date.now();
        const quest = tipper.progress.quests?.find(x => x.id == 4);
        let Box = quest?.current;

        if (tipper.tips.timestamp !== 0 && tipper.tips.timestamp - now > 0){
          return message.channel.send(`\\❌ **${message.author.tag}**, You have already been used *tip* earlier! Please try again later. \`${moment.duration(tipper.tips.timestamp - now).format('H [hours,] m [minutes, and] s [seconds]')}\``);
        } else if (!user){
          return message.channel.send(`\\❌ **${message.author.tag}**, Please mention the user to tip!`);
        };
    
        const member = await message.guild.members
        .fetch(user.match(/\d{17,19}/)?.[0] || 'let-fetch-fail')
        .catch(() => {});    
    
        if (!member){
          return message.channel.send(`\\❌ **${message.author.tag}**, Could not found this user!`);
        } else if (member.id === message.author.id){
          return message.channel.send(`\\❌ **${message.author.tag}**, You cannot tip to yourself!`);
        } else if (member.user.bot){
          return message.channel.send(`\\❌ **${message.author.tag}**, You cannot tip a bot!`);
        };

        try{
            Friend = await schema.findOne({
                userID: member.id
            })
            if(!Friend) {
                Friend = await schema.create({
                userID: member.id
            })
            }
            } catch(err) {
                console.log(err)
                message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
            }
    
            if(quest?.current < quest?.progress) {
              Box++;
              await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 4 }, { $inc: { "progress.quests.$.current": 1 } });
            }
          if(Box && Box == quest?.progress && !quest?.received) {
            tipper.credits += Math.floor(quest.reward);
            await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 4 }, { $set: { "progress.quests.$.received": true } });
            tipper.progress.completed++;
              await tipper.save();
              message.reply({ content: `\\✔️  You received: <a:ShinyMoney:877975108038324224> **${quest.reward}** from this command quest.`})
            }
          tipper.tips.timestamp = now + 432e5;
          tipper.tips.given++;
          Friend.tips.received++;
    
          return Promise.all([ Friend.save(), tipper.save() ])
          .then(() => message.channel.send([
            `\\✔️ **${message.author.tag}**, Successfully tipped **${member.user.tag}**.`].join('')))
          .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`))
    }
}