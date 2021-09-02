const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serveravatar')
        .setDescription('Replies with server avatar!'),
    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: false }).catch(() => {});
        if(!interaction.guild.me.permissions.has('SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES')) return interaction.editReply({ content: '<a:pp802:768864899543466006> The bot is missing \`SEND_MESSAGES,EMBED_LINKS,READ_MESSAGE_HISTORY,ATTACH_FILES\` permission(s)!'})
        let avatarserver = new discord.MessageEmbed()
        .setColor("#ed7947")
        .setAuthor(interaction.guild.name, interaction.guild.iconURL())
        .setTitle("Avatar Link")
        .setURL(interaction.guild.iconURL())
        .setImage (interaction.guild.iconURL({dynamic: true, format: 'png', size: 512}))
        .setFooter(`Requested By ${interaction.user.tag}`, interaction.user.avatarURL())
        interaction.editReply({ embeds: [avatarserver] })
    },
};