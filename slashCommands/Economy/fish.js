const discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { colors } = require('../../util/constants/constants');
const schema = require('../../schema/Economy-Schema')

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "fish",
    description: "Take your fishing pole and start fishing",
    dmOnly: false,
    guildOnly: true,
    cooldown: 13,
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
      })
    }

    const item = data.profile.inventory.find(x => x.id == 1);
    const quest = data.progress.quests?.find(x => x.id == 1);
    let Box = quest?.current;
    
    if (!item) {
      const nulle = new discord.EmbedBuilder()
        .setTitle("❌ Missing item!")
        .setDescription(`**${interaction.user.username}**, you didn't buy the **FishingPole** item from the shop!
Use \`/market\` to show the market.`)
        .setFooter({ 
          text: interaction.user.username, 
          iconURL: interaction.user.displayAvatarURL({dynamic: true, size: 2048}) 
        })
        .setColor(colors.ERROR);
      return interaction.reply({ embeds: [nulle] });
    }

    await interaction.reply({ 
      content: "> ⏳ Fishing from the pond..." 
    });
    
    let moneyget;
    
    if (Math.random() * 100 < 37) {
      const trashitems = ["Trash 👞", "Trash 🔧", "Trash 🧻", "Trash 🗑️", "Trash 📎"];
      const trash = trashitems[Math.floor(Math.random() * trashitems.length)];
      moneyget = Math.floor(Math.random() * 20) + 20;
      data.credits += Math.floor(moneyget);
      await data.save()
        .then(() => {
          interaction.editReply({ 
            content: `🎣 **${interaction.user.tag}**, you caught: **${trash}** from the Pool and got 💰 **${moneyget}**!`
          });
        })
        .catch((err) => interaction.editReply({ 
          content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
        }));
    } else if (Math.random() * 100 < 33) {
      const common = ["CommonFish 🐟"];
      moneyget = Math.floor(Math.random() * 80) + 60;
      data.credits += Math.floor(moneyget);
      
      if (quest?.current < quest?.progress) {
        Box++;
        await schema.findOneAndUpdate(
          { userID: interaction.user.id, "progress.quests.id": 1 }, 
          { $inc: { "progress.quests.$.current": 1 } }
        );
      }
      
      if (Box && Box == quest?.progress && !quest?.received) {
        data.credits += Math.floor(quest.reward);
        await schema.findOneAndUpdate(
          { userID: interaction.user.id, "progress.quests.id": 1 }, 
          { $set: { "progress.quests.$.received": true } }
        );
        data.progress.completed++;
        interaction.channel.send({
          content: `\\💰 You've completed a quest and received **${quest.reward}** Credits as reward!`
        });
      }
      
      await data.save()
        .then(() => {
          interaction.editReply({ 
            content: `🎣 **${interaction.user.tag}**, you caught: **${common[0]}** from the Pool and got 💰 **${moneyget}**!`
          });
        })
        .catch((err) => interaction.editReply({ 
          content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
        }));
    } else if (Math.random() * 100 < 15) {
      const uncommon = ["UncommonFish 🐠"];
      moneyget = Math.floor(Math.random() * 180) + 130;
      data.credits += Math.floor(moneyget);
      
      if (quest?.current < quest?.progress) {
        Box++;
        await schema.findOneAndUpdate(
          { userID: interaction.user.id, "progress.quests.id": 1 }, 
          { $inc: { "progress.quests.$.current": 1 } }
        );
      }
      
      if (Box && Box == quest?.progress && !quest?.received) {
        data.credits += Math.floor(quest.reward);
        await schema.findOneAndUpdate(
          { userID: interaction.user.id, "progress.quests.id": 1 }, 
          { $set: { "progress.quests.$.received": true } }
        );
        data.progress.completed++;
        interaction.channel.send({
          content: `\\💰 You've completed a quest and received **${quest.reward}** Credits as reward!`
        });
      }
      
      await data.save()
        .then(() => {
          interaction.editReply({ 
            content: `🎣 **${interaction.user.tag}**, you caught: **${uncommon[0]}** from the Pool and got 💰 **${moneyget}**!`
          });
        })
        .catch((err) => interaction.editReply({ 
          content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
        }));
    } else if (Math.random() * 100 < 12) {
      const rare = ["RareFish 🐟"];
      moneyget = Math.floor(Math.random() * 240) + 150;
      data.credits += Math.floor(moneyget);
      
      if (quest?.current < quest?.progress) {
        Box++;
        await schema.findOneAndUpdate(
          { userID: interaction.user.id, "progress.quests.id": 1 }, 
          { $inc: { "progress.quests.$.current": 1 } }
        );
      }
      
      if (Box && Box == quest?.progress && !quest?.received) {
        data.credits += Math.floor(quest.reward);
        await schema.findOneAndUpdate(
          { userID: interaction.user.id, "progress.quests.id": 1 }, 
          { $set: { "progress.quests.$.received": true } }
        );
        data.progress.completed++;
        interaction.channel.send({
          content: `\\💰 You've completed a quest and received **${quest.reward}** Credits as reward!`
        });
      }
      
      await data.save()
        .then(() => {
          interaction.editReply({ 
            content: `🎣 **${interaction.user.tag}**, you caught: **${rare[0]}** from the Pool and got 💰 **${moneyget}**!`
          });
        })
        .catch((err) => interaction.editReply({ 
          content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
        }));
    } else if (Math.random() * 100 < 2) {
      const epic = ["EpicFish 🐠"];
      moneyget = Math.floor(Math.random() * 650) + 250;
      data.credits += Math.floor(moneyget);
      
      if (quest?.current < quest?.progress) {
        Box++;
        await schema.findOneAndUpdate(
          { userID: interaction.user.id, "progress.quests.id": 1 }, 
          { $inc: { "progress.quests.$.current": 1 } }
        );
      }
      
      if (Box && Box == quest?.progress && !quest?.received) {
        data.credits += Math.floor(quest.reward);
        await schema.findOneAndUpdate(
          { userID: interaction.user.id, "progress.quests.id": 1 }, 
          { $set: { "progress.quests.$.received": true } }
        );
        data.progress.completed++;
        interaction.channel.send({
          content: `\\💰 You've completed a quest and received **${quest.reward}** Credits as reward!`
        });
      }
      
      await data.save()
        .then(() => {
          interaction.editReply({ 
            content: `🎣 **${interaction.user.tag}**, you caught: **${epic[0]}** from the Pool and got 💰 **${moneyget}**!`
          });
        })
        .catch((err) => interaction.editReply({ 
          content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
        }));
    } else if (Math.random() * 100 < 0.80) {
      const legendary = ["LegendaryFish 🐟"];
      moneyget = Math.floor(Math.random() * 890) + 560;
      data.credits += Math.floor(moneyget);
      
      if (quest?.current < quest?.progress) {
        Box++;
        await schema.findOneAndUpdate(
          { userID: interaction.user.id, "progress.quests.id": 1 }, 
          { $inc: { "progress.quests.$.current": 1 } }
        );
      }
      
      if (Box && Box == quest?.progress && !quest?.received) {
        data.credits += Math.floor(quest.reward);
        await schema.findOneAndUpdate(
          { userID: interaction.user.id, "progress.quests.id": 1 }, 
          { $set: { "progress.quests.$.received": true } }
        );
        data.progress.completed++;
        interaction.channel.send({
          content: `\\💰 You've completed a quest and received **${quest.reward}** Credits as reward!`
        });
      }
      
      await data.save()
        .then(() => {
          interaction.editReply({ 
            content: `🎣 **${interaction.user.tag}**, you caught: **${legendary[0]}** from the Pool and got 💰 **${moneyget}**!`
          });
        })
        .catch((err) => interaction.editReply({ 
          content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
        }));
    } else if (Math.random() * 100 < 0.20) {
      const Mythic = ["MythicFish 🐋"];
      moneyget = Math.floor(Math.random() * 1500) + 860;
      data.credits += Math.floor(moneyget);
      
      if (quest?.current < quest?.progress) {
        Box++;
        await schema.findOneAndUpdate(
          { userID: interaction.user.id, "progress.quests.id": 1 }, 
          { $inc: { "progress.quests.$.current": 1 } }
        );
      }
      
      if (Box && Box == quest?.progress && !quest?.received) {
        data.credits += Math.floor(quest.reward);
        await schema.findOneAndUpdate(
          { userID: interaction.user.id, "progress.quests.id": 1 }, 
          { $set: { "progress.quests.$.received": true } }
        );
        data.progress.completed++;
        interaction.channel.send({
          content: `\\💰 You've completed a quest and received **${quest.reward}** Credits as reward!`
        });
      }
      
      await data.save()
        .then(() => {
          interaction.editReply({ 
            content: `🎣 **${interaction.user.tag}**, you caught: **${Mythic[0]}** from the Pool and got 💰 **${moneyget}**!`
          });
        })
        .catch((err) => interaction.editReply({ 
          content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
        }));
    } else {
      interaction.editReply({ 
        content: `🚫 **${interaction.user.tag}**, you caught: **😞 Nothing**`
      });
    }
  },
}; 