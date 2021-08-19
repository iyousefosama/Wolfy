const discord = require('discord.js');
const cooldown = new Set();

module.exports = {
    name: "delete",
    aliases: ["Delete", "DELETE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 1, //seconds(s)
    guarded: false, //or false
    permissions: ["ADMINISTRATOR", "MANAGE_CHANNELS"],
    clientpermissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    async execute(client, message, args) {
    if (message.channel.type === "dm") return;
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
                if(message.channel.deleted) return;
                message.channel.delete()
            }, 5000);
        })

    // if its not a ticket channel return
    } else {
        return message.channel.send("<a:pp681:774089750373597185> \`Err 404:\`\n\n🙄 You can use this cmd only in the ticket")
    }
    }
}
