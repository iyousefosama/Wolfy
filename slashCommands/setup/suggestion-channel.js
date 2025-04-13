const discord = require('discord.js');
const schema = require('../../schema/GuildSchema')
const { ChannelType } = require('discord.js')

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "suggestion-channel",
        description: "Sets the suggestion channel for the current server",
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
                type: 7, // CHANNEL
                name: 'channel',
                description: 'Suggestion channel',
                channelTypes: [ChannelType.GuildText],
                required: true
            },
        ]
    },
    async execute(client, interaction) {
        const { options, guild } = interaction;
        const channel = options.getChannel('channel');

        if (!channel || channel.type !== ChannelType.GuildText) {
            return interaction.reply({ 
                content: client.language.getString("SETUP_SUGGESTION_CHANNEL_INVALID", interaction.guild?.id, {
                    username: interaction.user.username
                }), 
                ephemeral: true 
            });
        } else if (!channel.permissionsFor(guild.members.me).has('SendMessages')) {
            return interaction.reply({ 
                content: client.language.getString("SETUP_SUGGESTION_CHANNEL_NO_PERMS", interaction.guild?.id, {
                    channel: channel
                }), 
                ephemeral: true 
            });
        };

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

        if (data.Mod.Suggestion.channel !== null && channel.id == data.Mod.Suggestion.channel) {
            return interaction.reply({ 
                content: client.language.getString("SETUP_SUGGESTION_CHANNEL_ALREADY_SET", interaction.guild?.id, {
                    channel: channel
                }), 
                ephemeral: true 
            });
        }

        data.Mod.Suggestion.channel = channel.id
        await data.save()
            .then(() => {
                interaction.reply({
                    embeds: [new discord.EmbedBuilder()
                        .setColor('DarkGreen')
                        .setDescription([
                            '<a:Correct:812104211386728498>\u2000|\u2000',
                            client.language.getString("SETUP_SUGGESTION_CHANNEL_SUCCESS", interaction.guild?.id, {
                                username: interaction.user.username,
                                channel: channel
                            }) + '\n\n',
                            !data.Mod.Suggestion.isEnabled ? 
                                client.language.getString("SETUP_SUGGESTION_CHANNEL_DISABLED", interaction.guild?.id) :
                                client.language.getString("SETUP_SUGGESTION_CHANNEL_DISABLE_TIP", interaction.guild?.id)
                        ].join(''))]
                })
            })
    }
};