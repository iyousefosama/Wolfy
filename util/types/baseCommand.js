/**
 * @typedef {Object} Validation
 * @property {function} callback - The condition to validate
 * @property {string} message - The message to be displayed if callback condition is not met
 */

/**
 * @typedef {Object} SubCommand
 * @property {string} trigger - subcommand invoke
 * @property {string} description - subcommand description
 */

/**
 * @typedef {"ADMIN"|"ANIME"|"AUTOMOD"|"ECONOMY"|"FUN"|"IMAGE"|"INFORMATION"|"INVITE"|"MODERATION"|"NONE"|"OWNER"|"SOCIAL"|"PUBLIC"|"TICKET"|"UTILITY"|"MUSIC"} CommandCategory
 */

/**
 * @typedef {Object} InteractionInfo
 * @property {boolean} enabled - Whether the slash command is enabled or not
 * @property {boolean} ephemeral - Whether the reply should be ephemeral
 * @property {import('discord.js').ApplicationCommandOptionData[]} options - command options
 */

/**
 * @typedef {Object} CommandInfo
 * @property {boolean} enabled - Whether the command is enabled or not
 * @property {string[]} [aliases] - Alternative names for the command (all must be lowercase)
 * @property {string} [usage=""] - The command usage format string
 * @property {number} [minArgsCount=0] - Minimum number of arguments the command takes (default is 0)
 * @property {SubCommand[]} [subcommands=[]] - List of subcommands
 */

/**
 * @typedef {Object} CommandData
 * @property {string} name - The name of the command (must be lowercase)
 * @property {string[]} aliases - The name of the command (must be lowercase)
 * @property {string[]} examples - The name of the command (must be lowercase)
 * @property {boolean} dmOnly - The name of the command (must be lowercase)
 * @property {boolean} guildOnly - The name of the command (must be lowercase)
 * @property {boolean} args - The name of the command (must be lowercase)
 * @property {boolean} guarded - The name of the command (must be lowercase)
 * @property {string} description - A short description of the command
 * @property {string} usage - A short description of the command
 * @property {number} cooldown - The command cooldown in seconds
 * @property {CommandCategory} group - The category this command belongs to
 * @property {string} [about] - The command about a developer maked 
 * @property {import('discord.js').PermissionResolvable[]} [clientPermissions] - Permissions required by the client to use the command.
 * @property {import('discord.js').PermissionResolvable[]} [permissions] - Permissions required by the user to use the command
 * @property {Validation[]} [validations] - List of validations to be run before the command is executed
 * @property {function(import('../../struct/Client'),import('discord.js').Message, string[])} execute - The callback to be executed when the command is invoked
 */

/**
 * Placeholder for command data
 * @type {CommandData}
 */
module.exports = {
    name: "",
    description: "",
    aliases: [],
    examples: [],
    dmOnly: false,
    guildOnly: false,
    args: false,
    guarded: false,
    usage: "",
    cooldown: 0,
    isPremium: false,
    group: "NONE",
    clientPermissions: [],
    permissions: [],
    validations: [],
    execute: (client, message, args) => { },
};