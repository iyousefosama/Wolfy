const discord = require('discord.js');
const ms = require('ms')
const cooldown = new Set();

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(cooldown.has(message.author.id)) {
      message.reply('Please wait \`5 seconds\` between using the command, because you are on cooldown')
  } else {
        let reason = args.slice(1).join(" ")
        let time = args[0];
    
            // Input Checking
            const tempMuteFormatErr = new discord.MessageEmbed()
              .setDescription(`Error! You must state a duration for your reminder!. \`${prefix}remind [time] [reason]\``)
              .setColor('RED')
            if (!time) return message.channel.send(tempMuteFormatErr)
    
            const noReasonInput = new discord.MessageEmbed()
              .setDescription(`Error! Please state your remind reason! \`${prefix}remind [time] [reason]\``)
              .setColor('RED')
            if (!reason) return message.channel.send(noReasonInput)
    
            // Executing
            const muteEmbedServer = new discord.MessageEmbed()
              .setAuthor('| Reminder Set!', message.author.displayAvatarURL())
              .setDescription(`Successfully Set \`${message.author.tag}'s\` reminder!`)
              .addField('❯ Remind You In:', `${time}`)
              .addField('❯ Remind Reason', `${reason}`)
              .setColor('GREEN')
              .setTimestamp()
              .setFooter('Successfully set the reminder!', Client.user.displayAvatarURL())
            message.channel.send(muteEmbedServer)
    
            setTimeout(async function () {
    
              message.channel.send(`**[ <@${message.author.id}> ] • Here is your reminder! <a:pp399:768864799625838604>**`)
              const reminderEmbed = new discord.MessageEmbed()
                .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
                .setDescription(`**${message.author.tag}** \`Here is your reminder!\``)
                .setColor('DARK_GREEN')
                .addField('❯ Remind Reason', `${reason}`)
                .setTimestamp()
                .setFooter('Successfully Reminded!', Client.user.displayAvatarURL())
               message.channel.send(reminderEmbed)
               try {
                await message.author.send(reminderEmbed)
            } catch (error) {
                return;
            }
              
            }, ms(time));
            cooldown.add(message.author.id);
            setTimeout(() => {
                cooldown.delete(message.author.id)
            }, 5000); // here will be the time in miliseconds 5 seconds = 5000 miliseconds
        }
}

    

module.exports.help = {
    name: "remind",
    aliases: ['Remind', 'Remindme', 'remindme']
}