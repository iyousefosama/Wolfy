const discord = require("discord.js");
const { colors } = require("../../util/constants/constants");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "rps",
        description: "Play rock paper scissors!",
        guildOnly: false,
        dmOnly: false,
        cooldown: 3,
        group: "Fun",
        options: [
            {
                type: 3, // String
                name: "choice",
                description: "Your choice (rock, paper, scissors)",
                required: true,
                choices: [
                    {
                        name: "Rock",
                        value: "rock"
                    },
                    {
                        name: "Paper",
                        value: "paper"
                    },
                    {
                        name: "Scissors",
                        value: "scissors"
                    }
                ]
            }
        ]
    },
    async execute(client, interaction) {
        const userChoice = interaction.options.getString("choice");
        const choices = ["rock", "paper", "scissors"];
        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        
        // Emoji mapping for choices
        const emojis = {
            rock: "🪨",
            paper: "📄",
            scissors: "✂️"
        };
        
        // Determine the result
        let result;
        if (userChoice === botChoice) {
            result = "It's a tie! 🤝";
        } else if (
            (userChoice === "rock" && botChoice === "scissors") ||
            (userChoice === "paper" && botChoice === "rock") ||
            (userChoice === "scissors" && botChoice === "paper")
        ) {
            result = "You win! 🎉";
        } else {
            result = "You lose! 😞";
        }
        
        // Create and send embed
        const embed = new discord.EmbedBuilder()
            .setColor(colors.FUN)
            .setTitle("Rock Paper Scissors")
            .addFields(
                { 
                    name: "Your choice", 
                    value: `${emojis[userChoice]} ${userChoice.charAt(0).toUpperCase() + userChoice.slice(1)}`, 
                    inline: true 
                },
                { 
                    name: "Bot's choice", 
                    value: `${emojis[botChoice]} ${botChoice.charAt(0).toUpperCase() + botChoice.slice(1)}`, 
                    inline: true 
                },
                { 
                    name: "Result", 
                    value: result, 
                    inline: false 
                }
            )
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};
