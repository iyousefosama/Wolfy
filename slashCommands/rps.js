const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    clientpermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'USE_EXTERNAL_EMOJIS'],
	data: new SlashCommandBuilder()
		.setName('rps')
		.setDescription('Play rock,paper,scissors game with the bot!')
        .addBooleanOption(option => option.setName('rock').setDescription('Select the rock option'))
        .addBooleanOption(option => option.setName('paper').setDescription('Select the paper option'))
        .addBooleanOption(option => option.setName('scissors').setDescription('Select the scissors option')),
	async execute(client, interaction) {
		await interaction.deferReply({ ephemeral: false }).catch(() => {});
        const rock = interaction.options.getBoolean('rock');
        const paper = interaction.options.getBoolean('paper');
        const scissors = interaction.options.getBoolean('scissors');

        const options = [
            "rock 🪨",
            "paper <:paper:814667582116331530>",
            "scissors :scissors: "
        ]
        const words = [
            "And soo?",
            "are you crazy?",
            "You are dumb right?",
            "You are definitely kidding me",
            "I am a bot so i can't talk to say all the words inside of me to you!",
            "Bruh, you need to set it to true okay? easy right?",
            "Error 404, Someone help meee"
        ]
        const option = options[Math.floor(Math.random() * options.length)]
        const soo = words[Math.floor(Math.random() * words.length)]
        if (rock) {
            interaction.editReply({ content: `> My choice was ${option}!`})
        } else if (rock == false) {
            interaction.editReply({ content: `> \`${soo}\``})
        } else if (paper) {
            interaction.editReply({ content: `> My choice was ${option}!`})
        } else if (paper == false) {
            interaction.editReply({ content: `> \`${soo}\``})
        } else if (scissors) {
            interaction.editReply({ content: `> My choice was ${option}!`})
        } else if (scissors == false) {
            interaction.editReply({ content: `> \`${soo}\``})
        }
	},
};