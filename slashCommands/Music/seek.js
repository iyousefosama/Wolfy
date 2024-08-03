
/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "seek",
    description: "Seek to the given time",
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
        name: 'time',
        description: 'The time in seconds to seek to',
        required: true
      }
    ]
  },
  async execute(client, interaction) {
  }
};