/**
 * @typedef {Object} LanguageKeys
 * @property {string} ERROR - 💢 An error has occurred, please try again later.
 * @property {string} ERROR_EXEC - 💢 There was an error while executing this command!
 * @property {string} ERR_DB - 💢 [DATABASE_ERR]: The database responded with error: %error%
 * @property {string} DB_NOCONNECT - 💢 Cannot connect to Database
 * @property {string} DB_REQUIRED - This command requires a database connection.
 * @property {string} CREATING_ROLE_FAILED_250 - \❌ Failed to create `%role%` role. Your server has too many roles! [250]
 * @property {string} CREATING_ROLE_FAILED - \❌ Failed to create %role% role! [`%err_name%`]
 * @property {string} USER_DATA_404 - 💢 Looks like %user% don't have any `%data%` yet!
 * @property {string} SERVER_DATA_404 - 💢 Looks like this server don't have any `%data%` yet!
 * @property {string} BOT_PERMS_REQ - 💢 The bot requires the following permissions: %permissions%!
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
 * @property {string} CANNOT_MANAGE - 💢 I don't have the permissions to manage this %group%!
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
 * @property {string} CREATION_SUCCESS - ✅ Successfully created `%element%` %group%!
 * @property {string} DELETION_SUCCESS - 🗑️ Successfully deleted `%element%` %group%!
 * @property {string} UPDATE_SUCCESS - 🔃 Successfully updated `%element%` %group%!
 * @property {string} NO_ID - \❌ | Please type the id or mention the user to %action%.
 * @property {string} USER_NOT_FOUND - \❌ | User could not be found! Please ensure the supplied ID is valid.
 * @property {string} CANNOT_MODERATE_SELF - \❌ | You cannot %action% yourself!
 * @property {string} CANNOT_MODERATE_BOT - \❌ | You cannot %action% me!
 * @property {string} CANNOT_MODERATE_OWNER - \❌ | You cannot %action% a server owner!
 * @property {string} CANNOT_MODERATE_DEV - \❌ | You cannot %action% my developer through me!
 * @property {string} CANNOT_MODERATE_HIGHER - \❌ | You can't %action% that user because he/she has a higher role than yours!
 * @property {string} CANNOT_MODERATE - \❌ | I couldn't %action% that user!
 * @property {string} MODERATE_SUCCESS - Successfully %action_done% the user from %target%!
 * @property {string} MODERATE_REASON - - %action% reason: `%reason%`
 * @property {string} MODERATE_MODERATOR - - Moderator: %moderator% (%moderatorID%)
 * @property {string} MODERATE_TIME - - At: <t:%timestamp%>
 * @property {string} MODERATED_ALREADY - \❌ | User is already %action_done%!
 * @property {string} NOT_VALIDID - 💢 Please provide a valid %group% ID!
 * @property {string} CLEAR_QUANTITY - 💢 | Please provide the quantity of messages to be deleted which must be greater than two (2) and less than one hundred (100)
 * @property {string} CLEAR_SUCCESS - Successfully deleted `%count%` messages from this channel!
 * @property {string} LOCK_UNLOCK_SUCCESS - %action_done% `everyone` from texting in %channel%!
 * @property {string} LOCKED_UNLOCKED_ALREADY - \❌ | The channel is already %action_done%!
 * @property {string} NO_DM_MSG - 💢 I cannot DM an empty message!
 * @property {string} CANNOT_DM - 💢 I can't send messages to %user%
 * @property {string} NO_MUTE_ROLE - ℹ️ There is no `muted` role in this guild, Would you like to generate one?
 * @property {string} MUTE_UNMUTE_SUCCESS - Successfully %action_done% %user% from texting!
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
 * @property {string} INVITE_TITLE - %username% Links
 * @property {string} INVITE_DESCRIPTION - <a:Cookie:853495749370839050> Hey, %username%, here are some special links for you!  You can support our bot by voting for it on top.gg.
 * @property {string} INVITE_BUTTON_SUPPORT - Support
 * @property {string} INVITE_BUTTON_ADD - Add wolfy
 * @property {string} INVITE_BUTTON_TOPGG - Top.gg
 * @property {string} INVITE_BUTTON_DASHBOARD - DASHBOARD
 * @property {string} FEEDBACK_TOO_LONG - <a:Wrong:812104211361693696> Please make your report brief and short! (MAX 1000 characters!)
 * @property {string} FEEDBACK_OWNER_UNAVAILABLE - 💢 Couldn't contact `owner`!
 * @property {string} FEEDBACK_ALREADY_SENT - <a:pp802:768864899543466006> Feedback already Send!
 * @property {string} FEEDBACK_COOLDOWN_MESSAGE - \❌ %username%, You already send your feedback earlier! You can send your feedback again after `%time%`
 * @property {string} FEEDBACK_SENT - <:Verify:841711383191879690> Feedback Sent!
 * @property {string} FEEDBACK_DMS_CLOSED - 💢 %username% is currently not accepting any Feedbacks right now via DMs.
 * @property {string} HELP_TITLE - Hi %username%, how can I help you?
 * @property {string} HELP_FEEDBACK_TIP - <a:Right:877975111846731847> Type `/feedback` to report a bug
 * @property {string} HELP_FULL_LIST_TIP - For a full list of commands use: `/help type: all`
 * @property {string} HELP_INFO_TITLE - <a:BackPag:776670895371714570> Information Commands
 * @property {string} HELP_SEARCH_TITLE - <a:Search:845681277922967572> Search Commands
 * @property {string} HELP_UTILITY_TITLE - <a:pp350:836168684379701279> Utility Commands
 * @property {string} HELP_MOD_TITLE - <a:pp989:853496185443319809> Moderator Commands
 * @property {string} HELP_FUN_TITLE - <a:pp434:836168673755660290> Fun Commands
 * @property {string} HELP_SETUP_TITLE - <:MOD:836168687891382312> Setup Commands
 * @property {string} HELP_BOT_TITLE - <a:pp90:853496126153031710> Bot Commands
 * @property {string} HELP_LEVEL_TITLE - <a:Up:853495519455215627> Level Commands
 * @property {string} HELP_ECONOMY_TITLE - <a:ShinyMoney:877975108038324224> Economy Commands
 * @property {string} HELP_ALL_COMMANDS_TITLE - <:Tag:836168214525509653> Wolfy's Full Commands List!
 * @property {string} HELP_ALL_COMMANDS_TIP - <:star:888264104026992670> You can get full details of each command by typing `%prefix%cmd <command name>`
 * @property {string} CMD_SERVER_STATS_DESC - Show server statistics
 * @property {string} CMD_WHOIS_DESC - Get information about a user
 * @property {string} CMD_MCUSER_DESC - Get Minecraft user information
 * @property {string} CMD_AVATAR_DESC - Get a user's avatar
 * @property {string} CMD_STEAM_DESC - Get Steam game information
 * @property {string} CMD_WEATHER_DESC - Get weather information for a location
 * @property {string} CMD_LYRICS_DESC - Get song lyrics
 * @property {string} CMD_SUGGESTION_DESC - Create a suggestion
 * @property {string} CMD_REMINDME_DESC - Set a reminder
 * @property {string} CMD_REPORT_DESC - Report a user or issue
 * @property {string} CMD_BIN_DESC - Create a code snippet
 * @property {string} CMD_TICKET_DESC - Create a support ticket
 * @property {string} CMD_RENAME_DESC - Rename a channel
 * @property {string} CMD_DELETE_DESC - Delete a channel
 * @property {string} CMD_CALC_DESC - Calculate a mathematical expression
 * @property {string} CMD_BAN_DESC - Ban a user from the server
 * @property {string} CMD_HACKBAN_DESC - Ban a user by ID without them being in the server
 * @property {string} CMD_SOFTBAN_DESC - Ban and immediately unban a user to clear their messages
 * @property {string} CMD_UNBAN_DESC - Unban a user from the server
 * @property {string} CMD_KICK_DESC - Kick a user from the server
 * @property {string} CMD_DM_DESC - Send a DM to a user
 * @property {string} CMD_WARN_DESC - Warn a user
 * @property {string} CMD_WARNINGS_DESC - View warnings for a user
 * @property {string} CMD_REMOVE_WARN_DESC - Remove a warning from a user
 * @property {string} CMD_SAY_DESC - Make the bot say something
 * @property {string} CMD_EMBED_DESC - Create an embed message
 * @property {string} CMD_EMBED_SETUP_DESC - Configure embed settings
 * @property {string} CMD_RESPOND_DESC - Set up auto-responses
 * @property {string} CMD_NICKNAME_DESC - Changes/Resets the nickname of the member
 * @property {string} CMD_SLOWMO_DESC - Set slowmode for a channel
 * @property {string} CMD_NUKE_DESC - Clone and delete a channel
 * @property {string} CMD_MUTE_DESC - Mute/Unmute someone from texting!
 * @property {string} CMD_TIMEOUT_DESC - Prevents a user from talking or connecting to a voice channel for a period of time
 * @property {string} CMD_LOCK_DESC - Unlock the permissions for @everyone to talk in the channel
 * @property {string} CMD_UNLOCK_DESC - Unlock the permissions for @everyone to talk in the channel
 * @property {string} CMD_VOICE_KICK_DESC - Kick a user from a voice channel
 * @property {string} CMD_CLEAR_DESC - Clear messages in a channel
 * @property {string} CMD_PURGE_DESC - Delete messages from a specific user
 * @property {string} CMD_INFRACTION_DESC - View infractions for a user
 * @property {string} CMD_8BALL_DESC - Ask the magic 8ball a question
 * @property {string} CMD_CLYDE_DESC - Send a message as Clyde
 * @property {string} CMD_FAST_DESC - Test your typing speed
 * @property {string} CMD_MEME_DESC - Get a random meme
 * @property {string} CMD_RPS_DESC - Play rock, paper, scissors
 * @property {string} CMD_TWEET_DESC - Create a fake tweet
 * @property {string} CMD_GUESS_DESC - Play a number guessing game
 * @property {string} CMD_LOGS_CHANNEL_DESC - Set logs channel
 * @property {string} CMD_REPORT_CHANNEL_DESC - Set the channel for reports
 * @property {string} CMD_SUGGESTION_CHANNEL_DESC - Set suggestion channel
 * @property {string} CMD_WELCOME_CHANNEL_DESC - Set the welcome channel
 * @property {string} CMD_LEAVER_CHANNEL_DESC - Set the leave channel
 * @property {string} CMD_TICKET_CHANNEL_DESC - Set the ticket channel
 * @property {string} CMD_WELCOME_MSG_DESC - Set the welcome message
 * @property {string} CMD_LEAVER_MSG_DESC - Set the leave message
 * @property {string} CMD_SELECT_MENU_ROLE_DESC - Create a role selection menu
 * @property {string} CMD_BAD_WORDS_DESC - Configure bad word filtering
 * @property {string} CMD_TOGGLE_DESC - Toggle command settings
 * @property {string} CMD_ANTILINK_DESC - Toggle anti-link protection
 * @property {string} CMD_SET_PREFIX_DESC - Set custom command prefix
 * @property {string} CMD_STATS_DESC - Shows bot statistics
 * @property {string} CMD_LINKS_DESC - Shows all bot special link vote/invite
 * @property {string} CMD_FEEDBACK_DESC - Send feedback about the bot
 * @property {string} CMD_HELP_DESC - Shows all available commands
 * @property {string} CMD_PING_DESC - Check bot's ping
 * @property {string} CMD_UPTIME_DESC - Replies with bot uptime!
 * @property {string} CMD_LEVEL_TOGGLE_DESC - Toggle the leveling system
 * @property {string} CMD_RANK_DESC - Show your current rank
 * @property {string} CMD_LEVEL_ROLES_DESC - Configure level roles
 * @property {string} CMD_ADD_ROLE_DESC - Add a role to level rewards
 * @property {string} CMD_EDIT_LEVEL_ROLE_DESC - Edit a level role
 * @property {string} CMD_CLEAR_XP_DESC - Clear XP from a user
 * @property {string} CMD_REMOVE_ROLE_DESC - Remove a role from level rewards
 * @property {string} CMD_PROFILE_DESC - Shows your profile card!
 * @property {string} CMD_SETBIO_DESC - Sets your profile card bio.
 * @property {string} CMD_SETBIRTHDAY_DESC - Sets your profile card birthday.
 * @property {string} CMD_QUEST_DESC - Refresh/Show current quests and the current progress.
 * @property {string} CMD_CREDITS_DESC - To check your credits balance in wallet
 * @property {string} CMD_TIP_DESC - Send a tip for your friend!
 * @property {string} CMD_COOKIE_DESC - To send cookie for a friend as a gift
 * @property {string} CMD_BEG_DESC - Want to earn money some more? Why don't you try begging, maybe someone will give you.
 * @property {string} CMD_DAILY_DESC - To get your daily reward
 * @property {string} CMD_FISH_DESC - Take your fishingpole and start fishing
 * @property {string} CMD_MINE_DESC - What you know about mining down in the deep?
 * @property {string} CMD_REGISTER_DESC - To register a bank account
 * @property {string} CMD_BANK_DESC - To check your credits balance in wallet
 * @property {string} CMD_DEPOSIT_DESC - Deposit credits from your wallet to safeguard
 * @property {string} CMD_WITHDRAW_DESC - Withdraw credits from your bank to your wallet
 * @property {string} CMD_INVENTORY_DESC - Show your inventory items! (currently support mining only)
 * @property {string} CMD_SELL_DESC - Sell item from your inventory and get some credits!
 * @property {string} CMD_MARKET_DESC - Open the economy market!
 * @property {string} CMD_BUY_DESC - To buy items from the market
 * @property {string} CMD_USE_DESC - Equips an item from your inventory.
 * @property {string} CMD_PREVIEW_ITEM_DESC - Check what you can buy from the shop.
 * @property {string} CMD_LEADERBOARD_DESC - Get a list for the 10 richest users that using wolfy
 * @property {string} RELEASE_NOTES_NONE - ⚠ No release notes found!
 * @property {string} RELEASE_NOTES_TITLE - <:Discord_Staff:911761250759893012> %username%(`V: %version%`) Changelogs!
 * @property {string} RELEASE_NOTES_UPDATES - Updates:  ```diff %updates%```
 * @property {string} RELEASE_NOTES_DATE - Date: <t:%timestamp%:R>
 * @property {string} STATS_TITLE - %username% Bot's stats
 * @property {string} STATS_GENERAL - General
 * @property {string} STATS_USERNAME - <:Bot:841711382739157043> Username: %username%
 * @property {string} STATS_TAG - <a:pp224:853495450111967253> Tag: %tag%
 * @property {string} STATS_ID - <:pp198:853494893439352842> ID: %id%
 * @property {string} STATS_CREATED_AT - 📆 Created At: %date%
 * @property {string} STATS_DEVELOPER - <:Developer:841321892060201021> Developer: %author%
 * @property {string} STATS_WEBSITE - <a:LightUp:776670894126006302> [Bot Website](%website%)
 * @property {string} STATS_VERSION - Version: `%version%`
 * @property {string} STATS_SYSTEM - <a:Settings:841321893750505533> System
 * @property {string} STATS_MEMORY_TOTAL - 🧠 Memory Total (heapTotal): [` %memory% MB `]
 * @property {string} STATS_MEMORY_USED - 🧠 Memory Used (heapUsed): [` %memory% MB `]
 * @property {string} STATS_OS - 🖥️ OS: %os% %release%
 * @property {string} STATS_DISCORD_JS - <:discordjs:805086222749007874>discordJS: v%version%
 * @property {string} STATS_NODE - <:nodejs:805092302011236422> Node: %version%
 * @property {string} STATS_CPU - <a:Right:877975111846731847> CPU: %cpu%
 * @property {string} STATS_COMMANDS - <:star:888264104026992670> Commands Stats
 * @property {string} STATS_TEXT_COMMANDS - <:tag:888265211327438908> Text Commands: `%count%`
 * @property {string} STATS_SLASH_COMMANDS - <:slash:888265211138674708> Slash Commands: `%count%`
 * @property {string} STATS_GUILDS - <a:pp594:768866151827767386> Guilds:
 * @property {string} STATS_CHANNELS - ⌨️ Channels:
 * @property {string} STATS_MEMBERS - <:pp833:853495153280155668> Members:
 * @property {string} STATS_VIEWING - > Viewing %username%'s stats for • [  %user% ]
 * @property {string} UPTIME - <a:pp399:768864799625838604> I have been online for `%days%` days, `%hours%` hours, `%minutes%` minutes, `%seconds%` seconds
 * @property {string} CMD_RELEASE_NOTES_DESC - Shows the latest release notes
 * @property {string} CMD_INVITE_DESC - Get bot invite links
 * @property {string} CMD_CREATE_ROLE_DESC - Create a new role
 * @property {string} CMD_AUTOMOD_DESC - Configure auto-moderation settings
 * @property {string} CMD_AUTOMOD_FLAGGED_WORDS_DESC - Set the flagged words protection!
 * @property {string} CMD_AUTOMOD_SPAM_MESSAGES_DESC - Set the anti spam messages protection!
 * @property {string} CMD_AUTOMOD_MENTION_LIMIT_DESC - The total number of role & user mentions allowed per message
 * @property {string} CMD_AUTOMOD_KEYWORDS_DESC - Block given keywords from being used
 * @property {string} CMD_AUTOMOD_OPT_ACTION_DESC - Action you want to perform when the keyword is detected
 * @property {string} CMD_AUTOMOD_OPT_CHANNEL_DESC - The channel you want to send logs in
 * @property {string} CMD_AUTOMOD_OPT_MENTIONS_DESC - The total number of role & user mentions allowed per message
 * @property {string} CMD_AUTOMOD_OPT_WORDS_DESC - The words to block (ex: word1, word2)
 * @property {string} CMD_AUTOMOD_ACTION_BLOCK - block message
 * @property {string} CMD_AUTOMOD_ACTION_ALERT - send alert
 * @property {string} CMD_AUTOMOD_ACTION_TIMEOUT - Timeout
 * @property {string} CMD_AUTOMOD_ACTION_PREVENT - prevents a member from using text, voice, or other interactions
 * @property {string} CMD_AUTOMOD_SUCCESS_CREATE - Successfully created the new auto-moderation rule for `%guild%`
 * @property {string} CMD_AUTOMOD_SUCCESS_UPDATE - Successfully updated the auto-moderation rule for `%guild%`
 * @property {string} CMD_AUTOMOD_ERROR_CREATE - There was an error while creating the new auto-moderation rule: %error%
 * @property {string} CMD_AUTOMOD_ERROR_UPDATE - There was an error while updating the auto-moderation rule: %error%
 * @property {string} CMD_AUTOMOD_MESSAGE_FLAGGED - ⚠️ This message was blocked by %bot%, as it contains profanity, sexual content, or slurs!
 * @property {string} CMD_AUTOMOD_MESSAGE_SPAM - ⚠️ Spamming messages is not allowed in this server!
 * @property {string} CMD_AUTOMOD_MESSAGE_MENTIONS - ⚠️ Mentions spam is not allowed in this server!
 * @property {string} CMD_NICKNAME_OPT_NICKNAME - The new nickname
 * @property {string} CMD_NICKNAME_OPT_TARGET - A user to change nickname for
 * @property {string} CMD_NICKNAME_SUCCESS_RESET - Successfully reseted the nickname for %user%!
 * @property {string} CMD_NICKNAME_SUCCESS_CHANGE - Successfully changed %user% nickname to `%nickname%`!
 * @property {string} CMD_NICKNAME_ERROR_NOT_FOUND - User could not be found! Please ensure the supplied ID is valid.
 * @property {string} CMD_NICKNAME_ERROR_BOT - You cannot change nickname for me!
 * @property {string} CMD_NICKNAME_ERROR_OWNER - You cannot change nickname of the owner!
 * @property {string} CMD_NICKNAME_ERROR_DEVELOPER - You cannot change nickname for my developer through me!
 * @property {string} CMD_NICKNAME_ERROR_PERMISSION - You can't change nickname for that user! He/She has a higher role than yours
 * @property {string} CMD_NICKNAME_ERROR_CHANGE - Unable to change the nickname for %user%!
 * @property {string} CMD_TIMEOUT_OPT_TARGET - The user to timeout
 * @property {string} CMD_TIMEOUT_OPT_TIME - The duration of the timeout (e.g., 5h), or type "0" to remove timeout
 * @property {string} CMD_TIMEOUT_OPT_REASON - The reason for the timeout
 * @property {string} CMD_TIMEOUT_SUCCESS_TIMEOUT - Successfully timed out the user %user% for %duration%
 * @property {string} CMD_TIMEOUT_SUCCESS_REMOVE - Successfully removed timeout for the user %user%.
 * @property {string} CMD_TIMEOUT_ERROR_NOT_FOUND - User could not be found! Please ensure the supplied ID is valid.
 * @property {string} CMD_TIMEOUT_ERROR_SELF - You cannot timeout yourself!
 * @property {string} CMD_TIMEOUT_ERROR_BOT - You cannot timeout me!
 * @property {string} CMD_TIMEOUT_ERROR_OWNER - You cannot timeout the server owner!
 * @property {string} CMD_TIMEOUT_ERROR_DEVELOPER - You cannot timeout my developer through me!
 * @property {string} CMD_TIMEOUT_ERROR_PERMISSION - You cannot timeout this user! They have a higher or equal role to yours.
 * @property {string} CMD_TIMEOUT_ERROR_INVALID_TIME - Please provide a valid time for the timeout!
 * @property {string} CMD_TIMEOUT_ERROR_EXECUTE - Unable to timeout %user%! [`%error%`]
 * @property {string} CMD_LOCK_OPT_CHANNEL - Channel to unlock
 * @property {string} CMD_LOCK_OPT_MESSAGE - Message to send to the locked channel
 * @property {string} CMD_LOCK_SUCCESS - ✅ Locked channel %channel%
 * @property {string} CMD_LOCK_ERROR_INVALID_CHANNEL - Please provide a valid channel ID.
 * @property {string} CMD_LOCK_ERROR_PERMISSION - I need permission to manage channels in %channel%.
 * @property {string} CMD_LOCK_ERROR_ALREADY_LOCKED - The channel %channel% is already locked.
 * @property {string} CMD_LOCK_ERROR_EXECUTE - 💢 [`%error%`] The channel could not be locked.
 * @property {string} CMD_LOCK_MESSAGE_TITLE - 🔒 Channel locked
 * @property {string} CMD_UNLOCK_OPT_CHANNEL - Channel to unlock
 * @property {string} CMD_UNLOCK_OPT_MESSAGE - Message to send to the unlocked channel
 * @property {string} CMD_UNLOCK_SUCCESS - ✅ Unlocked channel %channel%
 * @property {string} CMD_UNLOCK_ERROR_INVALID_CHANNEL - Please provide a valid channel ID.
 * @property {string} CMD_UNLOCK_ERROR_PERMISSION - I need permission to manage channels in %channel%.
 * @property {string} CMD_UNLOCK_ERROR_ALREADY_UNLOCKED - The channel %channel% is already unlocked.
 * @property {string} CMD_UNLOCK_ERROR_EXECUTE - 💢 [`%error%`] The channel could not be unlocked.
 * @property {string} CMD_UNLOCK_MESSAGE_TITLE - 🔓 Channel Unlocked
 * @property {string} CMD_LEVEL_BOARD_DESC - Show level leaderboard
 * @property {string} CMD_PRAYS_DESC - Get prayer times
 * @property {string} CMD_PANEL_DESC - Configure bot settings panel
 * @property {string} CMD_LOGS_DESC - Configure logging settings
 * @property {string} CMD_MANAGE_LANGUAGE_DESC - Change server language
 * @property {string} CMD_BLOCK_COMMAND_DESC - Block/unblock commands
 * @property {string} CMD_SUGGESTION_TIMER_DESC - Set suggestion cooldown
 * @property {string} CMD_SET_AVATAR_DESC - Set bot's avatar
 * @property {string} CMD_RELOAD_DESC - Reload bot commands
 * @property {string} OPT_TARGET - The target user
 * @property {string} OPT_REASON - The reason for this action
 * @property {string} OPT_TIME - The duration of the action
 * @property {string} OPT_CHOICE - Your choice
 * @property {string} OPT_QUERY - Search query
 * @property {string} OPT_HIDE - Hide the output
 * @property {string} OPT_AMOUNT - Amount to transfer
 * @property {string} OPT_CHANNEL - The target channel
 * @property {string} OPT_COMMAND - The command to manage
 * @property {string} OPT_LANGUAGE - The language to set
 * @property {string} OPT_PREFIX - The new prefix
 * @property {string} SUCCESS_ROLE_CREATED - Successfully created role %role%
 * @property {string} SUCCESS_CHANNEL_LOCKED - Successfully locked channel %channel%
 * @property {string} SUCCESS_CHANNEL_UNLOCKED - Successfully unlocked channel %channel%
 * @property {string} SUCCESS_MESSAGES_CLEARED - Successfully cleared %count% messages
 * @property {string} SUCCESS_USER_BANNED - Successfully banned %user%
 * @property {string} SUCCESS_USER_UNBANNED - Successfully unbanned %user%
 * @property {string} SUCCESS_USER_KICKED - Successfully kicked %user%
 * @property {string} SUCCESS_NICKNAME_CHANGED - Successfully changed %user%'s nickname to %nickname%
 * @property {string} SUCCESS_USER_TIMEOUT - Successfully timed out %user% for %duration%
 * @property {string} SUCCESS_USER_WARNED - Successfully warned %user%
 * @property {string} SUCCESS_CREDITS_TRANSFERRED - Successfully transferred %amount% credits to %user%
 * @property {string} SUCCESS_DAILY_CLAIMED - Successfully claimed %amount% daily credits
 * @property {string} SUCCESS_REMINDER_SET - Successfully set reminder for %time%
 * @property {string} SUCCESS_LANGUAGE_CHANGED - Successfully changed language to %language%
 * @property {string} SUCCESS_PREFIX_CHANGED - Successfully changed prefix to %prefix%
 * @property {string} SUCCESS_COMMAND_BLOCKED - Successfully blocked command %command%
 * @property {string} SUCCESS_COMMAND_UNBLOCKED - Successfully unblocked command %command%
 * @property {string} ERROR_INVALID_USER - Invalid user provided
 * @property {string} ERROR_INVALID_CHANNEL - Invalid channel provided
 * @property {string} ERROR_INVALID_AMOUNT - Invalid amount provided
 * @property {string} ERROR_INSUFFICIENT_PERMISSIONS - You don't have permission to use this command
 * @property {string} ERROR_BOT_INSUFFICIENT_PERMISSIONS - I don't have permission to perform this action
 * @property {string} ERROR_USER_NOT_FOUND - User not found
 * @property {string} ERROR_CHANNEL_NOT_FOUND - Channel not found
 * @property {string} ERROR_INVALID_DURATION - Invalid duration provided
 * @property {string} ERROR_INVALID_LANGUAGE - Invalid language provided
 * @property {string} ERROR_INVALID_PREFIX - Invalid prefix provided
 * @property {string} ERROR_COMMAND_NOT_FOUND - Command not found
 * @property {string} ERROR_ALREADY_BLOCKED - Command is already blocked
 * @property {string} ERROR_NOT_BLOCKED - Command is not blocked
 * @property {string} ERROR_INSUFFICIENT_CREDITS - You don't have enough credits
 * @property {string} ERROR_DAILY_ALREADY_CLAIMED - You have already claimed your daily credits
 * @property {string} ERROR_REMINDER_TOO_LONG - Reminder time cannot be longer than 7 days
 * @property {string} ERROR_REMINDER_TOO_SHORT - Reminder time must be at least 1 minute
 */

