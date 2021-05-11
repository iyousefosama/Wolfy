const discord = require('discord.js')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;

    let suggestion = args.slice(0).join(" ")
    if (!suggestion) return message.channel.send("please provide a suggestions!")

    let Channel = message.guild.channels.cache.find((ch) => ch.name === "💡┃𝕊𝕦𝕘𝕘𝕖𝕤𝕥𝕚𝕠𝕟𝕤")
    if (!Channel) return message.channel.send("There is no channel called suggestions, please contact a mod or create a channel called `reports`");

    const embed = new discord.MessageEmbed()
    .setTitle('New suggestions!')
    .setDescription(`${suggestion}`)
    .setThumbnail(message.author.displayAvatarURL())
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

module.exports.help = {
    name: "suggestion",
    aliases: ['sugg', 'Suggestion']
}