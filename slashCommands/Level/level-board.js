const { EmbedBuilder } = require('discord.js');
const GuildSchema = require('../../schema/GuildSchema');
const LevelService = require('../../util/functions/LevelService');

const MEDALS = ['🥇', '🥈', '🥉'];

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "leaderboard",
    description: "Shows the server's XP leaderboard",
    group: "Level",
    requiresDatabase: true,
    clientPermissions: [],
    guildOnly: true,
    options: [
      {
        type: 4, // INTEGER
        name: 'page',
        description: 'Page number to view',
        required: false,
        min_value: 1,
        max_value: 10
      }
    ]
  },

  async execute(client, interaction) {
    const page = interaction.options.getInteger('page') || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    await interaction.deferReply();

    const guildData = await GuildSchema.findOne({ GuildID: interaction.guildId });
    if (!guildData?.Mod?.Level?.isEnabled) {
      return interaction.editReply({
        content: `❌ The leveling system is disabled! Use \`${client.prefix}leveltoggle\` to enable it.`
      });
    }

    try {
      // Fetch leaderboard data
      const leaderboard = await LevelService.getLeaderboard(interaction.guildId, limit + skip);
      const pageData = leaderboard.slice(skip, skip + limit);

      if (pageData.length === 0) {
        return interaction.editReply("❌ No data found for this page.");
      }

      // Build leaderboard entries
      const entries = await Promise.all(
        pageData.map(async (userData, index) => {
          const rank = skip + index + 1;
          const medal = rank <= 3 ? MEDALS[rank - 1] : `\`${rank.toString().padStart(2)}\``;
          
          const member = await interaction.guild.members.fetch(userData.userId).catch(() => null);
          const name = member?.displayName || member?.user?.username || 'Unknown';
          
          return `${medal} **${name}** • Level ${userData.level} • ${userData.totalXp.toLocaleString()} XP`;
        })
      );

      const embed = new EmbedBuilder()
        .setTitle(`🏆 ${interaction.guild.name} Leaderboard`)
        .setColor('Gold')
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 256 }))
        .setDescription(entries.join('\n') || 'No users found.')
        .setFooter({ text: `Page ${page} • ${interaction.guild.memberCount} members` })
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error('[Slash Leaderboard] Error:', err);
      return interaction.editReply('❌ Failed to load leaderboard. Please try again later.');
    }
  }
};
