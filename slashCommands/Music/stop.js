const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "stop",
    description: "Stops the current track and clears the queue",
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