const discord = require('discord.js')
const moment = require(`moment`)
const { MessageEmbed } = require("discord.js")
const { buttonsPagination } = require("djs-buttons-pagination");

const verificationLevels = {
    NONE: '<a:Error:836169051310260265> None',
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    VERY_HIGH: 'Very High'
}


// setting all the regions so it looks nice
const regions = {
    brazil: '🇧:regional_indicator_r: Brazil',
    europe: '🏰 Europe',
    hongkong: 'Hong Kong',
    india: 'India',
    japan: '🇯:regional_indicator_p: Japan',
    russia: '🇷:regional_indicator_u: Russia',
    singapore: 'Singapore',
    southafrica: 'South Africa',
    sydeny: 'Sydeny',
    'us-central': 'US Central',
    'us-east': 'US East',
    'us-west': 'US West',
    'us-south': 'US South'
}

module.exports = {
    name: "server",
    aliases: ["Server", "SERVER", "Serverinfo", "serverinfo"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Informations',
    description: 'Shows informations about a server',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES"],
    examples: [''],
    async execute(client, message, args) {
    const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).slice(0, -1)

    // getting all the members of the server
    const members = message.guild.members.cache;
    
    // getting all the channels of the server
    const channels = message.guild.channels.cache;
    
    // getting all the emojis of the server
    const emojis = message.guild.emojis.cache

    
    let rolesdisplay;

    // if the lenght is lower then 20, display all roles
    if(roles.length < 20) {
        rolesdisplay = roles.join(' ')
    } else {
    
        //if the lenght is more then 20, display only 20
        rolesdisplay = roles.slice(20).join(' ')
    }

    // if i typed guild it make ref to message.guild
    const { guild } = message
    
    // tyeping name, region, memberCount, owner isntead of guild.name
    const { name, region, memberCount } = guild
    
    // getting the server's pfp
    const icon = guild.iconURL()

    const owner = await guild.fetchOwner()
    
    // creating embed1
	const embed1 = new MessageEmbed() 			 
	.setTitle(`${name} server info (page 1/2)`)
    
    .setURL(message.guild.iconURL())

    .setThumbnail(message.guild.iconURL({dynamic: true, format: 'png', size: 512}))

    .setTimestamp()
    
    .setDescription(`**General**
    🇳 **Name:** ${name}
    <:pp198:853494893439352842> **ID:** ${message.guild.id}
    <:Owner:841321887882805289> **Owner:** <@${message.guild.ownerId}>
    🌐 **Region:** ${regions[message.guild.region] || 'Auto'}
    <a:pp891:853493740579717131> **Boost Tier:** ${message.guild.premiumTier || 'None'}
    <a:pp989:853496185443319809> **Verification Level:** ${verificationLevels[message.guild.verificationLevel]}
    <a:server_boosting:809994218759782411> **Boost Level:** ${message.guild.premiumSubscriptionCount || '0'}
    📆 **Created At:** ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}
    \u200b
    `)
	
	// creating embed2
	const embed2 = new MessageEmbed() 	
	.setTitle(`${name} server info (page 2/2)`)
    
   .setURL(message.guild.iconURL())

   .setThumbnail(message.guild.iconURL({dynamic: true, format: 'png', size: 512}))

   .setTimestamp()

   .setDescription(`**Stats**
   <:pp444:853496229677629490> **Role Count:** ${roles.length}
   <:pp697:853494953560375337> **Emoji Count:** ${emojis.size}
   <:pp941:782762042171719731> **Normal Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}
   <a:pp224:853495450111967253> **Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}
   <a:pp754:768867196302524426> **Member Count:** ${message.guild.memberCount}
   <:pp833:853495153280155668> **Humans:** ${members.filter(member => !member.user.bot).size}
   🤖 **Bots:** ${members.filter(member => member.user.bot).size}
   <:online:809995753921576960> **Online:** ${members.filter(member => member.presence?.status === 'online').size}
   <:offline:809995754021978112> **Offline:** ${members.filter(member => member.presence?.status === 'offline').size}
   <:Idle:809995753656549377> **Idle:** ${members.filter(member => member.presence?.status === 'idle').size}
   ⌨️ **Text Channels:** ${channels.filter(channel => channel.type === 'GUILD_TEXT').size}
   <:pp874:782758901829468180> **Voice Channels:** ${channels.filter(channel => channel.type === 'GUILD_VOICE').size}
   \u200b
   `)
	
const pages = [embed1, embed2];


const emojiList = ["860969849663782962", "860969895779893248"];


const timeout = 30000;


buttonsPagination(message, pages, emojiList, timeout)
    }
}