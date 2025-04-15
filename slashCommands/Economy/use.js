const { SlashCommandBuilder } = require("@discordjs/builders");
const market = require('../../assets/json/market.json');
const schema = require('../../schema/Economy-Schema');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "use",
    description: "Equips an item from your inventory",
    dmOnly: false,
    guildOnly: false,
    cooldown: 2,
    group: "Economy",
    requiresDatabase: true,
    clientPermissions: [],
    permissions: [],
    options: [
      {
        name: "item",
        description: "The ID of the item to use",
        type: 4, // INTEGER
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
    
    const id = interaction.options.getInteger("item");
    const item = data.profile.inventory.find(x => x.id == id);
    
    if (!item) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_USE_NOT_OWNED", interaction.guild?.id, { 
          username: interaction.user.tag 
        }),
        ephemeral: true
      });
    }
    
    const metadata = market.find(x => x.id === item.id);
    
    if (!metadata) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_USE_UNAVAILABLE", interaction.guild?.id, { 
          username: interaction.user.tag 
        }),
        ephemeral: true
      });
    }
    
    if (metadata.assets?.link == null) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_USE_UNUSABLE", interaction.guild?.id, { 
          username: interaction.user.tag 
        }),
        ephemeral: true
      });
    }
    
    data.profile[metadata.type] = metadata.assets.link;
    
    try {
      await data.save();
      interaction.reply({
        content: client.language.getString("ECONOMY_USE_SUCCESS", interaction.guild?.id, { 
          username: interaction.user.tag,
          item_name: metadata.name
        })
      });
    } catch (err) {
      interaction.reply({
        content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name }),
        ephemeral: true
      });
    }
  },
}; 