const discord = require('discord.js');
const ms = require('ms')
const { prefix } = require('../../config.json');
const schema = require('../../schema/TimeOut-Schema')

module.exports = {
  name: "remind",
  aliases: ["remindme", "Remind", "Remindme", "reminder"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: true, //or false
  usage: '<time> <reason>',
  group: 'Utilities',
  description: 'The bot will reminde you for anything',
  cooldown: 5, //seconds(s)
  guarded: false, //or false
  permissions: ["USE_EXTERNAL_EMOJIS"],
  examples: [
    '5m To start my new project!',
    '30s To skip this ad'
  ],
  async execute(client, message, args) {
        let reason = args.slice(1).join(" ")
        let time = args[0];

        let data;
        try{
            data = await schema.findOne({
              userId: message.author.id
            })
            if(!data) {
            data = await schema.create({
              userId: message.author.id
            })
            }
        } catch(err) {
            console.log(err)
        }
    
            if(time == "0") {
              data.Reminder.current = false;
              data.Reminder.time = 0;
              data.Reminder.reason = null;
              await data.save().then(() => {
                return message.channel.send(`<:success:888264105851490355> **${message.author.tag}**, Successfully canceled the last reminder!`)
              }).catch(() => {
                return message.channel.send(`\\❌ **${message.author.tag}**, Something went wrong!`)
              })
            }
            // Input Checking
            const reminderErr = new discord.MessageEmbed()
              .setDescription(`Error! You must state a duration for your reminder!. \`${prefix}remind [time] [reason]\``)
              .setColor('RED')
            if (!time || !ms(time)) return message.channel.send({ embeds: [reminderErr]})
    
            const noReasonInput = new discord.MessageEmbed()
              .setDescription(`Error! Please state your remind reason! \`${prefix}remind [time] [reason]\``)
              .setColor('RED')
            if (!reason) return message.channel.send({ embeds: [noReasonInput]})
    
            if(data.Reminder.current) return message.channel.send(`\\❌ **${message.author.tag}**, looks like you already have an active reminder! cancel it by ${prefix}reminder 0`)
            // Executing
            data.Reminder.current = true;
            data.Reminder.time = Math.floor(Date.now() + ms(time));
            data.Reminder.reason = reason;
            await data.save().then(() => {
              const dnEmbed = new discord.MessageEmbed()
              .setAuthor({ name: '| Reminder Set!', iconURL: message.author.displayAvatarURL() })
              .setDescription(`Successfully Set \`${message.author.tag}'s\` reminder!`)
              .addField('❯ Remind You In:', `${time}`)
              .addField('❯ Remind Reason', `${reason}`)
              .setColor('GREEN')
              .setTimestamp()
              .setFooter({ text: 'Successfully set the reminder!', iconURL: client.user.displayAvatarURL()})
            message.channel.send({ embeds: [dnEmbed]})
            })
          }
}