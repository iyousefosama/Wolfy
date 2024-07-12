const discord = require('discord.js');
const moment = require('moment');
const schema = require('../../schema/Economy-Schema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "setbirthday",
    aliases: [],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: true, //or false
    usage: '<date>',
    group: 'Economy',
    description: 'Sets your profile card birthday.',
    cooldown: 30, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: ['09-26'], 
    
    async execute(client, message, [date]) {

        let data;
        try{
            data = await schema.findOne({
                userID: message.author.id
            })
            if(!data) {
            data = await schema.create({
                userID: message.author.id
            })
        }
        } catch(err) {
            console.log(err)
        }

        if (!date){
            return message.channel.send(`\\❌ **${message.author.tag}**, Please add the date`);
          } else {
            date = moment(date, 'DD-MM');
      
            if (!date.isValid()){
              return message.channel.send(`\\❌ **${message.author.tag}**, Please add your date in DD-MM format`);
            };
      
            data.profile.birthday = date.format('Do MMMM');
      
            return data.save()
            .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, Successfully updated your birthday to \`${date.format('Do MMMM')}\`!`))
            .catch(() => message.channel.send(`\\❌ **${message.author.tag}**, your birthday update failed!`))
          };
    }
}