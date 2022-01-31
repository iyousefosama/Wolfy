const discord = require('discord.js')
const canvacord = require('canvacord')
const Levels = require('discord-xp')
const schema = require('../../schema/GuildSchema')
const { prefix } = require('../../config.json');

module.exports = {
    name: "clearxp",
    aliases: ["Clearxp", "ClearXp", "CLEARXP"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user>',
    group: 'LeveledRoles',
    description: 'Clear the xp for a user in the server',
    cooldown: 3, //seconds(s)
    guarded: false, //or false
    permissions: ["ADMINISTRATOR"],
    examples: [
        '@WOLF',
        '724580315481243668'
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

        const usererr = new discord.MessageEmbed()
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true}) })
        .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({dynamic: true}) })
        .setDescription('<a:pp802:768864899543466006> Please mention the user to clearXp')
        .setColor("RED")
        .setTimestamp()
        const error = new discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setDescription('<a:pp802:768864899543466006> Error, you can\'t clearXp for this user!')
        .setColor("RED")
        .setTimestamp()
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(" ") || x.user.username === args[0])
        if (!user) return message.channel.send(usererr)
        if(!data.Mod.Level.isEnabled) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **levels** command is disabled in this server!\nTo enable this feature, use the \`${prefix}leveltoggle\` command.`})
        Levels.deleteUser(user.id || user, message.guild.id);
        const dn = new discord.MessageEmbed()
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true}) })
        .setFooter({ text: message.guild.name, iconURl: message.guild.iconURL({dynamic: true}) })
        .setDescription(`<a:Correct:812104211386728498> Done, i cleared **xp** for ${user}!`)
        .setColor('DARK_GREEN')
        .setTimestamp()
        message.channel.send({ embeds: [dn] })
        .catch(err => {
            message.channel.send({ embeds: [error]})
        })
    }
}