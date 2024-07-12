const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const uuid = require('uuid');
const warnSchema = require('../../schema/Warning-Schema')

module.exports = {
    data: {
        name: 'warn',
        description: 'Warn a user, get a list of a user, remove warn from the user!',
        dmOnly: false,
        guildOnly: true,
        cooldown: 0,
        group: 'ADMIN',
        clientPermissions: [],
        permissions: [
            "Administrator"
        ],
        options: [
            {
                type: 1, // SUB_COMMAND
                name: 'add',
                description: 'Warns a user!',
                options: [
                    {
                        type: 6, // USER
                        name: 'target',
                        description: 'The user to warn.',
                        required: true
                    },
                    {
                        type: 3, // STRING
                        name: 'reason',
                        description: 'Enter the reason for the warn',
                        required: true
                    }
                ]
            },
            {
                type: 1, // SUB_COMMAND
                name: 'remove',
                description: 'Remove a warn from the user!',
                options: [
                    {
                        type: 6, // USER
                        name: 'target',
                        description: 'The user to remove the warn',
                        required: true
                    },
                    {
                        type: 3, // STRING
                        name: 'warnid',
                        description: 'Enter the warn id from (warnings list)',
                        required: true
                    }
                ]
            },
            {
                type: 1, // SUB_COMMAND
                name: 'list',
                description: 'Get the list of warns for the user',
                options: [
                    {
                        type: 6, // USER
                        name: 'target',
                        description: 'Select a user',
                        required: true
                    }
                ]
            }
        ]
    },
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

                if (user.id === interaction.guild.ownerId) {
                    return interaction.reply({ content: `<a:Wrong:812104211361693696> | ${interaction.user}, You cannot warn a server owner!`, ephemeral: true });
                };

                if (user.id === interaction.user.id) {
                    return interaction.reply({ content: `<a:Wrong:812104211361693696> | ${interaction.user}, You cannot warn yourself!`, ephemeral: true });
                };

                if (user.id === client.user.id) {
                    return interaction.reply({ content: `<a:Wrong:812104211361693696> | ${interaction.user}, You cannot warn me!`, ephemeral: true });
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

                interaction.reply({ content: `\\✔️ Successfully warned **${user.tag}**, They now have \`${warnCount}\` warning${warnGrammar}` });
                const dmembed = new EmbedBuilder()
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                    .setColor('#e6a54a')
                    .setTitle(`⚠️ Warned **${interaction.user.username}**`)
                    .setDescription(`• **Warn Reason:** ${reason}\n• **Warning${warnGrammar} Count:** ${warnCount}\n• **Warned By:** ${interaction.user.tag}`)
                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                try {
                    await user.send({ embeds: [dmembed] })
                } catch (error) {
                    return;
                }
                break;

            case 'list':
                const warnedResult = await warnSchema.findOne({
                    guildId: interaction.guild.id,
                    userId: user.id,
                });

                if (!warnedResult || warnedResult.warnings.length === 0)
                    return interaction.reply({ content: '\\❌ | That user don\'t have any warns for now!', ephemeral: true });

                let string = '';
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.username}\'s Warn list!`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                    .setColor('#2F3136')
                    .setDescription(string)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
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

                interaction.reply({ embeds: [embed] });
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

                    interaction.reply({
                        content: `<a:pp989:853496185443319809> | Successfully deleted **${getRemovedWarnedUser.user.tag}** warning, they now have **${warnedRemoveCount}** warning${warnedRemoveGrammar}!`,
                    });
                } else {
                    interaction.reply({
                        content: '\\❌ | please provide a valid warn id.',
                        ephemeral: true,
                    });
                }

                break;
        }
    },
};