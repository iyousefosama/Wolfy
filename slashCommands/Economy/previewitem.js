const discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { colors } = require('../../util/constants/constants');
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
        content: `\\❌ **${interaction.user.tag}**, Could not find the item with that ID!`,
        flags: ['Ephemeral']
      });
    }
    
    if (selected.assets?.link == null) {
      return interaction.reply({
        content: `\\❌ **${interaction.user.tag}**, There is no preview for this item!`,
        flags: ['Ephemeral']
      });
    }
    
    const embed = new discord.EmbedBuilder()
      .setColor(colors.ECONOMY)
      .setImage(selected.assets.link);
    
    return interaction.reply({
      content: `> \`Item Name:\` **${selected.name}**, \`Item Type:\` **${selected.type}**, \`Item Price:\` **${text.commatize(selected.price)}**`,
      embeds: [embed]
    });
  },
}; 