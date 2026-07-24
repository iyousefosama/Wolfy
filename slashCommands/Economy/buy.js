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
        content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
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
        content: `\\❌ **${interaction.user.tag}**, Could not find this \`item ID\`!
The proper usage for this command would be \`/buy item:[item id]\`.
Example: \`/buy item:${Math.floor(Math.random() * market.length)}\``
      });
    }
    
    const old = data.profile.inventory.find(x => x.id === item.id);
    const total = item.price;
    
    if (old) {
      return interaction.reply({
        content: `\\❌ **${interaction.user.tag}**, you already have this item in your inventory`
      });
    } else if (data.credits < total) {
      return interaction.reply({
        content: `\\❌ **${interaction.user.tag}**, You do not have enough credits to proceed with this transaction!
You need **${text.commatize(total - data.credits)}** more for **${item.name}**`
      });
    } else {
      data.profile.inventory.push({
        id: item.id
      });
      
      data.credits = data.credits - total;
      
      return data.save()
        .then(() => interaction.reply({
          content: `🎒 **${interaction.user.tag}**, Successfully purchased **${item.name}!** for \`${text.commatize(item.price)}\``
        }))
        .catch((err) => interaction.reply({
          content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
        }));
    }
  },
}; 