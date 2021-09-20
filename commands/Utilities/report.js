const discord = require('discord.js')
const schema = require('../../schema/GuildSchema')
const userschema = require('../../schema/user-schema')

module.exports = {
    name: "report",
    aliases: ["Report", "REPORT"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user> <reason>',
    group: 'Utilities',
    description: 'To report someone in the server',
    cooldown: 3600, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: ["VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS"],
    examples: [
        '@WOLF bad boy'
      ],
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
        if(!data) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the reports channel please contact mod or use \`w!setreportch\` cmd.`})
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
    let Channel = client.channels.cache.get(data.Mod.Reports.channel)
    if(!Channel) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the reports channel please contact mod or use \`w!setreportch\` cmd.`})
    if(Channel.type !== 'GUILD_TEXT') return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the reports channel please contact mod or use \`w!setreportch\` cmd.`})
    if(!data.Mod.Reports.isEnabled) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **reports** command is disabled in this server!`})

    let Avatar = user.displayAvatarURL(({dynamic: true, format: 'png', size: 512}));

    const now = Date.now();
    const duration = Math.floor(57600000)
    if (data.timer.reports.timeout > now){
        const embed = new Discord.MessageEmbed()
        .setTitle(`<a:pp802:768864899543466006> Report already Send!`)
        .setDescription(`\\❌ **${message.author.tag}**, You already send your **report** earlier!\nYou can send your report again after \`${moment.duration(data.timer.reports.timeout - now, 'milliseconds').format('H [hours,] m [minutes, and] s [seconds]')}\``)
        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setColor('RED')
        message.channel.send({ embeds: [embed] })
      } else {
    data.timer.reports.timeout = Date.now() + duration;
    await time.save()
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
    message.channel.send({ content: `<:Verify:841711383191879690> **${message.member.displayName}**, Successfully sent Your **report**!`})
    }
}
}