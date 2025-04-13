const {
    EmbedBuilder,
    ChannelType,
    ApplicationCommandOptionType,
    ButtonBuilder,
    ActionRowBuilder
} = require("discord.js");
const { ErrorEmbed, SuccessEmbed, InfoEmbed } = require("../../util/modules/embeds");
const schema = require('../../schema/GuildSchema');
const { logTypes } = require('../../util/constants/logs');

// Dynamically generate slash options for the subcommand
const generateSlashOptions = () => {
    const options = [];
    for (const [key, logType] of Object.entries(logTypes)) {
        const formattedKey = logType.key.toLowerCase(); // Ensure consistent naming
        options.push({
            type: ApplicationCommandOptionType.Channel,
            name: formattedKey, // Use the formatted key
            description: logType.description,
            channelTypes: [ChannelType.GuildText],
            required: false
        });
    }
    return options;
};

module.exports = {
    data: {
        name: "logs",
        description: "Manage Logs in the server",
        group: "Setup",
        requiresDatabase: true,
        dmOnly: false,
        guildOnly: true,
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "set-separated",
                description: "Set's the separated logs for the server",
                options: generateSlashOptions()
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "set-global",
                description: "Set's the logs for global logs(all events) in the server",
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
                            { name: 'global', value: 'global' }, // Set logs type to "global"
                            { name: 'separated', value: 'separated' }, // Set logs type to "separated"
                        ]
                    },
                    {
                        type: ApplicationCommandOptionType.Boolean,
                        name: "global-status",
                        description: "Enable or disable global(all events) logs",
                        required: false,
                    }
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "manage-separated",
                description: "Sent separated logs configuration panel",
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
                case "set-global":
                    await setAllLogs(client, interaction, options);
                    break;
                case "edit":
                    await editLogs(client, interaction, options);
                    break;
                case "list":
                    await listLogs(client, interaction);
                    break;
                case "manage-separated":
                    await manageSeparatedLogs(client, interaction);
                    break;
                default:
                    await interaction.reply({ embeds: [ErrorEmbed(client.language.getString("ERROR_EXEC", guild.id))], ephemeral: true });
            }
        } catch (error) {
            console.error("Error executing logs command:", error);
            await interaction.reply({ embeds: [ErrorEmbed(client.language.getString("ERROR", guild.id))], ephemeral: true });
        }
    },
};
async function setSeparatedLogs(client, interaction, options) {
    const { guild } = interaction;

    // Fetch existing log data
    const existingData = await schema.findOne({ GuildID: guild.id });
    const separatedLogs = existingData?.Mod?.Logs?.separated || {}; // Preserve existing logs

    // Construct the update object dynamically
    const logData = { Mod: { Logs: { separated: { ...separatedLogs } } } }; // Spread existing logs
    const editedMsg = [];

    for (const [key, logType] of Object.entries(logTypes)) {
        const formattedKey = logType.key.toLowerCase(); // Ensure consistent naming
        const channel = options.getChannel(formattedKey); // Fetch the channel using the formatted key

        if (channel) {
            logData.Mod.Logs.separated[key] = { channel: channel.id, isEnabled: true }; // Merge new data
            editedMsg.push(client.language.getString("LOGS_SET_SEPARATED_UPDATED", guild.id, {
                log_name: logType.name,
                channel: `<#${channel.id}>`
            }));
        }
    }

    // If no valid channels were provided and existing logs are empty, return an error
    if (Object.keys(logData.Mod.Logs.separated).length === 0) {
        return interaction.reply({ 
            embeds: [ErrorEmbed(client.language.getString("LOGS_SET_SEPARATED_NO_CHANNELS", guild.id))], 
            ephemeral: true 
        });
    }

    // Update the database with merged values
    const data = await schema.findOneAndUpdate(
        { GuildID: guild.id },
        { $set: logData },
        { upsert: true, new: true }
    );

    // Get success message with appropriate warning if needed
    let successMessage = client.language.getString("LOGS_SET_SEPARATED_SUCCESS", guild.id);
    
    if (data.Mod.Logs.type !== "separated") {
        successMessage += "\n" + client.language.getString("LOGS_SET_SEPARATED_TYPE_WARNING", guild.id, {
            type: data.Mod.Logs.type
        });
    }

    // Send success message
    await interaction.reply({
        embeds: [SuccessEmbed(successMessage), InfoEmbed(editedMsg.join("\n"))],
        ephemeral: true
    });
}
async function setAllLogs(client, interaction, options) {
    const { guild } = interaction;
    const logChannel = options.getChannel("channel");

    const logData = {
        "Mod.Logs.channel": logChannel.id,
        "Mod.Logs.type": "global"
    };

    const data = await schema.findOneAndUpdate({ GuildID: guild.id }, { $set: logData }, { upsert: true });
    
    // Build success message with appropriate warnings if needed
    let successMessage = client.language.getString("LOGS_SET_GLOBAL_SUCCESS", guild.id);
    
    if (!data?.Mod?.Logs?.isEnabled) {
        successMessage += "\n" + client.language.getString("LOGS_SET_GLOBAL_DISABLED_WARNING", guild.id);
    }
    
    if (data?.Mod?.Logs?.type !== "global") {
        successMessage += "\n" + client.language.getString("LOGS_SET_GLOBAL_TYPE_WARNING", guild.id, {
            type: data?.Mod?.Logs?.type || "unknown"
        });
    }
    
    await interaction.reply({
        embeds: [SuccessEmbed(successMessage)],
        ephemeral: true
    });
}
async function editLogs(client, interaction, options) {
    const { guild } = interaction;
    const logsType = options.getString("logs-type");
    const globalStatus = options.getBoolean("global-status");

    // Fetch current log settings from the database
    const logData = await schema.findOne({ GuildID: guild.id });
    if (!logData || !logData.Mod?.Logs) {
        return interaction.reply({ 
            embeds: [ErrorEmbed(client.language.getString("LOGS_EDIT_NO_CONFIG", guild.id))], 
            ephemeral: true 
        });
    }

    let updateFields = {};
    let successUpdates = [];

    // Handle logs type change
    if (logsType) {
        updateFields["Mod.Logs.type"] = logsType;
        successUpdates.push(client.language.getString("LOGS_EDIT_TYPE_CHANGED", guild.id, {
            type: logsType
        }));
    }

    // Handle global logs status toggle
    if (globalStatus !== null && globalStatus !== undefined) {
        updateFields["Mod.Logs.isEnabled"] = globalStatus;
        successUpdates.push(client.language.getString("LOGS_EDIT_STATUS_CHANGED", guild.id, {
            status: globalStatus ? "ENABLED" : "DISABLED"
        }));
    }

    // If no updates were made, return an error
    if (Object.keys(updateFields).length === 0) {
        return interaction.reply({ 
            embeds: [ErrorEmbed(client.language.getString("LOGS_EDIT_NO_OPTIONS", guild.id))], 
            ephemeral: true 
        });
    }

    // Update the database
    await schema.findOneAndUpdate({ GuildID: guild.id }, { $set: updateFields }, { upsert: true });

    // Send success message
    await interaction.reply({
        embeds: [SuccessEmbed(client.language.getString("LOGS_EDIT_SUCCESS", guild.id, {
            updates: successUpdates.join("")
        }))],
        ephemeral: true
    });
}
async function listLogs(client, interaction) {
    const { guild } = interaction;
    const logData = await schema.findOne({ GuildID: guild.id });

    if (!logData || !logData.Mod?.Logs) {
        return interaction.reply({ 
            embeds: [ErrorEmbed(client.language.getString("LOGS_LIST_NO_CONFIG", guild.id))], 
            ephemeral: true 
        });
    }

    const logs = logData.Mod.Logs;

    // Create the base embed
    const embed = new EmbedBuilder()
        .setTitle(client.language.getString("LOGS_LIST_TITLE", guild.id))
        .setDescription(client.language.getString("LOGS_LIST_DESCRIPTION", guild.id))
        .addFields(
            { 
                name: client.language.getString("LOGS_LIST_LOGS_ENABLED", guild.id), 
                value: logs.isEnabled ? 
                    client.language.getString("LOGS_LIST_ENABLED", guild.id) : 
                    client.language.getString("LOGS_LIST_DISABLED", guild.id), 
                inline: true 
            },
            { 
                name: client.language.getString("LOGS_LIST_LOGS_TYPE", guild.id), 
                value: logs.type || client.language.getString("LOGS_LIST_NOT_SET", guild.id), 
                inline: true 
            },
            { 
                name: client.language.getString("LOGS_LIST_ALL_LOGS_CHANNEL", guild.id), 
                value: logs.channel ? 
                    `<#${logs.channel}>` : 
                    client.language.getString("LOGS_LIST_NOT_SET", guild.id), 
                inline: true 
            },
            { 
                name: client.language.getString("LOGS_LIST_SEPARATED_LOGS", guild.id), 
                value: client.language.getString("LOGS_LIST_DESCRIPTION", guild.id), 
                inline: false 
            },
            ...await separatedList(client, logs, guild.id)
        );

    // Send the embed
    await interaction.reply({ embeds: [embed], ephemeral: true });
}
async function manageSeparatedLogs(client, interaction) {
    const { guild } = interaction;
    const logData = await schema.findOne({ GuildID: guild.id });

    if (!logData || !logData.Mod?.Logs) {
        return interaction.reply({ 
            embeds: [ErrorEmbed(client.language.getString("LOGS_EDIT_NO_CONFIG", guild.id))], 
            ephemeral: true 
        });
    }

    const logs = logData.Mod.Logs;

    // Create the base embed
    const embed = new EmbedBuilder()
        .setTitle(client.language.getString("LOGS_MANAGE_SEPARATED_TITLE", guild.id))
        .setDescription(client.language.getString("LOGS_MANAGE_SEPARATED_DESCRIPTION", guild.id))
        .addFields(await separatedList(client, logs, guild.id));

    const msg = await interaction.reply({ 
        embeds: [embed], 
        components: await createButtonsAndRows(client, logs, guild.id), 
        fetch: true 
    });
    
    const collector = msg.createMessageComponentCollector({ time: 860000, errors: ['time'] });

    collector.on('collect', async (button) => {
        const logType = button.customId.split('-')[1];
        const log = logs.separated?.[logType];

        if (!log) {
            return button.reply({ 
                content: client.language.getString("LOGS_MANAGE_SEPARATED_NOT_FOUND", guild.id), 
                ephemeral: true 
            });
        }

        log.isEnabled = !log.isEnabled;

        await schema.findOneAndUpdate(
            { GuildID: guild.id }, 
            { $set: { [`Mod.Logs.separated.${logType}.isEnabled`]: log.isEnabled } }
        );

        await msg.edit({ 
            embeds: [embed.setFields(await separatedList(client, logs, guild.id))], 
            components: await createButtonsAndRows(client, logs, guild.id) 
        });
        
        button.reply({
            embeds: [InfoEmbed(client.language.getString("LOGS_MANAGE_SEPARATED_LOG_TOGGLED", guild.id, {
                log_type: logType,
                status: log.isEnabled ? 
                    client.language.getString("LOGS_LIST_ENABLED", guild.id) : 
                    client.language.getString("LOGS_LIST_DISABLED", guild.id)
            }))],
            ephemeral: true
        });
    });
}
async function createButtonsAndRows(client, logs, guildId) {
    let buttons = [];

    for (const [key, logType] of Object.entries(logTypes)) {
        const log = logs.separated?.[key];
        buttons.push(
            new ButtonBuilder()
                .setLabel(logType.name)
                .setCustomId(`toggle-${key}`)
                .setStyle(log?.isEnabled ? "Success" : "Danger")
                .setDisabled(!log?.channel)
        );
    }

    let rows = [];

    for (let i = 0; i < buttons.length; i += 5) {
        rows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + 5)));
    }

    return rows;
}
async function separatedList(client, logs, guildId) {
    const fields = [];

    for (const [key, logType] of Object.entries(logTypes)) {
        const log = logs.separated?.[key];
        let value;
        
        if (log?.channel) {
            value = `<#${log.channel}> (\`${
                log.isEnabled ? 
                client.language.getString("LOGS_LIST_ENABLED", guildId) : 
                client.language.getString("LOGS_LIST_DISABLED", guildId)
            }\`)`;
        } else {
            value = client.language.getString("LOGS_MANAGE_SEPARATED_NOT_SET", guildId);
        }
        
        fields.push({ name: logType.name, value, inline: true });
    }

    return fields;
}
