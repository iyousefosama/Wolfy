const discord = require('discord.js')
const schema = require('../../schema/GuildSchema')

module.exports = {
    name: "suggestion",
    aliases: ["Suggestion", "sugg"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<suggestion>',
    cooldown: 3600, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS", "ADD_REACTIONS"],
    async execute(client, message, args) {
    let suggestion = args.slice(0).join(" ")
    if (!suggestion) return message.channel.send({ content: "please provide a suggestions!"})

    let data;
    try{
        data = await schema.findOne({
            GuildID: message.guild.id
        })
        if(!data) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the suggestions channel please contact mod or use \`w!setSuggch\` cmd.`})
    } catch(err) {
        console.log(err)
    }
    let Channel = client.channels.cache.get(data.Mod.Suggestion.channel)
    if(!Channel) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the suggestions channel please contact mod or use \`w!setSuggch\` cmd.`})
    if(Channel.type !== 'GUILD_TEXT') return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the suggestions channel please contact mod or use \`w!setSuggch\` cmd.`})
    if(!data.Mod.Suggestion.isEnabled) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **suggestions** command is disabled in this server!`})
    const embed = new discord.MessageEmbed()
    .setTitle('New suggestions!')
    .setDescription(`${suggestion}`)
    .setThumbnail(message.author.displayAvatarURL(({dynamic: true, format: 'png', size: 512})))
    .addFields(
        { name: "From member", value: `${message.author.tag}`, inline: true},
        { name: "Member ID", value: `${message.author.id}`, inline: true}
    )
    Channel.send({ embeds: [embed]}).then(async sentEmbed => {
        await sentEmbed.react("812104211386728498")
        await sentEmbed.react("812104211361693696")
    })
    setTimeout(async function(){
    message.channel.send('\\✔️ Successfully sent Your suggestion!')
    }, 900);
}
}
