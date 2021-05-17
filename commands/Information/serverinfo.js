const discord = require('discord.js')
const pagination = require('discord.js-pagination');
const moment = require(`moment`)
const cooldown = new Set();

// setting all the verifiaction levels so it looks nice
const verificationLevels = {
    NONE: 'None',
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    VERY_HIGHT: 'Very High'
}


// setting all the regions so it looks nice
const regions = {
    brazil: 'Brazil',
    europe: 'Europe',
    hongkong: 'Hong Kong',
    india: 'India',
    japan: 'Japan',
    russia: 'Russia',
    singapore: 'Singapore',
    southafrica: 'South Africa',
    sydeny: 'Sydeny',
    'us-central': 'US Central',
    'us-east': 'US East',
    'us-west': 'US West',
    'us-south': 'US South'
}

module.exports.run = async (Client, message, prefix, args) => {
    if(!message.content.startsWith(prefix)) return;
    if (message.channel.type === "dm") return;
    if(cooldown.has(message.author.id)) {
        message.reply('Please wait \`5 seconds\` between using the command, because you are on cooldown')
    } else {
        // getting all the roles of the server
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
        const { name, region, memberCount, owner } = guild
        
        // getting the server's pfp
        const icon = guild.iconURL()

    const page1 = new discord.MessageEmbed()
    // sets the title of the embed
    .setTitle(`${name} server info (page 1/2)`)
    
    .setURL(message.guild.iconURL())

    .setThumbnail(message.guild.iconURL({dynamic: true, format: 'png', size: 512}))

    .setTimestamp()
    
    // adding a field with the general info
    .addField(`General`, [
        `🇳 **Name:** ${name}`, // server name
        `🆔 **ID:** ${message.guild.id}`, // server's id
        `👑 **Owner:** ${message.guild.owner.user.tag}`, // server's owner
        `🌐 **Region:** ${regions[message.guild.region]}`, // the region of the server
        `<:Boost:776670897545150465> **Boost Tier:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`, // boost tier
        `<a:Enchanted_netherite_sword:758070334879563786> **Verification Level:** ${verificationLevels[message.guild.verificationLevel]}`, // the verification level
        `<a:server_boosting:809994218759782411> **Boost Level:** ${message.guild.premiumSubscriptionCount || '0'}`, // how many times it got boosted
        `📆 **Created At:** ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}`, // when did the server got created 
        '\u200b'
    ])

    const page2 = new discord.MessageEmbed()
   .setTitle(`${name} server info (page 2/2)`)
    
   .setURL(message.guild.iconURL())

   .setThumbnail(message.guild.iconURL({dynamic: true, format: 'png', size: 512}))

   .setTimestamp()

   .addField('Stats', [
    `<a:pp289:782760183420026881> **Role Count:** ${roles.length}`, // how many roles in the server
    `<:pp944:768867378682527764> **Emoji Count:** ${emojis.size}`, // how many emojis
    `<:pp941:782762042171719731> **Normal Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}`, // how many not animated emojis
    `<a:4448_cat_glitchy:743997440168034336> **Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}`, // how many animated emoji
    `<a:pp754:768867196302524426> **Member Count:** ${message.guild.memberCount}`, // how many members in the server
    `👥 **Humans:** ${members.filter(member => !member.user.bot).size}`, // how many are humans
    `🤖 **Bots:** ${members.filter(member => member.user.bot).size}`, // how many are bots
    `<:online:809995753921576960> **Online:** ${members.filter(member => member.presence.status === 'online').size}`, // how many are online
    `<:offline:809995754021978112> **Offline:** ${members.filter(member => member.presence.status === 'offline').size}`, // how many are offline
    `<a:pp802:768864899543466006> **Do Not Disturb:** ${members.filter(member => member.presence.status === 'dnd').size}`, // how many have DND
    `<:Idle:809995753656549377> **Idle:** ${members.filter(member => member.presence.status === 'idle').size}`, // how many have idle
    `⌨️ **Text Channels:** ${channels.filter(channel => channel.type === 'text').size}`, // how many text channels
    `<:pp874:782758901829468180> **Voice Channels:** ${channels.filter(channel => channel.type === 'voice').size}`, // how many voice channels
    '\u200b'
])


    const pages = [
        page1,
        page2
    ]

    const emoji = ["⏪", "⏩"]

    const timeout = '40000'

    pagination(message, pages, emoji, timeout)}
    cooldown.add(message.author.id);
    setTimeout(() => {
        cooldown.delete(message.author.id)
    }, 5000); // here will be the time in miliseconds 5 seconds = 5000 miliseconds
}

module.exports.help = {
    name: "serverinfo",
    aliases: ['server', 'Serverinfo']
}