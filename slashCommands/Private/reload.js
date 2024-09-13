/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
    data: {
        name: "reload",
        description: "🛠 Developer only, sets the avatar for the bot",
        dmOnly: false,
        guildOnly: false,
        cooldown: 0,
        group: "Owner",
        clientPermissions: [],
        permissions: [],
        ownerOnly: true,
    },
    async execute(client, interaction) {
        reply = await interaction.reply({
            content: 'Please wait...'
        });
        try {
            // Clear all existing commands
            client.commands.clear();
            client.components.clear();
            // Remove all event listeners
            client.removeAllListeners();

            client.loadEvents("/events");
            client.loadCommands("/commands");
            client.loadSlashCommands("/slashCommands");
            client.loadComponents("/components");

            await reply.edit({ content: "\\✔️ Successfully reloaded application commands and message commands." });
        } catch (err) {
            await reply.edit({
                content: 'Something went wrong.',
                files: [
                    new AttachmentBuilder(Buffer.from(`${err}`, 'utf-8'), { name: 'output.ts' })
                ]
            });
        }
    },
};
