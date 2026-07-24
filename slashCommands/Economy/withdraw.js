const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const schema = require("../../schema/Economy-Schema");
const text = require('../../util/string');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "withdraw",
    description: "Withdraw credits from your bank to your wallet",
    dmOnly: false,
    guildOnly: false,
    cooldown: 5,
    requiresDatabase: true,
    group: "Economy",
    clientPermissions: [],
    permissions: [],
    options: [
      {
        name: "amount",
        description: "Amount to withdraw or 'all' to withdraw everything",
        type: 3, // STRING
        required: true
      }
    ]
  },
  async execute(client, interaction) {
    const amount = interaction.options.getString("amount");
    
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

    if (!data || data.Bank.balance.credits === null || data.Bank.info.Enabled == false) {
      return interaction.reply({
        content: `\\❌ **${interaction.user.tag}**, You don't have a *bank* yet! To create one, use \`/register\`.`
      });
    } else {
      let withdrawAmount;
      const amt = amount;
      
      if (amount.toLowerCase() === 'all') {
        withdrawAmount = Math.round(data.Bank.balance.credits / 1.2);
      } else {
        withdrawAmount = Math.round(amount.split(',').join(''));
      }

      if (!withdrawAmount || isNaN(withdrawAmount)) {
        return interaction.reply({
          content: `\\❌ **${interaction.user.tag}**, [ **${amt}** ] is not a valid amount!`
        });
      } else if (withdrawAmount < 500) {
        return interaction.reply({
          content: `\\❌ **${interaction.user.tag}**, The amount to be withdrawn must be at least **500**.`
        });
      } else if (withdrawAmount * 1.1 > data.Bank.balance.credits) {
        return interaction.reply({
          content: `\\❌ **${interaction.user.tag}**, You don't have enough credits in your bank to proceed with this transaction.\n You only have **${text.commatize(data.Bank.balance.credits)}** left, **${text.commatize(withdrawAmount - data.Bank.balance.credits + Math.ceil(withdrawAmount * 0.05))}** less than the amount you want to withdraw (Transaction fee of 5% included)\nTo withdraw all credits instead, please use \`/withdraw amount:all\`.`
        });
      }

      data.Bank.balance.credits = Math.round(data.Bank.balance.credits - withdrawAmount * 1.1);
      data.credits = data.credits + Math.round(withdrawAmount);

      return data.save()
        .then(() => interaction.reply({
          content: `💸 **${interaction.user.tag}**, You Successfully withdrawn **${text.commatize(Math.floor(withdrawAmount / 1.1))}** credits from your bank! (+5% fee).`
        }))
        .catch((err) => interaction.reply({
          content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
        }));
    }
  },
};