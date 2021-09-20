const discord = require('discord.js');

module.exports = {
    name: "lock",
    aliases: ["Lock", "LOCK"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Moderation',
    description: 'Lock the permissions for @everyone from talking in the channel',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    clientpermissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
    examples: [''],
    async execute(client, message, args) {

        var err = new discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<a:pp681:774089750373597185> | There was an error while trying to \`lock\` the channel!`)
        var loading = new discord.MessageEmbed()
        .setColor(`YELLOW`)
        .setDescription(`<a:Loading_Color:759734580122484757> Loading...`)
        var msg = await message.channel.send({ embeds: [loading] })

    try {
        message.channel.permissionOverwrites.edit(message.guild.roles.cache.find(e => e.name.toLowerCase().trim() == "@everyone"),{
            SEND_MESSAGES:false
        })
        let lock = new discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<a:pp802:768864899543466006> Locked @everyone from texting in this channel!`)
        msg.edit({ embeds: [lock] })

    }catch(e){
        msg.edit({ embeds: [err]}).then(()=>  message.react("💢")).catch(() => null)
    }
    }
}