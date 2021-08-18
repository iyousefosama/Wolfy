const discord = require('discord.js')
const moment = require("moment");

module.exports = {
    name: "invite",
    aliases: ["invites", "Invites", "INVITES"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '<user>',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES"],
    async execute(client, message, args) {
    let user = message.mentions.users.first() || message.author
    let invites = await message.guild.fetchInvites();
    let userInv = invites.filter(u => u.inviter && u.inviter.id === user.id)
    const Messingperms = new discord.MessageEmbed()
    .setColor(`RED`)
    .setDescription(`${user.username} don't have any invites! <a:Wrong:812104211361693696>`)
    if(userInv.size <= 0) {
        return message.channel.send(Messingperms)
    }

    let invCodes = userInv.map(x => x.code).join('\n')
    let i = 0;
    userInv.forEach(inv => i += inv.uses)

    const embed = new discord.MessageEmbed()
    .setAuthor(user.username, user.displayAvatarURL())
    .addFields(
		{ name: '`🔗` Invite Codes', value: invCodes },
		{ name: '\u200B', value: '\u200B' },
		{ name: '<:pp833:853495153280155668> User Total Invites', value: i, inline: true },
		{ name: '<:pp499:836168214525509653> Server', value: `${message.channel.guild.name}`, inline: true },
	)
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp()
    message.channel.send(embed)
    }
}
