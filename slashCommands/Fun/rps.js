const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: "rps",
        description: "Play rock, paper, scissors game with the bot!",
        dmOnly: false,
        guildOnly: true,
        cooldown: 0,
        group: "Fun",
        clientPermissions: ["SendMessages"],
        permissions: [],
        options: [
            {
                type: 3, // STRING
                name: 'choice',
                description: 'Select rock, paper, or scissors',
                required: true,
                choices: [
                    { name: 'rock', value: 'rock' },
                    { name: 'paper', value: 'paper' },
                    { name: 'scissors', value: 'scissors' }
                ]
            }
        ]
    },
    async execute(client, interaction) {
        const userChoice = interaction.options.getString('choice');
        const options = [
            { name: 'rock', emoji: '🪨' },
            { name: 'paper', emoji: '📄' },
            { name: 'scissors', emoji: '✂️' }
        ];

        const userOption = options.find(option => option.name === userChoice);

        if (!userOption) {
            return interaction.reply({ content: `You must select a valid option! \`i.e.\` **${options.map(option => option.name).join(', ')}.**`, ephemeral: true });
        }

        const botOption = options[Math.floor(Math.random() * options.length)];

        let result;
        if (userChoice === 'rock') {
            result = botOption.name === 'rock' ? 'It\'s a draw!' : botOption.name === 'paper' ? 'You lose!' : 'You win!';
        } else if (userChoice === 'paper') {
            result = botOption.name === 'rock' ? 'You win!' : botOption.name === 'paper' ? 'It\'s a draw!' : 'You lose!';
        } else if (userChoice === 'scissors') {
            result = botOption.name === 'rock' ? 'You lose!' : botOption.name === 'paper' ? 'You win!' : 'It\'s a draw!';
        }

        interaction.reply({ content: `Your choice was \`${userOption.name} ${userOption.emoji}\`, my choice was \`${botOption.name} ${botOption.emoji}\`. **${result}**` });
    },
};
