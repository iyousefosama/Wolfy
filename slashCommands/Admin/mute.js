const ms = require('ms');
const { ApplicationCommandOptionType } = require('discord.js');
const schema = require('../../schema/Mute-Schema');
const { checkModerationTarget } = require('../../util/moderation/targetChecks');
const { buildActionEmbed } = require('../../util/moderation/embeds');

// Discord API limit: timeout can't exceed 28 days.
const MAX_MUTE_MS = 28 * 24 * 60 * 60 * 1000;
const MIN_MUTE_MS = 10_000;

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "mute",
    description: "Mute a member for a set duration (text + voice) using Discord timeouts",
    dmOnly: false,
    guildOnly: true,
    cooldown: 3,
    group: "Moderation",
    clientPermissions: ["ModerateMembers"],
    permissions: ["ModerateMembers"],
    options: [
      {
        type: ApplicationCommandOptionType.User,
        name: 'target',
        description: 'The user to mute',
        required: true
      },
      {
        type: ApplicationCommandOptionType.String,
        name: 'duration',
        description: 'How long to mute for (e.g. 10m, 1h, 7d)',
        required: true
      },
      {
        type: ApplicationCommandOptionType.String,
        name: 'reason',
        description: 'The reason for the mute',
        required: false
      }
    ]
  },
  async execute(client, interaction) {
    const durationStr = interaction.options.getString("duration");
    const reason = interaction.options.getString("reason") || 'Unspecified';

    const check = await checkModerationTarget(client, interaction, 'mute');
    if (!check.ok) {
      return interaction.reply({ content: check.content, flags: ['Ephemeral'] });
    }
    const { member } = check;

    const durationMs = ms(durationStr);
    if (!durationMs || durationMs < MIN_MUTE_MS) {
      return interaction.reply({
        content: "❌ Please provide a valid mute duration (minimum 10 seconds). Examples: `10m`, `1h`, `7d`.",
        flags: ['Ephemeral']
      });
    }
    if (durationMs > MAX_MUTE_MS) {
      return interaction.reply({
        content: "❌ Mute duration cannot exceed **28 days**.",
        flags: ['Ephemeral']
      });
    }

    if (member.communicationDisabledUntilTimestamp && member.communicationDisabledUntilTimestamp > Date.now()) {
      return interaction.reply({ content: "❌ User is already **muted**! Use `/unmute` first.", flags: ['Ephemeral'] });
    }

    const expiresAt = Math.floor((Date.now() + durationMs) / 1000);

    try {
      await member.timeout(durationMs, `Wolfy MUTE: ${interaction.user.username}: ${reason}`);

      await schema.findOneAndUpdate(
        { guildId: interaction.guildId, userId: member.id },
        { guildId: interaction.guildId, userId: member.id, Muted: true },
        { upsert: true }
      );

      const muteEmbed = buildActionEmbed({
        target: member,
        executor: interaction.user,
        description: [
          `✅ Successfully **muted** ${member} for ${durationStr}.`,
          reason ? `- Reason: ${reason}` : '',
          `- Expires: <t:${expiresAt}:F> (<t:${expiresAt}:R>)`
        ].join('\n'),
      });

      return interaction.reply({ embeds: [muteEmbed] });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: "❌ I couldn't **mute** that user!",
        flags: ['Ephemeral']
      });
    }
  },
};