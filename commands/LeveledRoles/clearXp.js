const discord = require('discord.js')
const schema = require('../../schema/GuildSchema')
const UserSchema = require('../../schema/LevelingSystem-Schema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "clearxp",
    aliases: [],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user>',
    group: 'LeveledRoles',
    description: 'Clear the xp for a user in the server',
    cooldown: 3, //seconds(s)
    guarded: false, //or false
    permissions: ["Administrator"],
    examples: [
        '@WOLF',
        '724580315481243668'
      ],
      
    async execute(client, message, [ member = '', ...args]) {


        const owner = await message.guild.fetchOwner()

        let reason = args.slice(0).join(" ")
    
        if (!member.match(/\d{17,19}/)){
          return message.channel.send(`\\❌ | ${message.author}, Please type the id or mention the user to ban.`);
        };
    
        member = await message.guild.members
        .fetch(member.match(/\d{17,19}/)[0])
        .catch(() => null);
    
        if (!member){
          return message.channel.send(`\\❌ | ${message.author}, User could not be found! Please ensure the supplied ID is valid.`);
        } else if (member.id === client.user.id){
          return message.channel.send(`\\❌ | ${message.author}, You cannot clear xp for me!`);
        } else if (member.id != message.guild.ownerId && member.id === message.guild.ownerId){
          return message.channel.send(`\\❌ | ${message.author}, You cannot clear xp for a server owner!`);
        }else if (message.member.roles.highest.position < member.roles.highest.position){
          return message.channel.send(`\\❌ | ${message.author}, You can't clear xp for that user! He/She has a higher role than yours`);
        };

        let data;
        let Userdata;
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            if(!data) {
                data = await schema.create({
                    GuildID: message.guild.id
                })
            }
            Userdata = await UserSchema.findOne({
                userId: member.id,
                guildId: message.guild.id
            })
            if(!Userdata) {
                return message.channel.send(`\\❌ | ${message.author}, I couldn't find that user in the database!`)
            }
        } catch(err) {
            console.log(err)
            message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
        }

        if(!data.Mod.Level?.isEnabled) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **levels** command is disabled in this server!\nTo enable this feature, use the \`${client.prefix}leveltoggle\` command.`})

        await Userdata.delete().then(() => {
            return message.channel.send(`\\✔️ ${message.author}, Successfully cleared xp for the user \`${member.user.username}\`!`)
        }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`))
    }
}