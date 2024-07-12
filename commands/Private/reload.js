const commandHandler = require("../../Handler/CommandHandler");

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "reload",
    aliases: [],
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
            await commandHandler(client);

            return message.reply({ content: "\\✔️ Successfully reloaded the commands!" });
        } catch (error) {
            console.error(error);
            return message.reply({ content: `\\❗ Could not reload the commands!` });
        }
    },
};
