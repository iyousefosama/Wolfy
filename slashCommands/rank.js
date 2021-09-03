const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const canvacord = require('canvacord')
const Levels = require('discord-xp')

module.exports = {
    clientpermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES'],
    guildOnly: true,
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Replies with bot ping!'),
	async execute(client, interaction) {
		await interaction.deferReply({ ephemeral: false }).catch(() => {});
        const userData = await Levels.fetch(interaction.user.id, interaction.guild.id)
        const requiredXP = (userData.level +1) * (userData.level +1) *100 // Enter the formula for calculating the experience here. I used mine, which is used in discord-xp.
        const rank = new canvacord.Rank()
        .setAvatar(interaction.user.displayAvatarURL({format: "png", size: 1024}))
        .setProgressBar("#FFFFFF", "COLOR")
        .setCurrentXP(userData.xp)
        .setLevel(userData.level)
        .setRequiredXP(requiredXP)
        .setUsername(interaction.user.username)
        .setDiscriminator(interaction.user.discriminator)
        const img = await rank.build()
        .then(data => {
            const attachment = new discord.MessageAttachment(data, "RankCard.png");
            interaction.editReply({ files: [attachment] });
        })
	},
};