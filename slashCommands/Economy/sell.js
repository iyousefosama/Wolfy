const discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const schema = require('../../schema/Economy-Schema');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "sell",
    description: "Sell items from your inventory and get credits",
    dmOnly: false,
    guildOnly: false,
    cooldown: 5,
    group: "Economy",
    requiresDatabase: true,
    clientPermissions: [],
    permissions: [],
    options: [
      {
        name: "item",
        description: "The item you want to sell (coal, stone, iron, gold, diamond)",
        type: 3, // STRING
        required: true,
        choices: [
          { name: "Coal", value: "coal" },
          { name: "Stone", value: "stone" },
          { name: "Iron", value: "iron" },
          { name: "Gold", value: "gold" },
          { name: "Diamond", value: "diamond" }
        ]
      },
      {
        name: "amount",
        description: "How many items to sell",
        type: 4, // INTEGER
        required: true
      }
    ]
  },
  async execute(client, interaction) {
    const item = interaction.options.getString("item");
    const amount = interaction.options.getInteger("amount");
    
    if (amount <= 0) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_SELL_INVALID_AMOUNT", interaction.guild?.id, { 
          username: interaction.user.tag 
        }),
        ephemeral: true
      });
    }
    
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
    
    // Set item prices
    const Coal_price = Math.floor(12);
    const Stone_price = Math.floor(5);
    const Iron_price = Math.floor(25);
    const gold_price = Math.floor(55);
    const Diamond_price = Math.floor(90);
    
    if (item === 'coal') {
      if (data.inv.Coal < amount) {
        return interaction.reply({ 
          content: client.language.getString("ECONOMY_SELL_INSUFFICIENT", interaction.guild?.id, { 
            username: interaction.user.tag,
            item: "coal",
            available: data.inv.Coal
          }),
          ephemeral: true
        });
      }
      
      const finall = Math.floor(Coal_price * 0.7 * amount);
      data.credits += finall;
      data.inv.Coal -= Math.floor(amount);
      
      await data.save()
        .then(() => {
          interaction.reply({ 
            content: client.language.getString("ECONOMY_SELL_SUCCESS", interaction.guild?.id, { 
              username: interaction.user.tag,
              item: "<:e_:887034070842900552> Coal",
              amount: finall
            })
          });
        })
        .catch(err => {
          interaction.reply({ 
            content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name }),
            ephemeral: true 
          });
        });
    } else if (item === 'stone') {
      if (data.inv.Stone < amount) {
        return interaction.reply({ 
          content: client.language.getString("ECONOMY_SELL_INSUFFICIENT", interaction.guild?.id, { 
            username: interaction.user.tag,
            item: "stone",
            available: data.inv.Stone
          }),
          ephemeral: true
        });
      }
      
      const finall = Math.floor(Stone_price * 0.7 * amount);
      data.credits += finall;
      data.inv.Stone -= Math.floor(amount);
      
      await data.save()
        .then(() => {
          interaction.reply({ 
            content: client.language.getString("ECONOMY_SELL_SUCCESS", interaction.guild?.id, { 
              username: interaction.user.tag,
              item: "<:e_:887031111790764092> Stone",
              amount: finall
            })
          });
        })
        .catch(err => {
          interaction.reply({ 
            content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name }),
            ephemeral: true 
          });
        });
    } else if (item === 'iron') {
      if (data.inv.Iron < amount) {
        return interaction.reply({ 
          content: client.language.getString("ECONOMY_SELL_INSUFFICIENT", interaction.guild?.id, { 
            username: interaction.user.tag,
            item: "iron",
            available: data.inv.Iron
          }),
          ephemeral: true
        });
      }
      
      const finall = Math.floor(Iron_price * 0.7 * amount);
      data.credits += finall;
      data.inv.Iron -= Math.floor(amount);
      
      await data.save()
        .then(() => {
          interaction.reply({ 
            content: client.language.getString("ECONOMY_SELL_SUCCESS", interaction.guild?.id, { 
              username: interaction.user.tag,
              item: "<:e_:887034687472689192> Iron",
              amount: finall
            })
          });
        })
        .catch(err => {
          interaction.reply({ 
            content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name }),
            ephemeral: true 
          });
        });
    } else if (item === 'gold') {
      if (data.inv.Gold < amount) {
        return interaction.reply({ 
          content: client.language.getString("ECONOMY_SELL_INSUFFICIENT", interaction.guild?.id, { 
            username: interaction.user.tag,
            item: "gold",
            available: data.inv.Gold
          }),
          ephemeral: true
        });
      }
      
      const finall = Math.floor(gold_price * 0.7 * amount);
      data.credits += finall;
      data.inv.Gold -= Math.floor(amount);
      
      await data.save()
        .then(() => {
          interaction.reply({ 
            content: client.language.getString("ECONOMY_SELL_SUCCESS", interaction.guild?.id, { 
              username: interaction.user.tag,
              item: "<:e_:887036608874967121> Gold",
              amount: finall
            })
          });
        })
        .catch(err => {
          interaction.reply({ 
            content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name }),
            ephemeral: true 
          });
        });
    } else if (item === 'diamond') {
      if (data.inv.Diamond < amount) {
        return interaction.reply({ 
          content: client.language.getString("ECONOMY_SELL_INSUFFICIENT", interaction.guild?.id, { 
            username: interaction.user.tag,
            item: "diamond",
            available: data.inv.Diamond
          }),
          ephemeral: true
        });
      }
      
      const finall = Math.floor(Diamond_price * 0.7 * amount);
      data.credits += finall;
      data.inv.Diamond -= Math.floor(amount);
      
      await data.save()
        .then(() => {
          interaction.reply({ 
            content: client.language.getString("ECONOMY_SELL_SUCCESS", interaction.guild?.id, { 
              username: interaction.user.tag,
              item: "<a:Diamond:877975082868301824> Diamond",
              amount: finall
            })
          });
        })
        .catch(err => {
          interaction.reply({ 
            content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name }),
            ephemeral: true 
          });
        });
    } else {
      const nulle = new discord.EmbedBuilder()
        .setTitle(client.language.getString("ECONOMY_SELL_UNKNOWN_ITEM_TITLE", interaction.guild?.id))
        .setDescription(client.language.getString("ECONOMY_SELL_UNKNOWN_ITEM_DESC", interaction.guild?.id, {
          username: interaction.user.username,
          item: item
        }))
        .setFooter({ 
          text: interaction.user.username, 
          iconURL: interaction.user.displayAvatarURL({dynamic: true, size: 2048}) 
        })
        .setColor('Red');
      
      return interaction.reply({ embeds: [nulle], ephemeral: true });
    }
  },
}; 