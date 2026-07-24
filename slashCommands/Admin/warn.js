const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')
const uuid = require('uuid');
const warnSchema = require('../../schema/Warning-Schema')

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: 'warn',
        description: 'Warn a user, get a list of a user, remove warn from the user!',
        dmOnly: false,
        guildOnly: true,
        cooldown: 3,
        group: 'Moderation',
        requiresDatabase: true,
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
        let reason = interaction.options.getString('reason');
        let warnid = interaction.options.getString('warnid');
        let user = interaction.options.getUser('target');

        switch (subCommandName) {
            case 'add':
                if (user.id === interaction.guild.ownerId) {
                    return interaction.reply({ content: "\\❌ | You cannot **warn** a server owner!", flags: ['Ephemeral'] });
                };

                if (user.id === interaction.user.id) {
                    return interaction.reply({ content: "\\❌ | You cannot **warn** yourself!", flags: ['Ephemeral'] });
                };

                if (user.id === client.user.id) {
                    return interaction.reply({ content: "\\❌ | You cannot **warn** me!", flags: ['Ephemeral'] });
                };

                const warnObj = {
                    authorId: interaction.user.id,
                    timestamp: Math.floor(Date.now() / 1000),
                    warnId: uuid.v4(),
                    reason: reason,
                };

                const warnAddData = await warnSchema.findOneAndUpdate(
                    {
                        guildId: interaction.guildId,
                        userId: user.id,
                    },
                    {
                        guildId: interaction.guildId,
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

                interaction.reply({ content: `Successfully **warned** the ${user.tag}!` });
                const dmembed = new EmbedBuilder()
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                    .setColor('#e6a54a')
                    .setTitle(`You have been warned by ${interaction.user.username}`)
                    .setDescription(`You have been warned for **${reason}** by ${interaction.user.tag}!\n\nYou now have **${warnCount}** warning${warnGrammar} in total.`)
                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                try {
                    await user.send({ embeds: [dmembed] })
                } catch (error) {
                    return;
                }
                break;

            case 'list':
                const warnedResult = await warnSchema.findOne({
                    guildId: interaction.guildId,
                    userId: user.id,
                });

                if (!warnedResult || warnedResult.warnings.length === 0) {
                    return interaction.reply({ content: `💢 Looks like ${user.tag} don't have any \`warnings\` yet!`, flags: ['Ephemeral'] });
                }

                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.username}'s Warnings List`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                    .setColor('#2F3136')
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
                    .setTimestamp();

                for (const warning of warnedResult.warnings) {
                    const { authorId, timestamp, warnId, reason } = warning;

                    const getModeratorUser = interaction.guild.members.cache.find(
                        user => user.id === authorId
                    );

                    if (getModeratorUser) {
                        embed.addFields({
                            name: `Warning by ${getModeratorUser.user.tag} (ID: ${warnId})`,
                            value: `Reason: **${reason}**\nWarned at: <t:${timestamp}:F>`
                        });
                    } else {
                        embed.addFields({
                            name: `Warning by Unknown Moderator (ID: ${warnId})`,
                            value: `Reason: **${reason}**\nWarned at: <t:${timestamp}:F>`
                        });
                    }
                }

                const options = warnedResult.warnings.map((warning) => {
                    const { warnId, reason } = warning;
                    return {
                        label: `Warning ID: ${warnId}`,
                        value: warnId,
                        description: reason,
                    };
                });

                const selectMenu = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`select_warnRemove_${user.id}`)
                        .setPlaceholder("Select a warning to remove")
                        .addOptions(options)
                );

                interaction.reply({ embeds: [embed], components: [selectMenu], flags: ['Ephemeral'] });

                break;

            case 'remove':
                const validateUUID = uuid.validate(warnid);

                if (validateUUID) {
                    const warnedRemoveData = await warnSchema.findOneAndUpdate(
                        {
                            guildId: interaction.guildId,
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
                        content: `Successfully **removed warning for** the user from ${getRemovedWarnedUser.user.tag}!`,
                    });
                } else {
                    interaction.reply({
                        content: "💢 Please provide a valid warn ID!",
                        flags: ['Ephemeral'],
                    });
                }

                break;
        }
    },
};