const discord = require('discord.js');
const { EmbedBuilder} = require('discord.js');
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    name: "ticketpanel",
    aliases: ["TicketPanel"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '(Optional: Embed description)',
    group: 'Tickets',
    description: 'Setup the ticket panel in the server',
    cooldown: 8, //seconds(s)
    guarded: false, //or false
    permissions: [discord.PermissionsBitField.Flags.ManageChannels],
    examples: [''],
    async execute(client, message, args) {
        let text = args.slice(0).join(" ")

        const embed = new EmbedBuilder()
        .setColor('Red')
        .setAuthor({ name: 'Tickets', iconURL: message.guild.iconURL({ dynamic: true }) })
        .setDescription([
        text ? text :
        `React with 📩 to create your ticket!` ].join(' '))
        .setFooter({ text: `Ticket Panel | \©️${new Date().getFullYear()} Wolfy`, iconURL: client.user.avatarURL({dynamic: true}) })
        .setTimestamp()
        const button = new ButtonBuilder()
        .setLabel('Open ticket')
        .setCustomId("ticket")
        .setEmoji("📩")
        .setStyle('Primary')
        const row = new ActionRowBuilder()
        .addComponents(button);
    message.channel.send({
        embeds: [embed],
        components: [row]
    });
}
}