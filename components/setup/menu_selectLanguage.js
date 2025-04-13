const schema = require("../../schema/GuildSchema");
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
                embeds: [ErrorEmbed(client.language.getString("LANGUAGE_404", interaction.guild.id))], 
                ephemeral: true 
            });
        };

        await schema.findOneAndUpdate(
            { GuildID: interaction.guild.id }, 
            { Language: choice }, 
            { upsert: true }
        )
        .then(() => {
            client.language.languageCache.set(interaction.guild.id, choice);
            return interaction.reply({ 
                embeds: [SuccessEmbed(client.language.getString("LANGUAGE_SET", interaction.guild.id, {
                    client: client.user.username, 
                    language: `${language.flag} ${language.name}`
                }))], 
                ephemeral: true 
            });
        })
        .catch((err) => {
            client.logDetailedError({ error: err, eventType: `COMPONENT_ERROR`, interaction });
            console.log(err);
            return interaction.reply({ 
                embeds: [ErrorEmbed(client.language.getString("ERROR_EXEC", interaction.guild.id))], 
                ephemeral: true 
            });
        });
    },
};
