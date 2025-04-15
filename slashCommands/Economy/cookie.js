const discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const schema = require('../../schema/Economy-Schema');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "cookie",
    description: "Send a cookie to a friend as a gift",
    dmOnly: false,
    guildOnly: true,
    cooldown: 5,
    requiresDatabase: true,
    group: "Economy",
    clientPermissions: [],
    permissions: [],
    options: [
      {
        name: "user",
        description: "The user you want to give a cookie to",
        type: 6, // USER
        required: true
      }
    ]
  },
  async execute(client, interaction) {
    const friend = interaction.options.getUser("user");
    
    if (friend.id === interaction.user.id) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_COOKIE_SELF", interaction.guild?.id, { 
          username: interaction.user.tag
        })
      });
    }
    
    let data;
    let friendData;
    try {
      data = await schema.findOne({
        userID: interaction.user.id,
      });
      friendData = await schema.findOne({
        userID: friend.id,
      });
      
      if (!data) {
        data = await schema.create({
          userID: interaction.user.id,
        });
      }
      
      if (!friendData) {
        friendData = await schema.create({
          userID: friend.id,
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
    
    const item = data.profile.inventory.find(x => x.id == 2);
    const quest = data.progress.quests?.find(x => x.id == 2);
    let Box = quest?.current;
    
    if (!item && data.cookies.givecookies >= 350) {
      const embed = new discord.EmbedBuilder()
        .setTitle(client.language.getString("ECONOMY_COOKIE_MISSING_ITEM_TITLE", interaction.guild?.id))
        .setDescription(client.language.getString("ECONOMY_COOKIE_MISSING_ITEM_DESC", interaction.guild?.id, {
          username: interaction.user.username,
          prefix: client.prefix
        }))
        .setFooter({ 
          text: interaction.user.username, 
          iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) 
        })
        .setColor('Red');
        
      return interaction.reply({ embeds: [embed] });
    }
    
    let moneyget = Math.floor(Math.random() * 70) + 10;
    data.credits += Math.floor(moneyget);
    data.cookies.givecookies++;
    friendData.cookies.totalcookies++;
    
    if (quest?.current < quest?.progress) {
      Box++;
      await schema.findOneAndUpdate(
        { userID: interaction.user.id, "progress.quests.id": 2 }, 
        { $inc: { "progress.quests.$.current": 1 } }
      );
    }
    
    if (Box && Box == quest?.progress && !quest?.received) {
      data.credits += Math.floor(quest.reward);
      await schema.findOneAndUpdate(
        { userID: interaction.user.id, "progress.quests.id": 2 }, 
        { $set: { "progress.quests.$.received": true } }
      );
      data.progress.completed++;
      await data.save();
      await friendData.save();
      return interaction.reply({ 
        content: client.language.getString("ECONOMY_QUEST_REWARD", interaction.guild?.id, { 
          reward: quest.reward 
        })
      });
    }
    
    return Promise.all([data.save(), friendData.save()])
      .then(() => {
        const embed = new discord.EmbedBuilder()
          .setTitle(client.language.getString("ECONOMY_COOKIE_GIVEN_TITLE", interaction.guild?.id))
          .setDescription(client.language.getString("ECONOMY_COOKIE_GIVEN_DESC", interaction.guild?.id, {
            username: interaction.user.username,
            friend: friend,
            money: moneyget,
            received: data.cookies.totalcookies,
            given: data.cookies.givecookies
          }))
          .setColor('#E6CEA0');
          
        interaction.reply({ embeds: [embed] });
      })
      .catch((err) => interaction.reply({
        content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name })
      }));
  },
}; 