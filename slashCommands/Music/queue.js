
module.exports = {
    data: {
        name: "queue",
        description: "Displays the current track queue",
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
                name: 'page',
                description: 'Page number of the queue'
            }
        ]
    },
	async execute(client, interaction) {
	},
};