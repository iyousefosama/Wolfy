const GuildSchema = require('../../schema/GuildSchema');
const { colors } = require('../../util/constants/constants');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "antispam",
    description: "Configure anti-spam protection (caps, emojis, duplicates)",
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
        description: 'Enable anti-spam protection',
      },
      {
        type: 1, // SUB_COMMAND
        name: 'disable',
        description: 'Disable anti-spam protection',
      },
      {
        type: 1, // SUB_COMMAND
        name: 'settings',
        description: 'Configure anti-spam settings',
        options: [
          {
            type: 4, // INTEGER
            name: 'max_caps_percent',
            description: 'Maximum caps percentage (default: 70)',
            minValue: 10,
            maxValue: 100
          },
          {
            type: 4, // INTEGER
            name: 'min_caps_length',
            description: 'Minimum message length for caps check (default: 5)',
            minValue: 1,
            maxValue: 50
          },
          {
            type: 4, // INTEGER
            name: 'max_emojis',
            description: 'Maximum emojis per message (default: 10)',
            minValue: 1,
            maxValue: 50
          },
          {
            type: 4, // INTEGER
            name: 'max_duplicates',
            description: 'Maximum duplicate messages (default: 3)',
            minValue: 1,
            maxValue: 20
          },
          {
            type: 3, // STRING
            name: 'action',
            description: 'Action to take when spam is detected',
            choices: [
              { name: "Delete message", value: "delete" },
              { name: "Mute user", value: "mute" },
              { name: "Warn user", value: "warn" }
            ]
          },
          {
            type: 7, // CHANNEL
            name: 'log_channel',
            description: 'Channel to send anti-spam logs'
          }
        ]
      },
      {
        type: 1, // SUB_COMMAND
        name: 'status',
        description: 'View current anti-spam status and settings',
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

    // Initialize AntiSpam if not exists
    if (!guildData.Mod.AntiSpam) {
      guildData.Mod.AntiSpam = {
        isEnabled: false,
        maxCapsPercentage: 70,
        minCapsLength: 5,
        maxEmojis: 10,
        maxDuplicates: 3,
        action: 'delete',
        logChannel: null
      };
    }

    switch (sub) {
      case "enable": {
        const updated = await GuildSchema.findOneAndUpdate(
          { GuildID: guild.id },
          { $set: { 'Mod.AntiSpam.isEnabled': true } },
          { upsert: true, new: true, lean: true }
        ).catch(() => null);

        if (updated) {
          client.setCachedGuildData(guild.id, updated);
          guildData = updated;
        } else {
          guildData.Mod.AntiSpam.isEnabled = true;
        }

        const antiSpamConfig = guildData.Mod?.AntiSpam || {};
        await interaction.editReply({
          content: `✅ **Anti-spam protection has been enabled**\n\nCurrent settings:\n- Max caps percentage: ${antiSpamConfig.maxCapsPercentage || 70}%\n- Min caps length: ${antiSpamConfig.minCapsLength || 5}\n- Max emojis: ${antiSpamConfig.maxEmojis || 10}\n- Max duplicates: ${antiSpamConfig.maxDuplicates || 3}\n- Action: ${antiSpamConfig.action || 'delete'}`
        });
        break;
      }

      case "disable": {
        const updated = await GuildSchema.findOneAndUpdate(
          { GuildID: guild.id },
          { $set: { 'Mod.AntiSpam.isEnabled': false } },
          { upsert: true, new: true, lean: true }
        ).catch(() => null);

        if (updated) {
          client.setCachedGuildData(guild.id, updated);
          guildData = updated;
        } else {
          guildData.Mod.AntiSpam.isEnabled = false;
        }

        await interaction.editReply({
          content: `❌ **Anti-spam protection has been disabled**`
        });
        break;
      }

      case "settings": {
        const maxCapsPercent = options.getInteger("max_caps_percent");
        const minCapsLength = options.getInteger("min_caps_length");
        const maxEmojis = options.getInteger("max_emojis");
        const maxDuplicates = options.getInteger("max_duplicates");
        const action = options.getString("action");
        const logChannel = options.getChannel("log_channel");

        const updateData = {};
        if (maxCapsPercent) updateData['Mod.AntiSpam.maxCapsPercentage'] = maxCapsPercent;
        if (minCapsLength) updateData['Mod.AntiSpam.minCapsLength'] = minCapsLength;
        if (maxEmojis) updateData['Mod.AntiSpam.maxEmojis'] = maxEmojis;
        if (maxDuplicates) updateData['Mod.AntiSpam.maxDuplicates'] = maxDuplicates;
        if (action) updateData['Mod.AntiSpam.action'] = action;
        if (logChannel) updateData['Mod.AntiSpam.logChannel'] = logChannel.id;

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

        const antiSpamConfig = guildData.Mod?.AntiSpam || {};
        await interaction.editReply({
          content: `⚙️ **Anti-spam settings updated**\n\nCurrent settings:\n- Max caps percentage: ${antiSpamConfig.maxCapsPercentage || 70}%\n- Min caps length: ${antiSpamConfig.minCapsLength || 5}\n- Max emojis: ${antiSpamConfig.maxEmojis || 10}\n- Max duplicates: ${antiSpamConfig.maxDuplicates || 3}\n- Action: ${antiSpamConfig.action || 'delete'}\n- Log channel: ${antiSpamConfig.logChannel ? `<#${antiSpamConfig.logChannel}>` : 'Not set'}`
        });
        break;
      }

      case "status": {
        const antiSpamConfig = guildData.Mod?.AntiSpam || {};
        const isEnabled = !!antiSpamConfig.isEnabled;

        const statusEmbed = {
          color: isEnabled ? colors.SUCCESS : colors.ERROR,
          author: {
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
          },
          title: `⚠️ Anti-Spam Status - ${isEnabled ? 'Enabled' : 'Disabled'}`,
          fields: [
            { name: 'Max Caps %', value: `${antiSpamConfig.maxCapsPercentage || 70}%`, inline: true },
            { name: 'Min Caps Length', value: (antiSpamConfig.minCapsLength || 5).toString(), inline: true },
            { name: 'Max Emojis', value: (antiSpamConfig.maxEmojis || 10).toString(), inline: true },
            { name: 'Max Duplicates', value: (antiSpamConfig.maxDuplicates || 3).toString(), inline: true },
            { name: 'Action', value: antiSpamConfig.action || 'delete', inline: true },
            { name: 'Log Channel', value: antiSpamConfig.logChannel ? `<#${antiSpamConfig.logChannel}>` : 'Not set', inline: true }
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
