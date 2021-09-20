const discord = require('discord.js');
const { MessageEmbed} = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "setupticket",
    aliases: ["SetupTicket"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'ticket',
    description: 'Setup the ticket panel in the server',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    examples: [''],
    async execute(client, message, args) {
        const embed = new MessageEmbed()
        .setColor('#ffd167')
        .setTitle('Tickets')
        .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
        .setDescription(`teeest`)
        const button = new MessageButton()
        .setLabel('Open ticket')
        .setCustomId("ticket")
        .setStyle('PRIMARY')
        const row = new MessageActionRow()
        .addComponents(button);
    message.channel.send({
        embeds: [embed],
        components: [row]
    });
}
}