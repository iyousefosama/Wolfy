
/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "skipto",
    description: "Skips the current track to a certain track",
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
            type: 10, // NUMBER
            name: 'tracknumber',
            description: 'The track number to skip to',
            required: true
        }
    ]
},
	async execute(client, interaction) {
	},
};