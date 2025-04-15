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
        content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name }),
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
        content: client.language.getString("ECONOMY_BIO_LIMIT", interaction.guild?.id, { 
          username: interaction.user.tag 
        }),
        ephemeral: true
      });
    }
    
    data.profile.bio = bioText;
    
    try {
      await data.save();
      interaction.reply({
        content: client.language.getString("ECONOMY_BIO_UPDATED", interaction.guild?.id, { 
          username: interaction.user.tag 
        })
      });
    } catch (err) {
      interaction.reply({
        content: client.language.getString("ECONOMY_BIO_UPDATE_FAILED", interaction.guild?.id, { 
          username: interaction.user.tag 
        }),
        ephemeral: true
      });
    }
  },
}; 