const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { colors } = require('../../util/constants/constants');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "purge",
    description: "Delete a specific number of messages from a user",
    dmOnly: false,
    guildOnly: true,
    cooldown: 5,
    group: "Moderation",
    clientPermissions: ["ManageMessages"],
    permissions: ["ManageMessages"],
    options: [
      {
        type: ApplicationCommandOptionType.User,
        name: 'user',
        description: 'The user whose messages to delete',
        required: true
      },
      {
        type: ApplicationCommandOptionType.Integer,
        name: 'amount',
        description: 'Number of messages to delete (2-100)',
        required: true,
        min_value: 2,
        max_value: 100
      }
    ]
  },
  async execute(client, interaction) {
    const { guild, channel } = interaction;
    const user = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");

    await interaction.deferReply({ flags: ['Ephemeral'] });

    try {
      // Tolerate targets that left the guild (ID-based purge still works).
      const member = await guild.members.fetch(user.id).catch(() => null);

      if (member && member.id === guild.ownerId) {
        return interaction.editReply({
          content: "❌ You cannot purge the server owner's messages!",
          flags: ['Ephemeral']
        });
      }

      // Collect up to `amount` of the user's messages, paginating backwards.
      const toDelete = [];
      let before;
      let pages = 0;

      while (toDelete.length < amount && pages < 10) {
        const fetched = await channel.messages.fetch({ limit: 100, before });
        if (fetched.size === 0) break;

        for (const message of fetched.values()) {
          if (message.author.id === user.id && !message.pinned) {
            toDelete.push(message.id);
          }
          if (toDelete.length >= amount) break;
        }

        before = fetched.lastKey();
        pages++;
        if (fetched.size < 100) break;
      }

      const targets = toDelete.slice(0, amount);

      if (targets.length === 0) {
        return interaction.editReply(`❌ No messages to delete from **${user.username}**!`);
      }

      // bulkDelete caps at 100 messages per call
      for (let i = 0; i < targets.length; i += 100) {
        await channel.bulkDelete(targets.slice(i, i + 100), true);
      }

      const embed = new EmbedBuilder()
        .setColor(colors.ADMIN)
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
        .setDescription(`✅ Successfully purged **${targets.length}** messages from **${user.username}**!`)
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.editReply(`❌ I couldn't purge messages from **${user.username}**!`);
    }
  },
};