const discord = require('discord.js')
const schema = require('../../schema/GuildSchema')
const userschema = require('../../schema/user-schema')
const moment = require("moment");

module.exports = {
    name: "suggestion",
    aliases: ["Suggestion", "sugg"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<suggestion>',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS", "ADD_REACTIONS"],
    async execute(client, message, args) {
    let data;
    try{
        data = await schema.findOne({
            GuildID: message.guild.id
        })
        if(!data) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the suggestions channel please contact mod or use \`w!setSuggch\` cmd.`})
    } catch(err) {
        console.log(err)
    }
    let time;
    try{
        time = await userschema.findOne({
            userId: message.author.id
        })
        if(!time) {
        time = await userschema.create({
            userId: message.author.id
        })
        }
    } catch(err) {
        console.log(err)
    }
    let suggestion = args.slice(0).join(" ")
    if (!suggestion) return message.channel.send({ content: "please provide a suggestions!"})
    let Channel = client.channels.cache.get(data.Mod.Suggestion.channel)
    if(!Channel) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the suggestions channel please contact mod or use \`w!setSuggch\` cmd.`})
    if(Channel.type !== 'GUILD_TEXT') return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the suggestions channel please contact mod or use \`w!setSuggch\` cmd.`})
    if(!data.Mod.Suggestion.isEnabled) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **suggestions** command is disabled in this server!`})
    const now = Date.now();
    const duration = Math.floor(57600000)
    if (time.timer.suggestion.timeout > now){
        const embed = new discord.MessageEmbed()
        .setTitle(`<a:pp802:768864899543466006> Suggestion already Send!`)
        .setDescription(`\\❌ **${message.author.tag}**, You already send your **suggestion** earlier!\nYou can send your suggestion again after \`${moment.duration(time.timer.suggestion.timeout - now, 'milliseconds').format('H [hours,] m [minutes, and] s [seconds]')}\``)
        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setColor('RED')
        message.channel.send({ embeds: [embed] })
      } else {
    time.timer.suggestion.timeout = Date.now() + duration;
    await time.save()
    const embed = new discord.MessageEmbed()
    .setTitle('New suggestions!')
    .setDescription(`${suggestion}`)
    .setThumbnail(message.author.displayAvatarURL(({dynamic: true, format: 'png', size: 512})))
    .addFields(
        { name: "From member", value: `${message.author.tag}`, inline: true},
        { name: "Member ID", value: `${message.author.id}`, inline: true}
    )
    message.delete()
    Channel.send({ embeds: [embed]}).then(async sentEmbed => {
        await sentEmbed.react("812104211386728498")
        setTimeout(async () => {
        await sentEmbed.react("812104211361693696")
    }, 1000)
    })
    setTimeout(async function(){
    message.channel.send({ content: `<:Verify:841711383191879690> **${message.member.displayName}**, Successfully sent Your **suggestion**!`})
    }, 900);
}
}
}
