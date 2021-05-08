const discord = require('discord.js');
const cooldown = new Set();

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(cooldown.has(message.author.id)) {
      message.reply('Please wait \`3 seconds\` between using the command, because you are on cooldown')
  } else {

          if (!message.channel.guild)
            return message.channel
              .send("You Dont Have Perms :x:")
              .then(m => m.delete(5000));
          if (!message.member.hasPermission("ADMINISTRATOR"))
            return message.channel.send("🙄 **Sorry you dont have \`ADMINISTRATOR\`**");
          message.delete();
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