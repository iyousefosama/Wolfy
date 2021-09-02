const Discord = require('discord.js');
const { prefix } = require('../../config.json');

module.exports = {
    name: "command",
    aliases: ["Command", "COMMAND", "cmd", "commandhelp", "helpcommand"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<cmdName>',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    async execute(client, message, args) {
    let command = args[0]
    const cmd = client.commands.get(command);

    embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        .setColor('#2F3136')
        .setTitle(`${prefix}${cmd.name}`)
        .setDescription(`\`\`\`${cmd.description}\`\`\`\n`)
.addFields(
    { name: 'Usage', value: `\`${prefix}${cmd.name} ${cmd.usage}\``, inline: true },
    { name: 'ALIASES', value: `__${cmd.aliases}__`, inline: true },
    { name: 'COOLDOWN', value: `\`${cmd.cooldown}\``, inline: false },
)
.setFooter(client.user.username, client.user.displayAvatarURL({dynamic: true}))
.setTimestamp()
message.channel.send({ embeds: [embed] })
}
}