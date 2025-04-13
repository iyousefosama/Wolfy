const discord = require('discord.js');
const schema = require('../../schema/GuildSchema')
const ms = require("ms");
const { SuccessEmbed } = require('../../util/modules/embeds')
/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "suggestion-timer",
        description: "Sets the time which the user can use suggestion command after first time",
        dmOnly: false,
        guildOnly: true,
        cooldown: 0,
        group: "Setup",
        requiresDatabase: true,
        clientPermissions: [
            "ViewChannel"
        ],
        permissions: ["Administrator"],
        options: [
            {
                type: 3, // STRING
                name: 'time',
                description: 'The time between each use (ex: 2h)',
                required: true
            },
        ]
    },
    async execute(client, interaction) {
        const { options, guild } = interaction;
        const time = options.getString("time");

        if (!time || !ms(time)) {
            return interaction.reply({ 
                content: client.language.getString("SETUP_SUGGESTION_TIMER_INVALID", interaction.guild?.id, {
                    username: interaction.user.username
                }), 
                ephemeral: true 
            });
        }

        let data;
        try {
            data = await schema.findOne({
                GuildID: guild.id
            })
            if (!data) {
                data = await schema.create({
                    GuildID: guild.id
                })
            }
        } catch (err) {
            await interaction.reply({ 
                content: client.language.getString("ERR_DB", interaction.guild?.id, {
                    error: err.name
                }), 
                ephemeral: true 
            });
            throw new Error(err);
        }

        if (!data.Mod.Suggestion.isEnabled) {
            return interaction.reply({ 
                content: client.language.getString("SETUP_SUGGESTION_TIMER_DISABLED", interaction.guild?.id), 
                ephemeral: true 
            });
        }

        data.Mod.Suggestion.time = ms(time)
        await data.save()
            .then(() => {
                interaction.reply({
                    embeds: [SuccessEmbed(
                        client.language.getString("SETUP_SUGGESTION_TIMER_SUCCESS", interaction.guild?.id, {
                            username: interaction.user.username,
                            time: time
                        })
                    )]
                })
            })
    }
};