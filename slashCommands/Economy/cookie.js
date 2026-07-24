const discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { colors } = require('../../util/constants/constants');
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
        content: `\\❌ **${interaction.user.tag}**, You can't give yourself a cookie!`
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
        content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
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
        .setTitle("❌ Missing item!")
        .setDescription(`**${interaction.user.username}**, You can only give \`350\` cookies for free you should now buy **UltimateCookie Machine**!
Type \`/buy item:2\` to buy the item.`)
        .setFooter({ 
          text: interaction.user.username, 
          iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }) 
        })
        .setColor(colors.ERROR);
        
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
        content: `\\💰 You've completed a quest and received **${quest.reward}** Credits as reward!`
      });
    }
    
    return Promise.all([data.save(), friendData.save()])
      .then(() => {
        const embed = new discord.EmbedBuilder()
          .setTitle("<a:Cookie:853495749370839050> Cookie is given!")
          .setDescription(`**${interaction.user.username}**, gave ${friend} a cookie!
💰 ${interaction.user.username} got (\`+${moneyget}\`) credits for being a nice friend!

📥 ${data.cookies.totalcookies} | 📤 ${data.cookies.givecookies}`)
          .setColor('#E6CEA0');
          
        interaction.reply({ embeds: [embed] });
      })
      .catch((err) => interaction.reply({
        content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
      }));
  },
}; 