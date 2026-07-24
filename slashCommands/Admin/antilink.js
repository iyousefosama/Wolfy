const GuildSchema = require('../../schema/GuildSchema');
const { colors } = require('../../util/constants/constants');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "antilink",
    description: "Configure advanced link protection with whitelist/blacklist and scam detection",
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
        description: 'Enable anti-link protection',
      },
      {
        type: 1, // SUB_COMMAND
        name: 'disable',
        description: 'Disable anti-link protection',
      },
      {
        type: 1, // SUB_COMMAND
        name: 'settings',
        description: 'Configure anti-link settings',
        options: [
          {
            type: 3, // STRING
            name: 'action',
            description: 'Action to take when links are detected',
            choices: [
              { name: "Delete message", value: "delete" },
              { name: "Mute user", value: "mute" },
              { name: "Ban user", value: "ban" }
            ]
          },
          {
            type: 7, // CHANNEL
            name: 'log_channel',
            description: 'Channel to send anti-link logs'
          },
          {
            type: 5, // BOOLEAN
            name: 'scam_detection',
            description: 'Enable automatic scam link detection'
          }
        ]
      },
      {
        type: 1, // SUB_COMMAND
        name: 'whitelist',
        description: 'Manage link whitelist',
        options: [
          {
            type: 3, // STRING
            name: 'add',
            description: 'Add a domain to whitelist (e.g., youtube.com)'
          },
          {
            type: 3, // STRING
            name: 'remove',
            description: 'Remove a domain from whitelist'
          },
          {
            type: 5, // BOOLEAN
            name: 'clear',
            description: 'Clear the entire whitelist'
          }
        ]
      },
      {
        type: 1, // SUB_COMMAND
        name: 'blacklist',
        description: 'Manage link blacklist',
        options: [
          {
            type: 3, // STRING
            name: 'add',
            description: 'Add a domain to blacklist (e.g., scam.com)'
          },
          {
            type: 3, // STRING
            name: 'remove',
            description: 'Remove a domain from blacklist'
          },
          {
            type: 5, // BOOLEAN
            name: 'clear',
            description: 'Clear the entire blacklist'
          }
        ]
      },
      {
        type: 1, // SUB_COMMAND
        name: 'allowed',
        description: 'Set allowed domains (only these domains will be permitted)',
        options: [
          {
            type: 3, // STRING
            name: 'add',
            description: 'Add an allowed domain'
          },
          {
            type: 3, // STRING
            name: 'remove',
            description: 'Remove an allowed domain'
          },
          {
            type: 5, // BOOLEAN
            name: 'clear',
            description: 'Clear allowed domains list'
          }
        ]
      },
      {
        type: 1, // SUB_COMMAND
        name: 'status',
        description: 'View current anti-link status and settings',
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

    // Initialize AntiLink if not exists
    if (!guildData.Mod.AntiLink) {
      guildData.Mod.AntiLink = {
        isEnabled: false,
        whitelist: [],
        blacklist: [],
        scamDetection: true,
        allowedDomains: [],
        action: 'delete',
        logChannel: null
      };
    }

    switch (sub) {
      case "enable": {
        const updated = await GuildSchema.findOneAndUpdate(
          { GuildID: guild.id },
          { $set: { 'Mod.AntiLink.isEnabled': true } },
          { upsert: true, new: true, lean: true }
        ).catch(() => null);

        if (updated) {
          client.setCachedGuildData(guild.id, updated);
          guildData = updated;
        } else {
          guildData.Mod.AntiLink.isEnabled = true;
        }

        await interaction.editReply({
          content: `✅ **Anti-link protection has been enabled**\n\nCurrent settings:\n- Action: ${guildData.Mod?.AntiLink?.action || 'delete'}\n- Scam detection: ${guildData.Mod?.AntiLink?.scamDetection ? 'Enabled' : 'Disabled'}\n- Whitelisted domains: ${guildData.Mod?.AntiLink?.whitelist?.length || 0}\n- Blacklisted domains: ${guildData.Mod?.AntiLink?.blacklist?.length || 0}\n- Allowed domains: ${guildData.Mod?.AntiLink?.allowedDomains?.length || 0}`
        });
        break;
      }

      case "disable": {
        const updated = await GuildSchema.findOneAndUpdate(
          { GuildID: guild.id },
          { $set: { 'Mod.AntiLink.isEnabled': false } },
          { upsert: true, new: true, lean: true }
        ).catch(() => null);

        if (updated) {
          client.setCachedGuildData(guild.id, updated);
          guildData = updated;
        } else {
          guildData.Mod.AntiLink.isEnabled = false;
        }

        await interaction.editReply({
          content: `❌ **Anti-link protection has been disabled**`
        });
        break;
      }

      case "settings": {
        const action = options.getString("action");
        const logChannel = options.getChannel("log_channel");
        const scamDetection = options.getBoolean("scam_detection");

        const updateData = {};
        if (action) updateData['Mod.AntiLink.action'] = action;
        if (logChannel) updateData['Mod.AntiLink.logChannel'] = logChannel.id;
        if (scamDetection !== null) updateData['Mod.AntiLink.scamDetection'] = scamDetection;

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

        await interaction.editReply({
          content: `⚙️ **Anti-link settings updated**\n\nCurrent settings:\n- Action: ${guildData.Mod?.AntiLink?.action || 'delete'}\n- Scam detection: ${guildData.Mod?.AntiLink?.scamDetection ? 'Enabled' : 'Disabled'}\n- Log channel: ${guildData.Mod?.AntiLink?.logChannel ? `<#${guildData.Mod.AntiLink.logChannel}>` : 'Not set'}\n- Whitelisted domains: ${guildData.Mod?.AntiLink?.whitelist?.length || 0}\n- Blacklisted domains: ${guildData.Mod?.AntiLink?.blacklist?.length || 0}\n- Allowed domains: ${guildData.Mod?.AntiLink?.allowedDomains?.length || 0}`
        });
        break;
      }

      case "whitelist": {
        const addWhitelist = options.getString("add");
        const removeWhitelist = options.getString("remove");
        const clearWhitelist = options.getBoolean("clear");
        const currentList = guildData.Mod?.AntiLink?.whitelist || [];

        let newList = [...currentList];
        if (clearWhitelist) {
          newList = [];
        } else if (addWhitelist) {
          if (!newList.includes(addWhitelist.toLowerCase())) {
            newList.push(addWhitelist.toLowerCase());
          }
        } else if (removeWhitelist) {
          newList = newList.filter(d => d !== removeWhitelist.toLowerCase());
        }

        const updated = await GuildSchema.findOneAndUpdate(
          { GuildID: guild.id },
          { $set: { 'Mod.AntiLink.whitelist': newList } },
          { upsert: true, new: true, lean: true }
        ).catch(() => null);

        if (updated) {
          client.setCachedGuildData(guild.id, updated);
          guildData = updated;
        }

        const activeList = guildData.Mod?.AntiLink?.whitelist || [];
        await interaction.editReply({
          content: `📋 **Whitelist updated**\n\nCurrent whitelist (${activeList.length}):\n${activeList.length > 0 ? activeList.join(', ') : 'None'}`
        });
        break;
      }

      case "blacklist": {
        const addBlacklist = options.getString("add");
        const removeBlacklist = options.getString("remove");
        const clearBlacklist = options.getBoolean("clear");
        const currentList = guildData.Mod?.AntiLink?.blacklist || [];

        let newList = [...currentList];
        if (clearBlacklist) {
          newList = [];
        } else if (addBlacklist) {
          if (!newList.includes(addBlacklist.toLowerCase())) {
            newList.push(addBlacklist.toLowerCase());
          }
        } else if (removeBlacklist) {
          newList = newList.filter(d => d !== removeBlacklist.toLowerCase());
        }

        const updated = await GuildSchema.findOneAndUpdate(
          { GuildID: guild.id },
          { $set: { 'Mod.AntiLink.blacklist': newList } },
          { upsert: true, new: true, lean: true }
        ).catch(() => null);

        if (updated) {
          client.setCachedGuildData(guild.id, updated);
          guildData = updated;
        }

        const activeList = guildData.Mod?.AntiLink?.blacklist || [];
        await interaction.editReply({
          content: `🚫 **Blacklist updated**\n\nCurrent blacklist (${activeList.length}):\n${activeList.length > 0 ? activeList.join(', ') : 'None'}`
        });
        break;
      }

      case "allowed": {
        const addAllowed = options.getString("add");
        const removeAllowed = options.getString("remove");
        const clearAllowed = options.getBoolean("clear");
        const currentList = guildData.Mod?.AntiLink?.allowedDomains || [];

        let newList = [...currentList];
        if (clearAllowed) {
          newList = [];
        } else if (addAllowed) {
          if (!newList.includes(addAllowed.toLowerCase())) {
            newList.push(addAllowed.toLowerCase());
          }
        } else if (removeAllowed) {
          newList = newList.filter(d => d !== removeAllowed.toLowerCase());
        }

        const updated = await GuildSchema.findOneAndUpdate(
          { GuildID: guild.id },
          { $set: { 'Mod.AntiLink.allowedDomains': newList } },
          { upsert: true, new: true, lean: true }
        ).catch(() => null);

        if (updated) {
          client.setCachedGuildData(guild.id, updated);
          guildData = updated;
        }

        const activeList = guildData.Mod?.AntiLink?.allowedDomains || [];
        await interaction.editReply({
          content: `✅ **Allowed domains updated**\n\nCurrent allowed domains (${activeList.length}):\n${activeList.length > 0 ? activeList.join(', ') : 'None'}`
        });
        break;
      }

      case "status": {
        const antiLink = guildData.Mod?.AntiLink || {};
        const isEnabled = !!antiLink.isEnabled;
        const whitelist = antiLink.whitelist || [];
        const blacklist = antiLink.blacklist || [];
        const allowed = antiLink.allowedDomains || [];

        const statusEmbed = {
          color: isEnabled ? colors.SUCCESS : colors.ERROR,
          author: {
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
          },
          title: `🔗 Anti-Link Status - ${isEnabled ? 'Enabled' : 'Disabled'}`,
          fields: [
            { name: 'Action', value: antiLink.action || 'delete', inline: true },
            { name: 'Scam Detection', value: antiLink.scamDetection ? 'Enabled' : 'Disabled', inline: true },
            { name: 'Log Channel', value: antiLink.logChannel ? `<#${antiLink.logChannel}>` : 'Not set', inline: true },
            { name: 'Whitelisted Domains', value: whitelist.length > 0 ? whitelist.slice(0, 5).join(', ') + (whitelist.length > 5 ? '...' : '') : 'None', inline: false },
            { name: 'Blacklisted Domains', value: blacklist.length > 0 ? blacklist.slice(0, 5).join(', ') + (blacklist.length > 5 ? '...' : '') : 'None', inline: false },
            { name: 'Allowed Domains', value: allowed.length > 0 ? allowed.slice(0, 5).join(', ') + (allowed.length > 5 ? '...' : '') : 'None', inline: false }
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
