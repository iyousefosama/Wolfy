const discord = require('discord.js');
const ms = require('ms')
const { prefix } = require('../../config.json');

module.exports = {
  name: "remind",
  aliases: ["remindme", "Remind", "Remindme", "reminder"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: true, //or false
  usage: '<time> <reason>',
  group: 'Utilities',
  description: 'The bot will reminde you for anything',
  cooldown: 60, //seconds(s)
  guarded: false, //or false
  permissions: ["USE_EXTERNAL_EMOJIS"],
  examples: [
    '5m To start my new project!',
    '30s To skip this ad'
  ],
  async execute(client, message, args) {
    if (!message.guild.me.permissions.has("SEND_MESSAGES") || !message.guild.me.permissions.has("EMBED_LINKS") || !message.guild.me.permissions.has("USE_EXTERNAL_EMOJIS") || !message.guild.me.permissions.has("ADD_REACTIONS") || !message.guild.me.permissions.has("VIEW_CHANNEL") || !message.guild.me.permissions.has("ATTACH_FILES") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY")) return;
        let reason = args.slice(1).join(" ")
        let time = args[0];
    
            // Input Checking
            const reminderErr = new discord.MessageEmbed()
              .setDescription(`Error! You must state a duration for your reminder!. \`${prefix}remind [time] [reason]\``)
              .setColor('RED')
            if (!time) return message.channel.send({ embeds: reminderErr})
    
            const noReasonInput = new discord.MessageEmbed()
              .setDescription(`Error! Please state your remind reason! \`${prefix}remind [time] [reason]\``)
              .setColor('RED')
            if (!reason) return message.channel.send({ embeds: [noReasonInput]})
    
            // Executing
            const dnEmbed = new discord.MessageEmbed()
              .setAuthor('| Reminder Set!', message.author.displayAvatarURL())
              .setDescription(`Successfully Set \`${message.author.tag}'s\` reminder!`)
              .addField('❯ Remind You In:', `${time}`)
              .addField('❯ Remind Reason', `${reason}`)
              .setColor('GREEN')
              .setTimestamp()
              .setFooter('Successfully set the reminder!', client.user.displayAvatarURL())
            message.channel.send({ embeds: [dnEmbed]})
    
            setTimeout(async function () {
              const reminderEmbed = new discord.MessageEmbed()
                .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
                .setColor('DARK_GREEN')
                .addField('❯ Remind Reason', `${reason}`)
                .setTimestamp()
                .setFooter('Successfully Reminded!', client.user.displayAvatarURL())
            try {
                await message.author.send({ embeds: [reminderEmbed] })
            } catch (error) {
                return message.channel.send({ content: `> **Here is your reminder! • [** <@${message.author.id}> **]**`, embeds: [reminderEmbed]})
            }
            }, ms(time));
          }
}

    

module.exports.help = {
    name: "remind",
    aliases: ['Remind', 'Remindme', 'remindme']
}