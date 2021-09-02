const discord = require('discord.js')
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const ms = require('parse-ms');

module.exports = {
    name: 'uptime',
    aliases: ['Uptime'], 
    categories : 'bot', 
    description: 'Replies with bot Uptime!',
    usage: '',
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args 
     */
    run: async(client, interaction, args) => {
        if(!interaction.guild.me.permissions.has('SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY')) return interaction.editReply({ content: '<a:pp802:768864899543466006> The bot is missing \`SEND_MESSAGES,EMBED_LINKS,READ_MESSAGE_HISTORY\` permission(s)!'})
        let time = ms(client.uptime);
        var uptime = new discord.MessageEmbed()
        .setColor(`DARK_GREEN`)
        .setDescription(`<a:pp399:768864799625838604> **I have been online for \`${time.days}\` days, \`${time.hours}\` hours, \`${time.minutes}\` minutes, \`${time.seconds}\` seconds**`)
        var msg = interaction.editReply({ embeds: [uptime], ephemeral: false })
    }
}