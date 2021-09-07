const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const fetch = require("node-fetch");

module.exports = {
    clientpermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES'],
    data: new SlashCommandBuilder()
        .setName('filter')
        .setDescription('Adds filters to your avatar!')
        .addBooleanOption(option => option.setName('blurpify').setDescription('Select the blurpify filter option'))
        .addBooleanOption(option => option.setName('magik').setDescription('Select the magik filter option'))
        .addBooleanOption(option => option.setName('deepfry').setDescription('Select the deepfry filter option')),
    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: false }).catch(() => {});
        const blurpify = interaction.options.getBoolean('blurpify');
        const magik = interaction.options.getBoolean('magik');
        const deepfry = interaction.options.getBoolean('deepfry');


        if (blurpify) {
            let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=blurpify&image=${interaction.user.displayAvatarURL({dynamic: true, format: 'png', size: 512})}`));
            let json = await res.json();
            let attachment = new discord.MessageAttachment(json.message, "blurpify.png");
            await interaction.editReply({files: [attachment]});
        } else if (blurpify == false) {
            await interaction.editReply({ content: interaction.user.displayAvatarURL({dynamic: true, format: 'png', size: 512})});
        } else if (magik) {
            let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=magik&image=${interaction.user.displayAvatarURL({dynamic: true, format: 'png', size: 512})}`));
            let json = await res.json();
            let attachment = new discord.MessageAttachment(json.message, "magik.png");
            await interaction.editReply({files: [attachment]});
        } else if (magik == false) {
            await interaction.editReply({ content: interaction.user.displayAvatarURL({dynamic: true, format: 'png', size: 512})});
        } else if (deepfry) {
            let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=deepfry&image=${interaction.user.displayAvatarURL({dynamic: true, format: 'png', size: 512})}`));
            let json = await res.json();
            let attachment = new discord.MessageAttachment(json.message, "deepfry.png");
            await interaction.editReply({files: [attachment]});
        } else if (deepfry == false) {
            await interaction.editReply({ content: interaction.user.displayAvatarURL({dynamic: true, format: 'png', size: 512})});
        } else {
            await interaction.editReply({ content: '\\❌ You didn\'t choose the \`filter\` to add!'});
        }
    },
};