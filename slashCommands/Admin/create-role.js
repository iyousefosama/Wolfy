const discord = require("discord.js");
const { ErrorEmbed, SuccessEmbed } = require("../../util/modules/embeds");
const { capitalize } = require("../../util/functions/function");

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
    const guildId = interaction.guildId;

    try {
      // Check role limit first
      if (guild.roles.cache.size >= 250) {
        return interaction.reply({ 
          embeds: [ErrorEmbed(client.language.getString("CREATING_ROLE_FAILED_250", guildId, { role: name }))], 
          ephemeral: true 
        });
      }

      // Process color
      if (color) {
        color = capitalize(color);
        // Validate color - use a try/catch to handle invalid colors gracefully
        if (!discord.Colors[color]) {
          color = discord.Colors.Default;
        }
      } else {
        color = discord.Colors.Default;
      }

      // Create the role
      const role = await guild.roles.create({
        name: name,
        color: color,
        reason: `Created by ${interaction.user.tag}`
      });

      return interaction.reply({ 
        embeds: [SuccessEmbed(client.language.getString("CREATION_SUCCESS", guildId, { 
          element: role.name + " " + `(${role.id})`, 
          group: "ROLE" 
        }))]
      });
    } catch (err) {
      console.error(`Error creating role: ${err}`);
      return interaction.reply({ 
        embeds: [ErrorEmbed(client.language.getString("CREATING_ROLE_FAILED", guildId, { 
          role: name, 
          err_name: err.name
        }))],
        ephemeral: true 
      });
    }
  },
};
