const discord = require("discord.js");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "ping",
    description: "Replies with bot ping!",
    group: "Utility",
    cooldown: 5,
    integration_types: [0, 1],
    contexts: [0, 1, 2],
    options: [
      {
        name: "hide",
        description: "Hide the output",
        type: 5,
        required: false,
      }
    ],
    clientPermissions: [
      "EmbedLinks",
      "ReadMessageHistory"
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
    
    // Defer reply to calculate ping accurately
    await interaction.deferReply({ ephemeral: hide }).catch(() => {});
    
    // Calculate ping
    const ping = Date.now() - interaction.createdTimestamp;
    const ws_ping = Math.round(client.ws.ping);
    
    // Create single embed with ping information
    const pingEmbed = new discord.EmbedBuilder()
      .setColor("Green")
      .setDescription(client.language.getString("PING", interaction.guild.id, { 
        ping, 
        ws_ping 
      }));

    // Send a single response
    return interaction.editReply({ embeds: [pingEmbed] }).catch(() => null);
  },
};
