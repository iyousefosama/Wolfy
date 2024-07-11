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
      },
      {
        type: 1, // SUB_COMMAND
        name: "spam-messages",
        description: 'Set the anti spam messages protection!',
      },
      {
        type: 1, // SUB_COMMAND
        name: "mention-limit",
        description: 'The total number of role & user mentions allowed per message',
        options: [
          {
            type: 4, // INTEGER
            name: 'mentions',
            description: 'The total number of role & user mentions allowed per message',
            required: true
          }
        ]
      },
      {
        type: 1, // SUB_COMMAND
        name: "keywords",
        description: 'Block given keywords from being used',
        options: [
          {
            type: 3, // String
            name: 'words',
            description: 'The words to block (ex: word1, word2)',
            required: true
          }
        ]
      },
    ]
  },
  async execute(client, interaction) {
    const { guild, options } = interaction;
    await interaction.deferReply().catch(() => { })

    const sub = options.getSubcommand();
    const MentionLimit = options.getInteger("mentions") || 0;
    const keyword = options.getString("words") || 0;
    const Rules = await guild.autoModerationRules.fetch({ cache: false });
    let TriggerType;

    switch (sub) {
      case "flagged-words":
        TriggerType = Rules.map((x) => x.triggerType).filter(
          (x) => x === 4
        );

        if (TriggerType.length > 0) {
          return await interaction.editReply(`\\❌ This rule already exists!`);
        }

        guild.autoModerationRules
          .create({
            name: `Block profanity, sexual content, and slurs by ${client.user.username}`,
            creatorId: interaction.user.id,
            enabled: true,
            eventType: 1,
            triggerType: 4,
            triggerMetadata: {
              presets: [1, 2, 3],
            },
            actions: [
              {
                type: 1,
                MetaData: {
                  channel: interaction.channel,
                  durationSeconds: 10,
                  custommessage: `⚠️ This message was blocked by ${client.user.username}, as it contains profanity, sexual content, or slurs!`,
                },
              },
            ],
          })
          .then(async (result) => {
            await interaction.editReply(
              `\\✔️ Successfully created the new auto-moderation rule for \`${guild.name}\``
            );
          })
          .catch(async (err) => {
            return await interaction.editReply(`❌ Their were an error while creating the new auto-moderation rule: ${err.message}`);
          });
        break;
      case "spam-messages":
        TriggerType = Rules.map((x) => x.triggerType).filter(
          (x) => x === 3
        );

        if (TriggerType.length > 0) {
          return await interaction.editReply(`\\❌ This rule already exists!`);
        }

        guild.autoModerationRules
          .create({
            name: `Prevents spam messages by ${client.user.username}`,
            creatorId: interaction.user.id,
            enabled: true,
            eventType: 1,
            triggerType: 3,
            actions: [
              {
                type: 1,
                MetaData: {
                  channel: interaction.channel,
                  durationSeconds: 10,
                  custommessage: `⚠️ Spamming messages is not allowed in this server!`,
                },
              },
            ],
          })
          .then(async (result) => {
            await interaction.editReply(
              `\\✔️ Successfully created the new auto-moderation rule for \`${guild.name}\``
            );
          })
          .catch(async (err) => {
            return await interaction.editReply(`❌ Their were an error while creating the new auto-moderation rule: ${err.message}`);
          });
        break;
      case "mention-limit":
        TriggerType = Rules.map((x) => x.triggerType).filter(
          (x) => x === 5
        );

        if (TriggerType.length > 0) {
          return await interaction.editReply(`\\❌ This rule already exists!`);
        }

        guild.autoModerationRules
          .create({
            name: `Prevents mentions spam by ${client.user.username}`,
            creatorId: interaction.user.id,
            enabled: true,
            eventType: 1,
            triggerType: 5,
            triggerMetadata: {
              mentionTotalLimit: MentionLimit
            },
            actions: [
              {
                type: 1,
                MetaData: {
                  channel: interaction.channel,
                  durationSeconds: 10,
                  custommessage: `⚠️ Mentions spam is not allowed in this server!`,
                },
              },
            ],
          })
          .then(async (result) => {
            await interaction.editReply(
              `\\✔️ Successfully created the new auto-moderation rule for \`${guild.name}\``
            );
          })
          .catch(async (err) => {
            return await interaction.editReply(`❌ Their were an error while creating the new auto-moderation rule: ${err.message}`);
          });
        break;
      case "keywords":
        TriggerType = Rules.map((x) => x.triggerType).filter(
          (x) => x === 1
        );

        if (TriggerType.length > 5) {
          return await interaction.editReply(`\\❌ This rule already exists!`);
        }

        guild.autoModerationRules
          .create({
            name: `Prevents mentions spam by ${client.user.username}`,
            creatorId: interaction.user.id,
            enabled: true,
            eventType: 1,
            triggerType: 1,
            triggerMetadata: {
              keywordFilter: keyword.split(", "),
            },
            actions: [
              {
                type: 1,
                MetaData: {
                  channelId: interaction.channel.id,
                  durationSeconds: 10,
                  customMessage: `⚠️ This message was blocked by \`${client.user.username}\`, as it contains blocked keywords!`,
                },
              },
            ],
          })
          .then(async (result) => {
            await interaction.editReply(
              `\\✔️ Successfully created the new auto-moderation rule for \`${guild.name}\``
            );
          })
          .catch(async (err) => {
            return await interaction.editReply(`❌ Their were an error while creating the new auto-moderation rule: ${err.message}`);
          });
        break;
    }
  },
};
