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
 * @property {string} INTERACTION_TIMEOUT - 💢 Interaction timed out. Please try again.
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
 * @property {string} BUTTON_YES - Yes
 * @property {string} BUTTON_NO - No
 * @property {string} BUTTON_CANCEL - Cancel
 * @property {string} BUTTON_CONFIRM - Confirm
 * @property {string} NO_ID - \❌ | Please type the id or mention the user to %action%.
 * @property {string} USER_NOT_FOUND - \❌ | User could not be found! Please ensure the supplied ID is valid.
 * @property {string} CANNOT_MODERATE_SELF - \❌ | You cannot %action% yourself!
 * @property {string} CANNOT_MODERATE_BOT - \❌ | You cannot %action% me!
 * @property {string} CANNOT_MODERATE_OWNER - \❌ | You cannot %action% a server owner!
 * @property {string} CANNOT_MODERATE_DEV - \❌ | You cannot %action% my developer through me!
 * @property {string} CANNOT_MODERATE_HIGHER - \❌ | You can't %action% that user because he/she has a higher role than yours!
 * @property {string} CANNOT_MODERATE - \❌ | I couldn't %action% that user!
 * @property {string} MODERATE_SUCCESS - Successfully %action_done% the user from %target%!
 * @property {string} MODERATED_SUCCESSFULLY - Successfully %action_done% the %target%!
 * @property {string} MODERATE_REASON - - %action% reason: `%reason%`
 * @property {string} MODERATE_MODERATOR - - Moderator: %moderator% (%moderatorID%)
 * @property {string} MODERATE_TIME - - At: <t:%timestamp%>
 * @property {string} MODERATED_ALREADY - \❌ | User is already %action_done%!
 * @property {string} NOT_VALIDID - 💢 Please provide a valid %group% ID!
 * @property {string} CLEAR_QUANTITY - 💢 | Please provide the quantity of messages to be deleted which must be greater than two (2) and less than one hundred (100)
 * @property {string} CLEAR_SUCCESS - <a:Fix:1267280059517894737> Successfully deleted `%count%` messages from this channel!
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
 * @property {string} CMD_WARN_DM_TITLE - You have been warned by %user%
 * @property {string} CMD_WARN_DM_DESCRIPTION - You have been warned for %reason% by %moderator%!  You now have %count% warning%s% in total.
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
 * @property {string} CMD_VOICE_KICK_DESC - Kick all users that are connected to the current channel
 * @property {string} CMD_CLEAR_DESC - Clear messages in a channel
 * @property {string} CMD_PURGE_DESC - Delete messages from a specific user
 * @property {string} CMD_INFRACTION_DESC - View infractions for a user
 * @property {string} CMD_8BALL_DESC - Ask the magic 8ball a question
 * @property {string} CMD_CLYDE_DESC - Send a message as Clyde
 * @property {string} CMD_FAST_DESC - Test your typing speed
 * @property {string} CMD_MEME_DESC - Get a random meme
 * @property {string} CMD_RPS_DESC - Play rock, paper, scissors
 * @property {string} CMD_TWEET_DESC - Create a fake tweet
 * @property {string} CMD_GUESS_DESC - Start playing a number guessing game
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
 * @property {string} CMD_CLYDE_INPUT_TOO_LONG - <a:Wrong:812104211361693696> Sorry you can't type more than `100 letters!`
 * @property {string} CMD_CLYDE_ERROR - <a:Error:836169051310260265> | Incorrect input, please try again!
 * @property {string} CMD_GUESS_ALREADY_RUNNING - \❌ There is a game already running in this guild!
 * @property {string} CMD_GUESS_STARTED - <a:Right:877975111846731847> Guess the number game has started!  Hint: ```diff + Try to guess the number that is between (1-500) - You have 30 seconds to find it! ```
 * @property {string} CMD_GUESS_WINNER - <a:Fire:841321886365122660> %user% WON the Game!  <:star:888264104026992670> Game Stats: ``` • Winner: %username% • Number: %number% • Participants Count: %count% • Participants: %participants% ```
 * @property {string} CMD_GUESS_SMALLER - <a:Nnno:853494186002481182> The number (`%number%`) is Smaller than my number, try again!
 * @property {string} CMD_GUESS_BIGGER - <a:Nnno:853494186002481182> The number (`%number%`) is Bigger than my number, try again!
 * @property {string} CMD_GUESS_TIMEOUT - <:error:888264104081522698> You lose! The number was: (`%number%`)
 * @property {string} CMD_RPS_INVALID_CHOICE - You must select a valid option! `i.e.` %options%.
 * @property {string} CMD_RPS_RESULT - Your choice was `%user_choice% %user_emoji%`, my choice was `%bot_choice% %bot_emoji%`. %result%
 * @property {string} CMD_RPS_WIN - You win!
 * @property {string} CMD_RPS_LOSE - You lose!
 * @property {string} CMD_RPS_DRAW - It's a draw!
 * @property {string} ECONOMY_WALLET_TITLE - 💰 Wallet
 * @property {string} ECONOMY_WALLET_DESCRIPTION - <a:ShinyMoney:877975108038324224> Credits balance is `%credits%`! %bank_balance%  ━━━━━━━━━━━━━━ %daily_status%
 * @property {string} ECONOMY_BANK_BALANCE - 🏦 Bank
 * @property {string} ECONOMY_NO_BANK - \❌ %username%, Don't have a bank yet! To create one, type `%prefix%register`.
 * @property {string} ECONOMY_DAILY_CLAIMED - <:Success:888264105851490355> Daily reward is claimed!
 * @property {string} ECONOMY_DAILY_AVAILABLE - \⚠️ Daily reward is available!
 * @property {string} ECONOMY_DAILY_ALREADY_TITLE - ❌ Daily reward already claimed!
 * @property {string} ECONOMY_DAILY_ALREADY_DESC - %username%, You've already claimed your daily reward! You can claim again `%time%`
 * @property {string} ECONOMY_DAILY_CLAIMED_TITLE - <a:ShinyCoin:853495846984876063> Claimed daily!
 * @property {string} ECONOMY_DAILY_CLAIMED_DESC - <a:ShinyMoney:877975108038324224> %username%, You received %amount% from daily reward!%item_reward%%streak_status%
 * @property {string} ECONOMY_DAILY_ITEM_REWARD -  \✔️  You received: %item_name% - %item_desc% from daily rewards.
 * @property {string} ECONOMY_DAILY_STREAK_LOST -  ⚠️ Streak Lost: You haven't got your succeeding daily reward.
 * @property {string} ECONOMY_DAILY_STREAK_CURRENT -  <:fire:939372984274157689> Current Daily Streak (`x%streak%`)
 * @property {string} ECONOMY_DAILY_FOOTER - You can claim your daily after 24h.
 * @property {string} ECONOMY_QUEST_REWARD - \💰 You've completed a quest and received %reward% Credits as reward!
 * @property {string} ECONOMY_QUEST_TITLE - Daily Quests
 * @property {string} ECONOMY_QUEST_DESCRIPTION - Your daily quests will be refreshed in `%refresh_time%` You completed %completed% out of 4 from your daily quests. Once you complete all the quests type `%prefix%quest claim` to claim your final reward!  <:star:888264104026992670> Your Progress:
 * @property {string} ECONOMY_QUEST_NAME_FORMAT - %quest_name% (%current%/%total%)
 * @property {string} ECONOMY_QUEST_REWARDS - Rewards: <a:ShinyMoney:877975108038324224> `%amount%` credits
 * @property {string} ECONOMY_QUEST_REFRESHED - ✅ %username%, your daily quests have been refreshed!
 * @property {string} ECONOMY_QUEST_NOT_COMPLETED - ⚠️ Not enough quests completed! You must complete at least 4 of your daily quests. %completed_message%
 * @property {string} ECONOMY_QUEST_PARTIAL_COMPLETE - You currently completed %completed% out of 4
 * @property {string} ECONOMY_QUEST_ALREADY_CLAIMED - ⚠️ %username%, you have already claimed your daily quest reward!
 * @property {string} ECONOMY_QUEST_CLAIM_TITLE - 🎁 Daily Quest Reward
 * @property {string} ECONOMY_QUEST_CLAIM_DESC - 🎉 %username%, you received %amount% from daily quest reward!%item_reward%
 * @property {string} ECONOMY_QUEST_CLAIM_FOOTER - Complete your daily quests for more rewards!
 * @property {string} ECONOMY_QUEST_ITEM_REWARD -  \✔️ You received: %item_name% - %item_desc% as a bonus reward.
 * @property {string} FOOTER_COPYRIGHT - %user_tag% | ©️%year% Wolfy
 * @property {string} ECONOMY_NO_BANK_ACCOUNT - \❌ %username%, You don't have a bank yet! To create one, use `/register`.
 * @property {string} ECONOMY_BANK_STATUS - 🏦 %username%, you have <a:ShinyMoney:877975108038324224> %credits% credits in your bank account!  ⚠️ Check your bank after `%time%` to get your reward! (5% + 150)
 * @property {string} ECONOMY_BANK_OVERFLOW - \❌ %username%, Your bank is overflowed please withdraw some money from your bank.
 * @property {string} ECONOMY_BANK_NEW_BALANCE - 🏦 %username%, Your new balance is <a:ShinyMoney:877975108038324224> %credits% credits in your bank account!  ⚠️ Check your bank again after `%time%` to get your next reward! (5% + 150)
 * @property {string} ECONOMY_LEADERBOARD_AUTHOR - %username%'s Leaderboard
 * @property {string} ECONOMY_LEADERBOARD_TITLE - <a:ShinyMoney:877975108038324224> Credits Leaderboard!
 * @property {string} ECONOMY_LEADERBOARD_ENTRY - %position% %username%
 * @property {string} ECONOMY_LEADERBOARD_FOOTER - Your position is %position%!
 * @property {string} ECONOMY_DB_RETRIEVE_ERROR - `❌ [DATABASE_ERR]:` Unable to retrieve data from the database. Please try again later!
 * @property {string} ECONOMY_TRANSFER_SELF - <a:Wrong:812104211361693696> | %user%, You cannot transfer credits to yourself!
 * @property {string} ECONOMY_TRANSFER_BOT - <a:Wrong:812104211361693696> | %user%, You cannot transfer credits to me!
 * @property {string} ECONOMY_TRANSFER_INVALID_AMOUNT - \❌ %username%, `%amount%` is not a valid amount!
 * @property {string} ECONOMY_TRANSFER_AMOUNT_LIMIT - \❌ %username%, only valid amount to transfer is between 100 and 50,000!
 * @property {string} ECONOMY_TRANSFER_INSUFFICIENT - \❌ %username%, Insufficient credits! You only have %credits% in your wallet! (10% fee applies)
 * @property {string} ECONOMY_TRANSFER_CONFIRM - <a:iNFO:853495450111967253> %username%, Are you sure you want to transfer %amount% to %recipient%(10% fee applies)? Your new balance will be %balance%! `(y/n)`
 * @property {string} ECONOMY_TRANSFER_CANCELLED - <a:Wrong:812104211361693696> | %user%, Cancelled the `transfer` command!
 * @property {string} ECONOMY_TRANSFER_DM - ```%sender% transferred %amount% to you %reason%```
 * @property {string} ECONOMY_TRANSFER_SUCCESS - <a:Money:836169035191418951> %username%, Successfully transferred `%amount%` to %recipient%!
 * @property {string} ECONOMY_DB_SAVE_ERROR - \❌ `[DATABASE_ERR]:` Unable to save the document to the database, please try again later!
 * @property {string} CMD_LEVEL_BOARD_DESC - Show level leaderboard
 * @property {string} CMD_PRAYS_DESC - Get prayer times
 * @property {string} SETUP_SELECT_LANGUAGE - Please select a language from the dropdown menu below:
 * @property {string} SETUP_LANGUAGE_OPTION_DESC - Select %language% as %bot_name% language
 * @property {string} CMD_PANEL_DESC - Configure bot settings panel
 * @property {string} CMD_LOGS_DESC - Configure logging settings
 * @property {string} CMD_MANAGE_LANGUAGE_DESC - Change server language
 * @property {string} CMD_BLOCK_COMMAND_DESC - Block/unblock commands
 * @property {string} CMD_SET_PREFIX_DESC - Set custom command prefix
 * @property {string} CMD_SUGGESTION_TIMER_DESC - Set suggestion cooldown
 * @property {string} SETUP_PREFIX_MISSING - \❌ No new prefix detected! Please type the new prefix.
 * @property {string} SETUP_PREFIX_TOO_LONG - \❌ Invalid prefix. Prefixes cannot be longer than %max_length% characters!
 * @property {string} SETUP_PREFIX_SUCCESS - \✔️ %username%, Successfully %action%
 * @property {string} SETUP_PREFIX_REMOVED - removed this server's prefix! To add prefix, simply pass the desired prefix as parameter.
 * @property {string} SETUP_PREFIX_SET - set this server's prefix to `%prefix%`! To remove the prefix, just pass in `reset` or `clear` as parameter.
 * @property {string} SETUP_BLOCK_NO_CMD - \❌ %username%, Please provide a command name to block/unblock.
 * @property {string} SETUP_BLOCK_NO_ACTION - \❌ %username%, Please provide an action (block/unblock).
 * @property {string} SETUP_BLOCK_NOT_FOUND - \❌ %username%, Command `%command%` not found!
 * @property {string} SETUP_BLOCK_ALREADY_BLOCKED - \❌ %username%, Command `%command%` is already blocked!
 * @property {string} SETUP_BLOCK_ALREADY_UNBLOCKED - \❌ %username%, Command `%command%` is already unblocked!
 * @property {string} SETUP_BLOCK_SUCCESS - \✔️ %username%, Successfully %action% command `%command%`!
 * @property {string} SETUP_BLOCK_CANNOT_BLOCK_SELF - \❌ You cannot block `%command%`!
 * @property {string} SETUP_BLOCK_NO_BLOCKED - \❌ There are no blocked commands in this server!
 * @property {string} SETUP_BLOCK_LIST - <a:Mod:853496185443319809> Blocked commands: %commands%
 * @property {string} SETUP_BLOCK_CLEAR_SUCCESS - <a:Mod:853496185443319809> All blocked commands have been successfully cleared!
 * @property {string} SETUP_LOGS_CHANNEL_MISSING - \❌ %username%, Please provide a channel to set as logs channel!
 * @property {string} SETUP_LOGS_CHANNEL_INVALID - \❌ %username%, Please provide a valid channel!
 * @property {string} SETUP_LOGS_CHANNEL_SUCCESS - Successfully set the Logs channel to %channel%!
 * @property {string} SETUP_LOGS_CHANNEL_REMOVED - \✔️ %username%, Successfully removed logs channel!
 * @property {string} SETUP_LOGS_CHANNEL_NO_PERMS - \❌ I need you to give me permission to send messages on %channel% and try again.
 * @property {string} SETUP_LOGS_CHANNEL_DISABLED - \⚠️ Logs channel is disabled! To enable, type `/toggle logs`
 * @property {string} SETUP_LOGS_CHANNEL_DISABLE_TIP - To disable this feature, use the `/toggle logs` command.
 * @property {string} SETUP_SUGGESTION_CHANNEL_MISSING - \❌ %username%, Please provide a channel to set as suggestion channel!
 * @property {string} SETUP_SUGGESTION_CHANNEL_INVALID - \❌ %username%, Please provide a valid channel!
 * @property {string} SETUP_SUGGESTION_CHANNEL_SUCCESS - Successfully set the Suggestions channel to %channel%!
 * @property {string} SETUP_SUGGESTION_CHANNEL_REMOVED - \✔️ %username%, Successfully removed suggestion channel!
 * @property {string} SETUP_SUGGESTION_CHANNEL_NO_PERMS - \❌ I need you to give me permission to send messages on %channel% and try again.
 * @property {string} SETUP_SUGGESTION_CHANNEL_DISABLED - \⚠️ Suggestions channel is disabled! To enable, type `/toggle suggestions`
 * @property {string} SETUP_SUGGESTION_CHANNEL_ALREADY_SET - \❌ Suggestions channel is already set to %channel%!
 * @property {string} SETUP_SUGGESTION_TIMER_MISSING - \❌ %username%, Please provide a time for suggestion cooldown!
 * @property {string} SETUP_SUGGESTION_TIMER_INVALID - \❌ %username%, Please provide a valid time in seconds (min 30, max 3600)!
 * @property {string} SETUP_SUGGESTION_TIMER_SUCCESS - \✔️ %username%, Successfully set suggestion cooldown to %time%!
 * @property {string} SETUP_SUGGESTION_TIMER_DISABLED - \❌ Suggestions are not enabled! To enable, type `/toggle suggestions`
 * @property {string} SETUP_TOGGLE_NO_FEATURE - \❌ %username%, Please provide a feature to toggle!
 * @property {string} SETUP_TOGGLE_FEATURE_NOT_FOUND - \❌ %username%, Feature `%feature%` not found!
 * @property {string} SETUP_TOGGLE_SUCCESS - \✔️ %username%, Successfully %status% feature `%feature%`!
 * @property {string} SETUP_TOGGLE_NO_CHANNEL - \❌ You didn't set %feature% channel yet!
 * @property {string} SETUP_TOGGLE_NEXT_ACTION - To %action% this feature, use the `/toggle %feature%` command.
 * @property {string} SETUP_PANEL_TITLE - Settings Panel for %guild_name%
 * @property {string} SETUP_PANEL_DESCRIPTION - Use the buttons below to configure various settings for your server.
 * @property {string} SETUP_PANEL_LOGGING - Logging Settings
 * @property {string} SETUP_PANEL_MODERATION - Moderation Settings
 * @property {string} SETUP_PANEL_FEATURES - Features Settings
 * @property {string} SETUP_PANEL_ECONOMY - Economy Settings
 * @property {string} SETUP_PANEL_LEVELS - Leveling Settings
 * @property {string} SETUP_PANEL_FOOTER - Settings Panel | Page %page% of %total_pages%
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
 * @property {string} MOD_DM_SUCCESS - <a:Notification:811283631380234250> Successfully sent DM to %user%
 * @property {string} MOD_DM_ERROR - <a:Error:836169051310260265> Unable to send DM to %user%! They may have DMs disabled.
 * @property {string} CMD_WARN_LIST_TITLE - %user%'s Warnings List
 * @property {string} CMD_WARN_LIST_MODERATOR - Warning by %moderator% (ID: %id%)
 * @property {string} CMD_WARN_LIST_UNKNOWN - Warning by Unknown Moderator (ID: %id%)
 * @property {string} CMD_WARN_LIST_DETAILS - Reason: %reason% Warned at: <t:%timestamp%:F>
 * @property {string} CMD_WARN_LIST_OPTION - Warning ID: %id%
 * @property {string} CMD_WARN_LIST_PLACEHOLDER - Select a warning to remove
 * @property {string} SERVER_STATS_GENERAL - %name% General stats 
 * @property {string} SERVER_STATS_NAME - 🇳 Name: %name%
 * @property {string} SERVER_STATS_ID - <:pp198:853494893439352842> ID: %id%
 * @property {string} SERVER_STATS_OWNER - <:Owner:841321887882805289> Owner: %owner%
 * @property {string} SERVER_STATS_REGION - 🌐 Region: %region%
 * @property {string} SERVER_STATS_BOOST_TIER - <a:pp891:853493740579717131> Boost Tier: %tier%
 * @property {string} SERVER_STATS_VERIFICATION - <a:pp989:853496185443319809> Verification Level: %level%
 * @property {string} SERVER_STATS_BOOST_LEVEL - <a:server_boosting:809994218759782411> Boost Level: %level%
 * @property {string} SERVER_STATS_CREATED_AT - 📆 Created At: %time% %date% %relative%
 * @property {string} SERVER_STATS_DETAILS - %name% stats 
 * @property {string} SERVER_STATS_ROLE_COUNT - <:pp444:853496229677629490> Role Count: %count%
 * @property {string} SERVER_STATS_EMOJI_COUNT - <:pp697:853494953560375337> Emoji Count: %count%
 * @property {string} SERVER_STATS_NORMAL_EMOJI - <:pp941:782762042171719731> Normal Emoji Count: %count%
 * @property {string} SERVER_STATS_ANIMATED_EMOJI - <a:pp224:853495450111967253> Animated Emoji Count: %count%
 * @property {string} SERVER_STATS_MEMBER_COUNT - <a:pp754:768867196302524426> Member Count: %count%
 * @property {string} SERVER_STATS_HUMANS - <:pp833:853495153280155668> Humans: %count%
 * @property {string} SERVER_STATS_BOTS - 🤖 Bots: %count%
 * @property {string} SERVER_STATS_TEXT_CHANNELS - ⌨️ Text Channels: %count%
 * @property {string} SERVER_STATS_VOICE_CHANNELS - Voice Channels: %count%
 * @property {string} SERVER_STATS_BUTTON_PREV - Prev
 * @property {string} SERVER_STATS_BUTTON_NEXT - Next
 * @property {string} WHOIS_AUTHOR - User information of %displayName%
 * @property {string} WHOIS_DISPLAYNAME - <a:pp224:853495450111967253> DisplayName:
 * @property {string} WHOIS_USERNAME - <:pp499:836168214525509653> Username:
 * @property {string} WHOIS_ID - <:pp198:853494893439352842> ID:
 * @property {string} WHOIS_STATUS - <a:pp472:853494788791861268> Status:
 * @property {string} WHOIS_GAME - <:pp179:853495316186791977> Game:
 * @property {string} WHOIS_ACCOUNT_CREATED - 📆 Account Created At:
 * @property {string} WHOIS_JOINED_SERVER - 📥 Joined The Server At:
 * @property {string} WHOIS_AVATAR - 🖼️ Avatar:
 * @property {string} WHOIS_AVATAR_LINK - Click here to view Avatar
 * @property {string} WHOIS_FLAGS - <:medal:898358296694628414> Flags
 * @property {string} WHOIS_ROLES - Roles
 * @property {string} WHOIS_PERMISSIONS - Permissions
 * @property {string} WHOIS_ADMINISTRATOR - <:MOD:836168687891382312> Administrator
 * @property {string} WHOIS_FOOTER - User info. | ©️%year% Wolfy
 * @property {string} WHOIS_STATUS_OFFLINE - <:offline:809995754021978112> Offline
 * @property {string} WHOIS_STATUS_DND - <:8608_do_not_disturb:809995753577644073> Do Not Disturb
 * @property {string} WHOIS_STATUS_ONLINE - <:online:809995753921576960> Online
 * @property {string} WHOIS_STATUS_IDLE - <:Idle:809995753656549377> Idle
 * @property {string} WHOIS_ACTIVITY_NONE - None
 * @property {string} WHOIS_ROLES_NONE - None
 * @property {string} USER_FLAG_EMPLOYEE - <:discord_Staff:911761250759893012> Discord Employee
 * @property {string} USER_FLAG_PARTNER - <:discord_partner:911760719266086942> Discord Partner
 * @property {string} USER_FLAG_HYPESQUAD_EVENTS - <:HypeSquad_Event:911760719345762355> HypeSquad Events
 * @property {string} USER_FLAG_BRAVERY - <:HypeSquad_Bravery:911760719106703371> HypeSquad Bravery
 * @property {string} USER_FLAG_BRILLIANCE - <:HypeSquad_Brilliance:911760719417065523> HypeSquad Brilliance
 * @property {string} USER_FLAG_BALANCE - <:HypeSquad_Balance:911760719429632020> HypeSquad Balance
 * @property {string} USER_FLAG_BUG_HUNTER_1 - <:Bug_Hunter:911761250843762718> Bug Hunter (Level 1)
 * @property {string} USER_FLAG_BUG_HUNTER_2 - <:Bug_Hunter_level2:911760719429660683> Bug Hunter (Level 2)
 * @property {string} USER_FLAG_EARLY_SUPPORTER - <:early_supporter:911760718880194645> Early Supporter
 * @property {string} USER_FLAG_TEAM_USER - Team User
 * @property {string} USER_FLAG_SYSTEM - <:discord:887894225323192321> System
 * @property {string} USER_FLAG_VERIFIED_BOT - <:Verified:911762191731015740> Verified Bot
 * @property {string} USER_FLAG_VERIFIED_DEVELOPER - <:Verified_Bot_Developer:911760719261859870> Verified Bot Developer
 * @property {string} USER_FLAG_ACTIVE_DEVELOPER - <:ActiveDeveloper:1067072669117333515> Active Developer
 * @property {string} USER_FLAG_NONE - None
 * @property {string} LEVEL_DISABLED - \❌ %displayName%, The levels command is disabled in this server! To enable this feature, use the `%prefix%leveltoggle` command.
 * @property {string} LEVEL_NO_XP - \❌ %displayName%, This member doesn't have any XP yet!
 * @property {string} LEVEL_DATABASE_ERROR - `❌ [DATABASE_ERR]:` The database responded with error: %error%
 * @property {string} LEADERBOARD_TITLE - %guildName%
 * @property {string} LEADERBOARD_SUBTITLE - %memberCount% members
 * @property {string} AVATAR_NOT_FOUND - \❌ | %user%, I can't find an avatar for this user!
 * @property {string} AVATAR_ERROR - \❌ | %user%, Something went wrong, please try again later!
 * @property {string} AVATAR_SERVER_DM_ERROR - \❌ | %user%, This option can only be used in text channels!
 * @property {string} AVATAR_SERVER_TITLE - %guildName% avatar link
 * @property {string} AVATAR_USER_TITLE - %username% avatar link
 * @property {string} AVATAR_FOOTER - %username%'s avatar | ©️%year% Wolfy
 * @property {string} AVATAR_SERVER_FOOTER - %user% | ©️%year% Wolfy
 * @property {string} MCUSER_NOT_FOUND - \❌ | %user%, I couldn't find that Minecraft user!
 * @property {string} MCUSER_ERROR - \❌ | %user%, Something went wrong, please try again later!
 * @property {string} MCUSER_TITLE - %username%'s Minecraft Profile
 * @property {string} MCUSER_UUID - UUID:
 * @property {string} MCUSER_USERNAME - Username:
 * @property {string} MCUSER_SKIN - Skin:
 * @property {string} MCUSER_VIEW_SKIN - View Skin
 * @property {string} MCUSER_DOWNLOAD_SKIN - Download Skin
 * @property {string} MCUSER_NAMEMC - View on NameMC
 * @property {string} MCUSER_FOOTER - Minecraft User Info | ©️%year% Wolfy
 * @property {string} MEME_ERROR - \❌ | %user%, Something went wrong, please try again later!
 * @property {string} MEME_TITLE - From r/%subreddit%
 * @property {string} MEME_UPVOTES - 👍 %upvotes%
 * @property {string} MEME_COMMENTS - 💬 %comments%
 * @property {string} PRAYS_TITLE - Prayer Times for %city%, %country%
 * @property {string} PRAYS_FAJR - Fajr: %time%
 * @property {string} PRAYS_SUNRISE - Sunrise: %time%
 * @property {string} PRAYS_DHUHR - Dhuhr: %time%
 * @property {string} PRAYS_ASR - Asr: %time%
 * @property {string} PRAYS_MAGHRIB - Maghrib: %time%
 * @property {string} PRAYS_ISHA - Isha: %time%
 * @property {string} PRAYS_FOOTER - Prayer Times | ©️%year% Wolfy
 * @property {string} PRAYS_ERROR - \❌ I couldn't find prayer times for that location!
 * @property {string} PRAYS_INVALID - \❌ | %user%, Please provide a valid city name!
 * @property {string} PRAY_NAME_FAJR - Fajr
 * @property {string} PRAY_NAME_SUNRISE - Sunrise
 * @property {string} PRAY_NAME_DHUHR - Dhuhr
 * @property {string} PRAY_NAME_ASR - Asr
 * @property {string} PRAY_NAME_MAGHRIB - Maghrib
 * @property {string} PRAY_NAME_ISHA - Isha
 * @property {string} PRAY_DATE - <:star:888264104026992670> Date
 * @property {string} STEAM_NOT_FOUND - \❌ | %user%, I couldn't find that game on Steam!
 * @property {string} STEAM_ERROR - \❌ | %user%, Something went wrong, please try again later!
 * @property {string} STEAM_TITLE - %game% on Steam
 * @property {string} STEAM_PRICE - Price: %price%
 * @property {string} STEAM_DISCOUNT - Discount: %discount%%
 * @property {string} STEAM_RELEASE - Release Date: %date%
 * @property {string} STEAM_REVIEWS - Reviews: %reviews%
 * @property {string} STEAM_LINK - View on Steam
 * @property {string} STEAM_FOOTER - Steam Game Info | ©️%year% Wolfy
 * @property {string} STEAM_METASCORE - ❯ Metascore
 * @property {string} STEAM_REVIEWS_COUNT - ❯ Reviews
 * @property {string} STEAM_PLATFORMS - ❯ Platforms
 * @property {string} STEAM_DLC_COUNT - ❯ DLC Count
 * @property {string} STEAM_DEVELOPERS - ❯ Developers
 * @property {string} STEAM_PUBLISHERS - ❯ Publishers
 * @property {string} STEAM_GENRES - ❯ Genres
 * @property {string} STEAM_LANGUAGES - ❯ Supported Languages
 * @property {string} REMIND_INVALID_TIME - \❌ Please provide a valid time! (e.g. 1h, 30m, 1d)
 * @property {string} REMIND_TOO_LONG - \❌ The reminder time cannot be longer than 7 days!
 * @property {string} REMIND_TOO_SHORT - \❌ The reminder time must be at least 1 minute!
 * @property {string} REMIND_SET - ⏰ | I'll remind you about "%message%" in %time%!
 * @property {string} REMIND_NOTIFICATION - ⏰ Reminder: %message%
 * @property {string} ERROR_REMIND_NO_ACTIVE - \❌ You don't have any active reminders to cancel!
 * @property {string} ERROR_REMIND_NO_REASON - \❌ Please state your reminder reason! `/remindme [time] [reason]`
 * @property {string} ERROR_REMIND_ALREADY_ACTIVE - \❌ It looks like you already have an active reminder! Cancel it by `/remindme time: 0`
 * @property {string} SUCCESS_REMIND_CANCELED - <:Success:888264105851490355> Successfully canceled the last reminder!
 * @property {string} LOGS_SET_SEPARATED_SUCCESS - ✔️ Separated logs have been updated successfully!
 * @property {string} LOGS_SET_SEPARATED_TYPE_WARNING - ⚠️ Logs type is set to `%type%`! To change type, execute `/logs edit logs-type [separated]`
 * @property {string} LOGS_SET_SEPARATED_NO_CHANNELS - ❌ No valid channels were provided to update.
 * @property {string} LOGS_SET_SEPARATED_UPDATED - - %log_name% set to %channel%
 * @property {string} LOGS_SET_GLOBAL_SUCCESS - ✔️ All logs have been set to the specified channel!
 * @property {string} LOGS_SET_GLOBAL_DISABLED_WARNING - ⚠️ Logs channel is disabled! To enable, execute `/logs edit global-status [true]`
 * @property {string} LOGS_SET_GLOBAL_TYPE_WARNING - ⚠️ Logs type is set to `%type%`! To change type, execute `/logs edit logs-type [global]`
 * @property {string} LOGS_EDIT_NO_OPTIONS - ❌ No valid options were provided to update.
 * @property {string} LOGS_EDIT_SUCCESS - ✔️ %updates%
 * @property {string} LOGS_EDIT_TYPE_CHANGED - Logs type has been set to %type%. 
 * @property {string} LOGS_EDIT_STATUS_CHANGED - Global logs have been %status%. 
 * @property {string} LOGS_EDIT_NO_CONFIG - ❌ No logs configuration found for this server.
 * @property {string} LOGS_LIST_NO_CONFIG - ❌ No logs configuration found for this server.
 * @property {string} LOGS_LIST_TITLE - Logs Configuration
 * @property {string} LOGS_LIST_DESCRIPTION - Current logs settings for this server:
 * @property {string} LOGS_LIST_ENABLED - Yes
 * @property {string} LOGS_LIST_DISABLED - No
 * @property {string} LOGS_LIST_LOGS_ENABLED - Logs Enabled
 * @property {string} LOGS_LIST_LOGS_TYPE - Logs Type
 * @property {string} LOGS_LIST_ALL_LOGS_CHANNEL - All Logs Channel
 * @property {string} LOGS_LIST_SEPARATED_LOGS - Separated Logs
 * @property {string} LOGS_LIST_NOT_SET - Not set
 * @property {string} LOGS_MANAGE_SEPARATED_TITLE - Separated Logs Configuration
 * @property {string} LOGS_MANAGE_SEPARATED_DESCRIPTION - <a:Fix:1267280059517894737> Manage separated logs events using configurations below Toggle events status by pressing their button
 * @property {string} LOGS_MANAGE_SEPARATED_NOT_SET - Not set
 * @property {string} LOGS_MANAGE_SEPARATED_LOG_TOGGLED - %log_type% logs has been set to %status%.
 * @property {string} LOGS_MANAGE_SEPARATED_NOT_FOUND - This log type is not set.
 * @property {string} PANEL_CREATE_SUCCESS - ✔️ A new ticket panel is set to %category%! Your server currently has `%count%` ticket panels.
 * @property {string} PANEL_CREATE_ALREADY_EXISTS - ❌ Ticket category is already set to %category%!
 * @property {string} PANEL_CREATE_LIMIT_REACHED - ❌ You can only have `%max_panels%` ticket panels in the server!
 * @property {string} PANEL_CREATE_ERROR - ❌ An error occurred while creating the ticket panel. Please try again later.
 * @property {string} PANEL_DELETE_SUCCESS - ✔️ Ticket panel is deleted with category %category%!
 * @property {string} PANEL_DELETE_NOT_FOUND - ❌ There is no ticket panel set to %category%!
 * @property {string} PANEL_REMOVE_DELETED_SUCCESS - ✔️ Removed %count% panel(s) that were deleted!
 * @property {string} PANEL_REMOVE_DELETED_NONE - ❌ No deleted categories panels were found!
 * @property {string} PANEL_EDIT_SUCCESS - ✔️ Ticket panel updated successfully: %updates%
 * @property {string} PANEL_EDIT_ENABLED - - Enabled: `%value%`
 * @property {string} PANEL_EDIT_MESSAGE - - Message: `%value%`
 * @property {string} PANEL_EDIT_ROLE - - Role: %value%
 * @property {string} PANEL_EDIT_LOGS - - Logs: %value%
 * @property {string} PANEL_EDIT_NOT_FOUND - ❌ %category% is not a valid panel category!
 * @property {string} PANEL_EDIT_NO_CHANGES - ❌ No changes detected. Please provide new values for the fields you want to update.
 * @property {string} PANEL_EDIT_ERROR - ❌ [DATABASE_ERR]: The database responded with error: %error%
 * @property {string} PANEL_LIST_NONE - ❌ There are no ticket panels in the server!
 * @property {string} PANEL_LIST_TITLE - %guild_name% Panels list
 * @property {string} PANEL_LIST_DESCRIPTION - There are `%count%` ticket panels in the server!
 * @property {string} PANEL_LIST_ENABLED - Yes
 * @property {string} PANEL_LIST_DISABLED - No
 * @property {string} PANEL_LIST_ENABLED_LABEL - Enabled:
 * @property {string} PANEL_LIST_TIME_CREATED - Time Created:
 * @property {string} PANEL_LIST_ADMIN - Admin:
 * @property {string} PANEL_LIST_MOD_ROLE - Mod Role:
 * @property {string} PANEL_LIST_LOGS - Logs:
 * @property {string} PANEL_LIST_CUSTOM_MESSAGE - Custom message:
 * @property {string} PANEL_LIST_NONE_VALUE - None
 * @property {string} PANEL_LIST_NOT_SET - Not set.
 * @property {string} PANEL_LIST_FOOTER - Ticket Panel | ©️%year% Wolfy
 * @property {string} PANEL_LIST_DELETED_NOTICE - Deleted %count% unregistered panel(s)
 * @property {string} PANEL_SEND_SUCCESS - ✔️ Panel embed sent to %channel%!
 * @property {string} PANEL_SEND_NOT_FOUND - ❌ There is no ticket panel set to %category%!
 * @property {string} PANEL_SEND_ERROR - ❌ An error occurred while sending panel embed to channel. Please try again later.
 * @property {string} PANEL_EMBED_TITLE - Tickets
 * @property {string} PANEL_EMBED_DESCRIPTION - React with 📩 to create your ticket!
 * @property {string} PANEL_EMBED_BUTTON - Open ticket
 * @property {string} PANEL_EMBED_FOOTER - Ticket Panel | ©️%year% Wolfy
 * @property {string} LANGUAGE_WARNING - The language model is currently in development and may not be 100% accurate. Also currently it only supports slash commands.
 * @property {string} TICKET_ALREADY_CLOSED - Ticket is already closed!
 * @property {string} TICKET_CHANNEL_NOT_FOUND - I can't find the channel associated with this ticket!
 * @property {string} TICKET_DATA_NOT_FOUND - \❌ I can't find this guild `data` in the database!
 * @property {string} TICKET_CLOSED_BY - Closed by %user%
 * @property {string} TICKET_CONTROL_DESCRIPTION - ```Ticket panel control system```
 * @property {string} TICKET_ALREADY_OPEN - Ticket is already open!
 * @property {string} TICKET_REOPENED_BY - Re-opened by %user%
 * @property {string} TICKET_DELETED_BY - Deleted by %user%
 * @property {string} TICKET_CLAIMED_BY - Claimed by %user%
 * @property {string} TICKET_TRANSCRIPTED_BY - Transcript requested by %user%
 * @property {string} TICKET_BUTTON_CLAIM - Claim
 * @property {string} TICKET_BUTTON_CLOSE - Close
 * @property {string} TICKET_BUTTON_CLOSE_CONFIRM - Confirm Close
 * @property {string} TICKET_BUTTON_CANCEL - Cancel
 * @property {string} TICKET_DELETE_CONFIRM - Are you sure you want to delete this ticket?
 * @property {string} TICKET_DELETE_CANCELLED - Ticket deletion cancelled.
 * @property {string} TICKET_OPEN_ERROR - An error occurred while opening the ticket. Please try again later.
 * @property {string} TICKET_OPEN_SUCCESS - Ticket opened successfully!
 * @property {string} TICKET_OPENING - Opening your ticket...
 * @property {string} TICKET_CLAIM_CLOSED - Ticket can't be claimed because it's closed!
 * @property {string} TICKET_ALREADY_CLAIMED - Ticket is already claimed!
 * @property {string} TICKET_MODROLE_NOT_SET - The panel `mods-role` is not set!
 * @property {string} TICKET_MODROLE_REQUIRED - You need to have %role% in order to claim this ticket!
 * @property {string} TICKET_DELETE_NOT_CLOSED - Ticket should be closed before it can be deleted
 * @property {string} TICKET_DELETE_COUNTDOWN - Ticket will be deleted in `5 seconds`!
 * @property {string} TICKET_WELCOME_TITLE - Welcome in your ticket %user%
 * @property {string} TICKET_WELCOME_DESCRIPTION - Send here your message or question!
 * @property {string} TICKET_WELCOME_USER - User
 * @property {string} TICKET_WELCOME_USERID - UserID
 * @property {string} TICKET_TRANSCRIPT_TITLE - Chat transcript for %channel%
 * @property {string} TICKET_TRANSCRIPT_NOT_CLOSED - This ticket is not closed!
 * @property {string} TICKET_TRANSCRIPT_LINK - Ticket transcript
 * @property {string} TICKET_TRANSCRIPT_VIEW - View
 * @property {string} TICKET_TRANSCRIPT_OPENED_BY - Opened by
 * @property {string} TICKET_TRANSCRIPT_CLOSED_BY - Closed by
 * @property {string} TICKET_TRANSCRIPT_CLAIMED_BY - Claimed by
 * @property {string} TICKET_TRANSCRIPT_OPENED_AT - Opened At
 * @property {string} TICKET_TRANSCRIPT_LOGS_TITLE - Ticket Logs.
 * @property {string} TICKET_TRANSCRIPT_LOGS_DESC - <:Tag:836168214525509653> %channel% Ticket at %guild%!
 * @property {string} TICKET_TRANSCRIPT_EMBED_TITLE - Ticket Closed.
 * @property {string} TICKET_TRANSCRIPT_EMBED_DESC - <:Tag:836168214525509653> Ticket %channel% at %guild% has been closed!
 * @property {string} TICKET_TRANSCRIPT_SENT - Sent transcript to your DM!
 * @property {string} TICKET_TRANSCRIPT_DM_FAILED - 💢 I couldn't send the transcript to your DM!
 * @property {string} TICKET_BUTTON_TRANSCRIPT - Transcript
 * @property {string} TICKET_BUTTON_REOPEN - Re-Open
 * @property {string} TICKET_BUTTON_DELETE - Delete
 * @property {string} LANGUAGE_SELECT_MENU_PLACEHOLDER - Make a selection!
 * @property {string} SELECT_MENU_OUTDATED - 💢 This select menu is outdated!
 * @property {string} ROLE_REMOVED_SUCCESS - <a:pp833:853495989796470815> Successfully removed %role% from you!
 * @property {string} ROLE_REMOVE_ERROR - \❌ Failed to remove the role %role% for %user%, `%error%`!
 * @property {string} ROLE_ADDED_SUCCESS - <a:pp330:853495519455215627> Successfully added %role% for you!
 * @property {string} ROLE_ADD_ERROR - \❌ Failed to add the role %role% for %user%, `%error%`!
 * @property {string} BTN_INFO_TITLE - Test buttons show
 * @property {string} BTN_INFO_DESCRIPTION - That's an example for embed message from a button
 * @property {string} BTN_INFO_FOOTER - Requested By: %username%
 * @property {string} CHANGELOGS_CHANNEL_NOT_FOUND - ❌ Couldn't find changelogs channel, but updated documents!
 * @property {string} MODAL_NOTES_SUCCESS - 👌 Your submission was received successfully!
 * @property {string} WARN_ID_INVALID - \❌ Please provide a valid warn id.
 * @property {string} WARN_USER_NO_WARNINGS - \❌ No warnings found for this user.
 * @property {string} WARN_ID_NOT_FOUND - \❌ The specified warn ID does not exist.
 * @property {string} WARN_REMOVE_SUCCESS - <a:pp989:853496185443319809> | Successfully deleted %user% warning, they now have %count% warning%s%!
 * @property {string} ECONOMY_WITHDRAW_INVALID - \❌ %username%, [ %amount% ] is not a valid amount!
 * @property {string} ECONOMY_WITHDRAW_MIN - \❌ %username%, The amount to be withdrawn must be at least 500.
 * @property {string} ECONOMY_WITHDRAW_INSUFFICIENT - \❌ %username%, You don't have enough credits in your bank to proceed with this transaction.  You only have %balance% left, %shortAmount% less than the amount you want to withdraw (Transaction fee of 5% included) To withdraw all credits instead, please use `/withdraw amount:all`.
 * @property {string} ECONOMY_WITHDRAW_SUCCESS - <:moneytransfer:892745164324474900> %username%, You Successfully withdrawn %amount% credits from your bank! (+5% fee).
 * @property {string} ECONOMY_DEPOSIT_INVALID - \❌ %username%, [ %amount% ] is not a valid amount!
 * @property {string} ECONOMY_DEPOSIT_MIN - \❌ %username%, The amount to be deposited must be at least 500.
 * @property {string} ECONOMY_DEPOSIT_INSUFFICIENT - \❌ %username%, You don't have enough credits in your wallet to proceed with this transaction.  You only have %balance% left, %shortAmount% less than the amount you want to deposit (Transaction fee of 5% included) To deposit all credits instead, please use `/deposit amount:all`.
 * @property {string} ECONOMY_DEPOSIT_SUCCESS - <:moneytransfer:892745164324474900> %username%, you Successfully deposited %amount% credits to your bank! (+5% fee).
 * @property {string} ECONOMY_REGISTER_ALREADY - \❌ %username%, You already registered a bank account!
 * @property {string} ECONOMY_REGISTER_INSUFFICIENT - \❌ %username%, You don't have 8,000 credits yet to create a bank account!
 * @property {string} ECONOMY_REGISTER_SUCCESS - \✔️ %username%, Successfully created 🏦 Bank account You received %amount% as a gift!  Bank cost <a:ShinyMoney:877975108038324224> `-5,000`
 * @property {string} ECONOMY_BEG_COOLDOWN - \❌ %username%, You have already been given some coins earlier! Please try again later.
 * @property {string} ECONOMY_BEG_SUCCESS - <a:Money:836169035191418951> %username%, You received <a:ShinyMoney:877975108038324224> %amount% from %giver%.
 * @property {string} ECONOMY_BUY_INVALID - \❌ %username%, Could not find this `item ID`! The proper usage for this command would be `/buy item:[item id]`. Example: `/buy item:%random_id%`
 * @property {string} ECONOMY_BUY_ALREADY - \❌ %username%, you already have this item in your inventory
 * @property {string} ECONOMY_BUY_INSUFFICIENT - \❌ %username%, You do not have enough credits to proceed with this transaction! You need %missing% more for %item%
 * @property {string} ECONOMY_BUY_SUCCESS - <a:Bagopen:877975110806540379> %username%, Successfully purchased %item%! for `%price%`
 * @property {string} ECONOMY_COOKIE_SELF - \❌ %username%, You can't give yourself a cookie!
 * @property {string} ECONOMY_COOKIE_MISSING_ITEM_TITLE - <a:Wrong:812104211361693696> Missing item!
 * @property {string} ECONOMY_COOKIE_MISSING_ITEM_DESC - %username%, You can only give `350` cookies for free you should now buy UltimateCookie Machine! Type `/buy item:2` to buy the item.
 * @property {string} ECONOMY_COOKIE_GIVEN_TITLE - <a:Cookie:853495749370839050> Cookie is given!
 * @property {string} ECONOMY_COOKIE_GIVEN_DESC - %username%, gave %friend% a cookie! <a:ShinyMoney:877975108038324224> %username% got (`+%money%`) credits for being a nice friend!  📥 %received% | 📤 %given%
 * @property {string} ECONOMY_INV_TITLE - %username%'s Inventory
 * @property {string} ECONOMY_INV_FOOTER - %username%'s Inventory | ©️%year% Wolfy   •   Page %current_page% of %total_pages%
 * @property {string} ECONOMY_INV_EMPTY - \❌ %username%, your inventory is empty.
 * @property {string} ECONOMY_INV_MINING_TITLE - <a:BackPag:776670895371714570> %username%'s mining Inventory!
 * @property {string} ECONOMY_INV_MINING_FOOTER - %prefix%sell [item] (amount)
 * @property {string} ECONOMY_INV_MINING_BUTTON - Mining inventory
 * @property {string} ECONOMY_INV_ITEM_TYPE - Type
 * @property {string} ECONOMY_INV_ITEM_PRICE - Selling Price
 * @property {string} ECONOMY_INV_ITEM_USE - Use
 * @property {string} ECONOMY_BIRTHDAY_INVALID_FORMAT - \❌ %username%, Please add your date in DD-MM format (e.g., 26-09 for September 26)
 * @property {string} ECONOMY_BIRTHDAY_UPDATED - \✔️ %username%, Successfully updated your birthday to `%birthday%`!
 * @property {string} ECONOMY_BIRTHDAY_UPDATE_FAILED - \❌ %username%, Your birthday update failed!
 * @property {string} ECONOMY_BIO_LIMIT - \❌ %username%, Bio text limit! (max 200 characters)
 * @property {string} ECONOMY_BIO_UPDATED - \✔️ %username%, Successfully set your profile bio!
 * @property {string} ECONOMY_BIO_UPDATE_FAILED - \❌ %username%, Your bio update failed!
 * @property {string} ECONOMY_USE_NOT_OWNED - \❌ %username%, You do not have this item in your inventory!
 * @property {string} ECONOMY_USE_UNAVAILABLE - \❌ %username%, This item can no longer be used!
 * @property {string} ECONOMY_USE_UNUSABLE - \❌ %username%, You can't use this item!
 * @property {string} ECONOMY_USE_SUCCESS - \✔️ %username%, Successfully used %item_name%!
 * @property {string} ECONOMY_PREVIEW_INVALID - \❌ %username%, Could not find the item with that ID!
 * @property {string} ECONOMY_PREVIEW_UNAVAILABLE - \❌ %username%, There is no preview for this item!
 * @property {string} ECONOMY_PREVIEW_DETAILS - > `Item Name:` %item_name%, `Item Type:` %item_type%, `Item Price:` %item_price%
 * @property {string} ECONOMY_FISH_MISSING_ITEM_TITLE - <a:Wrong:812104211361693696> Missing item!
 * @property {string} ECONOMY_FISH_MISSING_ITEM_DESC - %username%, you didn't buy the FishingPole item from the shop! Use `/market` to show the market.
 * @property {string} ECONOMY_FISH_STARTED - > <a:Loading:841321898302373909> Fishing from the pond...
 * @property {string} ECONOMY_FISH_CAUGHT - 🎣 %username%, you caught: %catch% from the Pool and got <a:ShinyMoney:877975108038324224> %amount%!
 * @property {string} ECONOMY_FISH_NOTHING - <:nofish:892685980916678696> %username%, you caught: <:sad1:887894228305342504> Nothing
 * @property {string} ECONOMY_SELL_INVALID_AMOUNT - \❌ %username%, please provide a valid item amount greater than 0.
 * @property {string} ECONOMY_SELL_INSUFFICIENT - \❌ %username%, You only have %available% %item% in your inventory!
 * @property {string} ECONOMY_SELL_SUCCESS - \✔️ %username%, Successfully sold %item% for <a:ShinyMoney:877975108038324224> `+%amount%`!
 * @property {string} ECONOMY_SELL_UNKNOWN_ITEM_TITLE - <a:Wrong:812104211361693696> Unknown item!
 * @property {string} ECONOMY_SELL_UNKNOWN_ITEM_DESC - %username%, %item% this item is not from the items listed in the inventory!
 * @property {string} ECONOMY_MINE_MISSING_ITEM_TITLE - <a:Wrong:812104211361693696> Missing item!
 * @property {string} ECONOMY_MINE_MISSING_ITEM_DESC - %username%, you didn't buy a pickaxe to mine yet!  Use `/market` to show the market.
 * @property {string} ECONOMY_MINE_STONE_PICKAXE - <:StonePickaxe:887032165437702277> %username%, you mine: `+%amount%` %item% you can see this item count and sell it from your inv by `/inv type:mining`!
 * @property {string} ECONOMY_MINE_IRON_PICKAXE - <:e_:887042865715359774> %username%, you mine: `+%amount%` %item% you can see this item count and sell it from your inv by `/inv type:mining`!
 * @property {string} ECONOMY_MINE_DIAMOND_PICKAXE - <:e_:887059604998078495> %username%, you mine: `+%amount%` %item% you can see this item count and sell it from your inv by `/inv type:mining`!
 * @property {string} ECONOMY_MINE_DEFAULT - \❌ %username%, you mine: `+%amount%` %item% you can see this item count and sell it from your inv by `/inv type:mining`!
 * @property {string} ECONOMY_MARKET_TITLE - Wolfy's Market
 * @property {string} ECONOMY_MARKET_URL - https://wolfy.yoyojoe.repl.co/
 * @property {string} ECONOMY_MARKET_FOOTER - Wolfy's Market | ©️%year% Wolfy   •   Page %current_page% of %total_pages%
 * @property {string} ECONOMY_MARKET_ITEM_DETAILS - %description% Type: %type% Price: %price% %preview_command% %purchase_command%
 * @property {string} ECONOMY_MARKET_PREVIEW_COMMAND - Check Preview : `/previewitem id:%item_id%`
 * @property {string} ECONOMY_MARKET_PURCHASE_COMMAND - Purchase: `/buy item:%item_id%`
 * @property {string} ECONOMY_TIP_COOLDOWN - \❌ %username%, You have already used tip earlier! Please try again later. `%time%`
 * @property {string} ECONOMY_TIP_USER_NOT_FOUND - \❌ %username%, Could not find this user!
 * @property {string} ECONOMY_TIP_SELF - \❌ %username%, You cannot tip yourself!
 * @property {string} ECONOMY_TIP_BOT - \❌ %username%, You cannot tip a bot!
 * @property {string} ECONOMY_TIP_SUCCESS - \✔️ %username%, Successfully tipped %target%.
 * @property {string} ECONOMY_DAILY_SUCCESS_TITLE - 💰 Daily reward claimed!
 * @property {string} ECONOMY_DAILY_SUCCESS_DESC - %username%, You've claimed your daily reward and received: <a:ShinyMoney:877975108038324224> %amount% Credits!
 * @property {string} ECONOMY_PROFILE_TITLE - %username%'s Profile
 * @property {string} ECONOMY_PROFILE_BADGES - Badges
 * @property {string} ECONOMY_PROFILE_LEVEL - Level
 * @property {string} ECONOMY_PROFILE_EXP - EXP
 * @property {string} ECONOMY_PROFILE_RANK - Rank
 * @property {string} ECONOMY_PROFILE_BIO - Bio
 * @property {string} ECONOMY_PROFILE_BIRTHDAY - Birthday
 * @property {string} ECONOMY_PROFILE_JOINED - Joined Server
 * @property {string} ECONOMY_DAILY_COOLDOWN - \❌ %username%, You have already claimed your daily reward! You can claim again in `%time%`
 * @property {string} NO_VOICE_CHANNEL - \❌ You need to be in a voice channel to use this command!
 * @property {string} NO_MEMBERS_IN_VOICE - \❌ There are no members in your voice channel to kick!
 * @property {string} VOICE_KICK_ALL_SUCCESS - ✅ Successfully kicked all users from the voice channel!
 * @property {string} VOICE_KICK_ERROR - \❌ An error occurred while attempting to kick from voice channel!
 * @property {string} USER_NOT_IN_VOICE - \❌ This user is not in a voice channel!
 * @property {string} VOICE_KICK_SUCCESS - ✅ Successfully kicked %target% from voice channel!
 * @property {string} INVALID_ID - \❌ Please provide a valid user ID.
 * @property {string} SOFTBAN_SUCCESS - ✅ User Softbanned - %moderate_reason% - Moderator: %moderator% (%moderatorId%) - At: <t:%timestamp%>
 * @property {string} SOFTBAN_ERROR - \❌ An error occurred while attempting to softban %user%.
 * @property {string} REASON_TOO_LONG - \❌ The reason is too long! Maximum %max% characters.
 * @property {string} NO_SUGGESTION_CHANNEL - \❌ No suggestion channel has been set for this server! Please set one using `/%command%`.
 * @property {string} SUGGESTION_CHANNEL_NOT_FOUND - \❌ The suggestion channel could not be found! Please reset it using `/%command%`.
 * @property {string} SUGGESTION_NOT_FOUND - \❌ Could not find a valid suggestion with this message ID.
 * @property {string} SUGGESTION_ALREADY_RESPONDED - \❌ This suggestion already has a response.
 * @property {string} SUGGESTION_NOT_EDITABLE - \❌ I don't have permission to edit this suggestion.
 * @property {string} SUGGESTION_RESPONDED - ✅ Successfully %action%ed the suggestion!
 * @property {string} SUGGESTION_RESPONSE_ERROR - \❌ An error occurred while responding to the suggestion.
 * @property {string} NO_MUTED_ROLE - \❌ There is no `muted` role in this guild. Please create one first.
 * @property {string} ALREADY_MUTED - \❌ This user is already muted!
 * @property {string} ALREADY_UNMUTED - \❌ This user is not muted!
 * @property {string} TOO_MANY_ROLES - \❌ Your server has too many roles! [250/250]
 * @property {string} MISSING_PERMISSIONS - \❌ I need %permission% permission to perform this action.
 * @property {string} NOT_COMMAND_USER - \❌ Only the command executor can use these buttons.
 * @property {string} TEXT_CHANNEL_ONLY - \❌ This command can only be used in text channels.
 * @property {string} PURGE_CHANNEL_CONFIRM - ⚠️ Are you sure you want to purge the channel %channel%?  This will: • Create a new channel with the same settings • Delete all messages in the current channel • Delete the current channel
 * @property {string} PURGE_CHANNEL_COUNTDOWN - ⚠️ Purging channel in 3 seconds... This cannot be undone!
 * @property {string} PURGE_CHANNEL_SUCCESS - ✅ Channel successfully purged by %user%!
 * @property {string} PURGE_CHANNEL_ERROR - \❌ An error occurred while purging the channel. Please try again.
 * @property {string} PURGE_ERROR - \❌ An error occurred while purging messages for `%user%`.
 * @property {string} NO_MESSAGES_TO_DELETE - \❌ No messages found from `%user%` that can be deleted.
 * @property {string} INVALID_AMOUNT - \❌ Please provide a valid amount between %min% and %max%.
 * @property {string} COMMAND_CANCELLED - ✅ The %command% command has been cancelled.
 * @property {string} COMMAND_TIMEOUT - ⏱️ Command timed out. Please try again.
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
 * @property {{ action_done: string, target: string }} MODERATED_SUCCESSFULLY
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
 * @property {{ user: string }} CMD_WARN_DM_TITLE
 * @property {{ reason: string, moderator: string, count: string, s: string }} CMD_WARN_DM_DESCRIPTION
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
 * @property {{ user: string, username: string, number: string, count: string, participants: string }} CMD_GUESS_WINNER
 * @property {{ number: string }} CMD_GUESS_SMALLER
 * @property {{ number: string }} CMD_GUESS_BIGGER
 * @property {{ number: string }} CMD_GUESS_TIMEOUT
 * @property {{ options: string }} CMD_RPS_INVALID_CHOICE
 * @property {{ user_choice: string, user_emoji: string, bot_choice: string, bot_emoji: string, result: string }} CMD_RPS_RESULT
 * @property {{ credits: string, bank_balance: string, daily_status: string }} ECONOMY_WALLET_DESCRIPTION
 * @property {{ username: string, prefix: string }} ECONOMY_NO_BANK
 * @property {{ username: string, time: string }} ECONOMY_DAILY_ALREADY_DESC
 * @property {{ username: string, amount: string, item_reward: string, streak_status: string }} ECONOMY_DAILY_CLAIMED_DESC
 * @property {{ item_name: string, item_desc: string }} ECONOMY_DAILY_ITEM_REWARD
 * @property {{ streak: string }} ECONOMY_DAILY_STREAK_CURRENT
 * @property {{ reward: string }} ECONOMY_QUEST_REWARD
 * @property {{ refresh_time: string, completed: string, prefix: string }} ECONOMY_QUEST_DESCRIPTION
 * @property {{ quest_name: string, current: string, total: string }} ECONOMY_QUEST_NAME_FORMAT
 * @property {{ amount: string }} ECONOMY_QUEST_REWARDS
 * @property {{ username: string }} ECONOMY_QUEST_REFRESHED
 * @property {{ completed_message: string }} ECONOMY_QUEST_NOT_COMPLETED
 * @property {{ completed: string }} ECONOMY_QUEST_PARTIAL_COMPLETE
 * @property {{ username: string }} ECONOMY_QUEST_ALREADY_CLAIMED
 * @property {{ username: string, amount: string, item_reward: string }} ECONOMY_QUEST_CLAIM_DESC
 * @property {{ item_name: string, item_desc: string }} ECONOMY_QUEST_ITEM_REWARD
 * @property {{ user_tag: string, year: string }} FOOTER_COPYRIGHT
 * @property {{ username: string }} ECONOMY_NO_BANK_ACCOUNT
 * @property {{ username: string, credits: string, time: string }} ECONOMY_BANK_STATUS
 * @property {{ username: string }} ECONOMY_BANK_OVERFLOW
 * @property {{ username: string, credits: string, time: string }} ECONOMY_BANK_NEW_BALANCE
 * @property {{ username: string }} ECONOMY_LEADERBOARD_AUTHOR
 * @property {{ position: string, username: string }} ECONOMY_LEADERBOARD_ENTRY
 * @property {{ position: string }} ECONOMY_LEADERBOARD_FOOTER
 * @property {{ user: string }} ECONOMY_TRANSFER_SELF
 * @property {{ user: string }} ECONOMY_TRANSFER_BOT
 * @property {{ username: string, amount: string }} ECONOMY_TRANSFER_INVALID_AMOUNT
 * @property {{ username: string }} ECONOMY_TRANSFER_AMOUNT_LIMIT
 * @property {{ username: string, credits: string }} ECONOMY_TRANSFER_INSUFFICIENT
 * @property {{ username: string, amount: string, recipient: string, balance: string }} ECONOMY_TRANSFER_CONFIRM
 * @property {{ user: string }} ECONOMY_TRANSFER_CANCELLED
 * @property {{ sender: string, amount: string, reason: string }} ECONOMY_TRANSFER_DM
 * @property {{ username: string, amount: string, recipient: string }} ECONOMY_TRANSFER_SUCCESS
 * @property {{ language: string, bot_name: string }} SETUP_LANGUAGE_OPTION_DESC
 * @property {{ max_length: string }} SETUP_PREFIX_TOO_LONG
 * @property {{ username: string, action: string }} SETUP_PREFIX_SUCCESS
 * @property {{ prefix: string }} SETUP_PREFIX_SET
 * @property {{ username: string }} SETUP_BLOCK_NO_CMD
 * @property {{ username: string }} SETUP_BLOCK_NO_ACTION
 * @property {{ username: string, command: string }} SETUP_BLOCK_NOT_FOUND
 * @property {{ username: string, command: string }} SETUP_BLOCK_ALREADY_BLOCKED
 * @property {{ username: string, command: string }} SETUP_BLOCK_ALREADY_UNBLOCKED
 * @property {{ username: string, action: string, command: string }} SETUP_BLOCK_SUCCESS
 * @property {{ command: string }} SETUP_BLOCK_CANNOT_BLOCK_SELF
 * @property {{ commands: string }} SETUP_BLOCK_LIST
 * @property {{ username: string }} SETUP_LOGS_CHANNEL_MISSING
 * @property {{ username: string }} SETUP_LOGS_CHANNEL_INVALID
 * @property {{ channel: string }} SETUP_LOGS_CHANNEL_SUCCESS
 * @property {{ username: string }} SETUP_LOGS_CHANNEL_REMOVED
 * @property {{ channel: string }} SETUP_LOGS_CHANNEL_NO_PERMS
 * @property {{ username: string }} SETUP_SUGGESTION_CHANNEL_MISSING
 * @property {{ username: string }} SETUP_SUGGESTION_CHANNEL_INVALID
 * @property {{ channel: string }} SETUP_SUGGESTION_CHANNEL_SUCCESS
 * @property {{ username: string }} SETUP_SUGGESTION_CHANNEL_REMOVED
 * @property {{ channel: string }} SETUP_SUGGESTION_CHANNEL_NO_PERMS
 * @property {{ channel: string }} SETUP_SUGGESTION_CHANNEL_ALREADY_SET
 * @property {{ username: string }} SETUP_SUGGESTION_TIMER_MISSING
 * @property {{ username: string }} SETUP_SUGGESTION_TIMER_INVALID
 * @property {{ username: string, time: string }} SETUP_SUGGESTION_TIMER_SUCCESS
 * @property {{ username: string }} SETUP_TOGGLE_NO_FEATURE
 * @property {{ username: string, feature: string }} SETUP_TOGGLE_FEATURE_NOT_FOUND
 * @property {{ username: string, status: string, feature: string }} SETUP_TOGGLE_SUCCESS
 * @property {{ feature: string }} SETUP_TOGGLE_NO_CHANNEL
 * @property {{ action: string, feature: string }} SETUP_TOGGLE_NEXT_ACTION
 * @property {{ guild_name: string }} SETUP_PANEL_TITLE
 * @property {{ page: string, total_pages: string }} SETUP_PANEL_FOOTER
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
 * @property {{ user: string }} MOD_DM_SUCCESS
 * @property {{ user: string }} MOD_DM_ERROR
 * @property {{ user: string }} CMD_WARN_LIST_TITLE
 * @property {{ moderator: string, id: string }} CMD_WARN_LIST_MODERATOR
 * @property {{ id: string }} CMD_WARN_LIST_UNKNOWN
 * @property {{ reason: string, timestamp: string }} CMD_WARN_LIST_DETAILS
 * @property {{ id: string }} CMD_WARN_LIST_OPTION
 * @property {{ name: string }} SERVER_STATS_GENERAL
 * @property {{ name: string }} SERVER_STATS_NAME
 * @property {{ id: string }} SERVER_STATS_ID
 * @property {{ owner: string }} SERVER_STATS_OWNER
 * @property {{ region: string }} SERVER_STATS_REGION
 * @property {{ tier: string }} SERVER_STATS_BOOST_TIER
 * @property {{ level: string }} SERVER_STATS_VERIFICATION
 * @property {{ level: string }} SERVER_STATS_BOOST_LEVEL
 * @property {{ time: string, date: string, relative: string }} SERVER_STATS_CREATED_AT
 * @property {{ name: string }} SERVER_STATS_DETAILS
 * @property {{ count: string }} SERVER_STATS_ROLE_COUNT
 * @property {{ count: string }} SERVER_STATS_EMOJI_COUNT
 * @property {{ count: string }} SERVER_STATS_NORMAL_EMOJI
 * @property {{ count: string }} SERVER_STATS_ANIMATED_EMOJI
 * @property {{ count: string }} SERVER_STATS_MEMBER_COUNT
 * @property {{ count: string }} SERVER_STATS_HUMANS
 * @property {{ count: string }} SERVER_STATS_BOTS
 * @property {{ count: string }} SERVER_STATS_TEXT_CHANNELS
 * @property {{ count: string }} SERVER_STATS_VOICE_CHANNELS
 * @property {{ displayName: string }} WHOIS_AUTHOR
 * @property {{ year: string }} WHOIS_FOOTER
 * @property {{ displayName: string, prefix: string }} LEVEL_DISABLED
 * @property {{ displayName: string }} LEVEL_NO_XP
 * @property {{ error: string }} LEVEL_DATABASE_ERROR
 * @property {{ guildName: string }} LEADERBOARD_TITLE
 * @property {{ memberCount: string }} LEADERBOARD_SUBTITLE
 * @property {{ user: string }} AVATAR_NOT_FOUND
 * @property {{ user: string }} AVATAR_ERROR
 * @property {{ user: string }} AVATAR_SERVER_DM_ERROR
 * @property {{ guildName: string }} AVATAR_SERVER_TITLE
 * @property {{ username: string }} AVATAR_USER_TITLE
 * @property {{ username: string, year: string }} AVATAR_FOOTER
 * @property {{ user: string, year: string }} AVATAR_SERVER_FOOTER
 * @property {{ user: string }} MCUSER_NOT_FOUND
 * @property {{ user: string }} MCUSER_ERROR
 * @property {{ username: string }} MCUSER_TITLE
 * @property {{ year: string }} MCUSER_FOOTER
 * @property {{ user: string }} MEME_ERROR
 * @property {{ subreddit: string }} MEME_TITLE
 * @property {{ upvotes: string }} MEME_UPVOTES
 * @property {{ comments: string }} MEME_COMMENTS
 * @property {{ city: string, country: string }} PRAYS_TITLE
 * @property {{ time: string }} PRAYS_FAJR
 * @property {{ time: string }} PRAYS_SUNRISE
 * @property {{ time: string }} PRAYS_DHUHR
 * @property {{ time: string }} PRAYS_ASR
 * @property {{ time: string }} PRAYS_MAGHRIB
 * @property {{ time: string }} PRAYS_ISHA
 * @property {{ year: string }} PRAYS_FOOTER
 * @property {{ user: string }} PRAYS_INVALID
 * @property {{ user: string }} STEAM_NOT_FOUND
 * @property {{ user: string }} STEAM_ERROR
 * @property {{ game: string }} STEAM_TITLE
 * @property {{ price: string }} STEAM_PRICE
 * @property {{ discount: string }} STEAM_DISCOUNT
 * @property {{ date: string }} STEAM_RELEASE
 * @property {{ reviews: string }} STEAM_REVIEWS
 * @property {{ year: string }} STEAM_FOOTER
 * @property {{ message: string, time: string }} REMIND_SET
 * @property {{ message: string }} REMIND_NOTIFICATION
 * @property {{ type: string }} LOGS_SET_SEPARATED_TYPE_WARNING
 * @property {{ log_name: string, channel: string }} LOGS_SET_SEPARATED_UPDATED
 * @property {{ type: string }} LOGS_SET_GLOBAL_TYPE_WARNING
 * @property {{ updates: string }} LOGS_EDIT_SUCCESS
 * @property {{ type: string }} LOGS_EDIT_TYPE_CHANGED
 * @property {{ status: string }} LOGS_EDIT_STATUS_CHANGED
 * @property {{ log_type: string, status: string }} LOGS_MANAGE_SEPARATED_LOG_TOGGLED
 * @property {{ category: string, count: string }} PANEL_CREATE_SUCCESS
 * @property {{ category: string }} PANEL_CREATE_ALREADY_EXISTS
 * @property {{ max_panels: string }} PANEL_CREATE_LIMIT_REACHED
 * @property {{ category: string }} PANEL_DELETE_SUCCESS
 * @property {{ category: string }} PANEL_DELETE_NOT_FOUND
 * @property {{ count: string }} PANEL_REMOVE_DELETED_SUCCESS
 * @property {{ updates: string }} PANEL_EDIT_SUCCESS
 * @property {{ value: string }} PANEL_EDIT_ENABLED
 * @property {{ value: string }} PANEL_EDIT_MESSAGE
 * @property {{ value: string }} PANEL_EDIT_ROLE
 * @property {{ value: string }} PANEL_EDIT_LOGS
 * @property {{ category: string }} PANEL_EDIT_NOT_FOUND
 * @property {{ error: string }} PANEL_EDIT_ERROR
 * @property {{ guild_name: string }} PANEL_LIST_TITLE
 * @property {{ count: string }} PANEL_LIST_DESCRIPTION
 * @property {{ year: string }} PANEL_LIST_FOOTER
 * @property {{ count: string }} PANEL_LIST_DELETED_NOTICE
 * @property {{ channel: string }} PANEL_SEND_SUCCESS
 * @property {{ category: string }} PANEL_SEND_NOT_FOUND
 * @property {{ year: string }} PANEL_EMBED_FOOTER
 * @property {{ user: string }} TICKET_CLOSED_BY
 * @property {{ user: string }} TICKET_REOPENED_BY
 * @property {{ user: string }} TICKET_DELETED_BY
 * @property {{ user: string }} TICKET_CLAIMED_BY
 * @property {{ user: string }} TICKET_TRANSCRIPTED_BY
 * @property {{ role: string }} TICKET_MODROLE_REQUIRED
 * @property {{ user: string }} TICKET_WELCOME_TITLE
 * @property {{ channel: string }} TICKET_TRANSCRIPT_TITLE
 * @property {{ channel: string, guild: string }} TICKET_TRANSCRIPT_LOGS_DESC
 * @property {{ channel: string, guild: string }} TICKET_TRANSCRIPT_EMBED_DESC
 * @property {{ role: string }} ROLE_REMOVED_SUCCESS
 * @property {{ role: string, user: string, error: string }} ROLE_REMOVE_ERROR
 * @property {{ role: string }} ROLE_ADDED_SUCCESS
 * @property {{ role: string, user: string, error: string }} ROLE_ADD_ERROR
 * @property {{ username: string }} BTN_INFO_FOOTER
 * @property {{ user: string, count: string, s: string }} WARN_REMOVE_SUCCESS
 * @property {{ username: string, amount: string }} ECONOMY_WITHDRAW_INVALID
 * @property {{ username: string }} ECONOMY_WITHDRAW_MIN
 * @property {{ username: string, balance: string, shortAmount: string }} ECONOMY_WITHDRAW_INSUFFICIENT
 * @property {{ username: string, amount: string }} ECONOMY_WITHDRAW_SUCCESS
 * @property {{ username: string, amount: string }} ECONOMY_DEPOSIT_INVALID
 * @property {{ username: string }} ECONOMY_DEPOSIT_MIN
 * @property {{ username: string, balance: string, shortAmount: string }} ECONOMY_DEPOSIT_INSUFFICIENT
 * @property {{ username: string, amount: string }} ECONOMY_DEPOSIT_SUCCESS
 * @property {{ username: string }} ECONOMY_REGISTER_ALREADY
 * @property {{ username: string }} ECONOMY_REGISTER_INSUFFICIENT
 * @property {{ username: string, amount: string }} ECONOMY_REGISTER_SUCCESS
 * @property {{ username: string }} ECONOMY_BEG_COOLDOWN
 * @property {{ username: string, amount: string, giver: string }} ECONOMY_BEG_SUCCESS
 * @property {{ username: string, random_id: string }} ECONOMY_BUY_INVALID
 * @property {{ username: string }} ECONOMY_BUY_ALREADY
 * @property {{ username: string, missing: string, item: string }} ECONOMY_BUY_INSUFFICIENT
 * @property {{ username: string, item: string, price: string }} ECONOMY_BUY_SUCCESS
 * @property {{ username: string }} ECONOMY_COOKIE_SELF
 * @property {{ username: string }} ECONOMY_COOKIE_MISSING_ITEM_DESC
 * @property {{ username: string, friend: string, money: string, received: string, given: string }} ECONOMY_COOKIE_GIVEN_DESC
 * @property {{ username: string }} ECONOMY_INV_TITLE
 * @property {{ username: string, year: string, current_page: string, total_pages: string }} ECONOMY_INV_FOOTER
 * @property {{ username: string }} ECONOMY_INV_EMPTY
 * @property {{ username: string }} ECONOMY_INV_MINING_TITLE
 * @property {{ prefix: string }} ECONOMY_INV_MINING_FOOTER
 * @property {{ username: string }} ECONOMY_BIRTHDAY_INVALID_FORMAT
 * @property {{ username: string, birthday: string }} ECONOMY_BIRTHDAY_UPDATED
 * @property {{ username: string }} ECONOMY_BIRTHDAY_UPDATE_FAILED
 * @property {{ username: string }} ECONOMY_BIO_LIMIT
 * @property {{ username: string }} ECONOMY_BIO_UPDATED
 * @property {{ username: string }} ECONOMY_BIO_UPDATE_FAILED
 * @property {{ username: string }} ECONOMY_USE_NOT_OWNED
 * @property {{ username: string }} ECONOMY_USE_UNAVAILABLE
 * @property {{ username: string }} ECONOMY_USE_UNUSABLE
 * @property {{ username: string, item_name: string }} ECONOMY_USE_SUCCESS
 * @property {{ username: string }} ECONOMY_PREVIEW_INVALID
 * @property {{ username: string }} ECONOMY_PREVIEW_UNAVAILABLE
 * @property {{ item_name: string, item_type: string, item_price: string }} ECONOMY_PREVIEW_DETAILS
 * @property {{ username: string }} ECONOMY_FISH_MISSING_ITEM_DESC
 * @property {{ username: string, catch: string, amount: string }} ECONOMY_FISH_CAUGHT
 * @property {{ username: string }} ECONOMY_FISH_NOTHING
 * @property {{ username: string }} ECONOMY_SELL_INVALID_AMOUNT
 * @property {{ username: string, available: string, item: string }} ECONOMY_SELL_INSUFFICIENT
 * @property {{ username: string, item: string, amount: string }} ECONOMY_SELL_SUCCESS
 * @property {{ username: string, item: string }} ECONOMY_SELL_UNKNOWN_ITEM_DESC
 * @property {{ username: string }} ECONOMY_MINE_MISSING_ITEM_DESC
 * @property {{ username: string, amount: string, item: string }} ECONOMY_MINE_STONE_PICKAXE
 * @property {{ username: string, amount: string, item: string }} ECONOMY_MINE_IRON_PICKAXE
 * @property {{ username: string, amount: string, item: string }} ECONOMY_MINE_DIAMOND_PICKAXE
 * @property {{ username: string, amount: string, item: string }} ECONOMY_MINE_DEFAULT
 * @property {{ year: string, current_page: string, total_pages: string }} ECONOMY_MARKET_FOOTER
 * @property {{ description: string, type: string, price: string, preview_command: string, purchase_command: string }} ECONOMY_MARKET_ITEM_DETAILS
 * @property {{ item_id: string }} ECONOMY_MARKET_PREVIEW_COMMAND
 * @property {{ item_id: string }} ECONOMY_MARKET_PURCHASE_COMMAND
 * @property {{ username: string, time: string }} ECONOMY_TIP_COOLDOWN
 * @property {{ username: string }} ECONOMY_TIP_USER_NOT_FOUND
 * @property {{ username: string }} ECONOMY_TIP_SELF
 * @property {{ username: string }} ECONOMY_TIP_BOT
 * @property {{ username: string, target: string }} ECONOMY_TIP_SUCCESS
 * @property {{ username: string, amount: string }} ECONOMY_DAILY_SUCCESS_DESC
 * @property {{ username: string }} ECONOMY_PROFILE_TITLE
 * @property {{ username: string, time: string }} ECONOMY_DAILY_COOLDOWN
 * @property {{ target: string }} VOICE_KICK_SUCCESS
 * @property {{ moderate_reason: string, moderator: string, moderatorId: string, timestamp: string }} SOFTBAN_SUCCESS
 * @property {{ user: string }} SOFTBAN_ERROR
 * @property {{ max: string }} REASON_TOO_LONG
 * @property {{ command: string }} NO_SUGGESTION_CHANNEL
 * @property {{ command: string }} SUGGESTION_CHANNEL_NOT_FOUND
 * @property {{ action: string }} SUGGESTION_RESPONDED
 * @property {{ permission: string }} MISSING_PERMISSIONS
 * @property {{ channel: string }} PURGE_CHANNEL_CONFIRM
 * @property {{ user: string }} PURGE_CHANNEL_SUCCESS
 * @property {{ user: string }} PURGE_ERROR
 * @property {{ user: string }} NO_MESSAGES_TO_DELETE
 * @property {{ min: string, max: string }} INVALID_AMOUNT
 * @property {{ command: string }} COMMAND_CANCELLED
 */

module.exports = {};