const fs = require('fs')
const Discord = require('discord.js')

module.exports = {
    name: "editrole",
    aliases: ["Editrole", "EDITROLE", "editlevelrole"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<roleID> <number>',
    cooldown: 1, //seconds(s)
    guarded: false, //or false
    permissions: ["ADMINISTRATOR"],
    clientpermissions: ["ADMINISTRATOR"],
    async execute(client, message, args) {

    const provideID = new Discord.MessageEmbed()
    .setTitle('You need to provide a role ID.')
    .setColor('RED')
    .setTimestamp()
    const provide = new Discord.MessageEmbed()
    .setTitle('You need to provide a number.')
    .setDescription('This will change the Level Number.')
    .setColor('RED')
    .setTimestamp()

    const Role_To_Edit = args[0]
    if(!Role_To_Edit) return message.channel.send(provideID)

    const New_Number = args[1]
    if(!New_Number) return message.channel.send(provide)
    if(isNaN(New_Number)) return message.channel.send(provide)

    if(New_Number.includes('+')) return message.channel.send(provide)
    if(New_Number.includes('-')) return message.channel.send(provide)
    if(New_Number.includes('.')) return message.channel.send(provide)

    const Level_Roles_Storage = fs.readFileSync('./Storages/Level-Roles.json')
    const Level_Roles = JSON.parse(Level_Roles_Storage.toString())
    
    const Level_Role_ID_Check = Level_Roles.find(id => {
        return (id.guildID === `${message.guild.id}` && id.Level_Role_ID === Role_To_Edit)
    })
    if(!Level_Role_ID_Check) {
        const No_Roles = new Discord.MessageEmbed()
        .setTitle('There is no Level Role with that ID.')
        .setColor("RED")
        .setTimestamp()
        return message.channel.send(No_Roles)
    } else {
        const New_Level_Number = Level_Role_ID_Check.Level_To_Reach = parseInt(New_Number)
        
        const Updating_Data = JSON.stringify(New_Level_Number, null, 4)
        fs.writeFileSync('./Storages/Level-Roles.json', Updating_Data)

        const Updated_Data = JSON.stringify(Level_Roles, null, 4)
        fs.writeFileSync('./Storages/Level-Roles.json', Updated_Data)

        const Success = new Discord.MessageEmbed()
        .setTitle('Level Role has been successfully edited.')
        .setColor("GREEN")
        .setTimestamp()
        return message.channel.send(Success)
    }
}
}