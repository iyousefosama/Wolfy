const discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { colors } = require('../../util/constants/constants');
const schema = require('../../schema/Economy-Schema');
const market = require('../../assets/json/market.json');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "mine",
    description: "What you know about mining down in the deep?",
    dmOnly: false,
    guildOnly: true,
    cooldown: 8,
    group: "Economy",
    requiresDatabase: true,
    clientPermissions: [],
    permissions: [],
    options: []
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
        content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
      });
      return client.logDetailedError({
        error: err,
        eventType: "DATABASE_ERR",
        interaction: interaction
      });
    }

    const item = data.profile.inventory.find(x => x.id == 3);
    const item2 = data.profile.inventory.find(x => x.id == 4);
    const item3 = data.profile.inventory.find(x => x.id == 5);

    if (!item && !item2 && !item3) {
      const nulle = new discord.EmbedBuilder()
        .setTitle("❌ Missing item!")
        .setDescription(`**${interaction.user.username}**, you didn't buy a pickaxe to mine yet!

Use \`/market\` to show the market.`)
        .setFooter({ 
          text: interaction.user.username, 
          iconURL: interaction.user.displayAvatarURL({dynamic: true, size: 2048}) 
        })
        .setColor(colors.ERROR);
      return interaction.reply({ embeds: [nulle] });
    }

    const quest = data.progress.quests?.find(x => x.id == 7);
    let Box = quest?.current;

    if (quest?.current < quest?.progress) {
      Box++;
      await schema.findOneAndUpdate(
        { userID: interaction.user.id, "progress.quests.id": 7 }, 
        { $inc: { "progress.quests.$.current": 1 } }
      );
    }
    
    if (Box && Box >= quest?.progress && !quest?.received) {
      data.credits += Math.floor(quest.reward);
      await schema.findOneAndUpdate(
        { userID: interaction.user.id, "progress.quests.id": 7 }, 
        { $set: { "progress.quests.$.received": true } }
      );
      data.progress.completed++;
      interaction.channel.send({
        content: `\\💰 You've completed a quest and received **${quest.reward}** Credits as reward!`
      });
    }

    let itemget;
    let responseMessage = "";

    // Stone pickaxe mining outcomes
    if (item && !item2 && !item3 && Math.random() * 100 < 55) {
      const stone = ["Stone 🪨"];
      itemget = Math.floor(Math.random() * 16) + 4;
      data.inv.Stone += Math.floor(itemget);
      responseMessage = `⛏️ **${interaction.user.tag}**, you mine: \`+${itemget}\` **${stone[0]}** you can see this item count and sell it from your inv by \`/inv type:mining\`!`;
    } else if (item && !item2 && !item3 && Math.random() * 100 < 35) {
      const coal = ["Coal 🪙"];
      itemget = Math.floor(Math.random() * 6) + 6;
      data.inv.Coal += Math.floor(itemget);
      responseMessage = `⛏️ **${interaction.user.tag}**, you mine: \`+${itemget}\` **${coal[0]}** you can see this item count and sell it from your inv by \`/inv type:mining\`!`;
    } else if (item && !item2 && !item3 && Math.random() * 100 < 5) {
      const iron = ["Iron 🧪"];
      itemget = Math.floor(Math.random() * 5) + 2;
      data.inv.Iron += Math.floor(itemget);
      responseMessage = `⛏️ **${interaction.user.tag}**, you mine: \`+${itemget}\` **${iron[0]}** you can see this item count and sell it from your inv by \`/inv type:mining\`!`;
    } else if (item && !item2 && !item3 && Math.random() * 100 < 3) {
      const gold = ["Gold 🌟"];
      itemget = Math.floor(Math.random() * 2) + 1;
      data.inv.Gold += Math.floor(itemget);
      responseMessage = `⛏️ **${interaction.user.tag}**, you mine: \`+${itemget}\` **${gold[0]}** you can see this item count and sell it from your inv by \`/inv type:mining\`!`;
    } else if (item && !item2 && !item3 && Math.random() * 100 < 2) {
      const diamond = ["Diamond 💎"];
      itemget = Math.floor(Math.random() * 1) + 1;
      data.inv.Diamond += Math.floor(itemget);
      responseMessage = `⛏️ **${interaction.user.tag}**, you mine: \`+${itemget}\` **${diamond[0]}** you can see this item count and sell it from your inv by \`/inv type:mining\`!`;
    }
    // Iron pickaxe mining outcomes
    else if (item2 && !item3 && Math.random() * 100 < 30) {
      const stone = ["Stone 🪨"];
      itemget = Math.floor(Math.random() * 25) * 4 + 1;
      data.inv.Stone += Math.floor(itemget);
      responseMessage = `🪙 **${interaction.user.tag}**, you mine: \`+${itemget}\` **${stone[0]}** you can see this item count and sell it from your inv by \`/inv type:mining\`!`;
    } else if (item2 && !item3 && Math.random() * 100 < 10) {
      const coal = ["Coal 🪙"];
      itemget = Math.floor(Math.random() * 8) * 4 + 1;
      data.inv.Coal += Math.floor(itemget);
      responseMessage = `🪙 **${interaction.user.tag}**, you mine: \`+${itemget}\` **${coal[0]}** you can see this item count and sell it from your inv by \`/inv type:mining\`!`;
    } else if (item2 && !item3 && Math.random() * 100 < 40) {
      const iron = ["Iron 🧪"];
      itemget = Math.floor(Math.random() * 8) * 2 + 1;
      data.inv.Iron += Math.floor(itemget);
      responseMessage = `🪙 **${interaction.user.tag}**, you mine: \`+${itemget}\` **${iron[0]}** you can see this item count and sell it from your inv by \`/inv type:mining\`!`;
    } else if (item2 && !item3 && Math.random() * 100 < 10) {
      const gold = ["Gold 🌟"];
      itemget = Math.floor(Math.random() * 6) * 2 + 1;
      data.inv.Gold += Math.floor(itemget);
      responseMessage = `🪙 **${interaction.user.tag}**, you mine: \`+${itemget}\` **${gold[0]}** you can see this item count and sell it from your inv by \`/inv type:mining\`!`;
    } else if (item2 && !item3 && Math.random() * 100 < 10) {
      const diamond = ["Diamond 💎"];
      itemget = Math.floor(Math.random() * 4) * 2 + 1;
      data.inv.Diamond += Math.floor(itemget);
      responseMessage = `🪙 **${interaction.user.tag}**, you mine: \`+${itemget}\` **${diamond[0]}** you can see this item count and sell it from your inv by \`/inv type:mining\`!`;
    }
    // Diamond pickaxe mining outcomes
    else if (item3 && Math.random() * 100 < 15) {
      const stone = ["Stone 🪨"];
      itemget = Math.floor(Math.random() * 64) * 2 + 1;
      data.inv.Stone += Math.floor(itemget);
      responseMessage = `💎 **${interaction.user.tag}**, you mine: \`+${itemget}\` **${stone[0]}** you can see this item count and sell it from your inv by \`/inv type:mining\`!`;
    } else if (item3 && Math.random() * 100 < 5) {
      const coal = ["Coal 🪙"];
      itemget = Math.floor(Math.random() * 32) * 2 + 1;
      data.inv.Coal += Math.floor(itemget);
      responseMessage = `💎 **${interaction.user.tag}**, you mine: \`+${itemget}\` **${coal[0]}** you can see this item count and sell it from your inv by \`/inv type:mining\`!`;
    } else if (item3 && Math.random() * 100 < 45) {
      const iron = ["Iron 🧪"];
      itemget = Math.floor(Math.random() * 16) * 2 + 1;
      data.inv.Iron += Math.floor(itemget);
      responseMessage = `💎 **${interaction.user.tag}**, you mine: \`+${itemget}\` **${iron[0]}** you can see this item count and sell it from your inv by \`/inv type:mining\`!`;
    } else if (item3 && Math.random() * 100 < 25) {
      const gold = ["Gold 🌟"];
      itemget = Math.floor(Math.random() * 8) * 3 + 1;
      data.inv.Gold += Math.floor(itemget);
      responseMessage = `💎 **${interaction.user.tag}**, you mine: \`+${itemget}\` **${gold[0]}** you can see this item count and sell it from your inv by \`/inv type:mining\`!`;
    } else if (item3 && Math.random() * 100 < 10) {
      const diamond = ["Diamond 💎"];
      itemget = Math.floor(Math.random() * 12) * 2 + 1;
      data.inv.Diamond += Math.floor(itemget);
      responseMessage = `💎 **${interaction.user.tag}**, you mine: \`+${itemget}\` **${diamond[0]}** you can see this item count and sell it from your inv by \`/inv type:mining\`!`;
    } else {
      const stone = ["Stone 🪨"];
      itemget = Math.floor(Math.random() * 6) + 1;
      data.inv.Stone += Math.floor(itemget);
      responseMessage = `\\❌ **${interaction.user.tag}**, you mine: \`+${itemget}\` **${stone[0]}** you can see this item count and sell it from your inv by \`/inv type:mining\`!`;
    }

    await data.save()
      .then(() => {
        interaction.reply({ content: responseMessage });
      })
      .catch((err) => {
        interaction.reply({ 
          content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`,
          flags: ['Ephemeral']
        });
      });
  },
}; 