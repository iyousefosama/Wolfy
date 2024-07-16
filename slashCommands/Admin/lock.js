const { EmbedBuilder } = require("discord.js");
const { SuccessEmbed, ErrorEmbed, InfoEmbed } = require("../../util/modules/embeds")
/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "lock",
        description: "Lock the permissions for @everyone from talking in the channel",
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
                description: 'Channel to lock',
                required: true
            },
            {
                type: 3, // STRING
                name: 'message',
                description: 'Message to send to the locked channel',
                required: false
            }
        ]
    },
    async execute(client, interaction) {
        const { guild, options } = interaction;
        const channel = options.getChannel("channel");
        const reason = options.getString("message");
        
        if (!channel) {
            return interaction.reply({ content: `\\❌ Please provide a valid channel ID.`, ephemeral: true });
        } else if (!channel.permissionsFor(guild.members.me).has('ManageChannels')) {
            return interaction.reply({ content: `\\❌ I need permission to manage channels in ${channel}.`, ephemeral: true });
        }
        
        // Check if channel is already locked
        if (!channel.permissionsFor(guild.roles.everyone).has('SendMessages')) {
            return interaction.reply({ embeds: [ErrorEmbed(`\\❌ The channel ${channel} is already locked.`)], ephemeral: true });
        }
        
        // Proceed to lock the channel
        return channel.permissionOverwrites.edit(guild.roles.everyone, {
            SendMessages: false
        }, `WOLFY lock cmd: ${interaction.user.tag}: ${reason || "No reason specified"}`)
        .then(() => {
            // Success message and notification in the channel
            channel.send({ embeds: [ErrorEmbed(`${reason || ""}`).setTitle("🔒 Channel Locked")] }).catch(() => null);
            interaction.reply({ embeds: [InfoEmbed(`✅ Locked channel ${channel}`)] });
        })
        .catch((err) => {
            // Error handling if permission overwrite edit fails
            interaction.reply({ embeds: [ErrorEmbed(`💢 [\`${err.name}\`] The channel could not be locked.`)] });
        });
        
    },
};
