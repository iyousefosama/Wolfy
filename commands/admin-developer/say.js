const discord = require('discord.js');
const cooldown = new Set();

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(`w@`)) return;
    if(message.author.id !== '829819269806030879') return
    if (message.channel.type === "dm") return;
    if(cooldown.has(message.author.id)) {
      message.reply('Please wait \`3 seconds\` between using the command, because you are on cooldown')
  } else {
              if(!message.guild.me.permissions.has('MANAGE_MESSAGES', 'ADMINISTRATOR')) return;
          message.delete()
          message.channel.send(args.join(" "));
        cooldown.add(message.author.id);
        setTimeout(() => {
            cooldown.delete(message.author.id)
        }, 3000); // here will be the time in miliseconds 5 seconds = 5000 miliseconds
    }
}

    

module.exports.help = {
    name: "say",
    aliases: ['Say']
}