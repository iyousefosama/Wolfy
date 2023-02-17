const discord = require('discord.js');
const sb = require('sourcebin');
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: "bin",
    aliases: ["Sourcebin", "SOURCEBIN", "sourcebin"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '<code(or File with the message)>',
    group: 'Utilities',
    description: 'To upload a code to sourcebin',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: [discord.PermissionsBitField.Flags.EmbedLinks, discord.PermissionsBitField.Flags.UseExternalEmojis],
    examples: [
        'message.channel.send(\'Hello, world!\')'
      ],
    async execute(client, message, args) {
    let content;
    message.channel.sendTyping()
    // get the file's URL
    const file = message.attachments.first()?.url;

    let text;
    if(file) {
    // fetch the file from the external URL
    const response = await fetch(file);

    // if there was an error send a message with the status
    if (!response.ok)
      return message.channel.send(
        'There was an error with fetching the file:',
        response.statusText,
      );

    // take the response stream and read it to completion
     text = await response.text();
    }

    if (text) {
        content = text;
    } else if (args) {
        content = args.join(' ');
    } else {
        return message.reply(`\\❌ **${message.member.displayName}**, Please add the code in the message or the code file!`)
    }

        const value = await sb.create([
            {
                name: 'Random Code',
                content,
                language: 'javascript'
            }
        ])
        const embed = new discord.EmbedBuilder()
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true}) })
        .setTitle('We uploaded your code on sourcebin')
        .setDescription(`<a:iNFO:853495450111967253> Click the button to go there!`)
        .setColor('Red')
        .setTimestamp()
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(`Link`)
            .setEmoji('841711383191879690')
            .setURL(`${value.url}`) 
            .setLabel('Click Here!'),
        );
        message.delete().catch(() => null)
        await message.channel.send({ embeds: [embed], components: [row]})
    }
}