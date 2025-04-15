const discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const _ = require('lodash');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const market = require('../../assets/json/market.json');
const text = require('../../util/string');
const schema = require('../../schema/Economy-Schema');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "market",
    description: "Open the economy market to see items for sale",
    dmOnly: false,
    guildOnly: true,
    cooldown: 15,
    group: "Economy",
    requiresDatabase: true,
    clientPermissions: ["UseExternalEmojis", "EmbedLinks"],
    permissions: [],
    options: [
      {
        name: "type",
        description: "Filter items by type",
        type: 3, // STRING
        required: false
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
        content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name })
      });
      return client.logDetailedError({
        error: err,
        eventType: "DATABASE_ERR",
        interaction: interaction
      });
    }

    const type = interaction.options.getString("type");
    let selected = market.filter(x => x.type === type?.toLowerCase());

    if (!selected.length) {
      selected = market;
    }

    const quest = data.progress.quests?.find(x => x.id == 6);
    let Box = quest?.current;

    // Create pages of items
    const pages = _.chunk(selected, 24).map((chunk, i, o) => {
      return new EmbedBuilder()
        .setTitle(client.language.getString("ECONOMY_MARKET_TITLE", interaction.guild?.id))
        .setColor('Grey')
        .setURL(client.language.getString("ECONOMY_MARKET_URL", interaction.guild?.id))
        .setFooter({ 
          text: client.language.getString("ECONOMY_MARKET_FOOTER", interaction.guild?.id, {
            year: new Date().getFullYear(),
            current_page: i+1,
            total_pages: o.length
          })
        })
        .addFields(...chunk.map(item => {
          return {
            inline: true,
            name: `\`[${item.id}]\` ${item.name}`,
            value: client.language.getString("ECONOMY_MARKET_ITEM_DETAILS", interaction.guild?.id, {
              description: item.description,
              type: item.type,
              price: text.commatize(item.price),
              preview_command: item.type != "Item" ? client.language.getString("ECONOMY_MARKET_PREVIEW_COMMAND", interaction.guild?.id, { item_id: item.id }) : '',
              purchase_command: client.language.getString("ECONOMY_MARKET_PURCHASE_COMMAND", interaction.guild?.id, { item_id: item.id })
            })
          };
        }));
    });

    // Update quest progress
    if (quest?.current < quest?.progress) {
      Box++;
      await schema.findOneAndUpdate(
        { userID: interaction.user.id, "progress.quests.id": 6 }, 
        { $inc: { "progress.quests.$.current": 1 } }
      );
    }
    
    if (Box && Box == quest?.progress && !quest?.received) {
      data.credits += Math.floor(quest.reward);
      await schema.findOneAndUpdate(
        { userID: interaction.user.id, "progress.quests.id": 6 }, 
        { $set: { "progress.quests.$.received": true } }
      );
      data.progress.completed++;
      await data.save();
      interaction.channel.send({
        content: client.language.getString("ECONOMY_QUEST_REWARD", interaction.guild?.id, { 
          reward: quest.reward 
        })
      });
    }

    // No need for pagination if there's only one page
    if (pages.length === 1) {
      return interaction.reply({ embeds: [pages[0]] });
    }

    // Create navigation buttons
    let currentPage = 0;
    const prevButton = new ButtonBuilder()
      .setCustomId('prev')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('890490643548352572') // Previous emoji
      .setDisabled(true);

    const nextButton = new ButtonBuilder()
      .setCustomId('next')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('890490558492061736'); // Next emoji

    const row = new ActionRowBuilder().addComponents(prevButton, nextButton);

    // Send the initial message with buttons
    const response = await interaction.reply({
      embeds: [pages[currentPage]],
      components: [row],
      fetchReply: true
    });

    // Create collector for button interactions
    const collector = response.createMessageComponentCollector({
      filter: i => i.user.id === interaction.user.id,
      time: 90000 // 1.5 minutes
    });

    collector.on('collect', async i => {
      await i.deferUpdate();
      
      if (i.customId === 'prev') {
        currentPage--;
      } else if (i.customId === 'next') {
        currentPage++;
      }

      // Update button states
      prevButton.setDisabled(currentPage === 0);
      nextButton.setDisabled(currentPage === pages.length - 1);
      
      // Update the message with the new page and updated buttons
      await i.editReply({
        embeds: [pages[currentPage]],
        components: [new ActionRowBuilder().addComponents(prevButton, nextButton)]
      });
    });

    collector.on('end', async () => {
      // Disable all buttons when the collector ends
      prevButton.setDisabled(true);
      nextButton.setDisabled(true);
      
      await interaction.editReply({
        components: [new ActionRowBuilder().addComponents(prevButton, nextButton)]
      }).catch(() => {});
    });
  }
}; 