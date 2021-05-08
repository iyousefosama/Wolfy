const discord = require('discord.js');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (message.author != '742682490216644619') return

    await message.reply("Shutting down now...")
  
    process.exit()
    

}

    

module.exports.help = {
    name: "shutdown",
    aliases: ['Shutdown']
}