/**
 * @typedef {Object} LanguageKeys
 * @property {string} ERROR - 💢 An error has occurred, please try again later.
 * @property {string} ERROR_EXEC - 💢 There was an error while executing this command!
 * @property {string} ERR_DB - 💢 [DATABASE_ERR]: The database responded with error: %error%
 * @property {string} DB_NOCONNECT - 💢 Cannot connect to Database
 * @property {string} DB_REQUIRED - This command requires a database connection.
 * @property {string} CREATING_ROLE_FAILED_250 - \❌ Failed to generate a `%role%` role. Your server has too many roles! [250]
 * @property {string} CREATING_ROLE_FAILED - \❌ Failed to generate a `%role%` role.
 * @property {string} USER_DATA_404 - 💢 Looks like %user% don't have any `%data%` yet!
 * @property {string} SERVER_DATA_404 - 💢 Looks like this server don't have any `%data%` yet!
 * @property {string} CMD_404 - \❌ There is no command with name or alias `%commandName%`!
 * @property {string} CMD_BLOCKED - 💢 `%commandName%` command is blocked in this server!
 * @property {string} SLASH_OPTIONS - 💢 There was an error while viewing command options!
 * @property {string} CMD_NOARGS - You didn't provide any arguments
 * @property {string} CMD_NOT_DMS - 💢 I can't execute that command inside DMs!
 * @property {string} CMD_NOT_GUILD - 💢 I can't execute that command inside the server!
 * @property {string} NOT_VALID - 💢 Please provide a valid %target%!
 * @property {string} NOT_THEPLACE - 💢 This command can only be executed in %place%!
 * @property {string} DATA_404 - 💢 %data% can not be found!
 * @property {string} CANNOT_EDIT - 💢 I can't edit this %element%!
 * @property {string} NOT_VALID_TIME_INSEC - 💢 Please provide a valid time in seconds!
 * @property {string} NOT_VALID_MESSAGE - Please make your message brief and short! (MAX %number% characters!)
 * @property {string} LANGUAGE_404 - 💢 The language you selected is not available!
 * @property {string} CMD_COOLDOWN - ⏳ Please cool down! (%time_left% second(s) left)
 * @property {string} CMD_PERMISSIONS - 💢 You don't have `%permissions%` to use %commandName% command.
 * @property {string} CMD_BOT_PERMISSIONS - 💢 The bot is missing `%clientPermissions%` permission(s)!
 * @property {string} CMD_DEV_ONLY - The command `%commandName%` is limited for developers only!
 * @property {string} CMD_GUARDED - 💢 `%commandName%` is guarded!
 * @property {string} ACTION_SUCCESS - Successfully %action% the user!
 * @property {string} ROLE_CREATED - `%role.name%` role has been successfully created!
 * @property {string} CONFIRMATION_MESSAGE - Are you sure you want to %action% %target%? (yes/no)
 * @property {string} CANCEL_ACTION - The %action% has been cancelled!
 * @property {string} USER_DATA_DELETD - Successfully deleted the %user% %data%!
 * @property {string} LANGUAGE_SET - Successfully set %client% language to %language%!
 * @property {string} NO_ID - \❌ | %messageAuthor%, Please type the id or mention the user to %action%.
 * @property {string} USER_NOT_FOUND - \❌ | %messageAuthor%, User could not be found! Please ensure the supplied ID is valid.
 * @property {string} CANNOT_MODERATE_SELF - \❌ | %messageAuthor%, You cannot %action% yourself!
 * @property {string} CANNOT_MODERATE_BOT - \❌ | %messageAuthor%, You cannot %action% me!
 * @property {string} CANNOT_MODERATE_OWNER - \❌ | %messageAuthor%, You cannot %action% a server owner!
 * @property {string} CANNOT_MODERATE_DEV - \❌ | %messageAuthor%, You cannot %action% my developer through me!
 * @property {string} CANNOT_MODERATE_HIGHER - \❌ | %messageAuthor%, You can't %action% that user because he/she has a higher role than yours!
 * @property {string} CANNOT_MODERATE - \❌ | %messageAuthor%, I couldn't %action% that user!
 * @property {string} MODERATE_SUCCESS - Successfully %action% the user from the %target%!
 * @property {string} MODERATE_REASON - - %action% reason: `%reason%`
 * @property {string} MODERATE_MODERATOR - - Moderator: %moderator% (%moderatorID%)
 * @property {string} MODERATE_TIME - - At: <t:%timestamp%>
 * @property {string} MODERATED_ALREADY - \❌ | %messageAuthor%, User is already %action%!
 * @property {string} CLEAR_QUANTITY - 💢 | %messageAuthor%, Please provide the quantity of messages to be deleted which must be greater than two (2) and less than one hundred (100)
 * @property {string} CLEAR_SUCCESS - %messageAuthor%, Successfully deleted `%count%` messages from this channel!
 * @property {string} LOCK_UNLOCK_SUCCESS - %action% `everyone` from texting in %channel%!
 * @property {string} NO_DM_MSG - 💢 I cannot DM an empty message!
 * @property {string} CANNOT_DM - 💢 I can't send messages to %user%
 * @property {string} NO_MUTE_ROLE - ℹ️ There is no `muted` role in this guild, Would you like to generate one?
 * @property {string} MUTE_UNMUTE_SUCCESS - Successfully %action% %user% from texting!
 * @property {string} PURGE_SUCCESS - Successfully purged %amount% message(s) for user `%user%`!
 * @property {string} WARN_REASON_404 - Please provide a reason for the warning!
 * @property {string} CHANNEL_MODERATE_AFTERTIME - This channel will be %action% after %time%
 * @property {string} WARNINGS - - Warning(s) count: `%count%`
 * @property {string} SLOWMODE_SET - Successfully set the slowmode on this channel to %time% second(s)
 * @property {string} TIMEOUT_NOARGS - Please add the time of timeout or `'remove'` to remove it!
 * @property {string} PREFIX - My prefix is `%PREFIX%`, The custom prefix is `%SERVERPREFIX%`.
 * @property {string} CMD_USAGE - The proper usage would be: `%prefix%%commandName% %commandUsage%`
 * @property {string} LOADING - Loading Poob Beep...
 * @property {string} NO_RESULT - No results found for `%query%`
 * @property {string} NO_INFO - No information found for `%query%`
 * @property {string} PING - The Ping of the bot is `%ping%ms`! `🤖` API Latency is `%ws_ping%ms`!
 * @property {string} PONG - Pong!
 * @property {string} NO_CMD_QUERY - Please provide a valid command to get information about!
 * @property {string} CMD_USAGEE - Usage
 * @property {string} CMD_ALIASES - Aliases
 * @property {string} CMD_COOLDOWNN - Cooldown
 * @property {string} CMD_PERMISSIONSS - Permissions
 * @property {string} CMD_EXAMPLES - Examples
 */

