const Discord = require('discord.js');
const sb = require('sourcebin');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "bin",
    aliases: ["Sourcebin", "SOURCEBIN", "sourcebin"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<code>',
    group: 'Utilities',
    description: 'To upload a code to sourcebin',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
    examples: [
        'message.channel.send(\'Hello, world!\')'
      ],
    async execute(client, message, args) {
        let content = args.join(' ');

        message.channel.sendTyping()
        const value = await sb.create([
            {
                name: 'Random Code',
                content,
                language: 'javascript'
            }
        ]);
        const embed = new Discord.MessageEmbed()
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true}) })
        .setTitle('We uploaded your code on sourcebin')
        .setDescription(`<a:iNFO:853495450111967253> Click the button to go there!`)
        .setColor('RED')
        .setTimestamp()
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setStyle('LINK')
            .setEmoji('841711383191879690')
            .setURL(`${value.url}`) 
            .setLabel('Click Here!'),
        );
        message.delete().catch(() => null)
        await message.channel.send({ embeds: [embed], components: [row]})
    }
}