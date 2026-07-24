const discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const schema = require('../../schema/Economy-Schema');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "setbio",
    description: "Sets your profile card bio",
    dmOnly: false,
    guildOnly: false,
    cooldown: 30,
    group: "Economy",
    requiresDatabase: true,
    clientPermissions: [],
    permissions: [],
    options: [
      {
        name: "bio",
        description: "Your new bio text (max 200 characters)",
        type: 3, // STRING
        required: true
      }
    ]
  },
  async execute(client, interaction) {
    let data;
    try {
      data = await schema.findOne({
        userID: interaction.user.id,
      });
      if (!data) {
        data = await schema.create({
          userID: interaction.user.id,
        });
      }
    } catch (err) {
      interaction.reply({
        content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`,
        ephemeral: true
      });
      return client.logDetailedError({
        error: err,
        eventType: "DATABASE_ERR",
        interaction: interaction
      });
    }

    const bioText = interaction.options.getString("bio");
    
    if (bioText.length > 200) {
      return interaction.reply({
        content: `\\❌ **${interaction.user.tag}**, Bio text limit! (max 200 characters)`,
        ephemeral: true
      });
    }
    
    data.profile.bio = bioText;
    
    try {
      await data.save();
      interaction.reply({
        content: `\\✔️ **${interaction.user.tag}**, Successfully set your profile bio!`
      });
    } catch (err) {
      interaction.reply({
        content: `\\❌ **${interaction.user.tag}**, Your bio update failed!`,
        ephemeral: true
      });
    }
  },
}; 