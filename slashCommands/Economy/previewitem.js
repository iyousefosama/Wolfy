const discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const market = require('../../assets/json/market.json');
const text = require('../../util/string');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "previewitem",
    description: "Check what you can buy from the shop",
    dmOnly: false,
    guildOnly: false,
    cooldown: 5,
    group: "Economy",
    requiresDatabase: true,
    clientPermissions: ["AttachFiles"],
    permissions: [],
    options: [
      {
        name: "id",
        description: "The ID of the item to preview",
        type: 4, // INTEGER
        required: true
      }
    ]
  },
  async execute(client, interaction) {
    const id = interaction.options.getInteger("id");
    
    let selected = market.find(x => x.id == id);
    
    if (!selected) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_PREVIEW_INVALID", interaction.guild?.id, { 
          username: interaction.user.tag 
        }),
        ephemeral: true
      });
    }
    
    if (selected.assets?.link == null) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_PREVIEW_UNAVAILABLE", interaction.guild?.id, { 
          username: interaction.user.tag 
        }),
        ephemeral: true
      });
    }
    
    const embed = new discord.EmbedBuilder()
      .setColor(9807270)
      .setImage(selected.assets.link);
    
    return interaction.reply({
      content: client.language.getString("ECONOMY_PREVIEW_DETAILS", interaction.guild?.id, { 
        item_name: selected.name,
        item_type: selected.type,
        item_price: text.commatize(selected.price)
      }),
      embeds: [embed]
    });
  },
}; 