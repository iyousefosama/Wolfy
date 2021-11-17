const fs = require('fs')
const Discord = require('discord.js')
const schema = require('../../schema/GuildSchema')
const { prefix } = require('../../config.json');

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
    permissions: ["ADMINISTRATOR", "MANAGE_ROLES"],
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
        
    if(!data.Mod.Level.isEnabled) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **levels** command is disabled in this server!\nTo enable this feature, use the \`${prefix}leveltoggle\` command.`})
    const provide = new Discord.MessageEmbed()
    .setTitle('You need to provide a role ID.')
    .setColor('RED')
    .setTimestamp()

    const Role_To_Remove = args[0]
    if(!Role_To_Remove) return message.channel.send({ embeds: [provide] })
    if(isNaN(Role_To_Remove)) return message.channel.send({ embeds: [provide] })

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
        return message.channel.send({ embeds: [No_Roles] })
    } else {
        const Removing_Level_Role = Level_Roles.filter(id => {
            return id.Level_Role_ID !== `${Role_To_Remove}`
        });
        fs.writeFileSync('./Storages/Level-Roles.json', JSON.stringify(Removing_Level_Role, null, 4));
        
        const Success = new Discord.MessageEmbed()
        .setTitle('Level Role has been successfully removed.')
        .setColor("DARK_GREEN")
        .setTimestamp()
        message.channel.send({ embeds: [Success] })
        //Saves the Data, this also means that it won't bring back the previous data after it got deleted
        return setTimeout(() => {
            const Saving_Data = fs.readFileSync('./Storages/Level-Roles.json', 'utf8')
            const Saved_Data = JSON.parse(Saving_Data.toString())
            fs.writeFileSync('./Storages/Level-Roles.json', JSON.stringify(Saved_Data, null, 4))
        }, 1000)
    }
}
}