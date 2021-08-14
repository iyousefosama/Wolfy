const discord = require('discord.js')
const cooldown = new Set();

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if(!message.guild.me.permissions.has('SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS')) return;
    if(cooldown.has(message.author.id)) {
        message.reply('<a:Wrong:812104211361693696> You can send you suggestion only every \`30 minutes\`')
    } else {

    let suggestion = args.slice(0).join(" ")
    if (!suggestion) return message.channel.send("please provide a suggestions!")

    let Channel = message.guild.channels.cache.find((ch) => ch.name === "💡┃𝕊𝕦𝕘𝕘𝕖𝕤𝕥𝕚𝕠𝕟𝕤")
    if (!Channel) return message.channel.send("There is no channel called suggestions, please contact a mod or create a channel called `💡┃𝕊𝕦𝕘𝕘𝕖𝕤𝕥𝕚𝕠𝕟𝕤`");

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
    cooldown.add(message.author.id);
    setTimeout(() => {
        cooldown.delete(message.author.id)
    }, 1800000); // here will be the time in miliseconds 5 seconds = 5000 miliseconds
    }

}

module.exports.help = {
    name: "suggestion",
    aliases: ['sugg', 'Suggestion']
}