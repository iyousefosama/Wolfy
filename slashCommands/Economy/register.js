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
        content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
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
        content: `\\❌ **${interaction.user.tag}**, You already registered a bank account!`
      });
    } else if (credits < 8000) {
      return interaction.reply({
        content: `\\❌ **${interaction.user.tag}**, You don't have **8,000** credits yet to create a bank account!`
      });
    } else {
      data.credits -= Math.floor(8000);
      data.Bank.balance.credits = Math.floor(Math.random() * 250) + 250;
      data.Bank.info.Enabled = true;
      
      return data.save()
        .then(() => interaction.reply({
          content: `\\✔️ **${interaction.user.tag}**, Successfully created **🏦 Bank account** You received **${data.Bank.balance.credits}** as a gift!
 *Bank cost* 💰 \`-5,000\``
        }))
        .catch((err) => interaction.reply({
          content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
        }));
    }
  },
}; 