const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const canvacord = require('canvacord')
const schema = require('../schema/GuildSchema')
const ecoschema = require('../schema/Economy-Schema')
const Userschema = require('../schema/LevelingSystem-Schema')

module.exports = {
    clientpermissions: [discord.PermissionsBitField.Flags.EmbedLinks, discord.PermissionsBitField.Flags.AttachFiles],
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
        Userdata = await Userschema.findOne({
            userId: interaction.user.id,
            guildId: interaction.guild.id
        })
        if(!ecodata) {
        ecodata = await ecoschema.create({
            userID: interaction.user.id
        })
        if(!Userdata) {
            return interaction.channel.send({ content: `\\❌ **${message.member.displayName}**, This member didn't get xp yet!`})
        }
        }
    } catch(err) {
        console.log(err)
        interaction.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
    }
    var status = interaction.member.presence?.status;
    const requiredXP = Userdata.System.required;
    const rank = new canvacord.Rank()
    .setAvatar(interaction.user.displayAvatarURL({extension:"png", size: 1024}))
    .setProgressBar("#FFFFFF", "COLOR")
    .setBackground("IMAGE", `${ecodata.profile?.background || 'https://i.imgur.com/299Kt1F.png'}` || 'https://i.imgur.com/299Kt1F.png')
    .setCurrentXP(Userdata.System.xp)
    .setLevel(Userdata.System.level)
    .setStatus(status)
    .setRequiredXP(requiredXP)
    .setUsername(interaction.user.username)
    .setDiscriminator(interaction.user.discriminator)
    const img = await rank.build()
    .then(data => {
        const attachment = new discord.AttachmentBuilder(data, "RankCard.png");
        interaction.editReply({ files: [attachment], ephemeral: hide });
    });
	},
};