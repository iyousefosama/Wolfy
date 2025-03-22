module.exports = {
    // * GENERAL MESSAGES
    // Errors & Issues
    ERROR: "💢 An error has occurred, please try again later.",
    ERROR_EXEC: "💢 There was an error while executing this command!",
    ERR_DB: "💢 [DATABASE_ERR]: The database responded with error: %error%",
    DB_NOCONNECT: "💢 **Cannot connect to Database**",
    DB_REQUIRED: "This command requires a database connection.",
    CREATING_ROLE_FAILED_250: "\\❌ Failed to generate a \`%role%\` role. Your server has too many roles! **[250]**",
    CREATING_ROLE_FAILED: "\\❌ Failed to generate a \`%role%\` role.",
    USER_DATA_404: "💢 Looks like %user% don't have any \`%data%\` yet!",
    SERVER_DATA_404: "💢 Looks like this server don't have any \`%data%\` yet!",
    
    // Command Issues
    CMD_404: "\\❌ There is no command with name or alias \`%commandName%\`!",
    CMD_BLOCKED: "💢 \`%commandName%\` command is blocked in this server!",
    SLASH_OPTIONS: "💢 There was an error while viewing command options!",
    CMD_NOARGS: "You didn't provide any arguments",
    CMD_NOT_DMS: "💢 I can\'t execute that command inside DMs!",
    CMD_NOT_GUILD: "💢 I can\'t execute that command inside the server!",
    NOT_VALID: "💢 Please provide a valid %target%!",
    NOT_THEPLACE: "💢 This command can only be executed in %place%!",
    DATA_404: "💢 %data% can not be found!",
    CANNOT_EDIT: "💢 I can't edit this %element%!",
    NOT_VALID_TIME_INSEC: "💢 Please provide a valid time in seconds!",
    NOT_VALID_MESSAGE: "Please make your message brief and short! (MAX %number% characters!)",
    LANGUAGE_404: "💢 The language you selected is not available!",
    
    // * PERMISSIONS & LIMITATIONS
    CMD_COOLDOWN: "⏳ Please cool down! (**%time_left%** second(s) left)",
    CMD_PERMISSIONS: "💢 You don't have \`%permissions%\` to use **%commandName%** command.",
    CMD_BOT_PERMISSIONS: "💢 The bot is missing \`%clientPermissions%\` permission(s)!",
    CMD_DEV_ONLY: "The command \`%commandName%\` is limited for developers only!",
    CMD_GUARDED: "💢 \`%commandName%\` is guarded!",
    
    // * SUCCESS & CONFIRMATIONS
    ACTION_SUCCESS: "Successfully **%action%** the user!",
    ROLE_CREATED: "\`%role.name%\` role has been successfully created!",
    CONFIRMATION_MESSAGE: "Are you sure you want to **%action%** %target%? (yes/no)",
    CANCEL_ACTION: "The **%action%** has been cancelled!",
    USER_DATA_DELETD: "Successfully deleted the %user% %data%!",
    LANGUAGE_SET: "Successfully set %client% language to **%language%**!",

    // * MODERATION COMMANDS
    NO_ID: "\\❌ | %messageAuthor%, Please type the id or mention the user to **%action%**.",
    USER_NOT_FOUND: "\\❌ | %messageAuthor%, User could not be found! Please ensure the supplied ID is valid.",
    CANNOT_MODERATE_SELF: "\\❌ | %messageAuthor%, You cannot **%action%** yourself!",
    CANNOT_MODERATE_BOT: "\\❌ | %messageAuthor%, You cannot **%action%** me!",
    CANNOT_MODERATE_OWNER: "\\❌ | %messageAuthor%, You cannot **%action%** a server owner!",
    CANNOT_MODERATE_DEV: "\\❌ | %messageAuthor%, You cannot **%action%** my developer through me!",
    CANNOT_MODERATE_HIGHER: "\\❌ | %messageAuthor%, You can't **%action%** that user because he/she has a higher role than yours!",
    CANNOT_MODERATE: "\\❌ | %messageAuthor%, I couldn't **%action%** that user!",
    MODERATE_SUCCESS: "Successfully **%action%** the user from the %target%!",
    MODERATE_REASON: "- %action% reason: \`%reason%\`",
    MODERATE_MODERATOR: "- Moderator: %moderator% (%moderatorID%)",
    MODERATE_TIME: "- At: <t:%timestamp%>",
    MODERATED_ALREADY: "\\❌ | %messageAuthor%, User is already **%action%**!",
    CLEAR_QUANTITY: "💢 | %messageAuthor%, Please provide the quantity of messages to be deleted which must be greater than two (2) and less than one hundred (100)",
    CLEAR_SUCCESS: "%messageAuthor%, Successfully deleted \`%count%\` messages from this channel!",
    LOCK_UNLOCK_SUCCESS: "%action% \`everyone\` from texting in %channel%!",
    NO_DM_MSG: "💢 I cannot DM an **empty message**!",
    CANNOT_DM: "💢 I can't send messages to **%user%**",
    NO_MUTE_ROLE: "ℹ️ There is no \`muted\` role in this guild, Would you like to generate one?",
    MUTE_UNMUTE_SUCCESS: "Successfully %action% %user% from texting!",
    PURGE_SUCCESS: "Successfully purged **%amount%** message(s) for user \`%user%\`!",
    WARN_REASON_404: "Please provide a reason for the warning!",
    CHANNEL_MODERATE_AFTERTIME: "This channel will be %action% after **%time%**",
    WARNINGS: "- Warning(s) count: \`%count%\`",
    SLOWMODE_SET: "Successfully set the slowmode on this channel to **%time%** second(s)",
    TIMEOUT_NOARGS: "Please add the time of timeout or \`'remove'\` to remove it!",

    // * INFORMATION & HELP
    PREFIX: "My prefix is \`%PREFIX%\`, The custom prefix is \`%SERVERPREFIX%\`.",
    CMD_USAGE: "The proper usage would be:\n\`%prefix%%commandName% %commandUsage%\`",
    LOADING: "Loading Poob Beep...",
    NO_RESULT: "No results found for \`%query%\`",
    NO_INFO: "No information found for \`%query%\`",
    PING: "The Ping of the bot is \`%ping%ms\`!\n\`🤖\` API Latency is \`%ws_ping%ms\`!",
    PONG: "Pong!",

    // * CLIENT CORE COMMANDS
    NO_CMD_QUERY: "Please provide a valid command to get information about!",
    CMD_USAGEE: "Usage",
    CMD_ALIASES: "Aliases",
    CMD_COOLDOWNN: "Cooldown",
    CMD_PERMISSIONSS: "Permissions",
    CMD_EXAMPLES: "Examples",
    // * ECONOMY SYSTEM (TO BE ADDED)
    // * UTILITY COMMANDS (TO BE ADDED)
    // * OTHER COMMAND CATEGORIES (TO BE ADDED)

    PLACEHOLDER_MAPS: {
        action: {
            BAN: "banned",
            HACKBAN: "hack-banned",
            KICK: "kicked",
            MUTE: "muted",
            UNMUTE: "unmuted"
        },
    }
}
