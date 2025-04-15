const discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const moment = require('moment');
const schema = require('../../schema/Economy-Schema');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "setbirthday",
    description: "Sets your profile card birthday",
    dmOnly: false,
    guildOnly: false,
    cooldown: 30,
    group: "Economy",
    requiresDatabase: true,
    clientPermissions: [],
    permissions: [],
    options: [
      {
        name: "date",
        description: "Your birthday in DD-MM format (e.g., 26-09 for September 26)",
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

    const dateInput = interaction.options.getString("date");
    const date = moment(dateInput, 'DD-MM');
    
    if (!date.isValid()) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_BIRTHDAY_INVALID_FORMAT", interaction.guild?.id, { 
          username: interaction.user.tag 
        }),
        ephemeral: true
      });
    }
    
    data.profile.birthday = date.format('Do MMMM');
    
    try {
      await data.save();
      interaction.reply({
        content: client.language.getString("ECONOMY_BIRTHDAY_UPDATED", interaction.guild?.id, { 
          username: interaction.user.tag,
          birthday: date.format('Do MMMM')
        })
      });
    } catch (err) {
      interaction.reply({
        content: client.language.getString("ECONOMY_BIRTHDAY_UPDATE_FAILED", interaction.guild?.id, { 
          username: interaction.user.tag 
        }),
        ephemeral: true
      });
    }
  },
}; 