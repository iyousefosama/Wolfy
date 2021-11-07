const Discord = require('discord.js');
const schema = require('../../schema/GuildSchema')
const { prefix } = require('../../config.json');

module.exports = {
    name: "setTicketch",
    aliases: ["SetTicketCh", "SETTICKETCH", "setticketchannel", "setticketch", "setticketchannel"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '<channelID>',
    group: 'setup',
    description: 'Setup the ticket category bot will create tickets channels from users there!',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_CHANNELS"],
    clientpermissions: ["MANAGE_CHANNELS"],
    examples: [
      '877130715337220136'
    ],
    async execute(client, message, args) {
      
          const channelID = args[0];
          channel = message.guild.channels.cache.get(channelID);
      
          if (!channel || channel.type !== 'GUILD_CATEGORY'){
            return message.channel.send({ content: `\\❌ **${message.member.displayName}**, please provide a valid \`CATEGORY\` ID.`});
          } else if (!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
            return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I need you to give me permission to send messages on ${channel} and try again.`});
          } else if (!channel.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')){
            return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I need you to give me permission to manage channels on ${channel} and try again.`});
          };
          
        let data;
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            if(!data) {
            data = await schema.create({
                GuildID: message.guild.id
            })
            }
        } catch(err) {
            console.log(err)
            message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
        }
        if(data.Mod.Tickets.channel !== null && channel.id == data.Mod.Tickets.channel) {
          return message.channel.send({ content: `\\❌ **${message.member.displayName}**, Tickets category is already set to ${channel}!`});
        }
        data.Mod.Tickets.channel = channel.id
        data.save()
        .then(() => {
          const embed = new Discord.MessageEmbed()
          .setColor('DARK_GREEN')
          .setDescription([
            '<a:Correct:812104211386728498>\u2000|\u2000',
            `Successfully set the Tickets category to ${channel}!\n\n`,
            !data.Mod.Tickets.isEnabled ? `\\⚠️ Ticket cmd is disabled! To enable, type \`${prefix}tickettoggle\`\n` :
            `To disable this feature, use the \`${prefix}ticketstoggle\` command.`
          ].join(''))
          message.channel.send({ embeds: [embed] })
      })
}
}