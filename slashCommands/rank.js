const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const canvacord = require('canvacord')
const Levels = require('discord-xp')
const schema = require('../schema/GuildSchema')
const ecoschema = require('../schema/Economy-Schema')

module.exports = {
    clientpermissions: ['EMBED_LINKS', 'ATTACH_FILES'],
    guildOnly: true,
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Show your level & rank and your current and next xp!')
        .addBooleanOption(option => option.setName('hide').setDescription('Hide the output')),
	async execute(client, interaction) {
        const hide = interaction.options.getBoolean('hide');
        
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
            interaction.editReply(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
        }
    if(!data.Mod.Level.isEnabled) return interaction.editReply({ content: `\\❌ **${interaction.member.displayName}**, The **levels** command is disabled in this server!\nTo enable this feature, use the \`${prefix}leveltoggle\` command.`})
    let ecodata;
    try{
        ecodata = await ecoschema.findOne({
            userID: interaction.user.id
        })
        if(!data) {
        data = await ecoschema.create({
            userID: interaction.user.id
        })
        }
    } catch(err) {
        console.log(err)
    }
    const userData = await Levels.fetch(interaction.user.id, interaction.guild.id)
    if(!userData) {
        return interaction.editReply({ content: `\\❌ **${interaction.member.displayName}**, This member didn't get xp yet!`})
    }
        const requiredXP = (userData.level +1) * (userData.level +1) *100 // Enter the formula for calculating the experience here. I used mine, which is used in discord-xp.
        const rank = new canvacord.Rank()
        .setAvatar(interaction.user.displayAvatarURL({format: "png", size: 1024}))
        .setProgressBar("#FFFFFF", "COLOR")
        .setCurrentXP(userData.xp)
        .setLevel(userData.level)
        .setBackground("IMAGE", `${ecodata.profile.background || 'https://cdn.discordapp.com/attachments/805088270756872214/893620901264900096/1f6c66afbf9849801b85e9cc761983b5ec00fbe9.png'}`)
        .setRequiredXP(requiredXP)
        .setUsername(interaction.user.username)
        .setDiscriminator(interaction.user.discriminator)
        const img = await rank.build()
        .then(data => {
            const attachment = new discord.MessageAttachment(data, "RankCard.png");
            interaction.editReply({ files: [attachment], ephemeral: hide });
        })
	},
};