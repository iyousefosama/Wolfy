const GuildSchema = require('../../schema/GuildSchema');
const { colors } = require('../../util/constants/constants');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "antiraid",
    description: "Configure anti-raid protection for the server",
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
        description: 'Enable anti-raid protection',
      },
      {
        type: 1, // SUB_COMMAND
        name: 'disable',
        description: 'Disable anti-raid protection',
      },
      {
        type: 1, // SUB_COMMAND
        name: 'settings',
        description: 'Configure anti-raid settings',
        options: [
          {
            type: 4, // INTEGER
            name: 'max_joins',
            description: 'Maximum joins per minute before raid detection (default: 5)',
            minValue: 1,
            maxValue: 50
          },
          {
            type: 4, // INTEGER
            name: 'min_account_age',
            description: 'Minimum account age in hours (default: 24)',
            minValue: 1,
            maxValue: 720
          },
          {
            type: 3, // STRING
            name: 'action',
            description: 'Action to take against suspicious users',
            choices: [
              { name: "Mute", value: "mute" },
              { name: "Kick", value: "kick" },
              { name: "Ban", value: "ban" }
            ]
          },
          {
            type: 4, // INTEGER
            name: 'lockdown_duration',
            description: 'Lockdown duration in seconds (default: 300)',
            minValue: 60,
            maxValue: 3600
          },
          {
            type: 7, // CHANNEL
            name: 'log_channel',
            description: 'Channel to send anti-raid logs'
          }
        ]
      },
      {
        type: 1, // SUB_COMMAND
        name: 'status',
        description: 'View current anti-raid status and settings',
      }
    ]
  },
  async execute(client, interaction) {
    const { guild, options } = interaction;
    await interaction.deferReply({ flags: ['Ephemeral'] }).catch(() => {});

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

    // Initialize AntiRaid if not exists
    if (!guildData.Mod.AntiRaid) {
      guildData.Mod.AntiRaid = {
        isEnabled: false,
        maxJoinsPerMinute: 5,
        minAccountAge: 86400000,
        action: 'mute',
        logChannel: null,
        lockdownDuration: 300000
      };
    }

    switch (sub) {
      case "enable": {
        const updated = await GuildSchema.findOneAndUpdate(
          { GuildID: guild.id },
          { $set: { 'Mod.AntiRaid.isEnabled': true } },
          { upsert: true, new: true, lean: true }
        ).catch(() => null);

        if (updated) {
          client.setCachedGuildData(guild.id, updated);
          guildData = updated;
        } else {
          guildData.Mod.AntiRaid.isEnabled = true;
        }

        const antiRaidConfig = guildData.Mod?.AntiRaid || {};
        await interaction.editReply({
          content: `✅ **Anti-raid protection has been enabled**\n\nCurrent settings:\n- Max joins per minute: ${antiRaidConfig.maxJoinsPerMinute || 5}\n- Min account age: ${(antiRaidConfig.minAccountAge || 86400000) / 3600000} hours\n- Action: ${antiRaidConfig.action || 'mute'}\n- Lockdown duration: ${(antiRaidConfig.lockdownDuration || 300000) / 1000} seconds`
        });
        break;
      }

      case "disable": {
        const updated = await GuildSchema.findOneAndUpdate(
          { GuildID: guild.id },
          { $set: { 'Mod.AntiRaid.isEnabled': false } },
          { upsert: true, new: true, lean: true }
        ).catch(() => null);

        if (updated) {
          client.setCachedGuildData(guild.id, updated);
          guildData = updated;
        } else {
          guildData.Mod.AntiRaid.isEnabled = false;
        }

        await interaction.editReply({
          content: `❌ **Anti-raid protection has been disabled**`
        });
        break;
      }

      case "settings": {
        const maxJoins = options.getInteger("max_joins");
        const minAccountAge = options.getInteger("min_account_age");
        const action = options.getString("action");
        const lockdownDuration = options.getInteger("lockdown_duration");
        const logChannel = options.getChannel("log_channel");

        const updateData = {};
        if (maxJoins) updateData['Mod.AntiRaid.maxJoinsPerMinute'] = maxJoins;
        if (minAccountAge) updateData['Mod.AntiRaid.minAccountAge'] = minAccountAge * 3600000;
        if (action) updateData['Mod.AntiRaid.action'] = action;
        if (lockdownDuration) updateData['Mod.AntiRaid.lockdownDuration'] = lockdownDuration * 1000;
        if (logChannel) updateData['Mod.AntiRaid.logChannel'] = logChannel.id;

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

        const antiRaidConfig = guildData.Mod?.AntiRaid || {};
        await interaction.editReply({
          content: `⚙️ **Anti-raid settings updated**\n\nCurrent settings:\n- Max joins per minute: ${antiRaidConfig.maxJoinsPerMinute || 5}\n- Min account age: ${(antiRaidConfig.minAccountAge || 86400000) / 3600000} hours\n- Action: ${antiRaidConfig.action || 'mute'}\n- Lockdown duration: ${(antiRaidConfig.lockdownDuration || 300000) / 1000} seconds\n- Log channel: ${antiRaidConfig.logChannel ? `<#${antiRaidConfig.logChannel}>` : 'Not set'}`
        });
        break;
      }

      case "status": {
        const antiRaidConfig = guildData.Mod?.AntiRaid || {};
        const isEnabled = !!antiRaidConfig.isEnabled;

        const statusEmbed = {
          color: isEnabled ? colors.SUCCESS : colors.ERROR,
          author: {
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
          },
          title: `🛡️ Anti-Raid Status - ${isEnabled ? 'Enabled' : 'Disabled'}`,
          fields: [
            { name: 'Max Joins/Minute', value: (antiRaidConfig.maxJoinsPerMinute || 5).toString(), inline: true },
            { name: 'Min Account Age', value: `${(antiRaidConfig.minAccountAge || 86400000) / 3600000} hours`, inline: true },
            { name: 'Action', value: antiRaidConfig.action || 'mute', inline: true },
            { name: 'Lockdown Duration', value: `${(antiRaidConfig.lockdownDuration || 300000) / 1000} seconds`, inline: true },
            { name: 'Log Channel', value: antiRaidConfig.logChannel ? `<#${antiRaidConfig.logChannel}>` : 'Not set', inline: true }
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
