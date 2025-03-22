const { wolfyLanguages } = require('../../util/constants/constants')
const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');

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
            
            const option = new StringSelectMenuOptionBuilder().setLabel(lang.name).setDescription(`Select ${lang.name} as ${client.user.username} language`).setValue(lang.code).setEmoji(lang.flag);
            if (lang.code === client.language.languageCache.get(interaction.guild.id)) {
                option.setDefault(true);
            };
            Selectoptions.push(option);
        }

        const select = new StringSelectMenuBuilder()
        .setCustomId('menu_language-select')
        .setPlaceholder('Make a selection!')
        .addOptions(...Selectoptions);

        const row = new ActionRowBuilder()
        .addComponents(select);

        return interaction.reply({ content: 'Please select a language from the dropdown menu below:', components: [row], ephemeral: true });

    }
};