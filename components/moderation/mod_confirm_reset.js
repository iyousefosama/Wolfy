const GuildSchema = require('../../schema/GuildSchema');
const { buildDashboardEmbed, buildDashboardButtons } = require('../../util/functions/moderationDashboard');

/**
 * mod_confirm_reset — Button handler
 *
 * Confirms and executes the full reset to defaults.
 * Button customId: `mod_confirm_reset` → parts ["mod","confirm","reset"].
 *
 * @type {import("../../util/types/baseComponent")}
 */

const DEFAULTS = {
  'Mod.AntiLink': {
    isEnabled: false,
    mode: 'scam',
    whitelist: [],
    blacklist: [],
    scamDetection: true,
    allowedDomains: [],
    action: 'delete',
    logChannel: null,
    bypassRoles: [],
    bypassChannels: [],
  },
  'Mod.AntiBot': {
    isEnabled: false,
    maxMessagesPerMinute: 10,
    maxSameLinks: 3,
    action: 'mute',
    logChannel: null,
    suspiciousPatterns: [],
    minAccountAge: 86400000,
    requireVerified: false,
    bypassRoles: [],
  },
  'Mod.AntiSpam': {
    isEnabled: false,
    maxMessagesPerMinute: 10,
    maxCapsPercentage: 70,
    minCapsLength: 5,
    maxEmojis: 10,
    maxDuplicates: 3,
    maxMentions: 5,
    maxLinksPerMessage: 3,
    action: 'delete',
    logChannel: null,
    bypassRoles: [],
    bypassChannels: [],
  },
  'Mod.AntiRaid': {
    isEnabled: false,
    maxJoinsPerMinute: 5,
    minAccountAge: 86400000,
    action: 'mute',
    logChannel: null,
    lockdownDuration: 300000,
  },
  'Mod.BadWordsFilter': {
    isEnabled: false,
    BDW: [],
    action: 'delete',
    logChannel: null,
    bypassRoles: [],
    bypassChannels: [],
  },
  'Mod.HoneyPot': {
    isEnabled: false,
    channel: null,
    action: 'kick',
    logChannel: null,
  },
};

module.exports = {
  name: 'mod_confirm_reset',
  enabled: true,

  async action(client, interaction) {
    const updateData = {};
    for (const [path, defaults] of Object.entries(DEFAULTS)) {
      updateData[path] = defaults;
    }

    const updated = await GuildSchema.findOneAndUpdate(
      { GuildID: interaction.guildId },
      { $set: updateData },
      { upsert: true, new: true, lean: true },
    ).catch(() => null);

    if (updated) {
      client.setCachedGuildData(interaction.guildId, updated);
    }

    const embed = buildDashboardEmbed(client, updated)
      .setFooter({
        text: `Reset by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    await interaction.update({
      embeds: [embed],
      components: [buildDashboardButtons()],
    });
  },
};
