const discord = require('discord.js')

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
    if (!suggestion) return message.channel.send("please provide a suggestions!")

    let Channel = message.guild.channels.cache.find((ch) => ch.name === "💡┃𝕊𝕦𝕘𝕘𝕖𝕤𝕥𝕚𝕠𝕟𝕤")
    if (!Channel) return message.channel.send("There is no channel called suggestions, please contact a mod or create a channel called `💡┃𝕊𝕦𝕘𝕘𝕖𝕤𝕥𝕚𝕠𝕟𝕤`");

    const embed = new discord.MessageEmbed()
    .setTitle('New suggestions!')
    .setDescription(`${suggestion}`)
    .setThumbnail(message.author.displayAvatarURL(({dynamic: true, format: 'png', size: 512})))
    .addFields(
        { name: "From member", value: `${message.author.tag}`, inline: true},
        { name: "Member ID", value: `${message.author.id}`, inline: true}
    )
    Channel.send(embed).then(sentEmbed => {
        sentEmbed.react("812104211386728498")
        sentEmbed.react("812104211361693696")
    })
    message.delete()
    message.channel.send('<a:Right:812104211386728498> **successfully sent the suggestion!**')
}
}
