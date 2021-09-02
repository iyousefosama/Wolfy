const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const discord = require('discord.js');

module.exports = {
    name: 'serveravatar',
    aliases: ['ServerAvatar'], 
    categories : 'information', 
    description: 'Replies with server avatar!',
    usage: ' ',
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args 
     */
    run: async(client, interaction, args) => {
        if(!interaction.guild.me.permissions.has('SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES')) return interaction.editReply({ content: '<a:pp802:768864899543466006> The bot is missing \`SEND_MESSAGES,EMBED_LINKS,READ_MESSAGE_HISTORY,ATTACH_FILES\` permission(s)!'})
        let avatarserver = new discord.MessageEmbed()
        .setColor("#ed7947")
        .setAuthor(interaction.guild.name, interaction.guild.iconURL())
        .setTitle("Avatar Link")
        .setURL(interaction.guild.iconURL())
        .setImage (interaction.guild.iconURL({dynamic: true, format: 'png', size: 512}))
        .setFooter(`Requested By ${interaction.user.tag}`, interaction.user.avatarURL())
        interaction.editReply({ embeds: [avatarserver] })
    }
}