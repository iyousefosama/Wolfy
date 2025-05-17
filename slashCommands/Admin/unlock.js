const { SuccessEmbed, ErrorEmbed, InfoEmbed } = require("../../util/modules/embeds");

module.exports = {
    data: {
        name: "unlock",
        description: "Unlock the permissions for @everyone to talk in the channel",
        dmOnly: false,
        guildOnly: true,
        cooldown: 3,
        group: "Moderation",
        clientPermissions: ["ManageChannels"],
        permissions: [
            "ManageChannels",
            "ManageMessages"
        ],
        options: [
            {
                type: 7, // CHANNEL
                name: 'channel',
                description: 'Channel to unlock',
                required: true
            },
            {
                type: 3, // STRING
                name: 'message',
                description: 'Message to send to the unlocked channel',
                required: false
            }
        ]
    },
    async execute(client, interaction) {
        const { guild, options } = interaction;
        const channel = options.getChannel("channel");
        const reason = options.getString("message");
        
        if (!channel) {
            return interaction.reply({ content: client.language.getString("NOT_VALIDID", interaction.guildId, { group: "CHANNEL" }), ephemeral: true });
        } else if (!channel.permissionsFor(guild.members.me).has('ManageChannels')) {
            return interaction.reply({ content: client.language.getString("CANNOT_MANAGE", interaction.guildId, { group: "CHANNEL" }), ephemeral: true });
        }
        
        // Check if channel is already unlocked
        if (channel.permissionsFor(guild.roles.everyone).has('SendMessages')) {
            return interaction.reply({ embeds: [ErrorEmbed(client.language.getString("LOCKED_UNLOCKED_ALREADY", interaction.guildId, { action_done: "UNLOCK" }))], ephemeral: true });
        }
        
        // Proceed to unlock the channel
        return channel.permissionOverwrites.edit(guild.roles.everyone, {
            SendMessages: true
        }, `WOLFY unlock cmd: ${interaction.user.tag}: ${reason || "No reason specified"}`)
        .then(() => {
            // Success message and notification in the channel
            channel.send({ embeds: [SuccessEmbed(`${reason || ""}`).setTitle(client.language.getString("CMD_UNLOCK_MESSAGE_TITLE", interaction.guildId))] }).catch(() => null);
            interaction.reply({ embeds: [InfoEmbed(client.language.getString("CMD_UNLOCK_SUCCESS", interaction.guildId, { channel: channel }))] });
        })
        .catch((err) => {
            // Error handling if permission overwrite edit fails
            interaction.reply({ embeds: [ErrorEmbed(client.language.getString("CMD_UNLOCK_ERROR_EXECUTE", interaction.guildId, { error: err.name }))] });
        });
    },
};
