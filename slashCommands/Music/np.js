
/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "np",
    description: "Displays information about the currently playing track!",
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