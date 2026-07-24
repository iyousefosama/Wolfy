const { wolfyLanguages } = require("../../util/constants/constants");
const { SuccessEmbed, ErrorEmbed } = require("../../util/modules/embeds");

/**
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
    // Component configuration
    name: "menu_language-select",
    enabled: true,
    // Action to perform when the button is clicked
    async action(client, interaction, parts) {
        let choice = interaction.values[0];
        const language = wolfyLanguages.find((lang) => lang.code === choice);

        if (!language) {
            return interaction.reply({ 
                embeds: [ErrorEmbed("💢 The language you selected is not available!")], 
                ephemeral: true 
            });
        };

        try {
            return interaction.reply({ 
                embeds: [SuccessEmbed(`✔️ **${client.user.username}**, Successfully set this server's language to **${language.flag} ${language.name}**!`)], 
                ephemeral: true 
            });
        } catch (err) {
            client.logDetailedError({ error: err, eventType: `COMPONENT_ERROR`, interaction });
            console.log(err);
            return interaction.reply({ 
                embeds: [ErrorEmbed("💢 There was an error while executing this command!")], 
                ephemeral: true 
            });
        }
    },
};
