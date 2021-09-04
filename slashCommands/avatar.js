const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')

module.exports = {
    clientpermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES'],
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Replies with avatar!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Get a user avatar')
                .addUserOption(option => option.setName('target').setDescription('The user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('get the server avatar')),
    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: false }).catch(() => {});
        if (interaction.options.getSubcommand() === 'user') {
			const user = interaction.options.getUser('target');

			if (user) {
                const embed2 = new MessageEmbed()
                .setAuthor(`${user.username}`, user.displayAvatarURL())
                .setColor('738ADB')
                .setTitle(`Avatar Link!`)
                .setURL(user.displayAvatarURL({dynamic: true, format: 'png', size: 512}))
                .setImage(user.displayAvatarURL({dynamic: true, format: 'png', size: 512}))
                .setTimestamp() 
                interaction.editReply({ embeds: [embed2] }) 
			} else {
                const avatar = new MessageEmbed()
                .setAuthor(`${interaction.user.username}`, interaction.user.displayAvatarURL())
                .setColor('738ADB')
                .setTitle(`Avatar Link!`)
                .setURL(interaction.user.displayAvatarURL({dynamic: true, format: 'png', size: 512}))
                .setImage(interaction.user.displayAvatarURL({dynamic: true, format: 'png', size: 512}))
                .setTimestamp()
                interaction.editReply({ embeds: [avatar] }) 
			}
		} else if (interaction.options.getSubcommand() === 'server') {
            let avatarserver = new discord.MessageEmbed()
            .setColor("#ed7947")
            .setAuthor(interaction.guild.name, interaction.guild.iconURL())
            .setTitle("Avatar Link")
            .setURL(interaction.guild.iconURL())
            .setImage (interaction.guild.iconURL({dynamic: true, format: 'png', size: 512}))
            .setFooter(`Requested By ${interaction.user.tag}`, interaction.user.avatarURL())
            interaction.editReply({ embeds: [avatarserver] })
		}
    },
};