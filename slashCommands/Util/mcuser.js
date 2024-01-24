const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
    clientpermissions: [
        discord.PermissionsBitField.Flags.EmbedLinks,
        discord.PermissionsBitField.Flags.ReadMessageHistory
    ],
    data: new SlashCommandBuilder()
        .setName('mcuser')
        .setDescription('Gives information about a Minecraft user player!')
        .addStringOption(option => option.setName('query').setDescription('Enter a player name').setRequired(true)),
    async execute(client, interaction) {
        const query = interaction.options.getString('query').toLowerCase();

        let user;
        try {
            const response = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${query}`);
            user = response.data;
        } catch (error) {
            console.error(error);
            if (error.response) {
                console.error('Server responded with:', error.response.status, error.response.statusText);
                if (error.response.status === 404) {
                    return interaction.editReply({ content: "<a:pp681:774089750373597185> **|** The specified user was not found!" });
                } else {
                    return interaction.editReply({ content: `Error: ${error.response.statusText}` });
                }
            } else if (error.request) {
                console.error('No response received from the server');
                return interaction.editReply({ content: 'No response received from the server. Please try again later.' });
            } else {
                console.error('Error setting up the request:', error.message);
                return interaction.editReply({ content: 'An unexpected error occurred. Please try again later.' });
            }
        }

        if (user) {
            try {
                // Get name history
                const nameHistoryResponse = await axios.get(`https://api.mojang.com/user/profiles/${user.id}/names`);
                const nameHistory = nameHistoryResponse.data.map(entry => entry.name);

                // Build the embed
                const embed = new discord.MessageEmbed()
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .addFields(
                        { name: "Name:", value: `${user.name}`, inline: true },
                        { name: "Name History:", value: nameHistory.join('\n'), inline: false },
                        { name: "UUID:", value: `\`${user.id}\`` },
                        { name: "Created At:", value: new Date(user.created).toLocaleString(), inline: true },
                        { name: "Download:", value: `[Download](https://minotar.net/download/${user.name})`, inline: true },
                        { name: "NameMC:", value: `[Click Here](https://mine.ly/${user.name}.1)`, inline: true }
                    )
                    .setImage(`https://minotar.net/armor/body/${user.name}/100.png`)
                    .setColor('#2c2f33')
                    .setThumbnail(`https://minotar.net/helm/${user.name}/100.png`)
                    .setTimestamp()
                    .setFooter({
                        text: user.name + `'s mcuser | \©️${new Date().getFullYear()} Wolfy`,
                        iconURL: interaction.guild.iconURL({ dynamic: true })
                    });

                interaction.editReply({ embeds: [embed] });
            } catch (error) {
                console.error(error);
                return interaction.editReply({ content: 'An error occurred while retrieving name history. Please try again later.' });
            }
        }
    },
};
