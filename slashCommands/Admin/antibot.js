const GuildSchema = require('../../schema/GuildSchema');
const { colors } = require('../../util/constants/constants');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "antibot",
    description: "Configure anti-bot protection to detect compromised accounts",
    dmOnly: false,
    guildOnly: true,
    cooldown: 3,
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
        name: 'enable',
        description: 'Enable anti-bot protection',
      },
      {
        type: 1, // SUB_COMMAND
        name: 'disable',
        description: 'Disable anti-bot protection',
      },
      {
        type: 1, // SUB_COMMAND
        name: 'settings',
        description: 'Configure anti-bot settings',
        options: [
          {
            type: 4, // INTEGER
            name: 'max_messages',
            description: 'Maximum messages per minute before detection (default: 10)',
            minValue: 1,
            maxValue: 100
          },
          {
            type: 4, // INTEGER
            name: 'max_same_links',
            description: 'Maximum same links before detection (default: 3)',
            minValue: 1,
            maxValue: 20
          },
          {
            type: 3, // STRING
            name: 'action',
            description: 'Action to take against detected bots',
            choices: [
              { name: "Mute", value: "mute" },
              { name: "Kick", value: "kick" },
              { name: "Ban", value: "ban" }
            ]
          },
          {
            type: 7, // CHANNEL
            name: 'log_channel',
            description: 'Channel to send anti-bot logs'
          },
          {
            type: 3, // STRING
            name: 'add_pattern',
            description: 'Add a suspicious pattern (regex) to detect'
          },
          {
            type: 3, // STRING
            name: 'remove_pattern',
            description: 'Remove a suspicious pattern'
          }
        ]
      },
      {
        type: 1, // SUB_COMMAND
        name: 'status',
        description: 'View current anti-bot status and settings',
      }
    ]
  },
  async execute(client, interaction) {
    const { guild, options } = interaction;
    await interaction.deferReply({ ephemeral: true }).catch(() => {});

    const sub = options.getSubcommand();
    let guildData;

    try {
      guildData = await client.getCachedGuildData(guild.id);
    } catch (err) {
      console.log(err);
      return await interaction.editReply(
        "💢 There was an error while executing this command!"
      );
    }

    if (!guildData) {
      guildData = { GuildID: guild.id, Mod: {} };
    }
    if (!guildData.Mod) {
      guildData.Mod = {};
    }

    // Initialize AntiBot if not exists
    if (!guildData.Mod.AntiBot) {
      guildData.Mod.AntiBot = {
        isEnabled: false,
        maxMessagesPerMinute: 10,
        maxSameLinks: 3,
        action: 'mute',
        logChannel: null,
        suspiciousPatterns: []
      };
    }

    switch (sub) {
      case "enable": {
        const updated = await GuildSchema.findOneAndUpdate(
          { GuildID: guild.id },
          { $set: { 'Mod.AntiBot.isEnabled': true } },
          { upsert: true, new: true, lean: true }
        ).catch(() => null);

        if (updated) {
          client.setCachedGuildData(guild.id, updated);
          guildData = updated;
        } else {
          guildData.Mod.AntiBot.isEnabled = true;
        }

        const antiBotConfig = guildData.Mod?.AntiBot || {};
        await interaction.editReply({
          content: `✅ **Anti-bot protection has been enabled**\n\nCurrent settings:\n- Max messages per minute: ${antiBotConfig.maxMessagesPerMinute || 10}\n- Max same links: ${antiBotConfig.maxSameLinks || 3}\n- Action: ${antiBotConfig.action || 'mute'}\n- Suspicious patterns: ${antiBotConfig.suspiciousPatterns?.length || 0}`
        });
        break;
      }

      case "disable": {
        const updated = await GuildSchema.findOneAndUpdate(
          { GuildID: guild.id },
          { $set: { 'Mod.AntiBot.isEnabled': false } },
          { upsert: true, new: true, lean: true }
        ).catch(() => null);

        if (updated) {
          client.setCachedGuildData(guild.id, updated);
          guildData = updated;
        } else {
          guildData.Mod.AntiBot.isEnabled = false;
        }

        await interaction.editReply({
          content: `❌ **Anti-bot protection has been disabled**`
        });
        break;
      }

      case "settings": {
        const maxMessages = options.getInteger("max_messages");
        const maxSameLinks = options.getInteger("max_same_links");
        const action = options.getString("action");
        const logChannel = options.getChannel("log_channel");
        const addPattern = options.getString("add_pattern");
        const removePattern = options.getString("remove_pattern");

        const currentPatterns = guildData.Mod?.AntiBot?.suspiciousPatterns || [];
        let updatedPatterns = [...currentPatterns];

        if (addPattern && !updatedPatterns.includes(addPattern)) {
          updatedPatterns.push(addPattern);
        }
        if (removePattern) {
          updatedPatterns = updatedPatterns.filter(p => p !== removePattern);
        }

        const updateData = {};
        if (maxMessages) updateData['Mod.AntiBot.maxMessagesPerMinute'] = maxMessages;
        if (maxSameLinks) updateData['Mod.AntiBot.maxSameLinks'] = maxSameLinks;
        if (action) updateData['Mod.AntiBot.action'] = action;
        if (logChannel) updateData['Mod.AntiBot.logChannel'] = logChannel.id;
        if (addPattern || removePattern) updateData['Mod.AntiBot.suspiciousPatterns'] = updatedPatterns;

        if (Object.keys(updateData).length > 0) {
          const updated = await GuildSchema.findOneAndUpdate(
            { GuildID: guild.id },
            { $set: updateData },
            { upsert: true, new: true, lean: true }
          ).catch(() => null);

          if (updated) {
            client.setCachedGuildData(guild.id, updated);
            guildData = updated;
          }
        }

        const antiBotConfig = guildData.Mod?.AntiBot || {};
        await interaction.editReply({
          content: `⚙️ **Anti-bot settings updated**\n\nCurrent settings:\n- Max messages per minute: ${antiBotConfig.maxMessagesPerMinute || 10}\n- Max same links: ${antiBotConfig.maxSameLinks || 3}\n- Action: ${antiBotConfig.action || 'mute'}\n- Log channel: ${antiBotConfig.logChannel ? `<#${antiBotConfig.logChannel}>` : 'Not set'}\n- Suspicious patterns: ${antiBotConfig.suspiciousPatterns?.length || 0}`
        });
        break;
      }

      case "status": {
        const antiBotConfig = guildData.Mod?.AntiBot || {};
        const isEnabled = !!antiBotConfig.isEnabled;
        const patterns = antiBotConfig.suspiciousPatterns || [];

        const statusEmbed = {
          color: isEnabled ? colors.SUCCESS : colors.ERROR,
          author: {
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
          },
          title: `🤖 Anti-Bot Status - ${isEnabled ? 'Enabled' : 'Disabled'}`,
          fields: [
            { name: 'Max Messages/Minute', value: (antiBotConfig.maxMessagesPerMinute || 10).toString(), inline: true },
            { name: 'Max Same Links', value: (antiBotConfig.maxSameLinks || 3).toString(), inline: true },
            { name: 'Action', value: antiBotConfig.action || 'mute', inline: true },
            { name: 'Log Channel', value: antiBotConfig.logChannel ? `<#${antiBotConfig.logChannel}>` : 'Not set', inline: true },
            { name: 'Suspicious Patterns', value: patterns.length > 0 ? patterns.slice(0, 5).join(', ') + (patterns.length > 5 ? '...' : '') : 'None', inline: false }
          ],
          footer: {
            text: `Requested by ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL()
          },
          timestamp: new Date()
        };
        await interaction.editReply({ embeds: [statusEmbed] });
        break;
      }
    }
  },
};
