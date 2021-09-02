const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const discord = require('discord.js');

module.exports = {
    name: 'avatar',
    aliases: ['Avatar'], 
    categories : 'information', 
    description: 'Replies with your avatar!',
    usage: '',
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args 
     */
    run: async(client, interaction, args) => {
        if(!interaction.guild.me.permissions.has('SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES')) return interaction.editReply({ content: '<a:pp802:768864899543466006> The bot is missing \`SEND_MESSAGES,EMBED_LINKS,READ_MESSAGE_HISTORY,ATTACH_FILES\` permission(s)!'})
        const embed = new MessageEmbed()
        .setAuthor(interaction.member.displayName, interaction.member.user.displayAvatarURL())
        .setColor('738ADB')
        .setTitle(`Avatar Link!`)
        .setURL(interaction.member.user.displayAvatarURL({dynamic: true, format: 'png', size: 512}))
        .setImage(interaction.user.displayAvatarURL({dynamic: true, format: 'png', size: 512}))
        .setTimestamp()
        interaction.editReply({ embeds: [embed] }) 
    }
}