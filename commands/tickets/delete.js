const discord = require('discord.js');
const cooldown = new Set();

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (message.channel.type === "dm") return;
    if(!message.guild.me.permissions.has('MANAGE_CHANNELS', 'ADMINISTRATOR')) return;
    if(cooldown.has(message.author.id)) {
        message.reply('Please wait \`3 seconds\` between using the command, because you are on cooldown')
    } else { 
    // getting the tickets category
    const categoryID = message.member.guild.channels.cache.find(c => c.name == "TICKETS")
    
    // if no ticket category return
    if(!categoryID) return;

    // only ppl with this perm can close the ticket 
    if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send("🙄 You don't have permission to use that command.")

    // if the channel is a ticket then...
    if(message.channel.parentID == categoryID){
    
        // deletes the ticket / channel
        const close = new discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription('<a:pp681:774089750373597185> Ticket will be deleted in 5 seconds')
        message.channel.send(close)
        .then(channel => {
            setTimeout(() => {
                message.channel.delete()
            }, 5000);
        })

    // if its not a ticket channel return
    } else {
        return message.channel.send("<a:pp681:774089750373597185> \`Err 404:\`\n\n🙄 You can use this cmd only in the ticket")
    }
    cooldown.add(message.author.id);
    setTimeout(() => {
        cooldown.delete(message.author.id)
    }, 3000); // here will be the time in miliseconds 5 seconds = 5000 miliseconds
}
}
module.exports.help = {
    name: "delete",
    aliases: ['Delete']
}