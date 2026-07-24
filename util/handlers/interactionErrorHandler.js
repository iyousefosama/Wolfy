const { ErrorEmbed } = require('../modules/embeds');

/**
 * Handles Discord interaction errors
 * @param {Error} error - The error object
 * @param {import('discord.js').Interaction} interaction - The Discord interaction
 * @param {import('../../struct/Client')} client - The bot client
 * @returns {Promise<void>}
 */
async function handleInteractionError(error, interaction, client) {
    // Log the error
    console.error(`Interaction Error: ${error.message}`);
    
    // Handle specific Discord API errors
    if (error.code === 10062) { // Unknown interaction
        // Try to send a follow-up message if the interaction is still valid
        try {
            if (interaction.isRepliable()) {
                await interaction.followUp({
                    embeds: [ErrorEmbed("💢 This interaction has expired or already been responded to. Please try the command again.")],
                    ephemeral: true
                });
            }
        } catch (e) {
            // If follow-up fails, the interaction is completely dead
            console.error('Failed to send follow-up message:', e);
        }
        return;
    }

    // Handle interaction timeout
    if (error.code === 50001 || error.message.includes('interaction has already been acknowledged')) {
        try {
            if (interaction.isRepliable()) {
                await interaction.followUp({
                    embeds: [ErrorEmbed("💢 Interaction timed out. Please try again.")],
                    ephemeral: true
                });
            }
        } catch (e) {
            console.error('Failed to send timeout message:', e);
        }
        return;
    }

    // Handle other errors
    try {
        if (interaction.isRepliable()) {
            await interaction.reply({
                embeds: [ErrorEmbed("💢 There was an error while executing this command!")],
                ephemeral: true
            });
        }
    } catch (e) {
        console.error('Failed to send error message:', e);
    }
}

module.exports = handleInteractionError;