
/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "skip",
    description: "Skips the current track",
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
    options: []
  },
  async execute(client, interaction) {
  },
};