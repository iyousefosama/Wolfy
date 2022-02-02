const discord = require('discord.js')
const schema = require('../../schema/GuildSchema')
const TimeoutSchema = require('../../schema/TimeOut-Schema')
const moment = require("moment");

module.exports = {
    name: "suggestion",
    aliases: ["Suggestion", "sugg"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<suggestion>',
    group: 'Utilities',
    description: 'Send your suggestion for the server',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: ["EMBED_LINKS", "ADD_REACTIONS"],
    examples: [
        'Add voice channels!'
      ],    
    async execute(client, message, args) {
    const now = Date.now();
    const duration = Math.floor(57600000)
    let data;
    let TimeOutData;
    try{
        data = await schema.findOne({
            GuildID: message.guild.id
        })
        if(!data) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the suggestions channel please contact mod or use \`w!setSuggch\` cmd.`})
        TimeOutData = await TimeoutSchema.findOne({
            guildId: message.guild.id,
            userId: message.author.id
        })
        if(!TimeOutData) {
            TimeOutData = await TimeoutSchema.create({
                guildId: message.guild.id,
                userId: message.author.id
            })  
        }
    } catch(err) {
        console.log(err)
        message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
    }
    let suggestion = args.slice(0).join(" ")
    if (!suggestion) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, Please provide a suggestions!`})
    let Channel = client.channels.cache.get(data.Mod.Suggestion.channel)
    if(!Channel) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the suggestions channel please contact mod or use \`w!setSuggch\` cmd.`})
    if(Channel.type !== 'GUILD_TEXT') return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the suggestions channel please contact mod or use \`w!setSuggch\` cmd.`})
    if(!data.Mod.Suggestion.isEnabled) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **suggestions** command is disabled in this server!`})
    if (TimeOutData.suggestion > now){
        const embed = new discord.MessageEmbed()
        .setTitle(`<a:pp802:768864899543466006> Suggestion already Send!`)
        .setDescription(`\\❌ **${message.author.tag}**, You already send your **suggestion** earlier!\nYou can send your suggestion again after \`${moment.duration(TimeOutData.suggestion - now, 'milliseconds').format('H [hours,] m [minutes, and] s [seconds]')}\``)
        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setColor('RED')
        message.channel.send({ embeds: [embed] })
      } else {
    const embed = new discord.MessageEmbed()
    .setTitle(`<a:pp659:853495803967307887> ${message.member.displayName}'s Suggestion`)
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
    .setDescription(`${suggestion}`)
    .setThumbnail(message.author.displayAvatarURL(({dynamic: true, format: 'png', size: 512})))
    .addField('Status', 'Under Review', true)
    .setFooter({ text: `Suggestion System | \©️${new Date().getFullYear()} Wolfy`, iconURL: client.user.avatarURL({dynamic: true}) })
    message.delete().catch(() => null)
    Channel.send({ embeds: [embed]}).then(async sentEmbed => {
        await new Promise(r=>setTimeout(r,1500))
        await sentEmbed.react("812104211386728498").catch(() => {})
        await sentEmbed.react("812104211361693696").catch(() => {})
    })
    TimeOutData.suggestion = Math.floor(Date.now() + duration);
    await TimeOutData.save()
    setTimeout(async function(){
    message.channel.send({ content: `<:Verify:841711383191879690> **${message.member.displayName}**, Successfully sent Your **suggestion**!`})
    }, 900);
}
}
}
