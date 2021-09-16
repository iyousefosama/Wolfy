const fs = require('fs')
const Discord = require('discord.js')
const schema = require('../../schema/GuildSchema')
const { prefix } = require('../../config.json');

module.exports = {
    name: "addrolle",
    aliases: ["Addrole", "ADDROLE", "addlevelroole", "add-role"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<role> <number>',
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

        const provide = new Discord.MessageEmbed()
        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
        .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
        .description('<a:Wrong:812104211361693696> You need to mention a role.')
        .setColor('RED')
        .setTimestamp()
        const provideLevel = new Discord.MessageEmbed()
        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
        .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setTitle('You need to provide a number!')
        .setDescription('<a:Error:836169051310260265> This will give a user the role when the user reached the level.')
        .setColor('RED')
        .setTimestamp()

        const Role_To_Add = message.mentions.roles.first()
        if(!Role_To_Add) return message.channel.send({ embeds: [provide] })

        const Level_To_Reach = args[1]
        if(!Level_To_Reach) return message.channel.send({ embeds: [provideLevel] })
        if(isNaN(Level_To_Reach)) return message.channel.send({ embeds: [provideLevel] })

        if(Level_To_Reach.includes('+')) return message.channel.send({ embeds: [provideLevel] })
        if(Level_To_Reach.includes('-')) return message.channel.send({ embeds: [provideLevel] })
        if(Level_To_Reach.includes('.')) return message.channel.send({ embeds: [provideLevel] })
        if(!data.Mod.Level.isEnabled) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **levels** command is disabled in this server!\nTo enable this feature, use the \`${prefix}leveltoggle\` command.`})

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
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
            .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
            .setTitle('<a:Correct:812104211386728498> New Level Role has been successfully added.')
            .setColor('DARK_GREEN')
            .setTimestamp()
            return message.channel.send({ embeds: [Success] })
        } else {
            const Already = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
            .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
            .setTitle('<a:Nnno:853494186002481182> There is already a role that has that same level to reach.')
            .setColor('YELLOW')
            .setTimestamp()
            return message.channel.send({ embeds: [Already] })
        }
    }
}