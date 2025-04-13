const discord = require("discord.js");
const { SuccessEmbed } = require("../../util/modules/embeds");

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
        const guildId = interaction.guildId;
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
            result = client.language.getString("RPS_TIE", guildId);
        } else if (
            (userChoice === "rock" && botChoice === "scissors") ||
            (userChoice === "paper" && botChoice === "rock") ||
            (userChoice === "scissors" && botChoice === "paper")
        ) {
            result = client.language.getString("RPS_WIN", guildId);
        } else {
            result = client.language.getString("RPS_LOSE", guildId);
        }
        
        // Create and send embed
        const embed = new discord.EmbedBuilder()
            .setColor(client.config.color)
            .setTitle(client.language.getString("RPS_TITLE", guildId))
            .addFields(
                { 
                    name: client.language.getString("RPS_YOUR_CHOICE", guildId), 
                    value: `${emojis[userChoice]} ${userChoice.charAt(0).toUpperCase() + userChoice.slice(1)}`, 
                    inline: true 
                },
                { 
                    name: client.language.getString("RPS_BOT_CHOICE", guildId), 
                    value: `${emojis[botChoice]} ${botChoice.charAt(0).toUpperCase() + botChoice.slice(1)}`, 
                    inline: true 
                },
                { 
                    name: client.language.getString("RPS_RESULT", guildId), 
                    value: result, 
                    inline: false 
                }
            )
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};
