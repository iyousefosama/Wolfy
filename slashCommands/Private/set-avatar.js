const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  ownerOnly: true,
  data: new SlashCommandBuilder()
    .setName("set-avatar")
    .setDescription("🛠 Developer only, set's the avatar for the bot")
    .addAttachmentOption((option) =>
      option.setName("avatar").setDescription("The avatar to set!").setRequired(true)
    ),
  async execute(client, interaction) {
    const attachment = interaction.options.getAttachment("avatar");

    return await interaction.editReply({ content: `✨ **Setting** new avatar...` })
        .then(async () => {
            return await client.user
                .setAvatar(attachment.url)
                .then(() =>
                    interaction.editReply(`\\✅ New avatar **set**!`).catch(() => null)
                )
                .catch((err) => {
                    console.log(err);
                    return interaction.editReply(
                        `❌ Failed to set new avatar! [\`${err.name}\`]`
                    );
                });
        });
  },
};
