const discord = require('discord.js');
const { EmbedBuilder, ButtonStyle } = require('discord.js');
const schema = require('../../schema/Economy-Schema');
const _ = require('lodash');
const Pages = require('../../util/Paginate');
const market = require('../../assets/json/market.json');
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "inv",
    description: "Show your inventory items",
    dmOnly: false,
    guildOnly: false,
    cooldown: 15,
    requiresDatabase: true,
    group: "Economy",
    clientPermissions: [],
    permissions: [],
    options: [
      {
        name: "type",
        description: "The type of inventory to view",
        type: 3, // STRING
        required: false,
        choices: [
          {
            name: "Items",
            value: "items"
          },
          {
            name: "Mining",
            value: "mining"
          }
        ]
      }
    ]
  },
  async execute(client, interaction) {
    const type = interaction.options.getString("type") || "items";
    
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
    
    if (type === "mining") {
      const mineInv = new discord.EmbedBuilder()
        .setAuthor({ 
          name: client.user.username, 
          iconURL: client.user.displayAvatarURL({dynamic: true, size: 2048}) 
        })
        .setColor('#2F3136')
        .setTitle(client.language.getString("ECONOMY_INV_MINING_TITLE", interaction.guild?.id, {
          username: interaction.user.username
        }))
        .addFields(
          { name: '<:e_:887034070842900552> Coal', value: `\`\`\`${data.inv.Coal}\`\`\``},
          { name: '<:e_:887031111790764092> Stone', value: `\`\`\`${data.inv.Stone}\`\`\``},
          { name: '<:e_:887034687472689192> Iron', value: `\`\`\`${data.inv.Iron}\`\`\``},
          { name: '<:e_:887036608874967121> Gold', value: `\`\`\`${data.inv.Gold}\`\`\``},
          { name: '<a:Diamond:877975082868301824> Diamond', value: `\`\`\`${data.inv.Diamond}\`\`\``}
        )
        .setURL('https://Wolfy.yoyojoe.repl.co')
        .setFooter({ 
          text: client.language.getString("ECONOMY_INV_MINING_FOOTER", interaction.guild?.id, {
            prefix: client.prefix
          }),
          iconURL: interaction.user.displayAvatarURL({dynamic: true, size: 2048}) 
        })
        .setTimestamp();
        
      return interaction.reply({ embeds: [mineInv] });
    }
    
    // Regular inventory
    const pages = new Pages(_.chunk(data.profile.inventory, 25).map((chunk, i, o) => {
      return new EmbedBuilder()
        .setColor('Grey')
        .setTitle(client.language.getString("ECONOMY_INV_TITLE", interaction.guild?.id, {
          username: interaction.user.tag
        }))
        .setURL('https://wolfy.yoyojoe.repl.co/')
        .setFooter({ 
          text: client.language.getString("ECONOMY_INV_FOOTER", interaction.guild?.id, {
            username: interaction.user.tag,
            year: new Date().getFullYear(),
            current_page: i+1,
            total_pages: o.length
          })
        })
        .addFields(...chunk.sort((A,B) => A.id - B.id).map(d => {
          const item = market.find(x => x.id == d.id);
          return {
            inline: true,
            name: `\`[${item.id}]\` ${item.name}`,
            value: [
              `${client.language.getString("ECONOMY_INV_ITEM_TYPE", interaction.guild?.id)}: *${item.type}*`,
              `${client.language.getString("ECONOMY_INV_ITEM_PRICE", interaction.guild?.id)}: *${Math.floor(item.price / 0.7)}*`,
              item.type != "Item" ? `${client.language.getString("ECONOMY_INV_ITEM_USE", interaction.guild?.id)}: \`/use item:${item.id}\`` : ''
            ].join('\n')
          };
        }));
    }));
    
    if (!pages.size) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_INV_EMPTY", interaction.guild?.id, { 
          username: interaction.user.tag 
        })
      });
    }
    
    // Mining inventory button
    const miningButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setEmoji('853495153280155668')
      .setLabel(client.language.getString("ECONOMY_INV_MINING_BUTTON", interaction.guild?.id))
      .setCustomId("mining_inventory");
      
    // Navigation buttons
    const prevButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('890490643548352572')
      .setCustomId("prev_page");
      
    const nextButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('890490558492061736')
      .setCustomId("next_page");
      
    const closeButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Danger)
      .setEmoji('888264104081522698')
      .setCustomId("close_menu");
    
    const row = new ActionRowBuilder().addComponents(prevButton, nextButton, closeButton, miningButton);
    
    // If only one page, disable navigation buttons
    if (pages.size === 1) {
      prevButton.setDisabled(true);
      nextButton.setDisabled(true);
    }
    
    const response = await interaction.reply({ 
      embeds: [pages.firstPage], 
      components: [row],
      fetchReply: true
    });
    
    // Create collector for button interactions
    const collector = response.createMessageComponentCollector({ 
      filter: i => i.user.id === interaction.user.id,
      time: 90000 
    });
    
    collector.on('collect', async i => {
      if (i.customId === 'mining_inventory') {
        const mineInv = new discord.EmbedBuilder()
          .setAuthor({ 
            name: client.user.username, 
            iconURL: client.user.displayAvatarURL({dynamic: true, size: 2048}) 
          })
          .setColor('#2F3136')
          .setTitle(client.language.getString("ECONOMY_INV_MINING_TITLE", interaction.guild?.id, {
            username: interaction.user.username
          }))
          .addFields(
            { name: '<:e_:887034070842900552> Coal', value: `\`\`\`${data.inv.Coal}\`\`\``},
            { name: '<:e_:887031111790764092> Stone', value: `\`\`\`${data.inv.Stone}\`\`\``},
            { name: '<:e_:887034687472689192> Iron', value: `\`\`\`${data.inv.Iron}\`\`\``},
            { name: '<:e_:887036608874967121> Gold', value: `\`\`\`${data.inv.Gold}\`\`\``},
            { name: '<a:Diamond:877975082868301824> Diamond', value: `\`\`\`${data.inv.Diamond}\`\`\``}
          )
          .setURL('https://Wolfy.yoyojoe.repl.co')
          .setFooter({ 
            text: client.language.getString("ECONOMY_INV_MINING_FOOTER", interaction.guild?.id, {
              prefix: client.prefix
            }),
            iconURL: interaction.user.displayAvatarURL({dynamic: true, size: 2048}) 
          })
          .setTimestamp();
          
        await i.reply({ embeds: [mineInv], ephemeral: true });
      } 
      else if (i.customId === 'prev_page') {
        await i.update({ embeds: [pages.previous()], components: [row] });
      } 
      else if (i.customId === 'next_page') {
        await i.update({ embeds: [pages.next()], components: [row] });
      } 
      else if (i.customId === 'close_menu') {
        collector.stop();
      }
    });
    
    collector.on('end', () => {
      // Disable all buttons
      prevButton.setDisabled(true);
      nextButton.setDisabled(true);
      closeButton.setDisabled(true);
      miningButton.setDisabled(true);
      
      const disabledRow = new ActionRowBuilder().addComponents(prevButton, nextButton, closeButton, miningButton);
      
      interaction.editReply({ 
        components: [disabledRow] 
      }).catch(() => null);
    });
  },
}; 