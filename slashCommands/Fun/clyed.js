const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "clyed",
        description: "Send your message as Clyde text message!",
        dmOnly: false,
        guildOnly: false,
        cooldown: 0,
        group: "Fun",
        clientPermissions: [
            "EmbedLinks",
            "AttachFiles"
        ],
        permissions: [],
        options: [
            {
                type: 3, // STRING
                name: 'input',
                description: 'Enter a input',
                required: true
            }
        ]
    },
	async execute(client, interaction) {
        const input = interaction.options.getString('input');

        if(input.length > 100) return interaction.reply({ 
            content: client.language.getString("CMD_CLYDE_INPUT_TOO_LONG", interaction.guild?.id)
        });
        axios
        .get(`https://nekobot.xyz/api/imagegen?type=clyde&text=${input}`)
        .then((res) => {
            const embed = new EmbedBuilder()
            .setImage(res.data.message)
            interaction.reply({ embeds: [embed] })
        })
        .catch(err => {
            interaction.reply({ 
                content: client.language.getString("CMD_CLYDE_ERROR", interaction.guild?.id)
            });
        })
	},
};