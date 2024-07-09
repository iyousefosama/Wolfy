const discord = require("discord.js");
const {
  EmbedBuilder,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const TicketSchema = require("../../schema/Ticket-Schema");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "send-panel",
    description: "Sends the ticket panel to a channel",
    options: [
      {
        type: discord.ApplicationCommandOptionType.Channel,
        name: "channel",
        description: "The channel to send the message to",
        required: true,
      },
    ],
    clientPermissions: [discord.PermissionsBitField.Flags.ManageGuild],
    permissions: [discord.PermissionsBitField.Flags.ManageGuild],
    /*
        cooldown: 1, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL
        permissions: [], // OPTIONAL
        options: [
            {
                name: 'ping',
                description: "Get the bot's latency",
                type: 3, required: false,
                choices: [ { name: "yes", value: 'true' }, { name: "no", value: 'false' } ]
            }
        ], // OPTIONAL, (/) command options ; read https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
            */
  },
  async execute(client, interaction) {
    const channel = interaction.options.getChannel("channel");

    if (channel.type !== ChannelType.GuildText)
      return interaction.reply({
        content: "That channel must be a text channel!",
        ephemeral: true,
      });

    let emb = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle("Open a ticket")
      .setDescription("Press the button below to open a ticket")
      .setFooter({
        text: `Ticket Panel | \©️${new Date().getFullYear()} Wolfy`,
        iconURL: client.user.avatarURL({ dynamic: true }),
      })

    let row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket")
        .setLabel("Open ticket")
        .setEmoji("✉️")
        .setStyle(discord.ButtonStyle.Secondary)
    );

    channel
      .send({
        embeds: [emb],
        components: [row],
      })
      .then(() => {
        return interaction.reply({
          content: `Tickets creator sent to ${channel}!`,
          ephemeral: true,
        });
      });
  },
};
