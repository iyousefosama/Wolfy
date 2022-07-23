const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');

module.exports = {
    name: "command",
    aliases: ["Command", "COMMAND", "cmd", "commandhelp", "helpcommand"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<cmdName>',
    group: 'bot',
    description: 'Display informations and helplist about any command.',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: [],
    async execute(client, message, [query]) {
        if (!query){
            const embed = new Discord.MessageEmbed()
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true}) })
            .setTitle('<:error:888264104081522698> \`\`\`Unknown Commands\`\`\`')
            .setDescription(`\\❌ **${message.author.username}**, you didn't type the command to get informations about!`)
            message.channel.send({ embeds: [embed] })
        } else {
          const cmd = client.commands.get(query.toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(query.toLowerCase()));
    
          if (!cmd){
            return message.channel.send(`\\❌ **${message.author.username}**, I couldn't find the query **${query}** in the commands list!`);
          };

          if(cmd.OwnerOnly === true) {
            return message.channel.send(`\\❌ **${message.author.username}**, I couldn't find the query **${query}** in the commands list!`);
          }

          
          const embed = new Discord.MessageEmbed()
          .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true}) })
          .setColor('738ADB')
          .setTitle(`${client.prefix}${cmd.name}`)
          .setDescription(`\`\`\`${cmd.description}\`\`\`\n`)
          .addFields(
          { name: 'Usage', value: `\`${client.prefix}${cmd.name} ${cmd.usage}\``, inline: true },
          { name: 'ALIASES', value: `${text.joinArray(cmd.aliases) || 'None'}`, inline: true },
          { name: 'COOLDOWN', value: `\`${cmd.cooldown} (seconds)\``, inline: true },
          { name: 'Permissions', value: `${text.joinArray(cmd.permissions.map(x => x.split('_')
          .map(a => a.charAt(0) + a.slice(1).toLowerCase()).join(' '))) || 'None'}`, inline: true },
          { name: 'Examples', value: `${cmd.examples.map(x=>`\`${client.prefix}${cmd.name} ${x}\n\``).join(' ') || 'None'}`}
          )
          .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
          .setTimestamp()
        message.channel.send({ embeds: [embed] })
        };
}
}