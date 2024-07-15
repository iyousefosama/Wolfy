/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "rps",
    aliases: [],
    dmOnly: false,
    guildOnly: true,
    args: true,
    usage: '<option>',
    group: 'Fun',
    description: 'Playing rock/paper/scissors vs the bot',
    cooldown: 1,
    guarded: false,
    clientPermissions: ["SendMessages"],
    permissions: [],
    examples: [
        'rock',
        'paper',
        'scissors'
    ],

    async execute(client, message, args) {
        const options = [
            { name: 'rock', emoji: '🪨' },
            { name: 'paper', emoji: '📄' },
            { name: 'scissors', emoji: '✂️' }
        ];
        const userChoice = args.join(' ').toLowerCase();

        const userOption = options.find(option => option.name === userChoice);

        if (!userOption) {
            return interaction.reply({ content: `You must select a valid option! \`i.e.\` **${options.map(option => option.name).join(', ')}.**`, ephemeral: true });
        }

        message.channel.send({ content: `${message.author}, I choose...` }).then(msg => {
            setTimeout(() => {
                const botOption = options[Math.floor(Math.random() * options.length)];

                let result;
                if (userChoice === 'rock') {
                    result = botOption.name === 'rock' ? 'It\'s a draw!' : botOption.name === 'paper' ? 'You lose!' : 'You win!';
                } else if (userChoice === 'paper') {
                    result = botOption.name === 'rock' ? 'You win!' : botOption.name === 'paper' ? 'It\'s a draw!' : 'You lose!';
                } else if (userChoice === 'scissors') {
                    result = botOption === 'rock' ? 'You lose!' : botOption.name === 'paper' ? 'You win!' : 'It\'s a draw!';
                }

                msg.edit({ content: `Your choice was \`${userOption.name} ${userOption.emoji}\`, my choice was \`${botOption.name} ${botOption.emoji}\`. **${result}**` });
            }, 1000)
        });

    }
}