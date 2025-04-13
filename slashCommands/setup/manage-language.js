const { wolfyLanguages } = require('../../util/constants/constants')
const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
const { WarningEmbed } = require('../../util/modules/embeds');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "manage-language",
        description: "Send a list of available languages",
        dmOnly: false,
        guildOnly: true,
        cooldown: 5,
        group: "Setup",
        requiresDatabase: true,
        clientPermissions: [],
        permissions: ["Administrator"],
    },
    async execute(client, interaction) {
        const Selectoptions = [];

        for (const lang of wolfyLanguages) {
            
            const option = new StringSelectMenuOptionBuilder()
                .setLabel(lang.name)
                .setDescription(client.language.getString("SETUP_LANGUAGE_OPTION_DESC", interaction.guild?.id, {
                    language: lang.name,
                    bot_name: client.user.username
                }))
                .setValue(lang.code)
                .setEmoji(lang.flag);
                
            if (lang.code === client.language.languageCache.get(interaction.guild.id)) {
                option.setDefault(true);
            };
            Selectoptions.push(option);
        }

        const select = new StringSelectMenuBuilder()
            .setCustomId('menu_language-select')
            .setPlaceholder(client.language.getString("LANGUAGE_SELECT_MENU_PLACEHOLDER", interaction.guild?.id))
            .addOptions(...Selectoptions);

        const row = new ActionRowBuilder()
            .addComponents(select);

        return interaction.reply({ 
            content: client.language.getString("SETUP_SELECT_LANGUAGE", interaction.guild?.id),
            embeds: [WarningEmbed(client.language.getString("LANGUAGE_WARNING", interaction.guild?.id))],
            components: [row], 
            ephemeral: true 
        });
    }
};