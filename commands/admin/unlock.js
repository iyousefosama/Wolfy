const discord = require('discord.js');

module.exports = {
    name: "unlock",
    aliases: ["Unlock", "UNLOCK"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    clientpermissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    async execute(client, message, args) {
        var err = new discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<a:pp681:774089750373597185> | There was an error while trying to \`unlock\` the channel!`)
    var loading = new discord.MessageEmbed()
        .setColor(`YELLOW`)
        .setDescription(`<a:Loading_Color:759734580122484757> Loading...`)
        var msg = await message.channel.send({ embeds: [loading] })
    
    try {
        message.channel.permissionOverwrites.edit(message.guild.roles.cache.find(e => e.name.toLowerCase().trim() == "@everyone"),{
            SEND_MESSAGES:true
        })
        let unlock = new discord.MessageEmbed()
        .setColor(`GREEN`)
        .setDescription(`<a:pp399:768864799625838604> Unlocked @everyone from texting in this channel!`)
        msg.edit({ embeds: [unlock] })
    }catch(e){
        msg.edit({ embeds: [err]}).then(()=>  message.react("💢"));
    }
}
}