const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { colors } = require("../../util/constants/constants");

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
                type: ApplicationCommandOptionType.Channel,
                name: 'channel',
                description: 'Channel to lock',
                required: true
            },
            {
                type: ApplicationCommandOptionType.String,
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
            return interaction.reply({ content: "❌ | Please provide a valid **channel ID**!", flags: ['Ephemeral'] });
        } else if (!channel.permissionsFor(guild.members.me).has('ManageChannels')) {
            return interaction.reply({ content: "❌ | I don't have the permissions to manage this **channel**!", flags: ['Ephemeral'] });
        }
        
        // Check if channel is already locked
        if (!channel.permissionsFor(guild.roles.everyone).has('SendMessages')) {
            return interaction.reply({ content: "❌ | The channel is already **locked**!", flags: ['Ephemeral'] });
        }
        
        // Proceed to lock the channel
        try {
            await channel.permissionOverwrites.edit(guild.roles.everyone, {
                SendMessages: false
            }, `Wolfy lock cmd: ${interaction.user.tag}: ${reason || "No reason specified"}`);
            
            // Success message and notification in the channel
            if (reason) {
                const lockMessageEmbed = new EmbedBuilder()
                    .setColor(colors.ADMIN)
                    .setTitle("🔒 Channel locked")
                    .setDescription(reason)
                    .setTimestamp();
                channel.send({ embeds: [lockMessageEmbed] }).catch(() => null);
            }
            
            const replyEmbed = new EmbedBuilder()
                .setColor(colors.ADMIN)
                .setDescription(`✅ Locked channel ${channel}`)
                .setTimestamp();
            return interaction.reply({ embeds: [replyEmbed] });
        } catch (error) {
            return interaction.reply({ content: `❌ | There was an error while executing this command! ${error.name}`, flags: ['Ephemeral'] });
        }
    },
};
