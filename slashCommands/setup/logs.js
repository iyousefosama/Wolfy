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
                    await interaction.reply({ embeds: [ErrorEmbed("💢 There was an error while executing this command!")], ephemeral: true });
            }
        } catch (error) {
            console.error("Error executing logs command:", error);
            await interaction.reply({ embeds: [ErrorEmbed("💢 An error has occurred, please try again later.")], ephemeral: true });
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
            editedMsg.push(`- ${logType.name} set to <#${channel.id}>`);
        }
    }

    // If no valid channels were provided and existing logs are empty, return an error
    if (Object.keys(logData.Mod.Logs.separated).length === 0) {
        return interaction.reply({ 
            embeds: [ErrorEmbed("❌ No valid channels were provided to update.")], 
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
    let successMessage = "✔️ Separated logs have been updated successfully!";
    
    if (data.Mod.Logs.type !== "separated") {
        successMessage += "\n" + `⚠️ Logs type is set to \`${data.Mod.Logs.type}\`! To change type, execute \`/logs edit logs-type [separated]\``;
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
    let successMessage = "✔️ All logs have been set to the specified channel!";
    
    if (!data?.Mod?.Logs?.isEnabled) {
        successMessage += "\n" + "⚠️ Logs channel is disabled! To enable, execute `/logs edit global-status [true]`";
    }
    
    if (data?.Mod?.Logs?.type !== "global") {
        successMessage += "\n" + `⚠️ Logs type is set to \`${data?.Mod?.Logs?.type || "unknown"}\`! To change type, execute \`/logs edit logs-type [global]\``;
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
            embeds: [ErrorEmbed("❌ No logs configuration found for this server.")], 
            ephemeral: true 
        });
    }

    let updateFields = {};
    let successUpdates = [];

    // Handle logs type change
    if (logsType) {
        updateFields["Mod.Logs.type"] = logsType;
        successUpdates.push(`Logs type has been set to **${logsType}**. `);
    }

    // Handle global logs status toggle
    if (globalStatus !== null && globalStatus !== undefined) {
        updateFields["Mod.Logs.isEnabled"] = globalStatus;
        successUpdates.push(`Global logs have been **${globalStatus ? "ENABLED" : "DISABLED"}**. `);
    }

    // If no updates were made, return an error
    if (Object.keys(updateFields).length === 0) {
        return interaction.reply({ 
            embeds: [ErrorEmbed("❌ No valid options were provided to update.")], 
            ephemeral: true 
        });
    }

    // Update the database
    await schema.findOneAndUpdate({ GuildID: guild.id }, { $set: updateFields }, { upsert: true });

    // Send success message
    await interaction.reply({
        embeds: [SuccessEmbed(`✔️ ${successUpdates.join("")}`)],
        ephemeral: true
    });
}
async function listLogs(client, interaction) {
    const { guild } = interaction;
    const logData = await schema.findOne({ GuildID: guild.id });

    if (!logData || !logData.Mod?.Logs) {
        return interaction.reply({ 
            embeds: [ErrorEmbed("❌ No logs configuration found for this server.")], 
            ephemeral: true 
        });
    }

    const logs = logData.Mod.Logs;

    // Create the base embed
    const embed = new EmbedBuilder()
        .setTitle("Logs Configuration")
        .setDescription("Current logs settings for this server:")
        .addFields(
            { 
                name: "Logs Enabled", 
                value: logs.isEnabled ? 
                    "Yes" : 
                    "No", 
                inline: true 
            },
            { 
                name: "Logs Type", 
                value: logs.type || "Not set", 
                inline: true 
            },
            { 
                name: "All Logs Channel", 
                value: logs.channel ? 
                    `<#${logs.channel}>` : 
                    "Not set", 
                inline: true 
            },
            { 
                name: "Separated Logs", 
                value: "Current logs settings for this server:", 
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
            embeds: [ErrorEmbed("❌ No logs configuration found for this server.")], 
            ephemeral: true 
        });
    }

    const logs = logData.Mod.Logs;

    // Create the base embed
    const embed = new EmbedBuilder()
        .setTitle("Separated Logs Configuration")
        .setDescription("✨ Manage separated logs events using **configurations** below\nToggle events **status** by pressing their button")
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
                content: "This log type is not set.", 
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
            embeds: [InfoEmbed(`${logType} logs has been set to **${log.isEnabled ? 
                    "Yes" : 
                    "No"}**.`)],
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
                "Yes" : 
                "No"
            }\`)`;
        } else {
            value = "Not set";
        }
        
        fields.push({ name: logType.name, value, inline: true });
    }

    return fields;
}
