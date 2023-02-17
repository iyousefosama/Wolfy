const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const uuid = require('uuid');
const warnSchema = require('../schema/Warning-Schema')

module.exports = {
    permissions: [discord.PermissionsBitField.Flags.Administrator],
	guildOnly: true,
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user, get a list of a user, remove warn from the user!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Warns a user!')
                .addUserOption(option => option.setName('target').setDescription('The user to warn.').setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription('Enter the reason for the warn').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a warn from the user!')
                .addUserOption(option => option.setName('target').setDescription('The user to remove the warn').setRequired(true))
                .addStringOption(option => option.setName('warnid').setDescription('Enter the warn id from (warnings list)').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Get the list of warns for the user')
                .addUserOption(option => option.setName('target').setDescription('Select a user').setRequired(true))),
    async execute(client, interaction) {
        const subCommandName = interaction.options._subcommand;
        const add = interaction.options.getSubcommand('add');
        const remove = interaction.options.getSubcommand('remove');
        const list = interaction.options.getSubcommand('list');
        let reason = interaction.options.getString('reason');
        let warnid = interaction.options.getString('warnid');
        let user = interaction.options.getUser('target');
        const owner = await interaction.guild.fetchOwner()

        
        switch (subCommandName) {
			case 'add':
              
                  if (user.id === interaction.guild.ownerId){
                    return interaction.editReply({ content: `<a:Wrong:812104211361693696> | ${interaction.user}, You cannot warn a server owner!`, ephemeral: true });
                  };
              
                  if (user.id === interaction.user.id){
                    return interaction.editReply({ content: `<a:Wrong:812104211361693696> | ${interaction.user}, You cannot warn yourself!`, ephemeral: true});
                  };
              
                  if (user.id === client.user.id){
                    return interaction.editReply({ content: `<a:Wrong:812104211361693696> | ${interaction.user}, You cannot warn me!`, ephemeral: true});
                  };

				const warnObj = {
					authorId: interaction.user.id,
					timestamp: Math.floor(Date.now() / 1000),
					warnId: uuid.v4(),
					reason: reason,
				};

				const warnAddData = await warnSchema.findOneAndUpdate(
					{
						guildId: interaction.guild.id,
						userId: user.id,
					},
					{
						guildId: interaction.guild.id,
						userId: user.id,
						$push: {
							warnings: warnObj,
						},
					},
					{
						upsert: true,
					},
				);
				const warnCount = warnAddData ? warnAddData.warnings.length + 1 : 1;
				const warnGrammar = warnCount === 1 ? '' : 's';

				interaction.editReply({ content: `\\✔️ Successfully warned **${user.tag}**, They now have \`${warnCount}\` warning${warnGrammar}` });
                const dmembed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({dynamic: true, size: 2048}) })
                .setColor('#e6a54a')
                .setTitle(`⚠️ Warned **${interaction.user.username}**`)
                .setDescription(`• **Warn Reason:** ${reason}\n• **Warning${warnGrammar} Count:** ${warnCount}\n• **Warned By:** ${interaction.user.tag}`)
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({dynamic: true}) })
                try {
                    await user.send({ embeds: [dmembed] })
                } catch(error) {
                    return;
                }
				break;

			case 'list':
				const warnedResult = await warnSchema.findOne({
					guildId: interaction.guild.id,
					userId: user.id,
				});

				if (!warnedResult || warnedResult.warnings.length === 0)
					return interaction.editReply({ content: '\\❌ | That user don\'t have any warns for now!', ephemeral: true });

				let string = '';
				const embed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.username}\'s Warn list!`, iconURL: interaction.user.displayAvatarURL({dynamic: true, size: 2048}) })
                .setColor('#2F3136')
                .setDescription(string)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({dynamic: true, size: 2048}) })
                .setTimestamp()

				const getWarnedUser = interaction.guild.members.cache.find(
					(user) => user.id === warnedResult.userId,
				);
				for (const warning of warnedResult.warnings) {
					const { authorId, timestamp, warnId, reason } = warning;
					const getModeratorUser = interaction.guild.members.cache.find(
						(user) => user.id === authorId,
					);
					string += embed
                    .addField(
                        `Moderator: ${getModeratorUser.user.tag} (\`${warnId}\`)`,
                        `• *Warn Reason:* ${reason}\n• *Warned At:* <t:${timestamp}>`,
                    )
				}

				interaction.editReply({ embeds: [embed] });
				break;

			case 'remove':
				const validateUUID = uuid.validate(warnid);

				if (validateUUID) {
					const warnedRemoveData = await warnSchema.findOneAndUpdate(
						{
							guildId: interaction.guild.id,
							userId: user.id,
						},
						{
							$pull: { warnings: { warnId: `${warnid}` } },
						},
					);

					const getRemovedWarnedUser = interaction.guild.members.cache.find(
						(user) => user.id === warnedRemoveData.userId,
					);

					const warnedRemoveCount = warnedRemoveData
						? warnedRemoveData.warnings.length - 1
						: 0;
					const warnedRemoveGrammar = warnedRemoveCount === 1 ? '' : 's';

					interaction.editReply({
						content: `<a:pp989:853496185443319809> | Successfully deleted **${getRemovedWarnedUser.user.tag}** warning, they now have **${warnedRemoveCount}** warning${warnedRemoveGrammar}!`,
					});
				} else {
					interaction.editReply({
						content: '\\❌ | please provide a valid warn id.',
						ephemeral: true,
					});
				}

				break;
		}
    },
};