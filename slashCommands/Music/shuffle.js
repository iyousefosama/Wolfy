
/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "shuffle",
    description: "Plays a random track from the queue",
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