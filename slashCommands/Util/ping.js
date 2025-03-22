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
    //
    await interaction.deferReply().catch(() => {});
    const hide = interaction.options.getBoolean("hide");

    interaction
    .editReply({ content: client.language.getString("LOADING", interaction.guild.id), ephemeral: hide })
    .then((inter) => {
      const ping = inter.createdTimestamp - interaction.createdTimestamp;
      
      let Pong = new discord.EmbedBuilder()
        .setColor("Yellow")
        .setDescription(client.language.getString("PONG", interaction.guild.id));
  
      interaction.editReply({ content: null, embeds: [Pong] }); // Clears the text and sets Pong embed
  
      let Ping = new discord.EmbedBuilder()
        .setColor("DarkGreen")
        .setDescription(client.language.getString("PING", interaction.guild.id, { ping, ws_ping: Math.round(client.ws.ping) }));
  
      interaction.editReply({ content: null, embeds: [Ping] }); // Clears previous embed and sets Ping embed
    })
    .catch(() => null);
  
  },
};
