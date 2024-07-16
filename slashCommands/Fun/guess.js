const currentGames = {};
const { ErrorEmbed, InfoEmbed, SuccessEmbed } = require('../../util/modules/embeds');

module.exports = {
    data: {
        name: "guess",
        description: "Start playing new guess the number game.",
        dmOnly: false,
        guildOnly: true,
        cooldown: 5,
        group: "Fun",
        clientPermissions: ["SendMessages", "ReadMessageHistory"],
        permissions: [],
    },
    async execute(client, interaction) {
        const { guild } = interaction;

        // Check if a game is already running in the guild
        if (currentGames[guild.id]) {
            return interaction.reply({ content: `\\❌ There is a game already running in this guild!`, ephemeral: true });
        }

        const participants = [];
        const number = Math.floor(Math.random() * 499) + 1;

        await interaction.reply({
            embeds: [InfoEmbed("<a:Right:877975111846731847> Guess the number game has started!\n\nHint:\n\`\`\`diff\n+ Try to guess the number that is between (1-500)\n- You have 30 seconds to find it!\n\`\`\`")]
        });

        const filter = m => !m.author.bot;
        const collector = interaction.channel.createMessageCollector({
            filter,
            time: 30000, // 30 seconds
            errors: ['time']
        });
        currentGames[guild.id] = true;

        collector.on("collect", async msg => {
            if (msg.author.bot || isNaN(msg.content)) {
                return;
            }

            const parsedNumber = parseInt(msg.content, 10);

            if (!participants.includes(msg.author.id)) {
                participants.push(msg.author.id);
            }

            if (parsedNumber === number) {
                await interaction.followUp({
                    embeds: [SuccessEmbed(
                        `<a:Fire:841321886365122660> **${msg.author.toString()}** WON the Game!\n\n<:star:888264104026992670> Game Stats:\n\`\`\`\n• Winner: ${msg.author.username}\n• Number: ${number}\n• Participants Count: ${participants.length}\n• Participants: ${participants.map(p => message.guild.members.cache.get(p)?.user.username || 'Unknown').join(", ")}\n\`\`\``
                    )]
                });
                return collector.stop(msg.author.username);
            }

            if (participants.length >= 10) {
                return;
            }

            if (parsedNumber < number) {
                msg.reply(`<a:Nnno:853494186002481182> The number (\`${parsedNumber}\`) is Smaller than my number, try again!`);
            } else if (parsedNumber > number) {
                msg.reply(`<a:Nnno:853494186002481182> The number (\`${parsedNumber}\`) is Bigger than my number, try again!`);
            }
        });

        collector.on("end", (_collected, reason) => {
            delete currentGames[guild.id];
            if (reason === "time") {
                return interaction.followUp({
                    embeds: [ErrorEmbed(`<:error:888264104081522698> You lose!\nThe number was: (\`${number}\`)`)]
                });
            }
        });
    },
};
