const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { Profile } = require('discord-arts');
const GuildSchema = require('../../schema/GuildSchema');
const EconomySchema = require('../../schema/Economy-Schema');
const LevelService = require('../../util/functions/LevelService');

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "rank",
  aliases: ["level", "lvl"],
  dmOnly: false,
  guildOnly: true,
  args: false,
  usage: "[@user]",
  group: "LeveledRoles",
  description: "Show your or another user's level, rank, and XP progress",
  cooldown: 5,
  guarded: false,
  permissions: [],
  clientPermissions: ["EmbedLinks", "AttachFiles"],
  examples: ["@WOLF", ""],

  async execute(client, message, args) {
    const targetUser = args[0] ? 
      await message.guild.members.fetch(args[0].match(/\d{17,19}/)?.[0]).catch(() => message.member) : 
      message.member;

    const user = targetUser.user;

    // Check if leveling is enabled
    const guildData = await GuildSchema.findOne({ GuildID: message.guild.id });
    if (!guildData?.Mod?.Level?.isEnabled) {
      return message.reply({
        content: `❌ **${message.member.displayName}**, The leveling system is disabled in this server!\nTo enable it, use \`${client.prefix}leveltoggle\`.`
      });
    }

    // Get user level data
    const levelData = await LevelService.getUserData(message.guild.id, user.id);
    const userRank = await LevelService.getUserRank(message.guild.id, user.id);

    // Get economy data for background
    const ecoData = await EconomySchema.findOne({ userID: user.id });
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
      message.channel.sendTyping();

      // Generate rank card
      const buffer = await Profile(user.id, {
        customBackground: background,
        presenceStatus: targetUser.presence?.status || "online",
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
      return message.reply({ files: [attachment] });

    } catch (err) {
      console.error("[Rank Command] Error generating rank card:", err);

      // Fallback to text-based embed
      const embed = LevelService.buildRankEmbed(user, rankData);
      return message.reply({ embeds: [embed] });
    }
  }
};
