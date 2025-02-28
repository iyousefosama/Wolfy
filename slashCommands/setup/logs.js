const {
    EmbedBuilder,
    ChannelType,
    ApplicationCommandOptionType
} = require("discord.js");
const { ErrorEmbed, SuccessEmbed } = require("../../util/modules/embeds");
const schema = require('../../schema/GuildSchema');

module.exports = {
    data: {
        name: "logs",
        description: "Manage Logs in the server",
        group: "Setup",
        requiresDatabase: true,
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "set-separated",
                description: "Set's the separated logs for the server",
                options: [
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: "message-delete",
                        description: "A channel to send message delete logs to",
                        channelTypes: [ChannelType.GuildText],
                        required: false
                    },
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: "message-update",
                        description: "A channel to send message update logs to",
                        channelTypes: [ChannelType.GuildText],
                        required: false
                    },
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: "member-join",
                        description: "A channel to send member join logs to",
                        channelTypes: [ChannelType.GuildText],
                        required: false
                    },
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: "member-leave",
                        description: "A channel to send member leave logs to",
                        channelTypes: [ChannelType.GuildText],
                        required: false
                    },
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: "channel-create",
                        description: "A channel to send channel create logs to",
                        channelTypes: [ChannelType.GuildText],
                        required: false
                    },
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: "channel-delete",
                        description: "A channel to send channel delete logs to",
                        channelTypes: [ChannelType.GuildText],
                        required: false
                    },
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: "channel-update",
                        description: "A channel to send channel update logs to",
                        channelTypes: [ChannelType.GuildText],
                        required: false
                    },
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: "role-create",
                        description: "A channel to send role create logs to",
                        channelTypes: [ChannelType.GuildText],
                        required: false
                    },
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: "role-delete",
                        description: "A channel to send role delete logs to",
                        channelTypes: [ChannelType.GuildText],
                        required: false
                    },
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: "role-update",
                        description: "A channel to send role update logs to",
                        channelTypes: [ChannelType.GuildText],
                        required: false
                    },
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "set-all",
                description: "Set's the logs for all events in the server",
                options: [
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: "channel",
                        description: "A channel to send all logs to",
                        channelTypes: [ChannelType.GuildText],
                        required: true
                    },
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "edit",
                description: "Edit logs configurations",
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "logs-type",
                        description: "Choose whether you want all logs to send in one channel or separated channels",
                        required: false,
                        choices: [
                            { name: 'all', value: 'all' }, // Set logs type to "all"
                            { name: 'separated', value: 'separated' }, // Set logs type to "separated"
                        ]
                    },
                    {
                        type: ApplicationCommandOptionType.Boolean,
                        name: "global-all-status",
                        description: "Enable or disable global logs",
                        required: false,
                    },
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: "log-channel-status",
                        description: "Toggle the status of a specific separated logs type by selecting its channel",
                        channelTypes: [ChannelType.GuildText],
                        required: false,
                    }
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "list",
                description: "List all logs in the server",
            },
        ],
        permissions: ["ManageGuild"],
    },
    async execute(client, interaction) {
        const { guild, options } = interaction;
        const subCommand = options.getSubcommand();

        try {
            switch (subCommand) {
                case "set-separated":
                    await setSeparatedLogs(client, interaction, options);
                    break;
                case "set-all":
                    await setAllLogs(client, interaction, options);
                    break;
                case "edit":
                    await editLogs(client, interaction, options);
                    break;
                case "list":
                    await listLogs(client, interaction);
                    break;
                default:
                    await interaction.reply({ embeds: [ErrorEmbed("❌ Invalid subcommand!")], ephemeral: true });
            }
        } catch (error) {
            console.error("Error executing logs command:", error);
            await interaction.reply({ embeds: [ErrorEmbed("❌ An error occurred while processing your request.")], ephemeral: true });
        }
    },
};
async function setSeparatedLogs(client, interaction, options) {
    const { guild } = interaction;

    // Define all possible log types and their corresponding option names
    const logTypes = {
        "Mod.Logs.separated.messageDelete.channel": "message-delete",
        "Mod.Logs.separated.messageUpdate.channel": "message-update",
        "Mod.Logs.separated.memberJoin.channel": "member-join",
        "Mod.Logs.separated.memberLeave.channel": "member-leave",
        "Mod.Logs.separated.channelCreate.channel": "channel-create",
        "Mod.Logs.separated.channelDelete.channel": "channel-delete",
        "Mod.Logs.separated.channelUpdate.channel": "channel-update",
        "Mod.Logs.separated.RoleCreate.channel": "role-create",
        "Mod.Logs.separated.RoleDelete.channel": "role-delete",
        "Mod.Logs.separated.RoleUpdate.channel": "role-update",
    };

    // Construct the update object dynamically
    const logData = {};
    for (const [key, optionName] of Object.entries(logTypes)) {
        const channel = options.getChannel(optionName);
        if (channel) {
            logData[key] = channel.id; // Only add to the update object if a channel is provided
        }
    }

    // If no valid channels were provided, return an error
    if (Object.keys(logData).length === 0) {
        return interaction.reply({ embeds: [ErrorEmbed("❌ No valid channels were provided to update.")], ephemeral: true });
    }

    // Update the database with only the provided values
    const data = await schema.findOneAndUpdate({ GuildID: guild.id }, { $set: logData }, { upsert: true });

    // Send success message
    await interaction.reply({ embeds: [SuccessEmbed(["✔️ Separated logs have been updated successfully!", data.Mod.Logs.type != "separated" ? `\\⚠️ Logs type is set to \`${data.Mod.Logs.type}\`! To change type, execute \`/logs edit logs-type [separated]\`` : null])], ephemeral: true });
}
async function setAllLogs(client, interaction, options) {
    const { guild } = interaction;
    const logChannel = options.getChannel("channel");

    const logData = {
        "Mod.Logs.channel": logChannel.id,
        "Mod.Logs.type": "all"
    };

    const data = await schema.findOneAndUpdate({ GuildID: guild.id }, { $set: logData }, { upsert: true });
    await interaction.reply({ embeds: [SuccessEmbed(["✔️ All logs have been set to the specified channel!", !data.Mod.Logs.isEnabled ? "\\⚠️ Logs channel is disabled! To enable, execute \`/logs edit all-status [true]\`" : null, data.Mod.Logs.type != "all" ? `\\⚠️ Logs type is set to \`${data.Mod.Logs.type}\`! To change type, execute \`/logs edit logs-type [all]\`` : null].join("\n"))], ephemeral: true });
}
async function editLogs(client, interaction, options) {
    const { guild } = interaction;
    const logsType = options.getString("logs-type");
    const allStatus = options.getBoolean("global-all-status");
    const separatedStatusChannel = options.getChannel("log-channel-status");

    // Fetch current log settings from the database
    const logData = await schema.findOne({ GuildID: guild.id });
    if (!logData || !logData.Mod?.Logs) {
        return interaction.reply({ embeds: [ErrorEmbed("❌ No logs configuration found for this server.")], ephemeral: true });
    }

    const logs = logData.Mod.Logs;

    let updateFields = {};
    let successMessage = "";

    // Handle logs type change
    if (logsType) {
        updateFields["Mod.Logs.type"] = logsType;
        successMessage += `✔️ Logs type has been set to **${logsType}**. `;
    }

    // Handle global logs status toggle
    if (allStatus !== null) {
        updateFields["Mod.Logs.isEnabled"] = allStatus;
        successMessage += `✔️ Global logs have been **${allStatus ? "enabled" : "disabled"}**. `;
    }

    // Handle separated logs status toggle
    if (separatedStatusChannel) {
        // Find all log types associated with the selected channel
        const logTypesToUpdate = Object.entries(logs.separated)
            .filter(([_, value]) => value.channel === separatedStatusChannel.id)
            .map(([key]) => key);

        // If no log types are associated with the channel, return an error
        if (logTypesToUpdate.length === 0) {
            return interaction.reply({ embeds: [ErrorEmbed("❌ The selected channel is not assigned to any log type. Please assign it first.")], ephemeral: true });
        }

        // Determine the new status for all associated log types
        const currentStatuses = logTypesToUpdate.map((logType) => logs.separated[logType].isEnabled);
        const allEnabled = currentStatuses.every((status) => status === true);
        const allDisabled = currentStatuses.every((status) => status === false);

        // If some are enabled and some are disabled, enable all of them
        const newStatus = !allEnabled;

        // Toggle the status of all associated log types
        logTypesToUpdate.forEach((logType) => {
            updateFields[`Mod.Logs.separated.${logType}.isEnabled`] = newStatus;
            updateFields[`Mod.Logs.separated.${logType}.channel`] = separatedStatusChannel.id;
        });

        successMessage += `✔️ All logs events for <#${separatedStatusChannel.id}> have been **${newStatus ? "enabled" : "disabled"}**. `;
    }

    // If no updates were made, return an error
    if (Object.keys(updateFields).length === 0) {
        return interaction.reply({ embeds: [ErrorEmbed("❌ No valid options were provided to update.")], ephemeral: true });
    }

    // Update the database
    await schema.findOneAndUpdate({ GuildID: guild.id }, { $set: updateFields }, { upsert: true });

    // Send success message
    await interaction.reply({
        embeds: [SuccessEmbed(successMessage)],
        ephemeral: true
    });
}
async function listLogs(client, interaction) {
    const { guild } = interaction;
    const logData = await schema.findOne({ GuildID: guild.id });

    if (!logData || !logData.Mod?.Logs) {
        return interaction.reply({ embeds: [ErrorEmbed("❌ No logs configuration found for this server.")], ephemeral: true });
    }

    const logs = logData.Mod.Logs;

    // Define all log types and their display names
    const logTypes = [
        { key: "messageDelete", name: "Message Delete Logs" },
        { key: "messageUpdate", name: "Message Update Logs" },
        { key: "memberJoin", name: "Member Join Logs" },
        { key: "memberLeave", name: "Member Leave Logs" },
        { key: "channelCreate", name: "Channel Create Logs" },
        { key: "channelDelete", name: "Channel Delete Logs" },
        { key: "channelUpdate", name: "Channel Update Logs" },
        { key: "RoleCreate", name: "Role Create Logs" },
        { key: "RoleDelete", name: "Role Delete Logs" },
        { key: "RoleUpdate", name: "Role Update Logs" },
    ];

    // Create the base embed
    const embed = new EmbedBuilder()
        .setTitle("Logs Configuration")
        .setDescription("Current logs settings for this server:")
        .addFields(
            { name: "Logs Enabled", value: logs.isEnabled ? "Yes" : "No", inline: true },
            { name: "Logs Type", value: logs.type || "Not set", inline: true },
            { name: "All Logs Channel", value: logs.channel ? `<#${logs.channel}>` : "Not set", inline: true },
            { name: "Separated Logs", value: "See below for details", inline: false }
        );

    // Dynamically add fields for each log type
    logTypes.forEach(({ key, name }) => {
        const log = logs.separated?.[key];
        const value = log?.channel ? `<#${log.channel}> (\`${log.isEnabled ? "Enabled" : "Disabled"}\`)` : "Not set";
        embed.addFields({ name, value, inline: true });
    });

    // Add a timestamp
    embed.setTimestamp();

    // Send the embed
    await interaction.reply({ embeds: [embed], ephemeral: true });
}