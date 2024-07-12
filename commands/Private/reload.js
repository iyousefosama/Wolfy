const commandHandler = require("../../Handler/CommandHandler");

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "reload",
    aliases: ["refresh"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: false, //or false
    usage: "",
    group: "developer",
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    ownerOnly: true,
    permissions: [],
    async execute(client, message, args) {
        try {
            // Clear all existing commands
            client.commands.clear();
            client.components.clear(); // Assuming you have a collection for components

            // Remove all event listeners
            client.removeAllListeners();

            client.loadEvents("/events");
            client.loadCommands("/commands");
            client.loadSlashCommands("/slashCommands");
            client.loadComponents("/components");

            return message.reply({ content: "\\✔️ Successfully reloaded the commands!" });
        } catch (error) {
            console.error(error);
            return message.reply({ content: `\\❗ Could not reload the commands!` });
        }
    },
};
