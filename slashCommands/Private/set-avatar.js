const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "set-avatar",
    description: "🛠 Developer only, sets the avatar for the bot",
    dmOnly: false,
    guildOnly: false,
    cooldown: 0,
    group: "NONE",
    clientPermissions: [],
    permissions: [],
    ownerOnly: true,
    options: [
        {
            type: 11, // ATTACHMENT
            name: 'avatar',
            description: 'The avatar to set!',
            required: true
        }
    ]
},
  async execute(client, interaction) {
    const attachment = interaction.options.getAttachment("avatar");

    return await interaction.reply({ content: `✨ **Setting** new avatar...` })
        .then(async () => {
            return await client.user
                .setAvatar(attachment.url)
                .then(() =>
                    interaction.reply(`\\✅ New avatar **set**!`).catch(() => null)
                )
                .catch((err) => {
                    console.log(err);
                    return interaction.reply(
                        `❌ Failed to set new avatar! [\`${err.name}\`]`
                    );
                });
        });
  },
};
