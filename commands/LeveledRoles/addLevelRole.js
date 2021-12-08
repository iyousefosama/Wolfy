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
    group: 'LeveledRoles',
    description: 'Add a level role as a prize for users when they be active',
    cooldown: 1, //seconds(s)
    guarded: false, //or false
    permissions: ["ADMINISTRATOR", "MANAGE_ROLES"],
    examples: [
        '@ActiveMember 5'
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

        const Role_To_Add = message.mentions.roles.first()
        if(!Role_To_Add) return message.channel.send(`\\❌ **${message.member.displayName}**, Please provide the role mention or id!`)

        const Level_To_Reach = args[1]
        if(!Level_To_Reach) return message.channel.send(`\\❌ **${message.member.displayName}**, Please provide the role level!`)
        if(isNaN(Level_To_Reach)) return message.channel.send(`\\❌ **${message.member.displayName}**, Please provide the role level with number of level!`)

        if(Level_To_Reach.includes('+')) return message.channel.send(`\\❌ **${message.member.displayName}**, Please provide the role level with number of level!`)
        if(Level_To_Reach.includes('-')) return message.channel.send(`\\❌ **${message.member.displayName}**, Please provide the role level with number of level!`)
        if(Level_To_Reach.includes('.')) return message.channel.send(`\\❌ **${message.member.displayName}**, Please provide the role level with number of level!`)
        if(!data.Mod.Level.isEnabled) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **levels** command is disabled in this server!\nTo enable this feature, use the \`${prefix}leveltoggle\` command.`})

        const Level_Roles_Storage = fs.readFileSync('assets/json/Level-Roles.json')
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
            fs.writeFileSync('assets/json/Level-Roles.json', New_Level_Role)
            return message.channel.send(`\\✔️ **${message.member.displayName}**, New Level Role has been successfully added.`)
        } else {
            return message.channel.send(`\\❌ **${message.member.displayName}**, There is already a role that has that same level to reach.`)
        }
    }
}