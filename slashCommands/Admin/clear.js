const discord = require("discord.js");
const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const moment = require("moment");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "clear",
    description: "Clear/Delete messages with the quantity you specify (from 2 to 100)",
    dmOnly: false,
    guildOnly: true,
    cooldown: 0,
    group: "NONE",
    clientPermissions: [],
    permissions: [
      discord.PermissionsBitField.Flags.Administrator,
      discord.PermissionsBitField.Flags.ManageMessages
    ],
    options: [
      {
        type: 4, // INTEGER
        name: 'quantity',
        description: 'The total messages to delete from the current channel',
        required: true
      }
    ]
  },
  async execute(client, interaction) {
    const { guild, options } = interaction;
    await interaction.deferReply().catch(() => { })

    let quantity = options.getInteger("quantity") || 2;
    quantity = Math.round(quantity);

    if (!quantity || quantity < 2 || quantity > 100) {
      return interaction.reply({
        content: `<a:Wrong:812104211361693696> | ${interaction.user}, Please provide the quantity of messages to be deleted which must be greater than two (2) and less than one hundred (100)`,
        ephemeral: true
      });
    }

    interaction
      .deleteReply()
      .catch(() => null)
      .then(() => interaction.channel.bulkDelete(quantity, true))
      .then(async (messages) => {
        const count = messages.size;
        const _id = Math.random().toString(36).slice(-7);
        const debug = await client.channels.cache.get(
          client.config.channels.debug
        );

        messages = messages.filter(Boolean).map((message) => {
          return [
            `[${moment(message.createdAt).format(
              "dddd, do MMMM YYYY hh:mm:ss"
            )}]`,
            `${message.author.tag} : ${message.content}\r\n\r\n`,
          ].join(" ");
        });

        messages.push(
          `Messages Cleared on ![](${interaction.guild.iconURL({
            size: 32,
          })}) **${interaction.guild.name}** - **#${interaction.channel.name
          }** --\r\n\r\n`
        );
        messages = messages.reverse().join("");

        const res = debug
          ? await debug
            .send({
              content: `\`\`\`BULKDELETE FILE - ServerID: ${interaction.guild.id} ChannelID: ${interaction.channel.id} AuthorID: ${interaction.user.id}\`\`\``,
              files: [
                {
                  attachment: Buffer.from(messages),
                  name: `bulkdlt-${_id}.txt`,
                },
              ],
            })
            .then((message) => [
              message.attachments.first().url,
              message.attachments.first().id,
            ])
            .catch(() => ["", null])
          : ["", null];

        const url = (res[0].match(/\d{17,19}/) || [])[0];
        const id = res[1];

        return await interaction.channel
          .send({
            content: `<a:Mod:853496185443319809> | ${interaction.user}, Successfully deleted \`${count}\` messages from this channel!`,
          })
          .then((msg) => {
            setTimeout(() => {
              msg.delete().catch(() => null);
            }, 10000);
          })
          .catch(() => null);
      });
  },
};
