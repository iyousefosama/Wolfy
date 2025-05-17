// Import necessary classes from discord.js
const { EmbedBuilder } = require("discord.js")

/**
 * @type {import("../../util/types/baseComponent")}
 */
module.exports = {
  // Component configuration
  name: "btn_info",
  enabled: true,
  // Action to perform when the button is clicked
  async action(client, interaction, parts) {
    // Create an embed message
    const embed = new EmbedBuilder()
      .setTitle(client.language.getString("BTN_INFO_TITLE", interaction.guildId, { default: "Test buttons show" }))
      .setDescription(client.language.getString("BTN_INFO_DESCRIPTION", interaction.guildId, { default: "That's an example for embed message from a button" }))
      .setColor("DarkVividPink")
      .setTimestamp()
      .setAuthor({ 
        name: client.user.username, 
        iconURL: client.user.displayAvatarURL() 
      })
      .setFooter({
        text: client.language.getString("BTN_INFO_FOOTER", interaction.guildId, { 
          username: interaction.user.username,
          default: `Requested By: ${interaction.user.username}`
        }),
        iconURL: interaction.user.displayAvatarURL(),
      });
    // Reply to the interaction with the embed message
    interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  },
};
