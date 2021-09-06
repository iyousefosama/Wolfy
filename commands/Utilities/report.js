const discord = require('discord.js')
const schema = require('../../schema/GuildSchema')

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
    if (!user) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, Please mention a user to report!` })

    let reason = args.slice(1).join(" ")
    if (!reason) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, Please provide a reason!`})

    let data;
    try{
        data = await schema.findOne({
            GuildID: message.guild.id
        })
        if(!data) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the reports channel please contact mod or use \`w!set\` cmd.`})
    } catch(err) {
        console.log(err)
    }
    let Channel = client.channels.cache.get(data.ReportsChannel)
    if(!Channel) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the reports channel please contact mod or use \`w!set\` cmd.`})
    if(Channel.type !== 'GUILD_TEXT') return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the reports channel please contact mod or use \`w!set\` cmd.`})

    let Avatar = user.displayAvatarURL(({dynamic: true, format: 'png', size: 512}));

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
    Channel.send({ embeds: [embed] })
    message.channel.send({ content: '\\✔️ Successfully sent Your report!'})
    }
}