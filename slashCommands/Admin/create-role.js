const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { colors } = require('../../util/constants/constants');

const VALID_COLOR_NAMES = ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Black', 'White', 'Gray', 'Grey'];

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
        type: ApplicationCommandOptionType.String,
        name: 'name',
        description: 'The name of the role',
        required: true
      },
      {
        type: ApplicationCommandOptionType.String,
        name: 'color',
        description: 'Color of role (hex like #5865F2 or a name like Red)',
        required: false
      },
      {
        type: ApplicationCommandOptionType.Boolean,
        name: 'hoist',
        description: 'Display this role separately in the member list',
        required: false
      },
      {
        type: ApplicationCommandOptionType.Boolean,
        name: 'mentionable',
        description: 'Allow anyone to mention this role',
        required: false
      }
    ]
  },
  async execute(client, interaction) {
    const { guild, options } = interaction;
    const name = options.getString("name");
    const color = options.getString("color");
    const hoist = options.getBoolean("hoist") ?? false;
    const mentionable = options.getBoolean("mentionable") ?? false;

    try {
      if (guild.roles.cache.size >= 250) {
        return interaction.reply({
          content: "❌ Your server has too many roles to create another one!",
          flags: ['Ephemeral']
        });
      }

      let roleColor = null;
      if (color) {
        const valid = /^#([0-9A-Fa-f]{6})$/.test(color) || VALID_COLOR_NAMES.includes(color);
        if (!valid) {
          return interaction.reply({
            content: `❌ Invalid color! Use a hex value like \`#5865F2\` or a name like \`Red\`.`,
            flags: ['Ephemeral']
          });
        }
        roleColor = color;
      }

      const role = await guild.roles.create({
        name,
        color: roleColor,
        hoist,
        mentionable,
        reason: `Created by ${interaction.user.username}`
      });

      const embed = new EmbedBuilder()
        .setColor(colors.ADMIN)
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
        .setDescription([
          `✅ Successfully created role **${role.name}** (${role.id})!`,
          hoist ? '- Displayed separately in the member list' : null,
          mentionable ? '- Mentionable by anyone' : null
        ].filter(Boolean).join('\n'))
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
