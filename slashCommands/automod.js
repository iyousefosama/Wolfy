const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    permissions: [discord.PermissionsBitField.Flags.Administrator],
    clientpermissions: [discord.PermissionsBitField.Flags.Administrator],
    guildOnly: true,
    data: new SlashCommandBuilder()
        .setName('automod')
        .setDescription('Setting auto moderation rules for the current guild!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('flagged-words')
                .setDescription('Set the flagged words protection!')
                .addIntegerOption(option => option.setName('mention-limit').setDescription('The total number of role & user mentions allowed per message'))
                .addBooleanOption(option => option.setName('mention-raid-protection').setDescription('Whether to automatically detect mention raids'))),
    async execute(client, interaction) {
        const { guild, options } = interaction;

        const sub = options.getSubcommand();
        const MentionLimit = options.getInteger('mention-limit') || 0;
        const MentionRaid = options.getBoolean('mention-raid-protection') || false;
        const Rules = await guild.autoModerationRules.fetch({ cache: false })

        switch (sub) {
            case 'flagged-words':
                const TriggerType = Rules.map(x => x.triggerType).filter(x => x === 4)

                if (TriggerType.length > 0) {
                    return interaction.editReply(`\\❌ Could not create the autoModeration rule, there is another rule with TriggerType \`4\`!`)
                }

                guild.autoModerationRules.create({
                    name: `flagged-words & mention raid protection by ${client.user.username}`,
                    creatorId: interaction.user.id,
                    enabled: true,
                    eventType: 1,
                    triggerType: 4,
                    triggerMetadata: {
                        mentionTotalLimit: MentionLimit,
                        mentionRaidProtectionEnabled: MentionRaid,
                        presets: [1, 2, 3]
                    },
                    actions: [
                        {
                            type: 1,
                            MetaData: {
                                channel: interaction.channel,
                                durationSeconds: 10,
                                custommessage: `⚠️ ${interaction.user}, this action is not allowed in this server!`
                            }
                        }
                    ]
                }).then(async result => {
                    await interaction.editReply(`\\✔️ Successfully created the new auto-moderation rules for \`${guild.name}\``)
                }).catch(async err => {
                    return await interaction.editReply(`${err.message}`)
                })

        }
    }
};