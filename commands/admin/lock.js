const discord = require('discord.js');

module.exports = {
    name: "lock",
    aliases: ["Lock", "LOCK"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Moderation',
    description: 'Lock the permissions for @everyone from talking in the channel',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"],
    clientpermissions: ["MANAGE_CHANNELS"],
    examples: [''],
    async execute(client, message, [ channelID='', ...args ]) {

        channel = message.guild.channels.cache.get(channelID) || message.guild.channels.cache.get(message.channel.id);
        
        let reason = args.slice(0).join(" ")
        if (!args[0]) reason = 'No reason specified'
    
        if (!channel || channel.type !== 'GUILD_TEXT'){
          return message.channel.send(`\\❌ **${message.member.displayName}**, please provide a valid channel ID.`);
        } else if (!channel.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')){
          return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to manage channel at ${channel} and try again.`);
        };
        var err = new discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<a:pp681:774089750373597185> | There was an error while trying to \`lock\` the channel!`)
        var loading = new discord.MessageEmbed()
        .setColor(`YELLOW`)
        .setDescription(`<a:Loading_Color:759734580122484757> Loading...`)
        var msg = await message.channel.send({ embeds: [loading] });

        let lock = new discord.MessageEmbed()
        .setColor(`RED`)
        .setTimestamp()
        .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({dynamic: true}) })
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
        .setDescription([ `<a:pp802:768864899543466006> Locked \`everyone\` from texting ${channel}!`, 
        !args[0] ? '' :
        `\n • **Reason**: \`${reason}\`` ].join(''))
        return channel.permissionOverwrites.edit(message.guild.roles.cache.find(e => e.name.toLowerCase().trim() == "@everyone"),{ SEND_MESSAGES:false }, `WOLFY lock cmd: ${message.author.tag}: ${reason}`)
        .then(() => msg.edit({ embeds: [lock] }))
        .catch(() => msg.edit({ embeds: [err]}).then(()=>  message.react("💢")).catch(() => null));
    }
}