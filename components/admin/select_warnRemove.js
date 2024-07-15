const { EmbedBuilder } = require("discord.js");
const uuid = require('uuid');
const warnSchema = require('../../schema/Warning-Schema')

/**
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
    // Component configuration
    name: "select_warnRemove",
    enabled: true,
    // Action to perform when the button is clicked
    async action(client, interaction, parts) {
        const selectedWarnId = interaction.values[0]; // Only handle the first selected value for simplicity

        // Validate the UUID
        if (!uuid.validate(selectedWarnId)) {
            return interaction.reply({
                content: '\\❌ Please provide a valid warn id.',
                ephemeral: true,
            });
        }

        // Find the user's warnings
        const warnedUserResult = await warnSchema.findOne({
            guildId: interaction.guild.id,
            userId: parts[2],
        });

        // Check if the user has any warnings
        if (!warnedUserResult) {
            return interaction.reply({
                content: '\\❌ No warnings found for this user.',
                ephemeral: true,
            });
        }

        // Check if the specified warning exists
        const warningExists = warnedUserResult.warnings.some(warning => warning.warnId === selectedWarnId);

        if (!warningExists) {
            return interaction.reply({
                content: '\\❌ The specified warn ID does not exist.',
                ephemeral: true,
            });
        }

        // Remove the warning
        const warnedRemoveData = await warnSchema.findOneAndUpdate(
            {
                guildId: interaction.guild.id,
                userId: parts[2],
            },
            {
                $pull: { warnings: { warnId: selectedWarnId } },
            },
            { new: true } // Return updated document
        );

        // Find the warned user
        const getRemovedWarnedUser = interaction.guild.members.cache.find(
            (user) => user.id === warnedRemoveData.userId
        );

        if (!getRemovedWarnedUser) {
            return interaction.reply({
                content: '\\❌ Warned user not found in the guild.',
                ephemeral: true,
            });
        }

        // Count remaining warnings
        const warnedRemoveCount = warnedRemoveData.warnings.length;
        const warnedRemoveGrammar = warnedRemoveCount === 1 ? '' : 's';

        interaction.reply({ content: `<a:pp989:853496185443319809> | Successfully deleted **${getRemovedWarnedUser.user.tag}** warning, they now have **${warnedRemoveCount}** warning${warnedRemoveGrammar}!`, ephemeral: true });
    },
};
