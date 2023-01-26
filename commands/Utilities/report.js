const discord = require('discord.js')
const schema = require('../../schema/GuildSchema')
const TimeoutSchema = require('../../schema/TimeOut-Schema')
const moment = require("moment");
const { ChannelType } = require('discord.js')

module.exports = {
    name: "report",
    aliases: ["Report", "REPORT"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user> <reason>',
    group: 'Utilities',
    description: 'To report someone in the server',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: [discord.PermissionsBitField.Flags.ViewChannel, discord.PermissionsBitField.Flags.UseExternalEmojis],
    examples: [
        '@WOLF bad boy'
      ],
    async execute(client, message, args) {
    let user = message.mentions.users.first()
    if (!user) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, Please mention a user to report!` })

    let reason = args.slice(1).join(" ")
    if (!reason) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, Please provide a reason!`})

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
    let Channel = client.channels.cache.get(data.Mod.Reports.channel)
    if(!Channel) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the reports channel please contact mod or use \`w!setreportch\` cmd.`})
    if(Channel.type !== ChannelType.GuildText) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the reports channel please contact mod or use \`w!setreportch\` cmd.`})
    if(!data.Mod.Reports.isEnabled) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, The **reports** command is disabled in this server!`})

    let Avatar = user.displayAvatarURL(({dynamic: true, size: 512}));

    if (TimeOutData.reports > now){
        const embed = new discord.EmbedBuilder()
        .setTitle(`<a:pp802:768864899543466006> Report already Send!`)
        .setDescription(`\\❌ **${message.author.tag}**, You already send your **report** earlier!\nYou can send your report again after \`${moment.duration(TimeOutData.reports - now, 'milliseconds').format('H [hours,] m [minutes, and] s [seconds]')}\``)
        .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048})})
        .setColor('Red')
        message.channel.send({ embeds: [embed] })
      } else {
    TimeOutData.reports = Math.floor(Date.now() + duration);
    await TimeOutData.save()
    const embed = new discord.EmbedBuilder()
    .setTitle('New Report!')
    .setDescription(`The Member \`${message.author.tag}\` has reported the user \`${user.tag}\`!`)
    .setColor("Red")
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