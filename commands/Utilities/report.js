const discord = require('discord.js')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
    if (!message.guild.me.permissions.has("SEND_MESSAGES") || !message.guild.me.permissions.has("EMBED_LINKS") || !message.guild.me.permissions.has("USE_EXTERNAL_EMOJIS") || !message.guild.me.permissions.has("ADD_REACTIONS") || !message.guild.me.permissions.has("VIEW_CHANNEL") || !message.guild.me.permissions.has("ATTACH_FILES") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY") || !message.guild.me.permissions.has("READ_MESSAGE_HISTORY")) return;
    let user = message.mentions.users.first()
    if (!user) return message.channel.send('Please mention a user to report!')

    let reason = args.slice(1).join(" ")
    if (!reason) return message.channel.send("please provide a reason!")

    let Avatar = user.displayAvatarURL();
    let Channel = message.guild.channels.cache.find((ch) => ch.name === "reports") //report
    if (!Channel) return message.channel.send("There is no channel called reports, please contact a mod or create a channel called `reports`");

    const embed = new discord.MessageEmbed()
    .setTitle('New Report!')
    .setDescription(`The Member \`${message.author.tag}\` has reported the user \`${user.tag}\`!`)
    .setColor("RED")
    .setThumbnail(Avatar)
    .addFields(
        { name: "Member ID", value: `${message.author.id}`, inline: true},
        { name: "Member Tag", value: `${message.author.tag}`, inline: true},
        { name: "Reported ID", value: `${user.id}`, inline: true},
        { name: "Reported Tag", value: `${user.tag}`, inline: true},
        { name: "Reason", value: `${reason}`, inline: true}
    )
    Channel.send(embed)
    message.channel.send('<a:Right:812104211386728498> **Successfully sent the report!**')

}

module.exports.help = {
    name: "report",
    aliases: ['Report']
}