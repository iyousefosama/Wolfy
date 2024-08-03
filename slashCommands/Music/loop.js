

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "loop",
    description: "Loops the currently playing track!",
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
        name: 'action',
        description: 'Action you want to perform on the command',
        required: true,
        choices: [
          { name: 'Queue', value: 'enable_loop_queue' },
          { name: 'Disable', value: 'disable_loop' },
          { name: 'Song', value: 'enable_loop_song' }
        ]
      }
    ]
  },
  async execute(client, interaction) {
  },
};
