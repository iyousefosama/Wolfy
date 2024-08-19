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

    // Capitalize only if color is not null/undefined
    if (color) {
      color = capitalize(color);

      // Validate color
      if (!discord.Colors[color]) {
        color = discord.Colors.Default;
      }
    } else {
      color = discord.Colors.Default; // Set a default color if none provided
    }

    if (guild.roles.cache.size >= 250) {
      return interaction.reply({ embeds: [ErrorEmbed(`\\❌ You can only have 250 roles in your server.`)], ephemeral: true });
    }

    await guild.roles.create({
      name: name,
      color: color
    }).then(role => {
      return interaction.reply({ embeds: [SuccessEmbed(`\\✔ Successfully created role: ${role} (\`${role.id}\`)`)] });
    }).catch((err) => {
      return interaction.reply({ embeds: [ErrorEmbed(`\\❌ I couldn't create the role! [\`${err.name}\`]`)] });
    });
  },
};
