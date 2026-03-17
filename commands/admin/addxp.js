const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const LevelService = require('../../util/functions/LevelService');
const GuildSchema = require('../../schema/GuildSchema');

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "addxp",
  aliases: ["givexp", "xpadd"],
  dmOnly: false,
  guildOnly: true,
  args: true,
  usage: "<@user> <amount>",
  group: "admin",
  description: "Add XP to a user (Admin only)",
  cooldown: 5,
  guarded: false,
  permissions: [PermissionFlagsBits.ManageGuild],
  clientPermissions: [],
  examples: ["@user 500", "@user 1000"],

  async execute(client, message, args) {
    if (args.length < 2) {
      return message.reply(`❌ Usage: \`${client.prefix}addxp @user <amount>\``);
    }

    const targetUser = await message.guild.members.fetch(args[0].match(/\d{17,19}/)?.[0]).catch(() => null);
    if (!targetUser) {
      return message.reply('❌ Please mention a valid user.');
    }

    const amount = parseInt(args[1]);
    if (isNaN(amount) || amount < 1 || amount > 100000) {
      return message.reply('❌ Please provide a valid XP amount between 1 and 100,000.');
    }

    try {
      const result = await LevelService.addXpDirect(message.guild.id, targetUser.id, amount);
      
      // Assign level roles if user leveled up
      const guildData = await GuildSchema.findOne({ GuildID: message.guild.id });
      if (result.leveledUp && guildData?.Mod?.Level?.Roles?.length > 0) {
        await LevelService.assignLevelRoles(targetUser, result.newLevel, guildData.Mod.Level.Roles);
      }

      const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('✅ XP Added')
        .setDescription(`Added **${amount.toLocaleString()} XP** to **${targetUser.user.username}**`)
        .addFields(
          { name: 'Level', value: `${result.level}`, inline: true },
          { name: 'Current XP', value: `${result.currentXp.toLocaleString()}`, inline: true },
          { name: 'Required XP', value: `${result.requiredXp.toLocaleString()}`, inline: true }
        )
        .setTimestamp();

      if (result.leveledUp) {
        embed.addFields({
          name: '🎉 Level Up!',
          value: `${targetUser.user.username} leveled up from **${result.oldLevel}** → **${result.newLevel}**!`,
          inline: false
        });
      }

      return message.reply({ embeds: [embed] });
    } catch (err) {
      console.error('[AddXP] Error:', err);
      return message.reply('❌ Failed to add XP. Please try again.');
    }
  }
};
