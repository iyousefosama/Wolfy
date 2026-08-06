const { ApplicationCommandOptionType } = require('discord.js');
const schema = require('../../schema/Mute-Schema');
const { checkModerationTarget } = require('../../util/moderation/targetChecks');
const { buildActionEmbed } = require('../../util/moderation/embeds');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "unmute",
    description: "Unmute a member (removes their Discord timeout)",
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
        description: 'The user to unmute',
        required: true
      },
      {
        type: ApplicationCommandOptionType.String,
        name: 'reason',
        description: 'The reason for the unmute',
        required: false
      }
    ]
  },
  async execute(client, interaction) {
    const reason = interaction.options.getString("reason") || 'Unspecified';

    const check = await checkModerationTarget(client, interaction, 'unmute');
    if (!check.ok) {
      return interaction.reply({ content: check.content, flags: ['Ephemeral'] });
    }
    const { member } = check;

    if (!member.communicationDisabledUntilTimestamp || member.communicationDisabledUntilTimestamp <= Date.now()) {
      return interaction.reply({ content: "❌ User is not currently **muted**!", flags: ['Ephemeral'] });
    }

    try {
      await member.timeout(null, `Wolfy UNMUTE: ${interaction.user.username}: ${reason}`);

      await schema.findOneAndUpdate(
        { guildId: interaction.guildId, userId: member.id },
        { guildId: interaction.guildId, userId: member.id, Muted: false },
        { upsert: true }
      );

      const unmuteEmbed = buildActionEmbed({
        target: member,
        executor: interaction.user,
        description: [
          `✅ Successfully **unmuted** ${member}!`,
          reason ? `- Reason: ${reason}` : ''
        ].join('\n'),
      });

      return interaction.reply({ embeds: [unmuteEmbed] });
    } catch {
      return interaction.reply({
        content: "❌ I couldn't unmute that user!",
        flags: ['Ephemeral']
      });
    }
  },
}; 