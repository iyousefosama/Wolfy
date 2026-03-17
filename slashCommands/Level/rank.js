const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { Profile } = require('discord-arts');
const GuildSchema = require('../../schema/GuildSchema');
const EconomySchema = require('../../schema/Economy-Schema');
const LevelService = require('../../util/functions/LevelService');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "rank",
    description: "Show your or another user's level, rank, and XP progress",
    dmOnly: false,
    guildOnly: true,
    cooldown: 5,
    group: "Level",
    requiresDatabase: true,
    clientPermissions: ["AttachFiles"],
    permissions: [],
    options: [
      {
        type: 6, // USER
        name: 'user',
        description: 'User to check rank for (defaults to you)',
        required: false
      },
      {
        type: 5, // BOOLEAN
        name: 'hide',
        description: 'Hide the response (ephemeral)',
        required: false
      }
    ]
  },

  async execute(client, interaction) {
    const target = interaction.options.getUser('user') || interaction.user;
    const hide = interaction.options.getBoolean('hide') || false;

    await interaction.deferReply({ ephemeral: hide });

    // Check if leveling is enabled
    const guildData = await GuildSchema.findOne({ GuildID: interaction.guildId });
    if (!guildData?.Mod?.Level?.isEnabled) {
      return interaction.editReply({
        content: `❌ The leveling system is disabled in this server!\nUse \`${client.prefix}leveltoggle\` to enable it.`
      });
    }

    // Get member for presence status
    const member = await interaction.guild.members.fetch(target.id).catch(() => interaction.member);

    // Get user level data
    const levelData = await LevelService.getUserData(interaction.guildId, target.id);
    const userRank = await LevelService.getUserRank(interaction.guildId, target.id);

    // Get economy data for background
    const ecoData = await EconomySchema.findOne({ userID: target.id });
    const background = ecoData?.profile?.background || "https://i.imgur.com/299Kt1F.png";

    const rankData = {
      currentXp: levelData.xp,
      requiredXp: levelData.requiredXp,
      level: levelData.level,
      rank: userRank,
      totalXp: levelData.totalXp,
      messageCount: levelData.messageCount
    };

    try {
      // Generate rank card
      const buffer = await Profile(target.id, {
        customBackground: background,
        presenceStatus: member.presence?.status || "online",
        font: 'ROBOTO',
        badgesFrame: true,
        moreBackgroundBlur: true,
        backgroundBrightness: 50,
        rankData: {
          currentXp: rankData.currentXp,
          requiredXp: rankData.requiredXp,
          rank: rankData.rank,
          level: rankData.level,
          barColor: '#fcdce1',
          levelColor: '#ada8c6',
          autoColorRank: true
        }
      });

      const attachment = new AttachmentBuilder(buffer, { name: "RankCard.png" });
      return interaction.editReply({ files: [attachment] });

    } catch (err) {
      console.error("[Slash Rank] Error:", err);

      // Fallback to text-based embed
      const embed = LevelService.buildRankEmbed(target, rankData);
      return interaction.editReply({ embeds: [embed] });
    }
  }
};
