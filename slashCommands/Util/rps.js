const discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: {
        name: "rps",
        description: "Play rock, paper, scissors game with the bot!",
        dmOnly: false,
        guildOnly: true,
        cooldown: 0,
        group: "Utility",
        clientPermissions: ["SendMessages"],
        permissions: [],
        options: [
            {
                type: 5, // BOOLEAN
                name: 'rock',
                description: 'Select the rock option',
                required: false
            },
            {
                type: 5, // BOOLEAN
                name: 'paper',
                description: 'Select the paper option',
                required: false
            },
            {
                type: 5, // BOOLEAN
                name: 'scissors',
                description: 'Select the scissors option',
                required: false
            }
        ]
    },
	async execute(client, interaction) {
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
            interaction.reply({ content: `> My choice was ${option}!`})
        } else if (rock == false) {
            interaction.reply({ content: `${soo}\``})
        } else if (paper) {
            interaction.reply({ content: `> My choice was ${option}!`})
        } else if (paper == false) {
            interaction.reply({ content: `${soo}\``})
        } else if (scissors) {
            interaction.reply({ content: `> My choice was ${option}!`})
        } else if (scissors == false) {
            interaction.reply({ content: `${soo}\``})
        }
        else {
            await interaction.reply({ content: '\\❌ You didn\'t choose the \`option\`!'});
        }
	},
};