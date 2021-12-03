const discord = require('discord.js');
const schema = require('../../schema/GuildSchema')

module.exports = {
    name: "rename",
    aliases: ["Rename", "RENAME"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<Name>',
    group: 'ticket',
    description: 'Change ticket name',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_CHANNELS"],
    clientpermissions: ["MANAGE_CHANNELS"],
    examples: [
        'Test-ticket'
      ],
    async execute(client, message, args) {
    let name = args.slice(0).join(" ")

        let data;
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            if(!data) {
            data = await schema.create({
                GuildID: message.guild.id
            })
            }
        } catch(err) {
            console.log(err)
            message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
        }

    // getting in the ticket category
    const categoryID = message.guild.channels.cache.get(data.Mod.Tickets.channel)

    // if there is no ticket category return
    if(!categoryID) {
    return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the tickets channel please contact mod or use \`w!setticketch\` cmd`})
    } else if(!data.Mod.Tickets.isEnabled) {
    return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **tickets** command is disabled in this server!`})
    } else {
    // Do nothing..
    }

    // if the channel is a ticket then...
    if(message.channel.parent == categoryID){
        const rename = new discord.MessageEmbed()
        .setColor(`GREEN`)
        .setDescription('<a:pp399:768864799625838604> Ticket name changed')
        message.channel.send({ embeds: [rename] })
        .then(channel => {
            message.channel.setName(name).catch(() => null)
        })
    } else {
        return message.channel.send({ content: `\\❌ **${message.member.displayName}**, You can use this cmd only in the ticket!`})
    }
}
}