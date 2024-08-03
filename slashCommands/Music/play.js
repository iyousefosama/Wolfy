/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
      name: "play",
      description: "Plays tracks on Discord voice channel from other platforms",
      dmOnly: false,
      guildOnly: true,
      cooldown: 0,
      group: "Music",
      clientPermissions: [
        "EmbedLinks",
        "ReadMessageHistory",
        "Connect",
        "Speak"
      ],
      deleted: true,
      
      permissions: [],
      options: [
        {
          type: 3, // STRING
          name: 'track',
          description: 'Search for a track in different platforms by URL or name',
          required: true
        }
      ]
    },
    async execute(client, interaction) {
    }
}