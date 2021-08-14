const fs = require('fs')
const Discord = require('discord.js')

module.exports.run = async (client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(!message.guild.me.permissions.has('SEND_MESSAGES')) return;
    if (message.channel.type === "dm") return;
    const Messingperms = new Discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`<a:pp802:768864899543466006> You don't have permission to use that command.`)
    if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(Messingperms)
    if(!message.guild.me.permissions.has('ADMINISTRATOR')) return;

        const provide = new Discord.MessageEmbed()
        .setTitle('You need to mention a role.')
        .setColor('red')
        .setTimestamp()
        const provideLevel = new Discord.MessageEmbed()
        .setTitle('You need to provide a number.')
        .setDescription('This will give a user the role when the user reached the level.')
        .setColor('red')
        .setTimestamp()

        const Role_To_Add = message.mentions.roles.first()
        if(!Role_To_Add) return message.channel.send(provide)

        const Level_To_Reach = args[1]
        if(!Level_To_Reach) return message.channel.send(provideLevel)
        if(isNaN(Level_To_Reach)) return message.channel.send(provideLevel)

        if(Level_To_Reach.includes('+')) return message.channel.send(provideLevel)
        if(Level_To_Reach.includes('-')) return message.channel.send(provideLevel)
        if(Level_To_Reach.includes('.')) return message.channel.send(provideLevel)

        const Level_Roles_Storage = fs.readFileSync('./Storages/Level-Roles.json')
        const Level_Roles = JSON.parse(Level_Roles_Storage.toString())
        
        const Level_To_Reach_Check = Level_Roles.find(reach => {
            return (reach.guildID === `${message.guild.id}` && reach.Level_To_Reach === parseInt(Level_To_Reach))
        })
        if(!Level_To_Reach_Check) {
            Level_Roles.push(
                {   
                    guildID: `${message.guild.id}`,
                    Level_Role: `${Role_To_Add.name}`,
                    Level_Role_ID: `${Role_To_Add.id}`,
                    Level_To_Reach: parseInt(Level_To_Reach)
                }
            )
            //Important Line when Creating/Adding a Data to JSON
            const New_Level_Role = JSON.stringify(Level_Roles, null, 4)
            fs.writeFileSync('./Storages/Level-Roles.json', New_Level_Role)

            const Success = new Discord.MessageEmbed()
            .setTitle('New Level Role has been successfully added.')
            .setColor("DARK_GREEN")
            .setTimestamp()
            return message.channel.send(Success)
        } else {
            const Already = new Discord.MessageEmbed()
            .setTitle('There is already a role that has that same level to reach.')
            .setColor("YELLOW")
            .setTimestamp()
            return message.channel.send(Already)
        }
    }

module.exports.help = {
    name: "add-role",
    aliases: ["add-lvlRole", 'add-level-role']
};