const { MessageEmbed, version: discord_version } = require('discord.js'); // requiring discord modules
const { version, author } = require('../../package.json');
const { release, cpus } = require('os');
const moment = require(`moment`) // requiring moment
const { heapUsed, heapTotal } = process.memoryUsage();

module.exports = {
    name: "stats",
    aliases: ["Botinfo", "BotInfo", "BOTINFO", "Stats", "STATS"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES"],
    async execute(client, message, args) {
    const embed = new MessageEmbed()
    .setColor('738ADB') // will set the color for the embed
    .setAuthor(client.user.username, client.user.displayAvatarURL(({dynamic: true, format: 'png', size: 512})))
    .setTitle(`${client.user.username} Bot's stats`) // make the title for the cmd
    .setURL(`https://Wolfy.yoyojoe.repl.co`)
    .setThumbnail(client.user.displayAvatarURL()) // it will put the bot avatar (pfp) in the embed
    .setImage(`https://cdn.discordapp.com/attachments/830926767728492565/874773027177512960/c7d26cb2902f21277d32ad03e7a21139.gif`)
    .setDescription(`**General**
    <:Bot:841711382739157043> **Username:** ${client.user.username}
    <a:pp224:853495450111967253> **Tag:** ${client.user.tag}
    <:pp198:853494893439352842> **ID:** ${client.user.id}
    📆 **Created At:** ${moment(client.user.createdAt).format("DD-MM-YYYY [at] HH:mm")}
    <:Developer:841321892060201021> **Developer:** <@829819269806030879>
    <a:LightUp:776670894126006302> **Bot Website:** https://Wolfy.yoyojoe.repl.co\n\`\`\`message.channel.type === 'DM' && cmd.name: The.........BaskokaMan!\`\`\`
    **Version:** \`${version}\`
    ━━━━━━━━━━━━━━━━━━
    <a:Settings:841321893750505533> **System**
    **Memory Used** (heap)**:** [\` ${(heapUsed / 1024 / 1024).toFixed(0)} MB \`]
    🖥️ **OS:** ${process.platform} ${release}
   ** DiscordJS:** v${discord_version}
    **Node:** ${process.version}
    **CPU:** ${cpus()[0].model}
    \n\n**Stats**`)
    .addFields(
		{ name: '<a:pp594:768866151827767386> **Servers:**', value: `\`\`\`${client.guilds.cache.size}\`\`\``},
		{ name: '⌨️ **Channels:**', value: `\`\`\`${client.channels.cache.size}\`\`\`` },
        { name: '<:pp833:853495153280155668> **Users:**', value: `\`\`\`${client.users.cache.size}\`\`\`` },
	)
        message.channel.sendTyping()
        message.reply({ content: `> **Viewing ${client.user.username} stats for • [**  ${message.author.tag} **]**`,embeds: [embed], allowedMentions: { repliedUser: true } })
    }
}