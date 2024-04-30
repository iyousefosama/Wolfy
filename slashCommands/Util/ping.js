const discord = require("discord.js");
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("@discordjs/builders");

module.exports = {
  clientpermissions: [
    discord.PermissionsBitField.Flags.EmbedLinks,
    discord.PermissionsBitField.Flags.ReadMessageHistory,
  ],
  data: {
    name: "ping",
    description: "Replies with bot ping!",
    intergration_types: [1],
    contexts: [0, 1, 2],
    options: [
      {
        name: "hide",
        description: "Hide the output",
        type: 5,
        required: false,
      },
    ],
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
    const hide = interaction.options.getBoolean("hide");

    var loading = new discord.EmbedBuilder()
      .setColor("Gold")
      .setDescription(
        `<a:Loading_Color:759734580122484757> Finding bot ping...`
      );
    interaction
      .reply({ embeds: [loading], ephemeral: hide  })
      .then((msg) => {
        // sends this once you send the cmd
        const ping = msg.createdTimestamp - interaction.createdTimestamp; // calculation the time between when u send the message and when the bot reply
        let Pong = new discord.EmbedBuilder()
          .setColor("Yellow")
          .setDescription(`Pong!`);
        interaction.editReply({ embeds: [Pong] });
        let Ping = new discord.EmbedBuilder()
          .setColor("DarkGreen")
          .setDescription(
            `<a:pp224:853495450111967253> The Ping of the bot is \`${ping}ms\`!\n\`🤖\` API Latency is \`${Math.round(
              client.ws.ping
            )}ms\`!`
          );
        interaction.editReply({ embeds: [Ping]});
      })
      .catch(() => null);
  },
};