/**
 * @typedef {Object} PlaceholderTypes
 * @property {{ error: string }} ERR_DB
 * @property {{ role: string }} CREATING_ROLE_FAILED_250
 * @property {{ role: string, err_name: string }} CREATING_ROLE_FAILED
 * @property {{ user: string, data: string }} USER_DATA_404
 * @property {{ data: string }} SERVER_DATA_404
 * @property {{ permissions: string }} BOT_PERMS_REQ
 * @property {{ commandName: string }} CMD_404
 * @property {{ commandName: string }} CMD_BLOCKED
 * @property {{ target: string }} NOT_VALID
 * @property {{ place: string }} NOT_THEPLACE
 * @property {{ data: string }} DATA_404
 * @property {{ element: string }} CANNOT_EDIT
 * @property {{ number: string }} NOT_VALID_MESSAGE
 * @property {{ group: string }} CANNOT_MANAGE
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
 * @property {{ element: string, group: string }} CREATION_SUCCESS
 * @property {{ element: string, group: string }} DELETION_SUCCESS
 * @property {{ element: string, group: string }} UPDATE_SUCCESS
 * @property {{ action: string }} NO_ID
 * @property {{ action: string }} CANNOT_MODERATE_SELF
 * @property {{ action: string }} CANNOT_MODERATE_BOT
 * @property {{ action: string }} CANNOT_MODERATE_OWNER
 * @property {{ action: string }} CANNOT_MODERATE_DEV
 * @property {{ action: string }} CANNOT_MODERATE_HIGHER
 * @property {{ action: string }} CANNOT_MODERATE
 * @property {{ action_done: string, target: string }} MODERATE_SUCCESS
 * @property {{ action: string, reason: string }} MODERATE_REASON
 * @property {{ moderator: string, moderatorID: string }} MODERATE_MODERATOR
 * @property {{ timestamp: string }} MODERATE_TIME
 * @property {{ action_done: string }} MODERATED_ALREADY
 * @property {{ group: string }} NOT_VALIDID
 * @property {{ count: string }} CLEAR_SUCCESS
 * @property {{ action_done: string, channel: string }} LOCK_UNLOCK_SUCCESS
 * @property {{ action_done: string }} LOCKED_UNLOCKED_ALREADY
 * @property {{ user: string }} CANNOT_DM
 * @property {{ action_done: string, user: string }} MUTE_UNMUTE_SUCCESS
 * @property {{ amount: string, user: string }} PURGE_SUCCESS
 * @property {{ action: string, time: string }} CHANNEL_MODERATE_AFTERTIME
 * @property {{ count: string }} WARNINGS
 * @property {{ time: string }} SLOWMODE_SET
 * @property {{ PREFIX: string, SERVERPREFIX: string }} PREFIX
 * @property {{ prefix: string, commandName: string, commandUsage: string }} CMD_USAGE
 * @property {{ query: string }} NO_RESULT
 * @property {{ query: string }} NO_INFO
 * @property {{ ping: string, ws_ping: string }} PING
 * @property {{ username: string }} INVITE_TITLE
 * @property {{ username: string }} INVITE_DESCRIPTION
 * @property {{ username: string, time: string }} FEEDBACK_COOLDOWN_MESSAGE
 * @property {{ username: string }} FEEDBACK_DMS_CLOSED
 * @property {{ username: string }} HELP_TITLE
 * @property {{ prefix: string }} HELP_ALL_COMMANDS_TIP
 * @property {{ username: string, version: string }} RELEASE_NOTES_TITLE
 * @property {{ updates: string }} RELEASE_NOTES_UPDATES
 * @property {{ timestamp: string }} RELEASE_NOTES_DATE
 * @property {{ username: string }} STATS_TITLE
 * @property {{ username: string }} STATS_USERNAME
 * @property {{ tag: string }} STATS_TAG
 * @property {{ id: string }} STATS_ID
 * @property {{ date: string }} STATS_CREATED_AT
 * @property {{ author: string }} STATS_DEVELOPER
 * @property {{ website: string }} STATS_WEBSITE
 * @property {{ version: string }} STATS_VERSION
 * @property {{ memory: string }} STATS_MEMORY_TOTAL
 * @property {{ memory: string }} STATS_MEMORY_USED
 * @property {{ os: string, release: string }} STATS_OS
 * @property {{ version: string }} STATS_DISCORD_JS
 * @property {{ version: string }} STATS_NODE
 * @property {{ cpu: string }} STATS_CPU
 * @property {{ count: string }} STATS_TEXT_COMMANDS
 * @property {{ count: string }} STATS_SLASH_COMMANDS
 * @property {{ username: string, user: string }} STATS_VIEWING
 * @property {{ days: string, hours: string, minutes: string, seconds: string }} UPTIME
 * @property {{ guild: string }} CMD_AUTOMOD_SUCCESS_CREATE
 * @property {{ guild: string }} CMD_AUTOMOD_SUCCESS_UPDATE
 * @property {{ error: string }} CMD_AUTOMOD_ERROR_CREATE
 * @property {{ error: string }} CMD_AUTOMOD_ERROR_UPDATE
 * @property {{ bot: string }} CMD_AUTOMOD_MESSAGE_FLAGGED
 * @property {{ user: string }} CMD_NICKNAME_SUCCESS_RESET
 * @property {{ user: string, nickname: string }} CMD_NICKNAME_SUCCESS_CHANGE
 * @property {{ user: string }} CMD_NICKNAME_ERROR_CHANGE
 * @property {{ user: string, duration: string }} CMD_TIMEOUT_SUCCESS_TIMEOUT
 * @property {{ user: string }} CMD_TIMEOUT_SUCCESS_REMOVE
 * @property {{ user: string, error: string }} CMD_TIMEOUT_ERROR_EXECUTE
 * @property {{ channel: string }} CMD_LOCK_SUCCESS
 * @property {{ channel: string }} CMD_LOCK_ERROR_PERMISSION
 * @property {{ channel: string }} CMD_LOCK_ERROR_ALREADY_LOCKED
 * @property {{ error: string }} CMD_LOCK_ERROR_EXECUTE
 * @property {{ channel: string }} CMD_UNLOCK_SUCCESS
 * @property {{ channel: string }} CMD_UNLOCK_ERROR_PERMISSION
 * @property {{ channel: string }} CMD_UNLOCK_ERROR_ALREADY_UNLOCKED
 * @property {{ error: string }} CMD_UNLOCK_ERROR_EXECUTE
 * @property {{ role: string }} SUCCESS_ROLE_CREATED
 * @property {{ channel: string }} SUCCESS_CHANNEL_LOCKED
 * @property {{ channel: string }} SUCCESS_CHANNEL_UNLOCKED
 * @property {{ count: string }} SUCCESS_MESSAGES_CLEARED
 * @property {{ user: string }} SUCCESS_USER_BANNED
 * @property {{ user: string }} SUCCESS_USER_UNBANNED
 * @property {{ user: string }} SUCCESS_USER_KICKED
 * @property {{ user: string, nickname: string }} SUCCESS_NICKNAME_CHANGED
 * @property {{ user: string, duration: string }} SUCCESS_USER_TIMEOUT
 * @property {{ user: string }} SUCCESS_USER_WARNED
 * @property {{ amount: string, user: string }} SUCCESS_CREDITS_TRANSFERRED
 * @property {{ amount: string }} SUCCESS_DAILY_CLAIMED
 * @property {{ time: string }} SUCCESS_REMINDER_SET
 * @property {{ language: string }} SUCCESS_LANGUAGE_CHANGED
 * @property {{ prefix: string }} SUCCESS_PREFIX_CHANGED
 * @property {{ command: string }} SUCCESS_COMMAND_BLOCKED
 * @property {{ command: string }} SUCCESS_COMMAND_UNBLOCKED
 */

module.exports = {};