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
                content: client.language.getString("CMD_GUESS_ALREADY_RUNNING", guild.id),
                ephemeral: true 
            });
        }

        const participants = [];
        const number = Math.floor(Math.random() * 499) + 1;

        await interaction.reply({
            embeds: [InfoEmbed(client.language.getString("CMD_GUESS_STARTED", guild.id))]
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
                        client.language.getString("CMD_GUESS_WINNER", guild.id, {
                            user: msg.author.toString(),
                            username: msg.author.username,
                            number: number,
                            count: participants.length,
                            participants: participantNames
                        })
                    )]
                });
                return collector.stop(msg.author.username);
            }

            if (participants.length >= 10) {
                return;
            }

            if (parsedNumber < number) {
                msg.reply(client.language.getString("CMD_GUESS_SMALLER", guild.id, { number: parsedNumber }));
            } else if (parsedNumber > number) {
                msg.reply(client.language.getString("CMD_GUESS_BIGGER", guild.id, { number: parsedNumber }));
            }
        });

        collector.on("end", (_collected, reason) => {
            delete currentGames[guild.id];
            if (reason === "time") {
                return interaction.followUp({
                    embeds: [ErrorEmbed(client.language.getString("CMD_GUESS_TIMEOUT", guild.id, { number: number }))]
                });
            }
        });
    },
};
