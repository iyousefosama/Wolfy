const { ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "automod",
    description: "Setting auto moderation rules for the current guild!",
    dmOnly: false,
    guildOnly: true,
    cooldown: 2,
    group: "Moderation",
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
            name: 'action',
            description: 'Action you want to perform when the keyword is detected',
            choices: [{ name: "block message", value: 1 }, { name: "send alert", value: 2 }, { name: "Timeout", value: 3 }, { name: "prevents a member from using text, voice, or other interactions", value: 4 }]
          },
          {
            type: 7, // CHANNEL
            name: 'channel',
            description: 'The channel you want to send logs in'
          }
        ]
      },
      {
        type: 1, // SUB_COMMAND
        name: "spam-messages",
        description: 'Set the anti spam messages protection!',
        options: [
          {
            type: 4, // INTEGER
            name: 'action',
            description: 'Action you want to perform when the keyword is detected',
            choices: [{ name: "block message", value: 1 }, { name: "Send alert", value: 2 }, { name: "Timeout", value: 3 }, { name: "prevents a member from using text, voice, or other interactions", value: 4 }]
          },
          {
            type: 7, // CHANNEL
            name: 'channel',
            description: 'The channel you want to send logs in'
          }
        ]
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
          },
          {
            type: 4, // INTEGER
            name: 'action',
            description: 'Action you want to perform when the keyword is detected',
            choices: [{ name: "block message", value: 1 }, { name: "send alert", value: 2 }, { name: "Timeout", value: 3 }, { name: "prevents a member from using text, voice, or other interactions", value: 4 }]
          },
          {
            type: 7, // CHANNEL
            name: 'channel',
            description: 'The channel you want to send logs in'
          }
        ]
      },
      {
        type: 1, // SUB_COMMAND
        name: "keywords",
        description: 'Block given keywords from being used',
        options: [
          {
            type: 3, // STRING
            name: 'words',
            description: 'The words to block (ex: word1, word2)',
            required: true
          },
          {
            type: 4, // INTEGER
            name: 'action',
            description: 'Action you want to perform when the keyword is detected',
            choices: [{ name: "block message", value: 1 }, { name: "send alert", value: 2 }, { name: "Timeout", value: 3 }, { name: "prevents a member from using text, voice, or other interactions", value: 4 }]
          },
          {
            type: 7, // CHANNEL
            name: 'channel',
            description: 'The channel you want to send logs in'
          }
        ],
      },
    ]
  },
  async execute(client, interaction) {
    const { guild, options } = interaction;
    await interaction.deferReply({ ephemeral: true }).catch(() => { })

    const sub = options.getSubcommand();
    const MentionLimit = options.getInteger("mentions") || 0;
    const action = options.getInteger("action") || 1;
    const channel = options.getChannel("channel") || interaction.channel;
    const keyword = options.getString("words") || 0;
    const Rules = await guild.autoModerationRules.fetch({ cache: false });
    let ruleData;

    switch (sub) {
      case "flagged-words":
        // Fetch existing rules
        const existingFlaggedRule = Rules.find(
          (rule) => rule.triggerType === 4
        );

        // Rule data to create or update
        ruleData = {
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
              type: action,
              metadata: {
                channel: channel,
                durationSeconds: 10,
                customMessage: `⚠️ This message was blocked by ${client.user.username}, as it contains profanity, sexual content, or slurs!`,
              },
            },
          ],
        }

        // If a rule exists, update it; otherwise, create a new one
        if (existingFlaggedRule) {
          guild.autoModerationRules
            .edit(existingFlaggedRule.id, ruleData)
            .then(async (result) => {
              await interaction.editReply(
                `\\✔️ Successfully updated the auto-moderation rule for \`${guild.name}\``
              );
            })
            .catch(async (err) => {
              return await interaction.editReply(`❌ There was an error while updating the auto-moderation rule: ${err.message}`);
            });
        } else {
          guild.autoModerationRules
            .create(ruleData)
            .then(async (result) => {
              await interaction.editReply(
                `\\✔️ Successfully created the new auto-moderation rule for \`${guild.name}\``
              );
            })
            .catch(async (err) => {
              return await interaction.editReply(`❌ There was an error while creating the new auto-moderation rule: ${err.message}`);
            });
        }
        break;
      case "spam-messages":
        // Fetch existing rules
        const existingSpamMsgRule = Rules.find(
          (rule) => rule.triggerType === 3
        );

        // Rule data to create or update
        ruleData = {
          name: `Messages spam protection by ${client.user.username}`,
          creatorId: interaction.user.id,
          enabled: true,
          eventType: 1,
          triggerType: 3,
          actions: [
            {
              type: action,
              metadata: {
                channel: channel,
                durationSeconds: 10,
                customMessage: `⚠️ Spamming messages is not allowed in this server!`,
              },
            },
          ],
        }

        // If a rule exists, update it; otherwise, create a new one
        if (existingSpamMsgRule) {
          guild.autoModerationRules
            .edit(existingSpamMsgRule.id, ruleData)
            .then(async (result) => {
              await interaction.editReply(
                `\\✔️ Successfully updated the auto-moderation rule for \`${guild.name}\``
              );
            })
            .catch(async (err) => {
              return await interaction.editReply(`❌ There was an error while updating the auto-moderation rule: ${err.message}`);
            });
        } else {
          guild.autoModerationRules
            .create(ruleData)
            .then(async (result) => {
              await interaction.editReply(
                `\\✔️ Successfully created the new auto-moderation rule for \`${guild.name}\``
              );
            })
            .catch(async (err) => {
              return await interaction.editReply(`❌ There was an error while creating the new auto-moderation rule: ${err.message}`);
            });
        }
        break;
      case "mention-limit":
        // Fetch existing rules
        const existingMentionLimitRule = Rules.find(
          (rule) => rule.triggerType === 5
        );

        // Rule data to create or update
        ruleData = {
          name: `mentions spam prevention by ${client.user.username}`,
          creatorId: interaction.user.id,
          enabled: true,
          eventType: 1,
          triggerType: 5,
          triggerMetadata: {
            mentionTotalLimit: MentionLimit,
          },
          actions: [
            {
              type: action,
              metadata: {
                channel: channel,
                duration: 10,
                customMessage: `⚠️ Mentions spam is not allowed in this server!`,
              },
            },
          ],
        };

        // If a rule exists, update it; otherwise, create a new one
        if (existingMentionLimitRule) {
          guild.autoModerationRules
            .edit(existingMentionLimitRule.id, ruleData)
            .then(async (result) => {
              await interaction.editReply(
                `\\✔️ Successfully updated the auto-moderation rule for \`${guild.name}\``
              );
            })
            .catch(async (err) => {
              return await interaction.editReply(`❌ There was an error while updating the auto-moderation rule: ${err.message}`);
            });
        } else {
          guild.autoModerationRules
            .create(ruleData)
            .then(async (result) => {
              await interaction.editReply(
                `\\✔️ Successfully created the new auto-moderation rule for \`${guild.name}\``
              );
            })
            .catch(async (err) => {
              return await interaction.editReply(`❌ There was an error while creating the new auto-moderation rule: ${err.message}`);
            });
        }
        break;
      case "keywords":
        // Fetch existing rules
        const existingKeywordFilterRules = Rules.filter(
          (rule) => rule.triggerType === 1
        );

        ruleData = {
          name: `Blocked keywords protection by ${client.user.username}`,
          creatorId: interaction.user.id,
          enabled: true,
          eventType: 1,
          triggerType: 1,
          triggerMetadata: {
            keywordFilter: keyword.split(", "),
          },
          actions: [
            {
              type: action,
              metadata: {
                channel: channel,
                durationSeconds: 10,
                customMessage: `⚠️ This message was blocked by \`${client.user.username}\`, as it contains blocked keywords!`,
              },
            },
          ],
        }

        // Check if the number of existing rules with triggerType 1 exceeds the limit
        if (existingKeywordFilterRules.size >= 6) {
          const options = existingKeywordFilterRules.map(rule => ({
            label: rule.name,
            value: rule.id
          }));

          const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("collect_menu_selectRule")
            .setPlaceholder('Select a rule to edit')
            .addOptions(options);

          const row = new ActionRowBuilder().addComponents(selectMenu);

          const response = await interaction.editReply({
            content: `\\❌ You cannot create more than 6 keyword filter rules! Please select an existing rule to edit:`,
            components: [row]
          });
          // Set up a collector to listen for user selection
          const collector = response.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 60000, // 60 seconds timeout
          });

          // Listen for user selection
          collector.on('collect', async (selectInteraction) => {
            if (selectInteraction.user.id !== interaction.user.id) return; // Ensure only the original user can interact

            const selectedRuleId = selectInteraction.values[0];

            guild.autoModerationRules
              .edit(selectedRuleId, ruleData)
              .then(async (result) => {
                await interaction.editReply({
                  content: `\\✔️ Successfully updated the auto-moderation rule for \`${guild.name}\` with id: \`${selectedRuleId}\``,
                  components: []
                });
              })
              .catch(async (err) => {
                return await interaction.editReply(`❌ There was an error while updating the auto-moderation rule: ${err.message}`);
              });

            collector.stop(); // Stop listening for further interactions
          });

          // Handle collector timeout
          collector.on('end', (collected, reason) => {
            if (reason === 'time') {
              interaction.editReply({
                content: 'Interaction timed out. Please try again.',
                components: [],
              });
            }
          });

          return;
        }

        // Create the new rule
        guild.autoModerationRules
          .create(ruleData)
          .then(async (result) => {
            await interaction.editReply(
              `\\✔️ Successfully created the new auto-moderation rule for \`${guild.name}\``
            );
          })
          .catch(async (err) => {
            return await interaction.editReply(`❌ There was an error while creating the new auto-moderation rule: ${err.message}`);
          });
        break;
    }
  },
};
