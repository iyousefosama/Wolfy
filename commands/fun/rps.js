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
        const options = ['rock', 'paper', 'scissors'];
        const userOption = args.join(' ').toLowerCase();

        if (!options.includes(userOption)) {
            return message.channel.send(`You must send a valid option! \`i.e\`**${options.join(', ')}.**`);
        }

        message.channel.send({ content: `${message.author}, I choose...` }).then(msg => {
            setTimeout(() => {
            const botOption = options[Math.floor(Math.random() * options.length)];

            let result;
            if (userOption === 'rock') {
                result = botOption === 'rock' ? 'It\'s a draw!' : botOption === 'paper' ? 'You lose!' : 'You win!';
            } else if (userOption === 'paper') {
                result = botOption === 'rock' ? 'You win!' : botOption === 'paper' ? 'It\'s a draw!' : 'You lose!';
            } else if (userOption === 'scissors') {
                result = botOption === 'rock' ? 'You lose!' : botOption === 'paper' ? 'You win!' : 'It\'s a draw!';
            }

            msg.edit({ content: `Your choice was \`${userOption}\`, my choice was \`${botOption}\`. **${result}**` });
            }, 1000)
        });

    }
}