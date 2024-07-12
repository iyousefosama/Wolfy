const discord = require('discord.js');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const text = require('../../util/string');

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "command",
    aliases: ["cmd", "commandhelp", "helpcommand"],
    dmOnly: false, //or false
    guildOnly: false, //or false
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
            const embed = new discord.EmbedBuilder()
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true}) })
            .setTitle('<:error:888264104081522698> \`\`\`Unknown Commands\`\`\`')
            .setDescription(`\\❌ **${message.author.username}**, you didn't type the command to get informations about!`)
            message.channel.send({ embeds: [embed] })
        } else {
          const cmd = client.commands.get(query.toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(query.toLowerCase()));
    
          if (!cmd){
            return message.channel.send(`\\❌ **${message.author.username}**, I couldn't find the query **${query}** in the commands list!`);
          };

          if(cmd.ownerOnly === true) {
            return message.channel.send(`\\❌ **${message.author.username}**, I couldn't find the query **${query}** in the commands list!`);
          }


          function getPermissionName(permission) {
            for (const perm of Object.keys(PermissionsBitField.Flags)) {
              if (PermissionsBitField.Flags[perm] === permission) {
                return perm;
              }
            }
            return 'UnknownPermission';
          }
          
          const embed = new discord.EmbedBuilder()
          .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true}) })
          .setColor('738ADB')
          .setTitle(`${client.prefix}${cmd.name}`)
          .setDescription(`\`\`\`${cmd.description}\`\`\`\n`)
          .addFields(
          { name: 'Usage', value: `\`${client.prefix}${cmd.name} ${cmd.usage}\``, inline: true },
          { name: 'ALIASES', value: `${text.joinArray(cmd.aliases) || 'None'}`, inline: true },
          { name: 'COOLDOWN', value: `\`${cmd.cooldown} (seconds)\``, inline: true },
          { name: 'Permissions', value: `${text.joinArray(cmd.permissions.map(x => getPermissionName(x))) || 'None'}`, inline: true },
          { name: 'Examples', value: `${cmd.examples.map(x=>`\`${client.prefix}${cmd.name} ${x}\n\``).join(' ') || 'None'}`}
          )
          .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
          .setTimestamp()
        message.channel.send({ embeds: [embed] })
        };
}
}