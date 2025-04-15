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
        content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name })
      });
      return client.logDetailedError({
        error: err,
        eventType: "DATABASE_ERR",
        interaction: interaction
      });
    }

    if (!data || data.Bank.balance.credits === null || data.Bank.info.Enabled == false) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_NO_BANK_ACCOUNT", interaction.guild?.id, { 
          username: interaction.user.tag, 
          prefix: client.prefix 
        })
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
          content: client.language.getString("ECONOMY_WITHDRAW_INVALID", interaction.guild?.id, { 
            username: interaction.user.tag, 
            amount: amt 
          })
        });
      } else if (withdrawAmount < 500) {
        return interaction.reply({
          content: client.language.getString("ECONOMY_WITHDRAW_MIN", interaction.guild?.id, { 
            username: interaction.user.tag 
          })
        });
      } else if (withdrawAmount * 1.1 > data.Bank.balance.credits) {
        return interaction.reply({
          content: client.language.getString("ECONOMY_WITHDRAW_INSUFFICIENT", interaction.guild?.id, { 
            username: interaction.user.tag,
            balance: text.commatize(data.Bank.balance.credits),
            shortAmount: text.commatize(withdrawAmount - data.Bank.balance.credits + Math.ceil(withdrawAmount * 0.05)),
            prefix: client.prefix
          })
        });
      }

      data.Bank.balance.credits = Math.round(data.Bank.balance.credits - withdrawAmount * 1.1);
      data.credits = data.credits + Math.round(withdrawAmount);

      return data.save()
        .then(() => interaction.reply({
          content: client.language.getString("ECONOMY_WITHDRAW_SUCCESS", interaction.guild?.id, { 
            username: interaction.user.tag,
            amount: text.commatize(Math.floor(withdrawAmount / 1.1))
          })
        }))
        .catch((err) => interaction.reply({
          content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name })
        }));
    }
  },
}; 