const dayjs = require("dayjs");
const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "clear",
    description: "Clear/Delete messages with the quantity you specify (from 2 to 100)",
    dmOnly: false,
    guildOnly: true,
    cooldown: 3,
    group: "Moderation",
    clientPermissions: ["ManageMessages"],
    permissions: [
      "ManageMessages"
    ],
    options: [
      {
        type: ApplicationCommandOptionType.Integer,
        name: 'quantity',
        description: 'The total messages to delete from the current channel',
        required: true
      }
    ]
  },
  async execute(client, interaction) {
    const { guild, channel } = interaction;

    let quantity = interaction.options.getInteger("quantity") ?? 2;
    quantity = Math.round(quantity);

    // Validate BEFORE deferring so we can reply (not editReply) on failure.
    if (!quantity || quantity < 2 || quantity > 100) {
      return interaction.reply({
        content: "💢 Please provide the quantity of messages to be deleted which must be greater than two (2) and less than one hundred (100)",
        flags: ['Ephemeral']
      });
    }

    await interaction.deferReply().catch(() => { });

    let messages;
    try {
      messages = await channel.bulkDelete(quantity, true);
    } catch {
      return interaction.editReply({
        content: "❌ I couldn't delete messages in this channel!",
        flags: ['Ephemeral']
      }).catch(() => null);
    }

    const count = messages.size;

    // Non-blocking debug dump of the deleted content (best-effort).
    const debug = client.channels.cache.get(client.config.channels.debug);
    if (debug) {
      const _id = Math.random().toString(36).slice(-7);
      const lines = [...messages.values()]
        .filter(Boolean)
        .map((message) => (
          `[${dayjs(message.createdAt).format("dddd, do MMMM YYYY hh:mm:ss")}] ` +
          `${message.author.username} : ${message.content}\r\n\r\n`
        ))
        .reverse();
      lines.unshift(
        `Messages Cleared on ![](${guild.iconURL({ size: 32 })}) **${guild.name}** - **#${channel.name}** --\r\n\r\n`
      );

      await debug.send({
        content: `\`\`\`BULKDELETE FILE - ServerID: ${guild.id} ChannelID: ${channel.id} AuthorID: ${interaction.user.id}\`\`\``,
        files: [
          {
            attachment: Buffer.from(lines.join("")),
            name: `bulkdlt-${_id}.txt`,
          },
        ],
      }).catch(() => null);
    }

    return interaction.editReply({
      content: `✨ Successfully deleted \`${count}\` messages from this channel!`,
    }).catch(() => null);
  },
};
