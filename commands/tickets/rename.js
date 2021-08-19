const discord = require('discord.js');

module.exports = {
    name: "rename",
    aliases: ["Rename", "RENAME"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<Name>',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    clientpermissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    async execute(client, message, args) {
    if (message.channel.type === "dm") return;

    let name = args.slice(0).join(" ")

    const categoryID = message.member.guild.channels.cache.find(c => c.name == "TICKETS")
    
    // if no ticket category return
    if(!categoryID) return;

    // if the channel is a ticket then...
    if(message.channel.parentID == categoryID){

        const rename = new discord.MessageEmbed()
        .setColor(`GREEN`)
        .setDescription('<a:pp399:768864799625838604> Ticket name changed')
        message.channel.send(rename)
        .then(channel => {
            if(message.deleted) return;
            message.delete()
            message.channel.setName(`${name}`)
        })
    // if its not a ticket channel return
    } else {
        return message.channel.send("<a:pp681:774089750373597185> \`Err 404:\`\n\n🙄 You can use this cmd only in the ticket")
    }
}
}