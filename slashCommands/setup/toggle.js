const discord = require('discord.js');
const schema = require('../../schema/GuildSchema')
const { SuccessEmbed } = require('../../util/modules/embeds')

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "toggle",
        description: "Allow/Disable setup commands for bot",
        dmOnly: false,
        guildOnly: true,
        cooldown: 0,
        group: "Setup",
        requiresDatabase: true,
        clientPermissions: [
        ],
        permissions: ["Administrator"],
        options: [
            {
                type: 1, // SUB_COMMAND
                name: 'suggestions',
                description: 'Enable/Disable suggestions in that server',
            }
        ]
    },
    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: true }).catch(() => { })

        const { guild, options } = interaction;
        const sub = options.getSubcommand();

        switch (sub) {
            case 'logs': {
                let data;
                try {
                    data = await schema.findOne({
                        GuildID: guild.id
                    })
                    if (!data.Mod.Logs?.channel) {
                        return interaction.editReply({ content: `\\❌ You didn't set logs channel yet`, ephemeral: true });
                    }
                } catch (err) {
                    await interaction.editReply({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`, ephemeral: true })
                    throw new Error(err);
                }

                data.Mod.Logs.isEnabled = !data.Mod.Logs.isEnabled;

                await data.save()
                    .then(() => {
                        const state = ['Disabled', 'Enabled'][Number(data.Mod.Logs.isEnabled)];
                        data.Mod.Logs.isEnabled = data.Mod.Logs.isEnabled;

                        interaction.editReply({
                            embeds: [SuccessEmbed([
                                '<a:Correct:812104211386728498>\u2000|\u2000',
                                `Logs Feature has been Successfully **${state}**!\n\n`,
                                `To **${!data.Mod.Logs.isEnabled ? 're-enable' : 'disable'}** this`,
                                `feature, use the \`/toggle logs\` command.`
                            ].join(' '))]
                        })
                    }).catch(() => interaction.editReply({ content: `\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`, ephemeral: true }));
            }
            break;
            case 'suggestions': {
                let data;
                try {
                    data = await schema.findOne({
                        GuildID: guild.id
                    })
                    if (!data.Mod.Suggestion?.channel) {
                        return interaction.editReply({ content: `\\❌ You didn't set logs channel yet`, ephemeral: true });
                    }
                } catch (err) {
                    await interaction.editReply({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`, ephemeral: true })
                    throw new Error(err);
                }

                data.Mod.Suggestion.isEnabled = !data.Mod.Suggestion.isEnabled;

                await data.save()
                    .then(() => {
                        const state = ['Disabled', 'Enabled'][Number(data.Mod.Suggestion.isEnabled)];
                        data.Mod.Suggestion.isEnabled = data.Mod.Suggestion.isEnabled;

                        interaction.editReply({
                            embeds: [SuccessEmbed([
                                '<a:Correct:812104211386728498>\u2000|\u2000',
                                `Suggestions Feature has been Successfully **${state}**!\n\n`,
                                `To **${!data.Mod.Suggestion.isEnabled ? 're-enable' : 'disable'}** this`,
                                `feature, use the \`/toggle suggestions\` command.`
                            ].join(' '))]
                        })
                    }).catch(() => interaction.editReply({ content: `\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`, ephemeral: true }));
            }
            break;
        }
    }
};