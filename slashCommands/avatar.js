const discord= require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    clientpermissions: ['EMBED_LINKS', 'ATTACH_FILES'],
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
			let user = interaction.options.getUser('target');

            let color;

            if (user){
              color = '#ed7947';
            } else {
              color = '738ADB';
              user = interaction.user;
            };
        
            const avatar = user.displayAvatarURL({ extension:'png' || 'gif', dynamic: true, size: 1024 });

            if (interaction.options.getSubcommand() === 'server' && interaction.guild) {
                let avatarserver = new EmbedBuilder()
                .setColor("#ed7947")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                .setDescription(`[**${interaction.guild.name}** avatar link](${interaction.guild.iconURL({ extension:'png', dynamic: true, size: 1024 })})`)
                .setURL(interaction.guild.iconURL())
                .setImage (interaction.guild.iconURL({dynamic: true, extension:'png', size: 1024}))
                .setURL(interaction.guild.iconURL({ extension:'png', dynamic: true, size: 1024 }))
                .setImage (interaction.guild.iconURL({ extension:'png', dynamic: true, size: 1024 }))
                .setFooter({ text: interaction.user.tag + ` | \©️${new Date().getFullYear()} Wolfy`, iconURL: interaction.user.avatarURL({dynamic: true}) })
                .setTimestamp()
                interaction.editReply({ embeds: [avatarserver] })
            } else if(interaction.options.getSubcommand() === 'user') {
                const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                .setColor(color)
                .setDescription(`[**${user.tag}** avatar link](${avatar})`)
                .setURL(avatar)
                .setImage(avatar)
                .setFooter({ text: 'Avatar' + ` | \©️${new Date().getFullYear()} Wolfy`, iconURL: client.user.displayAvatarURL({dynamic: true}) })
                .setTimestamp() 
                interaction.editReply({ embeds: [embed] })
            } else {
                const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                .setColor(color)
                .setDescription(`[**${user.tag}** avatar link](${avatar})`)
                .setURL(avatar)
                .setImage(avatar)
                .setFooter({ text: 'Avatar' })
                .setTimestamp() 
                interaction.editReply({ embeds: [embed] })
            }
}
};