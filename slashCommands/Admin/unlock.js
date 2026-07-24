const { EmbedBuilder } = require("discord.js");
const { colors } = require("../../util/constants/constants");

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
            return interaction.reply({ content: "❌ | Please provide a valid **channel ID**!", ephemeral: true });
        } else if (!channel.permissionsFor(guild.members.me).has('ManageChannels')) {
            return interaction.reply({ content: "❌ | I don't have the permissions to manage this **channel**!", ephemeral: true });
        }
        
        // Check if channel is already unlocked
        if (channel.permissionsFor(guild.roles.everyone).has('SendMessages')) {
            return interaction.reply({ content: "❌ | The channel is already **unlocked**!", ephemeral: true });
        }
        
        // Proceed to unlock the channel
        try {
            await channel.permissionOverwrites.edit(guild.roles.everyone, {
                SendMessages: true
            }, `WOLFY unlock cmd: ${interaction.user.tag}: ${reason || "No reason specified"}`);
            
            // Success message and notification in the channel
            if (reason) {
                const unlockMessageEmbed = new EmbedBuilder()
                    .setColor(colors.ADMIN)
                    .setTitle("🔓 Channel unlocked")
                    .setDescription(reason)
                    .setTimestamp();
                channel.send({ embeds: [unlockMessageEmbed] }).catch(() => null);
            }
            
            const replyEmbed = new EmbedBuilder()
                .setColor(colors.ADMIN)
                .setDescription(`✅ Unlocked channel ${channel}`)
                .setTimestamp();
            return interaction.reply({ embeds: [replyEmbed] });
        } catch (error) {
            return interaction.reply({ content: `❌ | There was an error while executing this command! ${error.name}`, ephemeral: true });
        }
    },
};
