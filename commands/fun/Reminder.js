const discord = require('discord.js');
const ms = require('ms')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
        let reason = args.slice(1).join(" ")
        let time = args[0];
    
            // Input Checking
            const tempMuteFormatErr = new discord.MessageEmbed()
              .setDescription('Error! You must state a duration for your reminder!. \`[!remind [time] [reason]\`')
              .setColor('RED')
            if (!time) return message.channel.send(tempMuteFormatErr)
    
            const noReasonInput = new discord.MessageEmbed()
              .setDescription('Error! Please state your remind reason! \`p!remind [time] [reason]\`')
              .setColor('RED')
            if (!reason) return message.channel.send(noReasonInput)
    
            // Executing
            const muteEmbedServer = new discord.MessageEmbed()
              .setAuthor('| Reminder Set!', message.author.displayAvatarURL())
              .setDescription(`Successfully Set ${message.author.tag}'s reminder!`)
              .addField('❯ Remind You In:', `${time}`)
              .addField('❯ Remind Reason', `${reason}`)
              .setColor('BLUE')
              .setTimestamp()
              .setFooter('Successfully set the reminder for The Command Author!', Client.user.displayAvatarURL())
    
            message.channel.send(muteEmbedServer)
    
            setTimeout(async function () {
    
              message.channel.send(`<@${message.author.id}> Here is your reminder!`)
              const reminderEmbed = new discord.MessageEmbed()
                .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
                .setDescription(`${message.author.tag} Here is your reminder!`)
                .setColor('BLUE')
                .addField('❯ Remind Reason', `${reason}`)
                .setTimestamp()
                .setFooter('Successfully Reminded The Command Author!', Client.user.displayAvatarURL())
    
              message.channel.send(reminderEmbed)
    
    
            }, ms(time));

}

    

module.exports.help = {
    name: "reminde",
    aliases: ['Reminde']
}