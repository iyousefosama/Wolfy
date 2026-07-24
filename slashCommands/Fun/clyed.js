const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const { colors } = require('../../util/constants/constants');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "clyde",
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
            content: "Your input is too long! Maximum 100 characters."
        });
        axios
        .get(`https://nekobot.xyz/api/imagegen?type=clyde&text=${input}`)
        .then((res) => {
            const embed = new EmbedBuilder()
            .setColor(colors.FUN)
            .setImage(res.data.message)
            interaction.reply({ embeds: [embed] })
        })
        .catch(err => {
            interaction.reply({ 
                content: "Something went wrong while generating the image! Please try again later."
            });
        })
	},
};
