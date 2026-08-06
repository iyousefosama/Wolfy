const { EmbedBuilder, PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');
const { colors } = require('../../util/constants/constants');
const GuildSchema = require('../../schema/GuildSchema');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "level-roles",
    description: "Manage level reward roles",
    group: "Moderation",
    requiresDatabase: true,
    clientPermissions: [],
    guildOnly: true,
    permissions: [PermissionFlagsBits.ManageGuild],
    options: [
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "add",
        description: "Add a role reward for a specific level",
        options: [
          {
            type: ApplicationCommandOptionType.Role,
            name: "role",
            description: "Role to give when user reaches the level",
            required: true
          },
          {
            type: ApplicationCommandOptionType.Integer,
            name: "level",
            description: "Level required to get this role (1-1000)",
            required: true,
            min_value: 1,
            max_value: 1000
          }
        ]
      },
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "remove",
        description: "Remove a level role reward",
        options: [
          {
            type: ApplicationCommandOptionType.Role,
            name: "role",
            description: "Role to remove from level rewards",
            required: true
          }
        ]
      },
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "list",
        description: "Show all level role rewards",
        options: []
      },
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "clear",
        description: "Remove all level role rewards",
        options: [
          {
            type: ApplicationCommandOptionType.Boolean,
            name: "confirm",
            description: "Confirm clearing all level roles",
            required: true
          }
        ]
      }
    ]
  },

  async execute(client, interaction) {
    await interaction.deferReply({ flags: ['Ephemeral'] });

    const subcommand = interaction.options.getSubcommand();
    const guildData = await client.getCachedGuildData(interaction.guildId);

    if (!guildData) {
      return interaction.editReply('❌ Guild data not found. Please try again later.');
    }

    // Ensure Level config exists
    if (!guildData.Mod?.Level) {
      guildData.Mod = guildData.Mod ?? {};
      guildData.Mod.Level = { isEnabled: false, Roles: [], type: 'default' };
    }
    if (!Array.isArray(guildData.Mod.Level.Roles)) {
      guildData.Mod.Level.Roles = [];
    }

    /**
     * Persist the Roles array to the DB and refresh the guild-data cache.
     * The cached object is a lean doc (no .save()), so we write atomically.
     */
    const persist = async (roles) => {
      await GuildSchema.updateOne(
        { GuildID: interaction.guildId },
        { $set: { 'Mod.Level.Roles': roles } },
        { upsert: true }
      );
      guildData.Mod.Level.Roles = roles;
      client.setCachedGuildData(interaction.guildId, guildData);
    };

    switch (subcommand) {
      case 'add': {
        const role = interaction.options.getRole('role');
        const level = interaction.options.getInteger('level');

        // Check if bot can manage this role
        if (role.position >= interaction.guild.members.me.roles.highest.position) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor(colors.LEVEL)
                .setTitle('❌ Cannot Assign Role')
                .setDescription(`I cannot assign the role ${role} because it's positioned higher than my highest role.`)
                .setFooter({ text: 'Please move my role above this role in server settings.' })
            ]
          });
        }

        // Remove existing entry for this role if any
        const roles = guildData.Mod.Level.Roles.filter(r => r.RoleId !== role.id);

        // Add new role reward
        roles.push({ RoleId: role.id, Level: level });

        // Sort by level
        roles.sort((a, b) => a.Level - b.Level);

        await persist(roles);

        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(colors.LEVEL)
              .setTitle('✅ Level Role Added')
              .setDescription(`${role} will be given at **Level ${level}**`)
              .addFields(
                { name: 'Total Rewards', value: `${roles.length} role(s)`, inline: true }
              )
              .setTimestamp()
          ]
        });
      }

      case 'remove': {
        const role = interaction.options.getRole('role');

        const existingIndex = guildData.Mod.Level.Roles.findIndex(r => r.RoleId === role.id);
        if (existingIndex === -1) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor(colors.LEVEL)
                .setTitle('❌ Role Not Found')
                .setDescription(`${role} is not configured as a level reward.`)
            ]
          });
        }

        const oldLevel = guildData.Mod.Level.Roles[existingIndex].Level;
        const roles = guildData.Mod.Level.Roles.filter(r => r.RoleId !== role.id);
        await persist(roles);

        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(colors.LEVEL)
              .setTitle('✅ Level Role Removed')
              .setDescription(`Removed ${role} from level **${oldLevel}** rewards`)
              .setTimestamp()
          ]
        });
      }

      case 'list': {
        const roles = guildData.Mod.Level.Roles || [];

        if (roles.length === 0) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor(colors.LEVEL)
                .setTitle('🏆 Level Roles')
                .setDescription('No level roles have been configured yet.')
                .setFooter({ text: 'Use /level-roles add to create rewards' })
            ]
          });
        }

        // Sort by level
        const sortedRoles = [...roles].sort((a, b) => a.Level - b.Level);

        // Build role list
        const roleList = sortedRoles.map(roleData => {
          const guildRole = interaction.guild.roles.cache.get(roleData.RoleId);
          const roleName = guildRole ? guildRole.name : 'Unknown Role';
          const roleMention = guildRole ? `<@&${guildRole.id}>` : 'Unknown';
          return `**Level ${roleData.Level}** → ${roleMention} (${roleName})`;
        }).join('\n');

        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor('Gold')
              .setTitle('🏆 Level Roles')
              .setDescription(roleList)
              .setFooter({ text: `${roles.length} role(s) configured` })
              .setTimestamp()
          ]
        });
      }

      case 'clear': {
        const confirm = interaction.options.getBoolean('confirm');
        if (!confirm) {
          return interaction.editReply('❌ Please confirm to clear all level roles.');
        }

        const count = guildData.Mod.Level.Roles.length;
        await persist([]);

        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor('Red')
              .setTitle('⚠️ Level Roles Cleared')
              .setDescription(`Removed **${count}** level role reward(s).`)
              .setTimestamp()
          ]
        });
      }
    }
  }
};