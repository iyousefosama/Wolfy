const discord= require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const fetch = require("node-fetch");

module.exports = {
    clientpermissions: ['EMBED_LINKS', 'ATTACH_FILES'],
    data: new SlashCommandBuilder()
        .setName('filter')
        .setDescription('Adds filters to your avatar!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('blurpify')
                .setDescription('Select the blurpify filter option')
                .addUserOption(option => option.setName('target').setDescription('The user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('magik')
                .setDescription('Select the magik filter option')
                .addUserOption(option => option.setName('target').setDescription('The user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('deepfry')
                .setDescription('Select the deepfry filter option')
                .addUserOption(option => option.setName('target').setDescription('The user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('awooify')
                .setDescription('Select the awooify filter option')
                .addUserOption(option => option.setName('target').setDescription('The user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('baguette')
                .setDescription('Select the awooify filter option')
                .addUserOption(option => option.setName('target').setDescription('The user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('trash')
                .setDescription('Select the trash filter option')
                .addUserOption(option => option.setName('target').setDescription('The user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('jpeg')
                .setDescription('Select the jpeg filter option'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('lolice')
                .setDescription('Select the lolice filter option'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('trap')
                .setDescription('Select the trap filter option')
                .addUserOption(option => option.setName('target').setDescription('The user to trap!').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('changemymind')
                .setDescription('Select the changemymind filter option')
                .addStringOption(option => option.setName('input').setDescription('Enter a input').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('captcha')
                .setDescription('Select the captcha filter option')),
    async execute(client, interaction) {
        const blurpify = interaction.options.getSubcommand('blurpify');
        const magik = interaction.options.getSubcommand('magik');
        const deepfry = interaction.options.getSubcommand('deepfry');
        const awooify = interaction.options.getSubcommand('awooify');
        const baguette = interaction.options.getSubcommand('baguette');
        const trash = interaction.options.getSubcommand('trash');
        const jpeg = interaction.options.getSubcommand('jpeg');
        const lolice = interaction.options.getSubcommand('lolice');
        const trap = interaction.options.getSubcommand('trap');
        const changemymind = interaction.options.getSubcommand('changemymind');
        const captcha = interaction.options.getSubcommand('captcha');
        let input = interaction.options.getString('input');
        let user = interaction.options.getUser('target');
        if(!user) {
            user = interaction.user;
        } 


        if (interaction.options.getSubcommand() === 'blurpify') {
            let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=blurpify&image=${user.displayAvatarURL({dynamic: true})}`));
            let json = await res.json();
            let attachment = new discord.AttachmentBuilder(json.message, "blurpify.png");
            await interaction.editReply({files: [attachment]});
        } else if (interaction.options.getSubcommand() === 'magik') {
            let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=magik&image=${user.displayAvatarURL({dynamic: true, extension:'png', size: 512})}`));
            let json = await res.json();
            let attachment = new discord.AttachmentBuilder(json.message, "magik.png");
            await interaction.editReply({files: [attachment]});
        } else if (interaction.options.getSubcommand() === 'deepfry') {
            let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=deepfry&image=${user.displayAvatarURL({dynamic: true, extension:'png', size: 512})}`));
            let json = await res.json();
            let attachment = new discord.AttachmentBuilder(json.message, "deepfry.png");
            await interaction.editReply({files: [attachment]});
        } else if(interaction.options.getSubcommand() === 'awooify') {
            let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=awooify&url=${user.displayAvatarURL({dynamic: true, extension:'png', size: 512})}`));
            let json = await res.json();
            let attachment = new discord.AttachmentBuilder(json.message, "awooify.png");
            await interaction.editReply({files: [attachment]});
        } else if(interaction.options.getSubcommand() === 'baguette') {
            let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=baguette&url=${user.displayAvatarURL({dynamic: true, extension:'png', size: 512})}`));
            let json = await res.json();
            let attachment = new discord.AttachmentBuilder(json.message, "baguette.png");
            await interaction.editReply({files: [attachment]});
        } else if(interaction.options.getSubcommand() === 'trash') {
            let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=trash&url=${user.displayAvatarURL({dynamic: true, extension:'png', size: 512})}`));
            let json = await res.json();
            let attachment = new discord.AttachmentBuilder(json.message, "trash.png");
            await interaction.editReply({files: [attachment]});
        } else if(interaction.options.getSubcommand() === 'jpeg') {
            let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=jpeg&url=${interaction.user.displayAvatarURL({dynamic: true, extension:'png', size: 512})}`));
            let json = await res.json();
            let attachment = new discord.AttachmentBuilder(json.message, "jpeg.png");
            await interaction.editReply({files: [attachment]});
        } else if(interaction.options.getSubcommand() === 'lolice') {
            let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=lolice&url=${interaction.user.displayAvatarURL({dynamic: true, extension:'png', size: 512})}`));
            let json = await res.json();
            let attachment = new discord.AttachmentBuilder(json.message, "lolice.png");
            await interaction.editReply({files: [attachment]});
        } else if(interaction.options.getSubcommand() === 'trap') {
            let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=trap&name=${user.username}&author=${interaction.user.username}&image=${user.displayAvatarURL({dynamic: true, extension:'png', size: 512})}`));
            let json = await res.json();
            let attachment = new discord.AttachmentBuilder(json.message, "trap.png");
            await interaction.editReply({files: [attachment]});
        } else if(interaction.options.getSubcommand() === 'changemymind') {
            let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=changemymind&text=${input}`));
            let json = await res.json();
            let attachment = new discord.AttachmentBuilder(json.message, "changemymind.png");
            await interaction.editReply({files: [attachment]});
        } else if(interaction.options.getSubcommand() === 'captcha') {
            let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=captcha&url=${interaction.user.displayAvatarURL({dynamic: true, extension:'png', size: 512})}&username=${interaction.user.username}`));
            let json = await res.json();
            let attachment = new discord.AttachmentBuilder(json.message, "captcha.png");
            await interaction.editReply({files: [attachment]});
        } else {
            await interaction.editReply({ content: '\\❌ You didn\'t choose the \`filter\` to add!'});
        }
    },
};