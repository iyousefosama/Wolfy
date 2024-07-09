const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "automod",
    description: "Setting auto moderation rules for the current guild!",
    dmOnly: false,
    guildOnly: true,
    cooldown: 0,
    group: "NONE",
    clientPermissions: [
      "Administrator"
    ],
    permissions: [
      "Administrator"
    ],
    options: [
      {
        type: 1, // SUB_COMMAND
        name: 'flagged-words',
        description: 'Set the flagged words protection!',
        options: [
          {
            type: 4, // INTEGER
            name: 'mention-limit',
            description: 'The total number of role & user mentions allowed per message',
            required: false
          },
          {
            type: 5, // BOOLEAN
            name: 'mention-raid-protection',
            description: 'Whether to automatically detect mention raids',
            required: false
          }
        ]
      }
    ]
  },
  async execute(client, interaction) {
    const { guild, options } = interaction;

    const sub = options.getSubcommand();
    const MentionLimit = options.getInteger("mention-limit") || 0;
    const MentionRaid = options.getBoolean("mention-raid-protection") || false;
    const Rules = await guild.autoModerationRules.fetch({ cache: false });

    switch (sub) {
      case "flagged-words":
        const TriggerType = Rules.map((x) => x.triggerType).filter(
          (x) => x === 4
        );

        if (TriggerType.length > 0) {
          return interaction.reply(
            `\\❌ Could not create the autoModeration rule, there is another rule with TriggerType \`4\`!`
          );
        }

        guild.autoModerationRules
          .create({
            name: `flagged-words & mention raid protection by ${client.user.username}`,
            creatorId: interaction.user.id,
            enabled: true,
            eventType: 1,
            triggerType: 4,
            triggerMetadata: {
              mentionTotalLimit: MentionLimit,
              mentionRaidProtectionEnabled: MentionRaid,
              presets: [1, 2, 3],
            },
            actions: [
              {
                type: 1,
                MetaData: {
                  channel: interaction.channel,
                  durationSeconds: 10,
                  custommessage: `⚠️ ${interaction.user}, this action is not allowed in this server!`,
                },
              },
            ],
          })
          .then(async (result) => {
            await interaction.reply(
              `\\✔️ Successfully created the new auto-moderation rules for \`${guild.name}\``
            );
          })
          .catch(async (err) => {
            return await interaction.reply(`${err.message}`);
          });
    }
  },
};
