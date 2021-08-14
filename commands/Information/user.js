const discord = require('discord.js'); 
const moment = require("moment");
const axios = require("axios")

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return; // make sure its starts with the prefix
    if(!message.member.guild.me.hasPermission([SEND_MESSAGES, EMBED_LINKS, USE_EXTERNAL_EMOJIS])) return;
    let mentionedMember = message.mentions.members.first() || message.member; // wehnever i type mentioned member that mean message.mentions.members.first() || message.member

    
    var game = mentionedMember.presence.game // whenever i type game, it makes ref. to the game the person is playing

    
    var status = mentionedMember.presence.status; // whenever i type status, it makes ref. to the user's status


    // organising the code so it don't look bad
    if(status == 'dnd') status = "<:8608_do_not_disturb:809995753577644073> Do Not Disturb" // if the person is dnd  so it will type in the embed Do no Distrub
    if(status == 'online') status = "<:online:809995753921576960> Online"
    if(status == 'offline') status = "<:offline:809995754021978112> Offline"
    if(status === 'idle') status = "<:Idle:809995753656549377> Idle"

    
    const roles = mentionedMember.roles.cache // getting the roles of the person
    .sort((a, b) => b.position - a.position)
    .map(role => role.toString())
    .slice(0, -1);

    let displayRoles;

    // if he have less then 20 role, display it
    if(roles.length < 20) {
        displayRoles = roles.join(' ')
        if(roles.length < 1) displayRoles = "None" // if no roles say None

    } else {

        // if he have more then 20 just display 20 roles
        displayRoles = roles.slice(20).join(' ')
    }

    let res = (await axios({
        method: "GET",
        url: `https://discord.com/api/v8/users/${mentionedMember.id}`,
        headers: {
          Authorization: `Bot ${Client.token}`
        }
      })).data
    
    const userEmbed = new discord.MessageEmbed() // create an embed
     .setAuthor(`User information of ${mentionedMember.user.username}`, mentionedMember.user.displayAvatarURL({dynamic: true, size: 2048}))
     .addFields(
		{ name: '<a:pp224:853495450111967253> **Tag: **', value: `${mentionedMember.user.tag}` },
        { name: '<:pp499:836168214525509653> **Username: **', value: mentionedMember.user.username || "None" },
		{ name: '\u200B', value: '\u200B' },
		{ name: '<:pp198:853494893439352842> **ID: **', value: `${mentionedMember.id}`, inline: true },
		{ name: '<a:pp472:853494788791861268> **Status: **', value: `${status}`, inline: true },
        { name: '<:pp179:853495316186791977> **Game: **', value: `${game || 'None'}`, inline: true },
        { name: '📆 **Account Created At: **', value: `${moment.utc(mentionedMember.user.createdAt).format('LT')} ${moment.utc(mentionedMember.user.createdAt).format('LL')} ${moment.utc(mentionedMember.user.createdAt).fromNow()}`, inline: true },
        { name: '📥 **Joined The Server At: **', value: `${moment(mentionedMember.joinedAt).format("LT")} ${moment(mentionedMember.joinedAt).format('LL')} ${moment(mentionedMember.joinedAt).fromNow()}`, inline: true },
	)
    .addField(`🖼️ **Avatar: **`, `[Click here to view Avatar](${mentionedMember.user.displayAvatarURL({ dynamic: true})})`)
    .addFields(
        { name: "Roles", value: `${roles.length < 20 ? roles.join(", ") : roles.length > 20 ? trimArray(roles).join(", ") : "<a:pp681:774089750373597185> Bot can maximum display 20 roles!"}`, inline:false },
        )
    .setImage(`https://cdn.discordapp.com/banners/${mentionedMember.user.id}/${res["banner"]}.gif?size=1024`)
    message.channel.send(userEmbed) // sends the embed
}

module.exports.help = {
    name: "user",
    aliases: ['User']
}