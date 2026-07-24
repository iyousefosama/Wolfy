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
                content: `\\❌ **${interaction.user.username}**, Please provide a valid channel!`, 
                ephemeral: true 
            });
        } else if (!channel.permissionsFor(guild.members.me).has('SendMessages')) {
            return interaction.reply({ 
                content: `\\❌ I need you to give me permission to send messages on ${channel} and try again.`, 
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
                content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`, 
                ephemeral: true 
            });
            throw new Error(err);
        }

        if (data.Mod.Suggestion.channel !== null && channel.id == data.Mod.Suggestion.channel) {
            return interaction.reply({ 
                content: `\\❌ Suggestions channel is already set to ${channel}!`, 
                ephemeral: true 
            });
        }

        data.Mod.Suggestion.channel = channel.id
        await data.save()
            .then(() => {
                const disabledMsg = !data.Mod.Suggestion.isEnabled ? 
                    `\\⚠️ Suggestions channel is disabled! To enable, type \`/toggle suggestions\`` :
                    `To disable this feature, use the \`/toggle suggestions\` command.`;
                
                interaction.reply({
                    embeds: [new discord.EmbedBuilder()
                        .setColor('DarkGreen')
                        .setDescription([
                            '<a:Correct:812104211386728498>\u2000|\u2000',
                            `Successfully set the Suggestions channel to ${channel}!`,
                            '\n\n',
                            disabledMsg
                        ].join(''))]
                })
            })
    }
};