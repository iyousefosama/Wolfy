const discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
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
        content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name })
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
        .setTitle(client.language.getString("ECONOMY_MINE_MISSING_ITEM_TITLE", interaction.guild?.id))
        .setDescription(client.language.getString("ECONOMY_MINE_MISSING_ITEM_DESC", interaction.guild?.id, {
          username: interaction.user.username
        }))
        .setFooter({ 
          text: interaction.user.username, 
          iconURL: interaction.user.displayAvatarURL({dynamic: true, size: 2048}) 
        })
        .setColor('Red');
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
        content: client.language.getString("ECONOMY_QUEST_REWARD", interaction.guild?.id, { 
          reward: quest.reward 
        })
      });
    }

    let itemget;
    let responseMessage = "";

    // Stone pickaxe mining outcomes
    if (item && !item2 && !item3 && Math.random() * 100 < 55) {
      const stone = ["Stone <:e_:887031111790764092>"];
      itemget = Math.floor(Math.random() * 16) + 4;
      data.inv.Stone += Math.floor(itemget);
      responseMessage = client.language.getString("ECONOMY_MINE_STONE_PICKAXE", interaction.guild?.id, {
        username: interaction.user.tag,
        amount: itemget,
        item: stone[0]
      });
    } else if (item && !item2 && !item3 && Math.random() * 100 < 35) {
      const coal = ["Coal <:e_:887034070842900552>"];
      itemget = Math.floor(Math.random() * 6) + 6;
      data.inv.Coal += Math.floor(itemget);
      responseMessage = client.language.getString("ECONOMY_MINE_STONE_PICKAXE", interaction.guild?.id, {
        username: interaction.user.tag,
        amount: itemget,
        item: coal[0]
      });
    } else if (item && !item2 && !item3 && Math.random() * 100 < 5) {
      const iron = ["Iron <:e_:887034687472689192>"];
      itemget = Math.floor(Math.random() * 5) + 2;
      data.inv.Iron += Math.floor(itemget);
      responseMessage = client.language.getString("ECONOMY_MINE_STONE_PICKAXE", interaction.guild?.id, {
        username: interaction.user.tag,
        amount: itemget,
        item: iron[0]
      });
    } else if (item && !item2 && !item3 && Math.random() * 100 < 3) {
      const gold = ["Gold <:e_:887036608874967121>"];
      itemget = Math.floor(Math.random() * 2) + 1;
      data.inv.Gold += Math.floor(itemget);
      responseMessage = client.language.getString("ECONOMY_MINE_STONE_PICKAXE", interaction.guild?.id, {
        username: interaction.user.tag,
        amount: itemget,
        item: gold[0]
      });
    } else if (item && !item2 && !item3 && Math.random() * 100 < 2) {
      const diamond = ["Diamond <a:Diamond:877975082868301824>"];
      itemget = Math.floor(Math.random() * 1) + 1;
      data.inv.Diamond += Math.floor(itemget);
      responseMessage = client.language.getString("ECONOMY_MINE_STONE_PICKAXE", interaction.guild?.id, {
        username: interaction.user.tag,
        amount: itemget,
        item: diamond[0]
      });
    }
    // Iron pickaxe mining outcomes
    else if (item2 && !item3 && Math.random() * 100 < 30) {
      const stone = ["Stone <:e_:887031111790764092>"];
      itemget = Math.floor(Math.random() * 25) * 4 + 1;
      data.inv.Stone += Math.floor(itemget);
      responseMessage = client.language.getString("ECONOMY_MINE_IRON_PICKAXE", interaction.guild?.id, {
        username: interaction.user.tag,
        amount: itemget,
        item: stone[0]
      });
    } else if (item2 && !item3 && Math.random() * 100 < 10) {
      const coal = ["Coal <:e_:887034070842900552>"];
      itemget = Math.floor(Math.random() * 8) * 4 + 1;
      data.inv.Coal += Math.floor(itemget);
      responseMessage = client.language.getString("ECONOMY_MINE_IRON_PICKAXE", interaction.guild?.id, {
        username: interaction.user.tag,
        amount: itemget,
        item: coal[0]
      });
    } else if (item2 && !item3 && Math.random() * 100 < 40) {
      const iron = ["Iron <:e_:887034687472689192>"];
      itemget = Math.floor(Math.random() * 8) * 2 + 1;
      data.inv.Iron += Math.floor(itemget);
      responseMessage = client.language.getString("ECONOMY_MINE_IRON_PICKAXE", interaction.guild?.id, {
        username: interaction.user.tag,
        amount: itemget,
        item: iron[0]
      });
    } else if (item2 && !item3 && Math.random() * 100 < 10) {
      const gold = ["Gold <:e_:887036608874967121>"];
      itemget = Math.floor(Math.random() * 6) * 2 + 1;
      data.inv.Gold += Math.floor(itemget);
      responseMessage = client.language.getString("ECONOMY_MINE_IRON_PICKAXE", interaction.guild?.id, {
        username: interaction.user.tag,
        amount: itemget,
        item: gold[0]
      });
    } else if (item2 && !item3 && Math.random() * 100 < 10) {
      const diamond = ["Diamond <a:Diamond:877975082868301824>"];
      itemget = Math.floor(Math.random() * 4) * 2 + 1;
      data.inv.Diamond += Math.floor(itemget);
      responseMessage = client.language.getString("ECONOMY_MINE_IRON_PICKAXE", interaction.guild?.id, {
        username: interaction.user.tag,
        amount: itemget,
        item: diamond[0]
      });
    }
    // Diamond pickaxe mining outcomes
    else if (item3 && Math.random() * 100 < 15) {
      const stone = ["Stone <:e_:887031111790764092>"];
      itemget = Math.floor(Math.random() * 64) * 2 + 1;
      data.inv.Stone += Math.floor(itemget);
      responseMessage = client.language.getString("ECONOMY_MINE_DIAMOND_PICKAXE", interaction.guild?.id, {
        username: interaction.user.tag,
        amount: itemget,
        item: stone[0]
      });
    } else if (item3 && Math.random() * 100 < 5) {
      const coal = ["Coal <:e_:887034070842900552>"];
      itemget = Math.floor(Math.random() * 32) * 2 + 1;
      data.inv.Coal += Math.floor(itemget);
      responseMessage = client.language.getString("ECONOMY_MINE_DIAMOND_PICKAXE", interaction.guild?.id, {
        username: interaction.user.tag,
        amount: itemget,
        item: coal[0]
      });
    } else if (item3 && Math.random() * 100 < 45) {
      const iron = ["Iron <:e_:887034687472689192>"];
      itemget = Math.floor(Math.random() * 16) * 2 + 1;
      data.inv.Iron += Math.floor(itemget);
      responseMessage = client.language.getString("ECONOMY_MINE_DIAMOND_PICKAXE", interaction.guild?.id, {
        username: interaction.user.tag,
        amount: itemget,
        item: iron[0]
      });
    } else if (item3 && Math.random() * 100 < 25) {
      const gold = ["Gold <:e_:887036608874967121>"];
      itemget = Math.floor(Math.random() * 8) * 3 + 1;
      data.inv.Gold += Math.floor(itemget);
      responseMessage = client.language.getString("ECONOMY_MINE_DIAMOND_PICKAXE", interaction.guild?.id, {
        username: interaction.user.tag,
        amount: itemget,
        item: gold[0]
      });
    } else if (item3 && Math.random() * 100 < 10) {
      const diamond = ["Diamond <a:Diamond:877975082868301824>"];
      itemget = Math.floor(Math.random() * 12) * 2 + 1;
      data.inv.Diamond += Math.floor(itemget);
      responseMessage = client.language.getString("ECONOMY_MINE_DIAMOND_PICKAXE", interaction.guild?.id, {
        username: interaction.user.tag,
        amount: itemget,
        item: diamond[0]
      });
    } else {
      const stone = ["Stone <:e_:887031111790764092>"];
      itemget = Math.floor(Math.random() * 6) + 1;
      data.inv.Stone += Math.floor(itemget);
      responseMessage = client.language.getString("ECONOMY_MINE_DEFAULT", interaction.guild?.id, {
        username: interaction.user.tag,
        amount: itemget,
        item: stone[0]
      });
    }

    await data.save()
      .then(() => {
        interaction.reply({ content: responseMessage });
      })
      .catch((err) => {
        interaction.reply({ 
          content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name }),
          ephemeral: true
        });
      });
  },
}; 