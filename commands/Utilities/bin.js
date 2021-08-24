const Discord = require('discord.js');
const sb = require('sourcebin');
const { MessageActionRow, MessageButton } = require('discord-buttons')

module.exports = {
    name: "bin",
    aliases: ["Sourcebin", "SOURCEBIN", "sourcebin"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<code>',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        let content = args.join(' ');
        if (!content)
            return message.reply(
                new Discord.MessageEmbed({
                    title: '<a:Wrong:812104211361693696> Error Usage!',
                    description: `Usage: ${client.prefix}sourcebin <code>`
                })
            );

        const value = await sb.create([
            {
                name: 'Random Code',
                content,
                language: 'javascript'
            }
        ]);
        const embed = new Discord.MessageEmbed()
        .setTitle('We uploaded your code on sourcebin')
        .setDescription(`<a:iNFO:853495450111967253> Click the button to go there!`)
        .setColor('RED')
        .setFooter(client.user.username, client.user.displayAvatarURL())
        let button = new MessageButton()
        .setStyle('url')
        .setEmoji('841711383191879690')
        .setURL(`${value.url}`) 
        .setLabel('Click Here!'); 
        await message.channel.send(embed, button)
    }

}