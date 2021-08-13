const fs = require('fs')
const Discord = require('discord.js')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (message.channel.type === "dm") return;
    const Messingperms = new Discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> You don't have permission to use that command.`)
    if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(Messingperms)
    if(!message.guild.me.permissions.has('ADMINISTRATOR')) return;

    const provide = new Discord.MessageEmbed()
    .setTitle('You need to provide a role ID.')
    .setColor('RED')
    .setTimestamp()

    const Role_To_Remove = args[0]
    if(!Role_To_Remove) return message.channel.send(provide)
    if(isNaN(Role_To_Remove)) return message.channel.send(provide)

    const Level_Roles_Storage = fs.readFileSync('./Storages/Level-Roles.json')
    const Level_Roles = JSON.parse(Level_Roles_Storage.toString())
    
    const Level_Role_ID_Check = Level_Roles.find(id => {
        return (id.guildID === `${message.guild.id}` && id.Level_Role_ID === Role_To_Remove)
    })
    if(!Level_Role_ID_Check) {
        const No_Roles = new Discord.MessageEmbed()
        .setTitle('There is no Level Role with that ID.')
        .setColor("RED")
        .setTimestamp()
        return message.channel.send(No_Roles)
    } else {
        const Removing_Level_Role = Level_Roles.filter(id => {
            return id.Level_Role_ID !== `${Role_To_Remove}`
        });
        fs.writeFileSync('./Storages/Level-Roles.json', JSON.stringify(Removing_Level_Role, null, 4));
        
        const Success = new Discord.MessageEmbed()
        .setTitle('Level Role has been successfully removed.')
        .setColor("DARK_GREEN")
        .setTimestamp()
        message.channel.send(Success)
        //Saves the Data, this also means that it won't bring back the previous data after it got deleted
        return setTimeout(() => {
            const Saving_Data = fs.readFileSync('./Storages/Level-Roles.json', 'utf8')
            const Saved_Data = JSON.parse(Saving_Data.toString())
            fs.writeFileSync('./Storages/Level-Roles.json', JSON.stringify(Saved_Data, null, 4))
        }, 1000)
    }
}

    

module.exports.help = {
    name: "remove-role",
    aliases: ['remove-level-role']
}