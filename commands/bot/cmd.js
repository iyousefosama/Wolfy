const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { prefix } = require('../../config.json');
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
            .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
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

          if(cmd.aliases > 1 || cmd.aliases == null || typeof cmd.permissions !== 'string') {
            cmd.aliases = [ 'None' ]
          } else if(cmd.permissions > 1 || cmd.permissions == null || typeof cmd.permissions !== 'string') {
            cmd.permissions = [ 'None' ]
          } else if(cmd.examples > 1 || cmd.examples == null || typeof cmd.examples !== 'string') {
            cmd.examples = [ 'None' ]
          }
          
          const embed = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
          .setColor('738ADB')
          .setTitle(`${prefix}${cmd.name}`)
          .setDescription(`\`\`\`${cmd.description}\`\`\`\n`)
          .addFields(
          { name: 'Usage', value: `\`${prefix}${cmd.name} ${cmd.usage}\``, inline: true },
          { name: 'ALIASES', value: text.joinArray(cmd.aliases) || 'None', inline: true },
          { name: 'COOLDOWN', value: `\`${cmd.cooldown} (seconds)\``, inline: true },
          { name: 'Permissions', value: `${text.joinArray(cmd.permissions.map(x => x.split('_')
          .map(a => a.charAt(0) + a.slice(1).toLowerCase()).join(' '))) || 'None'}`, inline: true },
          { name: 'Examples', value: `${cmd.examples.map(x=>`\`${prefix}${cmd.name} ${x}\n\``) || 'None'}`}
          )
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setTimestamp()
        message.channel.send({ embeds: [embed] })
        };
}
}