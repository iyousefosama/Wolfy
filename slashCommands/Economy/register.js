const discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const schema = require('../../schema/Economy-Schema');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "register",
    description: "Register a bank account to store your credits safely",
    dmOnly: false,
    guildOnly: false,
    cooldown: 5,
    requiresDatabase: true,
    group: "Economy",
    clientPermissions: [],
    permissions: [],
    options: []
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
        content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name })
      });
      return client.logDetailedError({
        error: err,
        eventType: "DATABASE_ERR",
        interaction: interaction
      });
    }
    
    let credits = data.credits;
    
    if (data.Bank.info.Enabled == true) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_REGISTER_ALREADY", interaction.guild?.id, { 
          username: interaction.user.tag 
        })
      });
    } else if (credits < 8000) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_REGISTER_INSUFFICIENT", interaction.guild?.id, { 
          username: interaction.user.tag 
        })
      });
    } else {
      data.credits -= Math.floor(8000);
      data.Bank.balance.credits = Math.floor(Math.random() * 250) + 250;
      data.Bank.info.Enabled = true;
      
      return data.save()
        .then(() => interaction.reply({
          content: client.language.getString("ECONOMY_REGISTER_SUCCESS", interaction.guild?.id, { 
            username: interaction.user.tag,
            amount: data.Bank.balance.credits
          })
        }))
        .catch((err) => interaction.reply({
          content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name })
        }));
    }
  },
}; 