const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const schema = require("../../schema/Economy-Schema");
const text = require('../../util/string');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "deposit",
    description: "Deposit credits from your wallet to your bank",
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
        description: "Amount to deposit or 'all' to deposit everything",
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
      let depositAmount;
      const amt = amount;
      const quest = data.progress.quests.find(x => x.id == 5);
      let Box = quest?.current;
      
      if (amount.toLowerCase() === 'all') {
        depositAmount = Math.floor(data.credits / 1.05);
      } else {
        depositAmount = Math.round(amount.split(',').join(''));
      }

      if (!depositAmount || isNaN(depositAmount)) {
        return interaction.reply({
          content: `\\❌ **${interaction.user.tag}**, [ **${amt || 0}** ] is not a valid amount!`
        });
      } else if (depositAmount < 500) {
        return interaction.reply({
          content: `\\❌ **${interaction.user.tag}**, The amount to be deposited must be at least **500**.`
        });
      } else if (data.Bank.balance.credits + depositAmount > 100000) {
        data.Bank.balance.credits = Math.floor(100000);
        return data.save()
          .then(() => {
            interaction.reply({
              content: `\\❌ **${interaction.user.tag}**, Your bank is overflowed please withdraw some money from your bank.`
            });
          })
          .catch((err) => interaction.reply({
            content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
          }));
      } else if (depositAmount * 1.05 > data.credits) {
        return interaction.reply({
          content: `\\❌ **${interaction.user.tag}**, You don't have enough credits in your wallet to proceed with this transaction.\n You only have **${text.commatize(data.credits)}** left, **${text.commatize(depositAmount - data.credits + Math.ceil(depositAmount * 0.05))}** less than the amount you want to deposit (Transaction fee of 5% included)\nTo deposit all credits instead, please use \`/deposit amount:all\`.`
        });
      }

      // Handle quest progress
      if (quest?.current < quest?.progress) {
        Box += Math.floor(depositAmount);
        await schema.findOneAndUpdate(
          { userID: interaction.user.id, "progress.quests.id": 5 }, 
          { $inc: { "progress.quests.$.current": Math.floor(depositAmount) } }
        );
      }
      
      if (Box && Box >= quest?.progress && !quest?.received) {
        data.credits += Math.floor(quest.reward);
        await schema.findOneAndUpdate(
          { userID: interaction.user.id, "progress.quests.id": 5 }, 
          { $set: { "progress.quests.$.received": true } }
        );
        data.progress.completed++;
        await data.save();
        await interaction.reply({ 
          content: `\\✔️ You received: 💰 **${quest.reward}** from this command quest.`
        });
      }

      data.Bank.balance.credits = data.Bank.balance.credits + Math.floor(depositAmount);
      data.credits = data.credits - Math.floor(depositAmount * 1.05);

      return data.save()
        .then(() => {
          if (!quest || Box < quest?.progress || quest?.received) {
            interaction.reply({
              content: `💸 **${interaction.user.tag}**, you Successfully deposited **${text.commatize(Math.floor(depositAmount / 1.05))}** credits to your bank! (+5% fee).`
            });
          }
        })
        .catch((err) => interaction.reply({
          content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
        }));
    }
  },
};