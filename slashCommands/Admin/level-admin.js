const { EmbedBuilder, PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');
const { colors } = require('../../util/constants/constants');
const LevelService = require('../../util/functions/LevelService');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "level-admin",
    description: "Level system admin commands",
    group: "Moderation",
    requiresDatabase: true,
    clientPermissions: [],
    guildOnly: true,
    permissions: [PermissionFlagsBits.ManageGuild],
    options: [
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "set",
        description: "Set a user's level directly",
        options: [
          {
            type: ApplicationCommandOptionType.User,
            name: "user",
            description: "User to set level for",
            required: true
          },
          {
            type: ApplicationCommandOptionType.Integer,
            name: "level",
            description: "Level to set (1-1000)",
            required: true,
            min_value: 1,
            max_value: 1000
          }
        ]
      },
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "addxp",
        description: "Add XP to a user",
        options: [
          {
            type: ApplicationCommandOptionType.User,
            name: "user",
            description: "User to add XP to",
            required: true
          },
          {
            type: ApplicationCommandOptionType.Integer,
            name: "amount",
            description: "Amount of XP to add (1-100000)",
            required: true,
            min_value: 1,
            max_value: 100000
          }
        ]
      },
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "reset",
        description: "Reset a user's or all XP",
        options: [
          {
            type: ApplicationCommandOptionType.Boolean,
            name: "confirm",
            description: "Confirm reset action",
            required: true
          },
          {
            type: ApplicationCommandOptionType.User,
            name: "user",
            description: "User to reset (omit for all)",
            required: false
          }
        ]
      }
    ]
  },

  async execute(client, interaction) {
    await interaction.deferReply({ flags: ['Ephemeral'] });

    const subcommand = interaction.options.getSubcommand();

    /** Resolve the target member from the 'user' option (fetch if not cached). */
    const getTargetMember = async () => {
      const targetUser = interaction.options.getUser('user');
      if (!targetUser) return null;
      const cached = interaction.options.getMember('user');
      if (cached) return cached;
      return interaction.guild.members.fetch(targetUser.id).catch(() => null);
    };

    switch (subcommand) {
      case 'set': {
        const target = await getTargetMember();
        if (!target) {
          return interaction.editReply('❌ User could not be found in this server!');
        }
        const level = interaction.options.getInteger('level');

        const result = await LevelService.setLevel(interaction.guildId, target.id, level);

        // Assign level roles if configured
        const guildData = await client.getCachedGuildData(interaction.guildId);
        if (guildData?.Mod?.Level?.Roles?.length > 0) {
          await LevelService.assignLevelRoles(target, level, guildData.Mod.Level.Roles);
        }

        const embed = new EmbedBuilder()
          .setColor(colors.LEVEL)
          .setTitle('✅ Level Updated')
          .setDescription(`**${target.user.username}** is now at **Level ${result.level}**`)
          .addFields(
            { name: 'Current XP', value: `${result.xp}`, inline: true },
            { name: 'Required XP', value: `${result.requiredXp}`, inline: true }
          )
          .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
      }

      case 'addxp': {
        const target = await getTargetMember();
        if (!target) {
          return interaction.editReply('❌ User could not be found in this server!');
        }
        const amount = interaction.options.getInteger('amount');

        const result = await LevelService.addXpDirect(interaction.guildId, target.id, amount);

        // Assign level roles if user leveled up
        const guildData = await client.getCachedGuildData(interaction.guildId);
        if (result.leveledUp && guildData?.Mod?.Level?.Roles?.length > 0) {
          await LevelService.assignLevelRoles(target, result.newLevel, guildData.Mod.Level.Roles);
        }

        const embed = new EmbedBuilder()
          .setColor(colors.LEVEL)
          .setTitle('✅ XP Added')
          .setDescription(`Added **${amount.toLocaleString()} XP** to **${target.user.username}**`)
          .addFields(
            { name: 'Level', value: `${result.level}`, inline: true },
            { name: 'Current XP', value: `${result.currentXp.toLocaleString()}`, inline: true },
            { name: 'Required XP', value: `${result.requiredXp.toLocaleString()}`, inline: true }
          )
          .setTimestamp();

        if (result.leveledUp) {
          embed.addFields({
            name: '🎉 Level Up!',
            value: `${target.user.username} leveled up from **${result.oldLevel}** → **${result.newLevel}**!`,
            inline: false
          });
        }

        return interaction.editReply({ embeds: [embed] });
      }

      case 'reset': {
        const confirm = interaction.options.getBoolean('confirm');
        if (!confirm) {
          return interaction.editReply('❌ Please confirm the reset action.');
        }

        const target = await getTargetMember();

        if (target) {
          await LevelService.resetUser(interaction.guildId, target.id);
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor(colors.LEVEL)
                .setTitle('✅ User XP Reset')
                .setDescription(`**${target.user.username}**'s XP and level data has been reset.`)
                .setTimestamp()
            ]
          });
        } else {
          await LevelService.resetGuild(interaction.guildId);
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor(colors.LEVEL)
                .setTitle('⚠️ Server XP Reset')
                .setDescription('All XP and level data for this server has been reset.')
                .setTimestamp()
            ]
          });
        }
      }
    }
  }
};
