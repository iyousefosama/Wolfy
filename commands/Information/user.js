const discord = require('discord.js'); 
const moment = require("moment");
const axios = require("axios")
const text = require('../../util/string');

module.exports = {
    name: "user",
    aliases: ["User", "USER"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '<user>',
    group: 'Informations',
    description: 'Shows informations about a user',
    cooldown: 3, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES"],
    examples: [
        '@WOLF',
        ''
      ],
    async execute(client, message, [user = '']) {

    if (message.guild){
      const id = (user.match(/\d{17,19}/)||[])[0] || message.author.id;

      member = await message.guild.members.fetch(id)
      .catch(() => message.member);

      user = member.user;
    } else {
      user = message.author;
    };
    var status = member.presence?.status;

    if(status == null) status = '<:offline:809995754021978112> Offline'
    // organising the code so it don't look bad
    if(status == 'dnd') status = "<:8608_do_not_disturb:809995753577644073> Do Not Disturb" // if the person is dnd  so it will type in the embed Do no Distrub
    if(status == 'online') status = "<:online:809995753921576960> Online"
    if(status == 'offline') status = "<:offline:809995754021978112> Offline"
    if(status === 'idle') status = "<:Idle:809995753656549377> Idle"

    
    const roles = member.roles.cache // getting the roles of the person
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
        url: `https://discord.com/api/v8/users/${member.id}`,
        headers: {
          Authorization: `Bot ${client.token}`
        }
      })).data
    
    const userEmbed = new discord.MessageEmbed() // create an embed
     .setAuthor(`User information of ${member.user.username}`, member.user.displayAvatarURL({dynamic: true, size: 2048}), member.user.displayAvatarURL({dynamic: true, size: 2048}))
     .addFields(
		{ name: '<a:pp224:853495450111967253> **Tag: **', value: `${member.user.tag}` },
        { name: '<:pp499:836168214525509653> **Username: **', value: member.user.username || "None" },
		{ name: '\u200B', value: '\u200B' },
		{ name: '<:pp198:853494893439352842> **ID: **', value: `${member.id}`, inline: true },
		{ name: '<a:pp472:853494788791861268> **Status: **', value: `${status}`, inline: true },
        { name: '<:pp179:853495316186791977> **Game: **', value: `None`, inline: true },
        { name: '📆 **Account Created At: **', value: `${moment.utc(member.user.createdAt).format('LT')} ${moment.utc(member.user.createdAt).format('LL')} ${moment.utc(member.user.createdAt).fromNow()}`, inline: true },
        { name: '📥 **Joined The Server At: **', value: `${moment(member.joinedAt).format("LT")} ${moment(member.joinedAt).format('LL')} ${moment(member.joinedAt).fromNow()}`, inline: true },
	)
    .addField(`🖼️ **Avatar: **`, `[Click here to view Avatar](${member.user.displayAvatarURL({ dynamic: true})})`)
    .addFields(
        { name: "Roles", value: `${roles.length < 20 ? roles.join(", ") : "Bot can maximum display (\`20 roles\`)!" || '\u200b'}`, inline:false },
        )
    .setImage(`https://cdn.discordapp.com/banners/${member.user.id}/${res["banner"]}size=1024`)
    .setThumbnail(member.user.displayAvatarURL({dynamic: true, size: 2048}))
    .setTimestamp()
    message.channel.send({ embeds: [userEmbed] }) // sends the embed
    }
}