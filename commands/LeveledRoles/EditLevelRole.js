const fs = require('fs')
const Discord = require('discord.js')
const schema = require('../../schema/GuildSchema')
const { prefix } = require('../../config.json');

module.exports = {
    name: "editrole",
    aliases: ["Editrole", "EDITROLE", "editlevelrole"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<roleID> <number>',
    cooldown: 1, //seconds(s)
    guarded: false, //or false
    permissions: ["ADMINISTRATOR", "MANAGE_ROLES"],
    clientpermissions: ["ADMINISTRATOR", "MANAGE_ROLES"],
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

    const provideID = new Discord.MessageEmbed()
    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
    .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
    .setDescription('<a:Nnno:853494186002481182> You need to provide a \`roleID\`!')
    .setColor('RED')
    .setTimestamp()
    const provide = new Discord.MessageEmbed()
    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
    .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
    .setTitle('You need to provide a number.')
    .setDescription('<a:Nnno:853494186002481182> This will change the \`Level Number\`!')
    .setColor('RED')
    .setTimestamp()

    const Role_To_Edit = args[0]
    if(!Role_To_Edit) return message.channel.send({ embeds: [provideID] })

    const New_Number = args[1]
    if(!New_Number) return message.channel.send({ embeds: [provide] })
    if(isNaN(New_Number)) return message.channel.send({ embeds: [provide] })

    if(New_Number.includes('+')) return message.channel.send({ embeds: [provide] })
    if(New_Number.includes('-')) return message.channel.send({ embeds: [provide] })
    if(New_Number.includes('.')) return message.channel.send({ embeds: [provide] })
    if(!data.Mod.Level.isEnabled) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **levels** command is disabled in this server!\nTo enable this feature, use the \`${prefix}leveltoggle\` command.`})

    const Level_Roles_Storage = fs.readFileSync('./Storages/Level-Roles.json')
    const Level_Roles = JSON.parse(Level_Roles_Storage.toString())
    
    const Level_Role_ID_Check = Level_Roles.find(id => {
        return (id.guildID === `${message.guild.id}` && id.Level_Role_ID === Role_To_Edit)
    })
    if(!Level_Role_ID_Check) {
        const No_Roles = new Discord.MessageEmbed()
        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
        .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setTitle('<a:Nnno:853494186002481182> There is no Level Role with that \`ID\`!')
        .setColor("RED")
        .setTimestamp()
        return message.channel.send({ embeds: [No_Roles] })
    } else {
        const New_Level_Number = Level_Role_ID_Check.Level_To_Reach = parseInt(New_Number)
        
        const Updating_Data = JSON.stringify(New_Level_Number, null, 4)
        fs.writeFileSync('./Storages/Level-Roles.json', Updating_Data)

        const Updated_Data = JSON.stringify(Level_Roles, null, 4)
        fs.writeFileSync('./Storages/Level-Roles.json', Updated_Data)

        const Success = new Discord.MessageEmbed()
        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
        .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setTitle('<a:Correct:812104211386728498> Level Role has been successfully edited!')
        .setColor("GREEN")
        .setTimestamp()
        return message.channel.send({ embeds: [Success] })
    }
}
}