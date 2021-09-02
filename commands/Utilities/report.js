const discord = require('discord.js')

module.exports = {
    name: "report",
    aliases: ["Report", "REPORT"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user> <reason>',
    cooldown: 3600, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
    let user = message.mentions.users.first()
    if (!user) return message.channel.send({ content: 'Please mention a user to report!'})

    let reason = args.slice(1).join(" ")
    if (!reason) return message.channel.send({ content: "please provide a reason!"})

    let Avatar = user.displayAvatarURL(({dynamic: true, format: 'png', size: 512}));
    let reports = message.guild.channels.cache.find((ch) => ch.name === "reports") //report
    if (!reports) return message.channel.send({ content: "There is no channel called reports, please contact a mod or create a channel called `reports`"})
    if (reports.type !== 'GUILD_TEXT') return message.channel.send({ content: "There is no channel called suggestions, please contact a mod or create a channel called `💡┃𝕊𝕦𝕘𝕘𝕖𝕤𝕥𝕚𝕠𝕟𝕤`"});

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
    reports.send({ embeds: [embed] })
    message.channel.send({ content: '<a:Right:812104211386728498> **Successfully sent the report!**'})
    }
}