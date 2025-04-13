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
            },
            {
                type: 1, // SUB_COMMAND
                name: 'logs',
                description: 'Enable/Disable logs in that server',
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
                        return interaction.editReply({ 
                            content: client.language.getString("SETUP_TOGGLE_NO_CHANNEL", interaction.guild?.id, {
                                feature: "logs"
                            }), 
                            ephemeral: true 
                        });
                    }
                } catch (err) {
                    await interaction.editReply({ 
                        content: client.language.getString("ERR_DB", interaction.guild?.id, {
                            error: err.name
                        }), 
                        ephemeral: true 
                    });
                    throw new Error(err);
                }

                data.Mod.Logs.isEnabled = !data.Mod.Logs.isEnabled;

                await data.save()
                    .then(() => {
                        const statusKey = data.Mod.Logs.isEnabled ? "ENABLED" : "DISABLED";

                        interaction.editReply({
                            embeds: [SuccessEmbed(
                                client.language.getString("SETUP_TOGGLE_SUCCESS", interaction.guild?.id, {
                                    username: interaction.user.username,
                                    feature: "logs",
                                    status: statusKey
                                }) + "\n\n" + 
                                client.language.getString("SETUP_TOGGLE_NEXT_ACTION", interaction.guild?.id, {
                                    action: !data.Mod.Logs.isEnabled ? "re-enable" : "disable",
                                    feature: "logs"
                                })
                            )]
                        })
                    }).catch((err) => interaction.editReply({ 
                        content: client.language.getString("ECONOMY_DB_SAVE_ERROR", interaction.guild?.id, {
                            error: err.message
                        }), 
                        ephemeral: true 
                    }));
            }
            break;
            case 'suggestions': {
                let data;
                try {
                    data = await schema.findOne({
                        GuildID: guild.id
                    })
                    if (!data.Mod.Suggestion?.channel) {
                        return interaction.editReply({ 
                            content: client.language.getString("SETUP_TOGGLE_NO_CHANNEL", interaction.guild?.id, {
                                feature: "suggestions"
                            }), 
                            ephemeral: true 
                        });
                    }
                } catch (err) {
                    await interaction.editReply({ 
                        content: client.language.getString("ERR_DB", interaction.guild?.id, {
                            error: err.name
                        }), 
                        ephemeral: true 
                    });
                    throw new Error(err);
                }

                data.Mod.Suggestion.isEnabled = !data.Mod.Suggestion.isEnabled;

                await data.save()
                    .then(() => {
                        const statusKey = data.Mod.Suggestion.isEnabled ? "ENABLED" : "DISABLED";

                        interaction.editReply({
                            embeds: [SuccessEmbed(
                                client.language.getString("SETUP_TOGGLE_SUCCESS", interaction.guild?.id, {
                                    username: interaction.user.username,
                                    feature: "suggestions",
                                    status: statusKey
                                }) + "\n\n" + 
                                client.language.getString("SETUP_TOGGLE_NEXT_ACTION", interaction.guild?.id, {
                                    action: !data.Mod.Suggestion.isEnabled ? "re-enable" : "disable",
                                    feature: "suggestions"
                                })
                            )]
                        })
                    }).catch((err) => interaction.editReply({ 
                        content: client.language.getString("ECONOMY_DB_SAVE_ERROR", interaction.guild?.id, {
                            error: err.message
                        }), 
                        ephemeral: true 
                    }));
            }
            break;
        }
    }
};