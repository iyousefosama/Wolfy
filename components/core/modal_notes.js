const notes = require("../../schema/releasenotes-Schema");
const { version, author } = require("../../package.json");
const { EmbedBuilder } = require("discord.js");

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
        const updatedNotesData = await notes.find();

        // Assuming you've corrected how you handle the version, no need for extra logic here
        const changeLogs =
            await client.channels.cache.get(client.config.channels.changelogs) ||
            await client.channels.cache.get("887589978127863808");

        for (let value of updatedNotesData) {
            const embed = new EmbedBuilder()
                .setColor(`#c19a6b`)
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(
                    [
                        `<:Discord_Staff:911761250759893012> **${client.user.username}**(\`V: ${value.Version}\`) Changelogs!`,
                        value.Title ? `${value.Title}` : ``,
                        `**Updates:** \n\`\`\`diff\n${value.Updates}\`\`\``,
                        `**Date:** <t:${Math.floor(value.Date / 1000)}:R>`,
                    ].join("\n\n")
                )
                .setTimestamp();
            await changeLogs.send({ embeds: [embed] }).catch(() => { });
        };

        await interaction.reply({
            content: "👌 Your submission was received successfully!",
            ephemeral: true,
        });
    },
};
