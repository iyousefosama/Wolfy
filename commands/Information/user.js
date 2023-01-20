const discord= require('discord.js'); 
const moment = require("moment");
const axios = require("axios")

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
    const activity = member.presence?.activities;
    const activityNames = member.presence?.activities.map(activity => activity.name).join(", ");
    var status = member.presence?.status;

    if(status == null) status = '<:offline:809995754021978112> Offline'
    // organising the code so it don't look bad
    if(status == 'dnd') status = "<:8608_do_not_disturb:809995753577644073> Do Not Disturb" // if the person is dnd  so it will type in the embed Do no Distrub
    if(status == 'online') status = "<:online:809995753921576960> Online"
    if(status == 'offline') status = "<:offline:809995754021978112> Offline"
    if(status === 'idle') status = "<:Idle:809995753656549377> Idle"
    const flags = {
        discord_EMPLOYEE: '<:discord_Staff:911761250759893012> discord Employee',
        discord_PARTNER: '<:discord_partner:911760719266086942> discord Partner',
        BUGHUNTER_LEVEL_1: '<:Bug_Hunter:911761250843762718> Bug Hunter (Level 1)',
        BUGHUNTER_LEVEL_2: '<:Bug_Hunter_level2:911760719429660683> Bug Hunter (Level 2)',
        HYPESQUAD_EVENTS: '<:HypeSquad_Event:911760719345762355> HypeSquad Events',
        HOUSE_BRAVERY: '<:HypeSquad_Bravery:911760719106703371> House of Bravery',
        HOUSE_BRILLIANCE: '<:HypeSquad_Brilliance:911760719417065523> House of Brilliance',
        HOUSE_BALANCE: '<:HypeSquad_Balance:911760719429632020> House of Balance',
        EARLY_SUPPORTER: '<:early_supporter:911760718880194645> Early Supporter',
        TEAM_USER: 'Team User',
        SYSTEM: '<:discord:887894225323192321> System',
        VERIFIED_BOT: '<:Verified:911762191731015740> Verified Bot',
        VERIFIED_DEVELOPER: '<:Verified_Bot_Developer:911760719261859870> Verified Bot Developer'
    };
    const userFlags = member.user.flags?.toArray();

    
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

    let url = null;
    const data = await axios.get(`https://discord.com/api/users/${user.id}`, {
      headers: {
          Authorization: `Bot ${client.token}`
      }
  }).then(d => d.data);
  if(data.banner){
      url = data.banner.startsWith("a_") ? ".gif?size=4096" : ".png?size=4096";
      url = `https://cdn.discordapp.com/banners/${user.id}/${data.banner}${url}`;
  } else {
      url = null
  }

    const userEmbed = new discord.MessageEmbed()
     .setAuthor({ name: `User information of ${member.user.username}`, iconURL: member.user.displayAvatarURL({dynamic: true, size: 2048}), url: member.user.displayAvatarURL({dynamic: true, size: 2048}) })
     .addFields(
		{ name: '<a:pp224:853495450111967253> **Tag: **', value: member.user.tag || 'None' },
        { name: '<:pp499:836168214525509653> **Username: **', value: member.user.username || 'None' },
		{ name: '\u200B' || '-', value: '\u200B' || '-' },
		{ name: '<:pp198:853494893439352842> **ID: **', value: member.id || 'None', inline: true },
		{ name: '<a:pp472:853494788791861268> **Status: **', value: `${status || "<:offline:809995754021978112> Offline"}`, inline: true },
        { name: '<:pp179:853495316186791977> **Game: **', value: `${activityNames ? activityNames : "None"  || "None"}`, inline: true },
        { name: '📆 **Account Created At: **', value: `${moment.utc(member.user.createdAt).format('LT') || 'None'} ${moment.utc(member.user.createdAt).format('LL') || 'None'} ${moment.utc(member.user.createdAt).fromNow() || 'None'}` || 'None', inline: true },
        { name: '📥 **Joined The Server At: **', value: `${moment(member.joinedAt).format("LT") || 'None'} ${moment(member.joinedAt).format('LL') || 'None'} ${moment(member.joinedAt).fromNow() || 'None'}` || 'None', inline: true },
        { name: `🖼️ **Avatar: **`, value: `[Click here to view Avatar](${member.user.displayAvatarURL({ dynamic: true, size: 1024 }) || null})`, inline:false },
        { name: "<:medal:898358296694628414> Flags", value: `${userFlags?.length ? userFlags?.map(flag => flags[flag]).join(", ") : 'None' || "None"}`, inline:false },
        { name: "Roles", value: `${roles.length < 20 ? roles.join(", ") : "(\`20+ roles...\`)!" || 'None'}`, inline:false },
        { name: "Permissions", value: `${message.guild ? member.permissions?.toArray().map(p=>`\`${p.split('_').map(x => x[0] + x.slice(1).toLowerCase()).join(' ')}\``).join(", ") : "None" || 'None'}`, inline:false },
	)
    .setImage(url)
    .setThumbnail(member.user.displayAvatarURL({dynamic: true, size: 2048}))
    .setFooter({ text: `User info.` + ` | \©️${new Date().getFullYear()} Wolfy`, iconURL: client.user.avatarURL({dynamic: true}) })
    .setTimestamp()
    message.reply({ embeds: [userEmbed] })
    }
}
