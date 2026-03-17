const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const GuildSchema = require('../../schema/GuildSchema');
const LevelService = require('../../util/functions/LevelService');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "level-admin",
    description: "Level system admin commands",
    group: "Admin",
    requiresDatabase: true,
    clientPermissions: [],
    guildOnly: true,
    permissions: [PermissionFlagsBits.ManageGuild],
    options: [
      {
        type: 1, // SUB_COMMAND
        name: "set",
        description: "Set a user's level directly",
        options: [
          {
            type: 6, // USER
            name: "user",
            description: "User to set level for",
            required: true
          },
          {
            type: 4, // INTEGER
            name: "level",
            description: "Level to set (1-1000)",
            required: true,
            min_value: 1,
            max_value: 1000
          }
        ]
      },
      {
        type: 1, // SUB_COMMAND
        name: "addxp",
        description: "Add XP to a user",
        options: [
          {
            type: 6, // USER
            name: "user",
            description: "User to add XP to",
            required: true
          },
          {
            type: 4, // INTEGER
            name: "amount",
            description: "Amount of XP to add (1-100000)",
            required: true,
            min_value: 1,
            max_value: 100000
          }
        ]
      },
      {
        type: 1, // SUB_COMMAND
        name: "reset",
        description: "Reset a user's or all XP",
        options: [
          {
            type: 5, // BOOLEAN
            name: "confirm",
            description: "Confirm reset action",
            required: true
          },
          {
            type: 6, // USER
            name: "user",
            description: "User to reset (omit for all)",
            required: false
          }
        ]
      }
    ]
  },

  async execute(client, interaction) {
    await interaction.deferReply({ ephemeral: true });

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'set': {
        const target = interaction.options.getMember('user');
        const level = interaction.options.getInteger('level');

        const result = await LevelService.setLevel(interaction.guildId, target.id, level);

        // Assign level roles if configured
        const guildData = await GuildSchema.findOne({ GuildID: interaction.guildId });
        if (guildData?.Mod?.Level?.Roles?.length > 0) {
          await LevelService.assignLevelRoles(target, level, guildData.Mod.Level.Roles);
        }

        const embed = new EmbedBuilder()
          .setColor('Blue')
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
        const target = interaction.options.getMember('user');
        const amount = interaction.options.getInteger('amount');

        const result = await LevelService.addXpDirect(interaction.guildId, target.id, amount);

        // Assign level roles if user leveled up
        const guildData = await GuildSchema.findOne({ GuildID: interaction.guildId });
        if (result.leveledUp && guildData?.Mod?.Level?.Roles?.length > 0) {
          await LevelService.assignLevelRoles(target, result.newLevel, guildData.Mod.Level.Roles);
        }

        const embed = new EmbedBuilder()
          .setColor('Green')
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

        const target = interaction.options.getMember('user');

        if (target) {
          await LevelService.resetUser(interaction.guildId, target.id);
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('Orange')
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
                .setColor('Red')
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
