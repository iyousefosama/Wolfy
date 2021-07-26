const discord = require('discord.js'); 
const moment = require("moment");

module.exports.run = async (Client, message, args, prefix) => {

    if(!message.content.startsWith(prefix)) return; // make sure its starts with the prefix

    
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

    
    const userEmbed = new discord.MessageEmbed() // create an embed
     .setAuthor(`User information of ${mentionedMember.user.username}`, mentionedMember.user.displayAvatarURL({dynamic: true, size: 2048})) // User information of: KarimX and it will display my pfp
     .addFields(
		{ name: '<a:pp289:782760183420026881> **Tag: **', value: `${mentionedMember.user.tag}` },
        { name: '<a:rainbow_excited:759734576519053322> **Username: **', value: mentionedMember.user.username || "None" },
		{ name: '\u200B', value: '\u200B' },
		{ name: '<:pp198:853494893439352842> **ID: **', value: `${mentionedMember.id}`, inline: true },
		{ name: '<a:pp472:853494788791861268> **Status: **', value: `${status}`, inline: true },
        { name: '<:pp179:853495316186791977> **Game: **', value: `${game || 'None'}`, inline: true },
        { name: '📆 **Account Created At: **', value: `${moment(mentionedMember.createdAt).format("DD-MM-YYYY [at] HH:mm")}`, inline: true },
        { name: '📥 **Joined The Server At: **', value: `${moment(mentionedMember.joinedAt).format("DD-MM-YYYY [at] HH:mm")}`, inline: true },
	)
    .addField(`🖼️ **Avatar: **`, `[Click here to view Avatar](${mentionedMember.user.displayAvatarURL({ dynamic: true})})`)
    .addFields(
        { name: "Roles", value: `${roles.length < 10 ? roles.join(", ") : roles.length > 10 ? trimArray(roles).join(", ") : "None"}`, inline:false },
        )
    message.channel.send(userEmbed) // sends the embed
    
}

module.exports.help = {
    name: "user",
    aliases: ['User']
}