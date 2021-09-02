const fs = require('fs')
const Discord = require('discord.js')

module.exports = {
    name: "LevelRoles",
    aliases: ["roles", "Roles", "LeveledRoles", "levelroles", "leveledroles", "level-roles"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["USE_EXTERNAL_EMOJIS", "MANAGE_ROLES"],
    async execute(client, message, args) {
    if (message.channel.type === "dm") return;
    const Level_Roles_Storage = fs.readFileSync('./Storages/Level-Roles.json')
    const Level_Roles = JSON.parse(Level_Roles_Storage.toString())
    
    const Guild_Check = Level_Roles.find(reach => {
        return reach.guildID === `${message.guild.id}`
    })
    if(!Guild_Check) {
        const No_Roles = new Discord.MessageEmbed()
        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
        .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setTitle('<a:pp681:774089750373597185> There are no Level Roles yet!')
        .setColor("RED")
        .setTimestamp()
        return message.channel.send({ embeds: [No_Roles] })
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
    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
    .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
    .setDescription(`<a:Bagopen:877975110806540379> \`${message.guild.name}\` Leveled Roles List!\n\n`)
    .setImage('https://cdn.discordapp.com/attachments/830926767728492565/882338457832263700/Pngtreebusiness_office_meeting_illustration_4116108.jpg')
    .addFields(
        {
            name: '<a:iNFO:853495450111967253> Name',
            value: List_Of_Level_Roles.join('\n'),
            inline: true
        },
        {
            name: '<a:Right:860969895779893248> Level To Reach',
            value: `${List_Of_Levels_To_Reach.join('\n')}`,
            inline: true
        },
        {
            name: '<:pp198:853494893439352842> ID',
            value: `${List_Of_IDs.join('\n')}`,
            inline: true
        }
    )
    .setColor("DARK_GREEN")
    .setTimestamp()
    return message.channel.send({ embeds: [Success] })
    }
}