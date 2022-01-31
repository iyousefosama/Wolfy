const discord = require('discord.js');
const { MessageEmbed} = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "ticketpanel",
    aliases: ["TicketPanel"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '(Optional: Embed description)',
    group: 'ticket',
    description: 'Setup the ticket panel in the server',
    cooldown: 160, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_CHANNELS"],
    examples: [''],
    async execute(client, message, args) {
        let text = args.slice(0).join(" ")

        const embed = new MessageEmbed()
        .setColor('RED')
        .setAuthor('Tickets', message.guild.iconURL({ dynamic: true }))
        .setDescription([
        text ? text :
        `React with 📩 to create your ticket!` ].join(' '))
        .setFooter(`Ticket Panel | \©️${new Date().getFullYear()} Wolfy`, client.user.avatarURL({dynamic: true}))
        .setTimestamp()
        const button = new MessageButton()
        .setLabel('Open ticket')
        .setCustomId("ticket")
        .setEmoji("📩")
        .setStyle('PRIMARY')
        const row = new MessageActionRow()
        .addComponents(button);
    message.channel.send({
        embeds: [embed],
        components: [row]
    });
}
}