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
 * @property {string} name - The name of the command (must be lowercase)
 * @property {boolean} dmOnly - Whether the command is DM-only
 * @property {boolean} guildOnly - Whether the command is guild-only
 * @property {string} description - A short description of the command
 * @property {number} cooldown - The command cooldown in seconds
 * @property {CommandCategory} group - The category this command belongs to
 * @property {import('discord.js').PermissionResolvable[]} [clientPermissions] - Permissions required by the client to use the command.
 * @property {import('discord.js').PermissionResolvable[]} [permissions] - Permissions required by the user to use the command
 * @property {import('discord.js').ApplicationCommandOptionData[]} options - command options
 */

/**
 * @typedef {Object} CommandData
 * @property {InteractionInfo} data - The interaction information for the command
 * @property {function(import('discord.js').Client, import('discord.js').Interaction)} execute - The callback to be executed when the command is invoked
 */

/**
 * Placeholder for command data
 * @type {CommandData}
 */
module.exports = {
    data: {
        name: "",
        description: "",
        dmOnly: false,
        guildOnly: false,
        cooldown: 0,
        group: "NONE",
        clientPermissions: [],
        permissions: [],
        options: [],
    },
    /**
     * The function to be executed when the command is invoked.
     * @param {import('discord.js').Client} client - The Discord client instance
     * @param {import('discord.js').Interaction} interaction - The command interaction
     */
    execute: (client, interaction) => {},
};
