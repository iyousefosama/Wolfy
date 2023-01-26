const fs = require('fs')
const discord = require('discord.js')
const schema = require('../../schema/GuildSchema')

module.exports = {
    name: "removerole",
    aliases: ["Removerole", "REMOVEROLE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<id>',
    group: 'LeveledRoles',
    description: 'Remove a level role from the list',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: [discord.PermissionsBitField.Flags.Administrator, discord.PermissionsBitField.Flags.ManageRoles],
    examples: [
        '804860582066520104'
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
        
    if(!data.Mod.Level.isEnabled) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **levels** command is disabled in this server!\nTo enable this feature, use the \`${client.prefix}leveltoggle\` command.`})

    const Role_To_Remove = args[0]
    if(!Role_To_Remove) return message.channel.send(`\\❌ **${message.member.displayName}**, Please provide the role mention or id!`)
    if(isNaN(Role_To_Remove)) return message.channel.send(`\\❌ **${message.member.displayName}**, Please provide the role mention or id!`)

    const role = data.Mod.Level.Roles?.filter(x => x.RoleId == Role_To_Remove)[0];
    if(!data.Mod.Level.Roles.length || !role) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find this role!`})

    await schema.findOneAndUpdate({ GuildID: message.guild.id}, { $pull: { "Mod.Level.Roles": { "RoleId": Role_To_Remove} } }).then(() => {
        return message.channel.send(`\\✔️ **${message.member.displayName}**, Successfully removed the role from this guild!`)
    }).catch((err) => {
        return message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``})
    })
}
}