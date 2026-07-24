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
            return interaction.reply({ 
                content: "A guess the number game is already running in this server! 😄",
                ephemeral: true 
            });
        }

        const participants = [];
        const number = Math.floor(Math.random() * 499) + 1;

        await interaction.reply({
            embeds: [InfoEmbed("🎉 Guess the number game has started! I'm thinking of a number between 1 and 500! You have 30 seconds to guess!")]
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
                const participantNames = participants.map(p => 
                    guild.members.cache.get(p)?.user.username || 'Unknown'
                ).join(", ");
                
                await interaction.followUp({
                    embeds: [SuccessEmbed(
                        `🎉 **${msg.author.username}** has won! The number was **${number}**!\n\nWe had **${participants.length}** participants: ${participantNames}`
                    )]
                });
                return collector.stop(msg.author.username);
            }

            if (participants.length >= 10) {
                return;
            }

            if (parsedNumber < number) {
                msg.reply(`⬆️ **${parsedNumber}** is too small!`);
            } else if (parsedNumber > number) {
                msg.reply(`⬇️ **${parsedNumber}** is too big!`);
            }
        });

        collector.on("end", (_collected, reason) => {
            delete currentGames[guild.id];
            if (reason === "time") {
                return interaction.followUp({
                    embeds: [ErrorEmbed(`⏰ Time's up! The number was **${number}**!`)]
                });
            }
        });
    },
};
