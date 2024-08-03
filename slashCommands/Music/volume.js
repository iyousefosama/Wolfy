
/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "volume",
    description: "Set the volume for the current queue",
    dmOnly: false,
    guildOnly: true,
    cooldown: 0,
    group: "Music",
    deleted: true,
    clientPermissions: [
      "EmbedLinks",
      "ReadMessageHistory",
      "Connect",
      "Speak"
    ],
    permissions: [],
    options: [
      {
        type: 4, // INTEGER
        name: 'volume',
        description: 'Number of volume',
        required: true
      }
    ]
  },
  async execute(client, interaction) {

  },
};