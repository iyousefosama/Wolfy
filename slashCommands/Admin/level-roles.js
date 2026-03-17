const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const GuildSchema = require('../../schema/GuildSchema');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "level-roles",
    description: "Manage level reward roles",
    group: "Admin",
    requiresDatabase: true,
    clientPermissions: [],
    guildOnly: true,
    permissions: [PermissionFlagsBits.ManageGuild],
    options: [
      {
        type: 1, // SUB_COMMAND
        name: "add",
        description: "Add a role reward for a specific level",
        options: [
          {
            type: 8, // ROLE
            name: "role",
            description: "Role to give when user reaches the level",
            required: true
          },
          {
            type: 4, // INTEGER
            name: "level",
            description: "Level required to get this role (1-1000)",
            required: true,
            min_value: 1,
            max_value: 1000
          }
        ]
      },
      {
        type: 1, // SUB_COMMAND
        name: "remove",
        description: "Remove a level role reward",
        options: [
          {
            type: 8, // ROLE
            name: "role",
            description: "Role to remove from level rewards",
            required: true
          }
        ]
      },
      {
        type: 1, // SUB_COMMAND
        name: "list",
        description: "Show all level role rewards",
        options: []
      },
      {
        type: 1, // SUB_COMMAND
        name: "clear",
        description: "Remove all level role rewards",
        options: [
          {
            type: 5, // BOOLEAN
            name: "confirm",
            description: "Confirm clearing all level roles",
            required: true
          }
        ]
      }
    ]
  },

  async execute(client, interaction) {
    await interaction.deferReply({ ephemeral: true });

    const subcommand = interaction.options.getSubcommand();
    const guildData = await GuildSchema.findOne({ GuildID: interaction.guildId });

    if (!guildData) {
      return interaction.editReply('❌ Guild data not found. Please try again later.');
    }

    // Ensure Level config exists
    if (!guildData.Mod.Level) {
      guildData.Mod.Level = { isEnabled: false, Roles: [], type: 'default' };
    }
    if (!guildData.Mod.Level.Roles) {
      guildData.Mod.Level.Roles = [];
    }

    switch (subcommand) {
      case 'add': {
        const role = interaction.options.getRole('role');
        const level = interaction.options.getInteger('level');

        // Check if bot can manage this role
        if (role.position >= interaction.guild.members.me.roles.highest.position) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('Red')
                .setTitle('❌ Cannot Assign Role')
                .setDescription(`I cannot assign the role ${role} because it's positioned higher than my highest role.`)
                .setFooter({ text: 'Please move my role above this role in server settings.' })
            ]
          });
        }

        // Remove existing entry for this role if any
        const existingIndex = guildData.Mod.Level.Roles.findIndex(r => r.RoleId === role.id);
        if (existingIndex !== -1) {
          guildData.Mod.Level.Roles.splice(existingIndex, 1);
        }

        // Add new role reward
        guildData.Mod.Level.Roles.push({
          RoleId: role.id,
          Level: level
        });

        // Sort by level
        guildData.Mod.Level.Roles.sort((a, b) => a.Level - b.Level);

        await guildData.save();

        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor('Green')
              .setTitle('✅ Level Role Added')
              .setDescription(`${role} will be given at **Level ${level}**`)
              .addFields(
                { name: 'Total Rewards', value: `${guildData.Mod.Level.Roles.length} role(s)`, inline: true }
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
                .setColor('Red')
                .setTitle('❌ Role Not Found')
                .setDescription(`${role} is not configured as a level reward.`)
            ]
          });
        }

        const oldLevel = guildData.Mod.Level.Roles[existingIndex].Level;
        guildData.Mod.Level.Roles.splice(existingIndex, 1);
        await guildData.save();

        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor('Orange')
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
                .setColor('Gold')
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
        guildData.Mod.Level.Roles = [];
        await guildData.save();

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