/**
 * @typedef {Object} PlaceholderTypes
 * @property {{ error: string }} ERR_DB
 * @property {{ role: string }} CREATING_ROLE_FAILED_250
 * @property {{ role: string }} CREATING_ROLE_FAILED
 * @property {{ user: string, data: string }} USER_DATA_404
 * @property {{ data: string }} SERVER_DATA_404
 * @property {{ commandName: string }} CMD_404
 * @property {{ commandName: string }} CMD_BLOCKED
 * @property {{ target: string }} NOT_VALID
 * @property {{ place: string }} NOT_THEPLACE
 * @property {{ data: string }} DATA_404
 * @property {{ element: string }} CANNOT_EDIT
 * @property {{ number: string }} NOT_VALID_MESSAGE
 * @property {{ time_left: string }} CMD_COOLDOWN
 * @property {{ permissions: string, commandName: string }} CMD_PERMISSIONS
 * @property {{ clientPermissions: string }} CMD_BOT_PERMISSIONS
 * @property {{ commandName: string }} CMD_DEV_ONLY
 * @property {{ commandName: string }} CMD_GUARDED
 * @property {{ action: string }} ACTION_SUCCESS
 * @property {{ action: string, target: string }} CONFIRMATION_MESSAGE
 * @property {{ action: string }} CANCEL_ACTION
 * @property {{ user: string, data: string }} USER_DATA_DELETD
 * @property {{ client: string, language: string }} LANGUAGE_SET
 * @property {{ messageAuthor: string, action: string }} NO_ID
 * @property {{ messageAuthor: string }} USER_NOT_FOUND
 * @property {{ messageAuthor: string, action: string }} CANNOT_MODERATE_SELF
 * @property {{ messageAuthor: string, action: string }} CANNOT_MODERATE_BOT
 * @property {{ messageAuthor: string, action: string }} CANNOT_MODERATE_OWNER
 * @property {{ messageAuthor: string, action: string }} CANNOT_MODERATE_DEV
 * @property {{ messageAuthor: string, action: string }} CANNOT_MODERATE_HIGHER
 * @property {{ messageAuthor: string, action: string }} CANNOT_MODERATE
 * @property {{ action: string, target: string }} MODERATE_SUCCESS
 * @property {{ action: string, reason: string }} MODERATE_REASON
 * @property {{ moderator: string, moderatorID: string }} MODERATE_MODERATOR
 * @property {{ timestamp: string }} MODERATE_TIME
 * @property {{ messageAuthor: string, action: string }} MODERATED_ALREADY
 * @property {{ messageAuthor: string }} CLEAR_QUANTITY
 * @property {{ messageAuthor: string, count: string }} CLEAR_SUCCESS
 * @property {{ action: string, channel: string }} LOCK_UNLOCK_SUCCESS
 * @property {{ user: string }} CANNOT_DM
 * @property {{ action: string, user: string }} MUTE_UNMUTE_SUCCESS
 * @property {{ amount: string, user: string }} PURGE_SUCCESS
 * @property {{ action: string, time: string }} CHANNEL_MODERATE_AFTERTIME
 * @property {{ count: string }} WARNINGS
 * @property {{ time: string }} SLOWMODE_SET
 * @property {{ PREFIX: string, SERVERPREFIX: string }} PREFIX
 * @property {{ prefix: string, commandName: string, commandUsage: string }} CMD_USAGE
 * @property {{ query: string }} NO_RESULT
 * @property {{ query: string }} NO_INFO
 * @property {{ ping: string, ws_ping: string }} PING
 */

module.exports = {};