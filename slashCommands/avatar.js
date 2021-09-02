const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Replies with your avatar!'),
    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: true }).catch(() => {});
        if(!interaction.guild.me.permissions.has('SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES')) return interaction.editReply({ content: '<a:pp802:768864899543466006> The bot is missing \`SEND_MESSAGES,EMBED_LINKS,READ_MESSAGE_HISTORY,ATTACH_FILES\` permission(s)!'})
        const embed = new MessageEmbed()
        .setAuthor(`${interaction.user.displayName}`, interaction.user.displayAvatarURL())
        .setColor('738ADB')
        .setTitle(`Avatar Link!`)
        .setURL(interaction.user.displayAvatarURL({dynamic: true, format: 'png', size: 512}))
        .setImage(interaction.user.displayAvatarURL({dynamic: true, format: 'png', size: 512}))
        .setTimestamp()
        interaction.editReply({ embeds: [embed] }) 
    },
};