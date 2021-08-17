const fs = require('fs')
const Discord = require('discord.js')

module.exports = {
    name: "LevelRoles",
    aliases: ["roles", "Roles", "LeveledRoles", "levelroles", "leveledroles"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    permissions: [""],
    clientpermissions: ["USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
    if (message.channel.type === "dm") return;
    if (!message.guild.me.permissions.has("SEND_MESSAGES") || !message.guild.me.permissions.has("EMBED_LINKS") || !message.guild.me.permissions.has("USE_EXTERNAL_EMOJIS") || !message.guild.me.permissions.has("ADD_REACTIONS") || !message.guild.me.permissions.has("VIEW_CHANNEL") || !message.guild.me.permissions.has("ATTACH_FILES") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY")) return;
    const Level_Roles_Storage = fs.readFileSync('./Storages/Level-Roles.json')
    const Level_Roles = JSON.parse(Level_Roles_Storage.toString())
    
    const Guild_Check = Level_Roles.find(reach => {
        return reach.guildID === `${message.guild.id}`
    })
    if(!Guild_Check) {
        const No_Roles = new Discord.MessageEmbed()
        .setTitle('There are no Level Roles yet.')
        .setColor("RED")
        .setTimestamp()
        return message.channel.send(No_Roles)
    }

    const List_Of_Level_Roles = Level_Roles.filter(Level_Roles => {
        return Level_Roles.guildID === message.guild.id
    }).map(Roles => {
        return Roles.Level_Role
    })
    const List_Of_Levels_To_Reach = Level_Roles.filter(Level_Roles => {
        return Level_Roles.guildID === message.guild.id
    }).map(Roles => {
        return Roles.Level_To_Reach
    })
    const List_Of_IDs = Level_Roles.filter(Level_Roles => {
        return Level_Roles.guildID === message.guild.id
    }).map(Roles => {
        return Roles.Level_Role_ID
    })

    const Success = new Discord.MessageEmbed()
    .setAuthor(`${message.guild.name}`, `${message.guild.iconURL({ dynamic: true })}`)
    .setTitle('[ Level Roles ]')
    .addFields(
        {
            name: 'Name',
            value: List_Of_Level_Roles.join('\n'),
            inline: true
        },
        {
            name: 'Level To Reach',
            value: `${List_Of_Levels_To_Reach.join('\n')}`,
            inline: true
        },
        {
            name: 'ID',
            value: `${List_Of_IDs.join('\n')}`,
            inline: true
        }
    )
    .setColor("DARK_GREEN")
    .setTimestamp()
    return message.channel.send(Success)
    }
}