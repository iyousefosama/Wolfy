const notes = require("../../schema/releasenotes-Schema");
const { version, author } = require("../../package.json");
const { EmbedBuilder } = require("discord.js");
const { ErrorEmbed, SuccessEmbed } = require("../../util/modules/embeds");

/**
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
    // Component configuration
    name: "modal_notes",
    enabled: true,
    // Action to perform when the button is clicked
    async action(client, interaction, parts) {
        const update = interaction.fields.getTextInputValue("notesInput");

        try {
            // Delete previous notes
            await notes.deleteMany();

            // Create a new note
            await notes.create({
                Updates: update,
                Date: Date.now(),
                Developer: interaction.user.username,
                Version: version, // Consider revising how version is determined
            });

            // Fetch the updated notes data AFTER the new note has been created
            updatedNotesData = await notes.find();
        } catch (error) {
            client.logDetailedError({
                interaction: interaction,
                error: error,
                eventType: "DATABASE_ERR"
            });
            return await interaction.reply({ 
                embeds: [ErrorEmbed(client.language.getString("ERR_DB", interaction.guildId, { error: error.name }))], 
                ephemeral: true 
            });
        }

        const changeLogs = await client.channels.cache.get(client.config.channels.changelogs);
        if (!changeLogs) {
            return interaction.reply({ 
                embeds: [ErrorEmbed(client.language.getString("CHANGELOGS_CHANNEL_NOT_FOUND", interaction.guildId, { 
                    default: "❌ Couldn't find changelogs channel, but updated documents!" 
                }))],
                ephemeral: true
            });
        }

        for (let value of updatedNotesData) {
            const embed = new EmbedBuilder()
                .setColor(`#c19a6b`)
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(
                    [
                        client.language.getString("RELEASE_NOTES_TITLE", interaction.guildId, {
                            username: client.user.username,
                            version: value.Version,
                            default: `<:Discord_Staff:911761250759893012> **${client.user.username}**(\`V: ${value.Version}\`) Changelogs!`
                        }),
                        value.Title ? `${value.Title}` : ``,
                        client.language.getString("RELEASE_NOTES_UPDATES", interaction.guildId, {
                            updates: value.Updates,
                            default: `**Updates:** \n\`\`\`diff\n${value.Updates}\`\`\``
                        }),
                        client.language.getString("RELEASE_NOTES_DATE", interaction.guildId, {
                            timestamp: Math.floor(value.Date / 1000),
                            default: `**Date:** <t:${Math.floor(value.Date / 1000)}:R>`
                        }),
                    ].join("\n\n")
                )
                .setTimestamp();
            await changeLogs.send({ embeds: [embed] }).catch(() => { });
        };

        await interaction.reply({
            embeds: [SuccessEmbed(client.language.getString("MODAL_NOTES_SUCCESS", interaction.guildId, { 
                default: "👌 Your submission was received successfully!" 
            }))],
            ephemeral: true,
        });
    },
};
