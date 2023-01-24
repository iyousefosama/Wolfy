const discord= require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const { ActionRowBuilder, MessageSelectMenu } = require('discord.js');
const schema = require('../schema/GuildSchema')

module.exports = {
    permissions: ['ADMINISTRATOR'],
    guildOnly: true,
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Start editing or showing this server configuration!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('show')
                .setDescription('Show this server configuration'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription('Start editing this server configuration')),
    async execute(client, interaction) {

        let data;
        try{
            data = await schema.findOne({
                GuildID: interaction.guild.id
            })
            if(!data) {
            data = await schema.create({
                GuildID: interaction.guild.id
            })
            }
        } catch(err) {
            console.log(err)
            interaction.editReply({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
        }

        if (interaction.options.getSubcommand() === 'show') {
            let config_embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTitle(`Configuration Settings`)
            .setDescription(`<a:Settings:841321893750505533> \`${interaction.guild.name}\` configuration settings!`)
            .addFields(
                { name: `Client prefix`, value: `> ${data.prefix || '\\❌ Not set'}`, inline: true},
                { name: `Suggestion Channel`, value: `> ${interaction.guild.channels.cache.get(data.Mod.Suggestion.channel) || '\\❌ Not set'}`, inline: true},
                { name: `Reports Channel`, value: `> ${interaction.guild.channels.cache.get(data.Mod.Reports.channel) || '\\❌ Not set'}`, inline: true},
                { name: `Welcome Channel`, value: `> ${interaction.guild.channels.cache.get(data.greeter.welcome.channel) || '\\❌ Not set'}`, inline: true},
                { name: `Leaver Channel`, value: `> ${interaction.guild.channels.cache.get(data.greeter.leaving.channel) || '\\❌ Not set'}`, inline: true},
                { name: `Ticket Category`, value: `> ${interaction.guild.channels.cache.get(data.Mod.Tickets.channel) || '\\❌ Not set'}`, inline: true},
                { name: '\u200B', value: '\u200B', inline: true },
                { name: `Suggestion is Enabled?`, value: `> ${data.Mod.Suggestion.isEnabled || '\\❌'}`, inline: true},
                { name: `Reports is Enabled?`, value: `> ${data.Mod.Reports.isEnabled || '\\❌'}`, inline: true},
                { name: `Welcome is Enabled?`, value: `> ${data.greeter.welcome.isEnabled || '\\❌'}`, inline: true},
                { name: `Leaver is Enabled?`, value: `> ${data.greeter.leaving.isEnabled || '\\❌'}`, inline: true},
                { name: `Ticket is Enabled?`, value: `> ${data.Mod.Tickets.isEnabled || '\\❌'}`, inline: true},
            )
            .setColor('#2F3136')
            .setFooter({ text: `configuration | \©️${new Date().getFullYear()} Wolf`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
            interaction.editReply({ embeds: [config_embed]})
        } else if (interaction.options.getSubcommand() === 'edit') {
            /*const row = new ActionRowBuilder()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('kwthbek4m221pyDAdowp')
                    .setPlaceholder('Nothing selected!').addOptions([
                        {
                            label: 'Anti Link',
                            description: 'Choose this option to enable/disable anti-link protection!',
                            value: '58142965841859641',
                            emoji: '836168687891382312',
                        },
                    ]),
            )
            interaction.reply({ content: `<:Tag:836168214525509653> **${interaction.guild.name}** config edit list!`, components: [row] });*/
            interaction.editReply({ content: `<a:Settings:841321893750505533> Under Maintenance!` });
        }
}
};