const fs = require('fs')
const discord = require('discord.js')
const schema = require('../../schema/GuildSchema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "editrole",
    aliases: ["Editrole", "EDITROLE", "editlevelrole"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<roleID> <number>',
    group: 'LeveledRoles',
    description: 'Edit the guild level role to another one',
    cooldown: 1, //seconds(s)
    guarded: false, //or false
    permissions: [discord.PermissionsBitField.Flags.Administrator, discord.PermissionsBitField.Flags.ManageRoles],
    examples: [
        '804860582066520104 9'
      ],

  async execute(client, message, args) {

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
            message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
        }

    const provideID = new discord.EmbedBuilder()
    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true}) })
    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({dynamic: true}) })
    .setDescription('<a:Nnno:853494186002481182> You need to provide a \`roleID\`!')
    .setColor('Red')
    .setTimestamp()
    const provide = new discord.EmbedBuilder()
    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true}) })
    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({dynamic: true}) })
    .setTitle('You need to provide a number.')
    .setDescription('<a:Nnno:853494186002481182> This will change the \`Level Number\`!')
    .setColor('Red')
    .setTimestamp()

    const Role_To_Edit = args[0]
    if(!Role_To_Edit) return message.channel.send({ embeds: [provideID] })

    const New_Number = args[1]
    if(!New_Number) return message.channel.send({ embeds: [provide] })
    if(isNaN(New_Number)) return message.channel.send({ embeds: [provide] })

    if(New_Number.includes('+')) return message.channel.send({ embeds: [provide] })
    if(New_Number.includes('-')) return message.channel.send({ embeds: [provide] })
    if(New_Number.includes('.')) return message.channel.send({ embeds: [provide] })
    if(!data.Mod.Level.isEnabled) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **levels** command is disabled in this server!\nTo enable this feature, use the \`${client.prefix}leveltoggle\` command.`})

    const role = data.Mod.Level.Roles?.filter(x => x.RoleId == Role_To_Edit)[0];
    if(!data.Mod.Level.Roles.length || !role) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find this role!`})
    if(data.Mod.Level.Roles?.filter(x => x.Level == Math.floor(New_Number))[0]) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, there is already a leveled role with the same level!`})

        const NumberToAdd = New_Number - role.Level
        await schema.findOneAndUpdate({ GuildID: message.guild.id, "Mod.Level.Roles.RoleId": Role_To_Edit }, { $inc: { "Mod.Level.Roles.$.Level": Math.floor(NumberToAdd) } }).then(() => {
            return message.channel.send(`\\✔️ ${message.author}, Successfully edited **${role.RoleName}** to level \`${Math.floor(New_Number)}\`!`)
        }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`))

}
}