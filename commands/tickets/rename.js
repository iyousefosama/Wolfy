const discord = require('discord.js');

module.exports = {
    name: "rename",
    aliases: ["Rename", "RENAME"],
    dmOnly: true, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<Name>',
    cooldown: 1, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    clientpermissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    async execute(client, message, args) {
    if (message.channel.type === "dm") return;
    // getting the tickets category
    const categoryID = message.member.guild.channels.cache.find(c => c.name == "TICKETS")
    
    // if no ticket category return
    if(!categoryID) return;

    // only ppl with this perm can close the ticket 
    if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send("🙄 You don't have permission to use that command.")

    let name = args.slice(0).join(" ")

    if(!name) return message.channel.send(`<a:pp681:774089750373597185> Enter the new ticket name!`)

    // if the channel is a ticket then...
    if(message.channel.parentID == categoryID){
    
        
        const rename = new discord.MessageEmbed()
        .setColor(`GREEN`)
        .setDescription('<a:pp399:768864799625838604> Ticket name changed')
        message.channel.send(rename)
        .then(channel => {
            message.delete()
            message.channel.setName(`${name}`)
        })
    // if its not a ticket channel return
    } else {
        return message.channel.send("<a:pp681:774089750373597185> \`Err 404:\`\n\n🙄 You can use this cmd only in the ticket")
    }
}
}