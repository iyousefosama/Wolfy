const fs = require('fs')
const discord = require('discord.js')
const schema = require('../../schema/GuildSchema')

module.exports = {
    name: "LevelRoles",
    aliases: ["roles", "Roles", "LeveledRoles", "levelroles", "leveledroles", "level-roles"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'LeveledRoles',
    description: 'To show you all level roles in the guild',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: [discord.PermissionsBitField.Flags.UseExternalEmojis],
    examples: [],
    async execute(client, message, args) {
    
        let data;
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            if(!data) {
                return message.channel.send(`\\❌ ${message.author}, There are no Level Roles yet!`)
            }
        } catch(err) {
            console.log(err)
            message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
        }
    
    if(!data.Mod.Level.isEnabled) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **levels** command is disabled in this server!\nTo enable this feature, use the \`${client.prefix}leveltoggle\` command.`})

    const List_Of_Level_Roles = data.Mod.Level.Roles.map(Roles => {
        return Roles.RoleName
    })
    const List_Of_Levels_To_Reach = data.Mod.Level.Roles.map(Roles => {
        return Roles.Level
    })
    const List_Of_IDs = data.Mod.Level.Roles.map(Roles => {
        return Roles.RoleId
    })

    const Success = new discord.EmbedBuilder()
    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true}) })
    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({dynamic: true}) })
    .setDescription(`<a:Bagopen:877975110806540379> \`${message.guild.name}\` Leveled Roles List!\n\n`)
    .setImage('https://cdn.discordapp.com/attachments/830926767728492565/882338457832263700/Pngtreebusiness_office_meeting_illustration_4116108.jpg')
    .addFields(
        {
            name: '<a:iNFO:853495450111967253> Name',
            value: List_Of_Level_Roles.join('\n'),
            inline: true
        },
        {
            name: '<a:Right:877975111846731847> Level To Reach',
            value: List_Of_Levels_To_Reach.join('\n'),
            inline: true
        },
        {
            name: '<:pp198:853494893439352842> ID',
            value: List_Of_IDs.join('\n'),
            inline: true
        }
    )
    .setColor("DARK_GREEN")
    .setTimestamp()
    return message.channel.send({ embeds: [Success] })
    }
}