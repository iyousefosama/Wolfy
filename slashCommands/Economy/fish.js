const discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
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
        content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name })
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
        .setTitle(client.language.getString("ECONOMY_FISH_MISSING_ITEM_TITLE", interaction.guild?.id))
        .setDescription(client.language.getString("ECONOMY_FISH_MISSING_ITEM_DESC", interaction.guild?.id, {
          username: interaction.user.username
        }))
        .setFooter({ 
          text: interaction.user.username, 
          iconURL: interaction.user.displayAvatarURL({dynamic: true, size: 2048}) 
        })
        .setColor('Red');
      return interaction.reply({ embeds: [nulle] });
    }

    await interaction.reply({ 
      content: client.language.getString("ECONOMY_FISH_STARTED", interaction.guild?.id) 
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
            content: client.language.getString("ECONOMY_FISH_CAUGHT", interaction.guild?.id, {
              username: interaction.user.tag,
              catch: trash,
              amount: moneyget
            })
          });
        })
        .catch((err) => interaction.editReply({ 
          content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name })
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
          content: client.language.getString("ECONOMY_QUEST_REWARD", interaction.guild?.id, { 
            reward: quest.reward 
          })
        });
      }
      
      await data.save()
        .then(() => {
          interaction.editReply({ 
            content: client.language.getString("ECONOMY_FISH_CAUGHT", interaction.guild?.id, {
              username: interaction.user.tag,
              catch: common[0],
              amount: moneyget
            })
          });
        })
        .catch((err) => interaction.editReply({ 
          content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name })
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
          content: client.language.getString("ECONOMY_QUEST_REWARD", interaction.guild?.id, { 
            reward: quest.reward 
          })
        });
      }
      
      await data.save()
        .then(() => {
          interaction.editReply({ 
            content: client.language.getString("ECONOMY_FISH_CAUGHT", interaction.guild?.id, {
              username: interaction.user.tag,
              catch: uncommon[0],
              amount: moneyget
            })
          });
        })
        .catch((err) => interaction.editReply({ 
          content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name })
        }));
    } else if (Math.random() * 100 < 12) {
      const rare = ["RareFish <:fish:886630455795933264>"];
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
          content: client.language.getString("ECONOMY_QUEST_REWARD", interaction.guild?.id, { 
            reward: quest.reward 
          })
        });
      }
      
      await data.save()
        .then(() => {
          interaction.editReply({ 
            content: client.language.getString("ECONOMY_FISH_CAUGHT", interaction.guild?.id, {
              username: interaction.user.tag,
              catch: rare[0],
              amount: moneyget
            })
          });
        })
        .catch((err) => interaction.editReply({ 
          content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name })
        }));
    } else if (Math.random() * 100 < 2) {
      const epic = ["EpicFish <:e_:886630455175159818>"];
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
          content: client.language.getString("ECONOMY_QUEST_REWARD", interaction.guild?.id, { 
            reward: quest.reward 
          })
        });
      }
      
      await data.save()
        .then(() => {
          interaction.editReply({ 
            content: client.language.getString("ECONOMY_FISH_CAUGHT", interaction.guild?.id, {
              username: interaction.user.tag,
              catch: epic[0],
              amount: moneyget
            })
          });
        })
        .catch((err) => interaction.editReply({ 
          content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name })
        }));
    } else if (Math.random() * 100 < 0.80) {
      const legendary = ["LegendaryFish <:fish:892685979918426112>"];
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
          content: client.language.getString("ECONOMY_QUEST_REWARD", interaction.guild?.id, { 
            reward: quest.reward 
          })
        });
      }
      
      await data.save()
        .then(() => {
          interaction.editReply({ 
            content: client.language.getString("ECONOMY_FISH_CAUGHT", interaction.guild?.id, {
              username: interaction.user.tag,
              catch: legendary[0],
              amount: moneyget
            })
          });
        })
        .catch((err) => interaction.editReply({ 
          content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name })
        }));
    } else if (Math.random() * 100 < 0.20) {
      const Mythic = ["MythicFish <:carp:892687082621902859>"];
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
          content: client.language.getString("ECONOMY_QUEST_REWARD", interaction.guild?.id, { 
            reward: quest.reward 
          })
        });
      }
      
      await data.save()
        .then(() => {
          interaction.editReply({ 
            content: client.language.getString("ECONOMY_FISH_CAUGHT", interaction.guild?.id, {
              username: interaction.user.tag,
              catch: Mythic[0],
              amount: moneyget
            })
          });
        })
        .catch((err) => interaction.editReply({ 
          content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name })
        }));
    } else {
      interaction.editReply({ 
        content: client.language.getString("ECONOMY_FISH_NOTHING", interaction.guild?.id, {
          username: interaction.user.tag
        })
      });
    }
  },
}; 