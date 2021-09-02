const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const discord = require('discord.js');

module.exports = {
    name: 'ping',
    aliases: ['Ping'], 
    categories : 'bot', 
    description: 'Replies with bot ping!',
    usage: 'ping to pong',
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args 
     */
    run: async(client, interaction, args) => {
        if(!interaction.guild.me.permissions.has('SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY')) return interaction.editReply({ content: '<a:pp802:768864899543466006> The bot is missing \`SEND_MESSAGES,EMBED_LINKS,READ_MESSAGE_HISTORY\` permission(s)!'})
        var loading = new discord.MessageEmbed()
        .setColor('GOLD')
        .setDescription(`<a:Loading_Color:759734580122484757> Finding bot ping...`)
        var msg = interaction.editReply({ embeds: [loading]}).then(msg => { // sends this once you send the cmd
        const ping = msg.createdTimestamp - interaction.createdTimestamp; // calculation the time between when u send the message and when the bot reply
        let Pong = new discord.MessageEmbed()
        .setColor('YELLOW')
        .setDescription(`Pong!`)
        interaction.editReply({ embeds: [Pong]})
        let Ping = new discord.MessageEmbed()
        .setColor('DARK_GREEN')
        .setDescription(`The Ping of the bot is \`${ping}ms\`!`)
        interaction.editReply({ embeds: [Ping] })
        })
    }
}