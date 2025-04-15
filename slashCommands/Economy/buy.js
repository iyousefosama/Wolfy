const { SlashCommandBuilder } = require("@discordjs/builders");
const market = require('../../assets/json/market.json');
const schema = require('../../schema/Economy-Schema');
const text = require('../../util/string');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "buy",
    description: "Buy items from the market",
    dmOnly: false,
    guildOnly: false,
    cooldown: 2,
    requiresDatabase: true,
    group: "Economy",
    clientPermissions: [],
    permissions: [],
    options: [
      {
        name: "item",
        description: "The ID of the item you want to buy",
        type: 4, // INTEGER
        required: true
      }
    ]
  },
  async execute(client, interaction) {
    const itemId = interaction.options.getInteger("item");
    
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
    
    const item = market.find(x => x.id == itemId);
    
    if (!item || item == null) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_BUY_INVALID", interaction.guild?.id, { 
          username: interaction.user.tag,
          prefix: client.prefix,
          random_id: Math.floor(Math.random() * market.length)
        })
      });
    }
    
    const old = data.profile.inventory.find(x => x.id === item.id);
    const total = item.price;
    
    if (old) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_BUY_ALREADY", interaction.guild?.id, { 
          username: interaction.user.tag
        })
      });
    } else if (data.credits < total) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_BUY_INSUFFICIENT", interaction.guild?.id, { 
          username: interaction.user.tag,
          missing: text.commatize(total - data.credits),
          item: item.name
        })
      });
    } else {
      data.profile.inventory.push({
        id: item.id
      });
      
      data.credits = data.credits - total;
      
      return data.save()
        .then(() => interaction.reply({
          content: client.language.getString("ECONOMY_BUY_SUCCESS", interaction.guild?.id, { 
            username: interaction.user.tag,
            item: item.name,
            price: text.commatize(item.price)
          })
        }))
        .catch((err) => interaction.reply({
          content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name })
        }));
    }
  },
}; 