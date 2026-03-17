const { EmbedBuilder } = require('discord.js');
const GuildSchema = require('../../schema/GuildSchema');
const LevelService = require('../../util/functions/LevelService');

const MEDALS = ['🥇', '🥈', '🥉'];

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "leaderboard",
  aliases: ["lb", "levelboard", "top"],
  dmOnly: false,
  guildOnly: true,
  args: false,
  usage: "[page]",
  group: "LeveledRoles",
  description: "Shows the server's XP leaderboard",
  cooldown: 10,
  guarded: false,
  permissions: [],
  clientPermissions: ["EmbedLinks"],
  examples: ["", "2"],

  async execute(client, message, args) {
    const page = Math.max(1, parseInt(args[0]) || 1);
    const limit = 10;
    const skip = (page - 1) * limit;

    const guildData = await GuildSchema.findOne({ GuildID: message.guild.id });
    if (!guildData?.Mod?.Level?.isEnabled) {
      return message.reply({
        content: `❌ **${message.member.displayName}**, The leveling system is disabled!\nUse \`${client.prefix}leveltoggle\` to enable it.`
      });
    }

    try {
      message.channel.sendTyping();

      // Fetch leaderboard data
      const leaderboard = await LevelService.getLeaderboard(message.guild.id, limit + skip);
      const pageData = leaderboard.slice(skip, skip + limit);

      if (pageData.length === 0) {
        return message.reply("❌ No data found for this page.");
      }

      // Build leaderboard entries
      const entries = await Promise.all(
        pageData.map(async (userData, index) => {
          const rank = skip + index + 1;
          const medal = rank <= 3 ? MEDALS[rank - 1] : `\`${rank.toString().padStart(2)}\``;
          
          const member = await message.guild.members.fetch(userData.userId).catch(() => null);
          const name = member?.displayName || member?.user?.username || 'Unknown';
          
          return `${medal} **${name}** • Level ${userData.level} • ${userData.totalXp.toLocaleString()} XP`;
        })
      );

      const embed = new EmbedBuilder()
        .setTitle(`🏆 ${message.guild.name} Leaderboard`)
        .setColor('Gold')
        .setThumbnail(message.guild.iconURL({ dynamic: true, size: 256 }))
        .setDescription(entries.join('\n') || 'No users found.')
        .setFooter({ text: `Page ${page} • ${message.guild.memberCount} members` })
        .setTimestamp();

      return message.reply({ embeds: [embed] });

    } catch (err) {
      console.error('[Leaderboard] Error:', err);
      return message.reply('❌ Failed to load leaderboard. Please try again later.');
    }
  }
};
