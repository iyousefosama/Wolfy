const { EmbedBuilder } = require('discord.js');
const { colors } = require('../../util/constants/constants');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "create-role",
    description: "Creates a new role in the current server",
    dmOnly: false,
    guildOnly: true,
    cooldown: 3,
    group: "Moderation",
    clientPermissions: ["ManageRoles"],
    permissions: [
      "ManageRoles"
    ],
    options: [
      {
        type: 3, // STRING
        name: 'name',
        description: 'The name of the role',
        required: true
      },
      {
        type: 3, // STRING
        name: 'color',
        description: 'Color of role',
        required: false
      }
    ]
  },
  async execute(client, interaction) {
    const { guild, options } = interaction;
    const name = options.getString("name");
    let color = options.getString("color");

    try {
      // Check role limit first
      if (guild.roles.cache.size >= 250) {
        return interaction.reply({ 
          content: "❌ Your server has too many roles to create another one!", 
          flags: ['Ephemeral'] 
        });
      }

      // Process color
      if (color) {
        // Validate color
        if (!/^#([0-9A-Fa-f]{6})$/.test(color) && !['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Black', 'White', 'Gray', 'Grey'].includes(color)) {
          color = null;
        }
      }

      // Create the role
      const role = await guild.roles.create({
        name: name,
        color: color,
        reason: `Created by ${interaction.user.tag}`
      });

      const embed = new EmbedBuilder()
        .setColor(colors.ADMIN)
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
        .setDescription(`✅ Successfully created role **${role.name}** (${role.id})!`)
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
        .setTimestamp();
      
      return interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error(`Error creating role: ${err}`);
      return interaction.reply({ 
        content: `❌ I couldn't create role **${name}**! ${err.name}`, 
        flags: ['Ephemeral'] 
      });
    }
  },
};
