const discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const moment = require('moment');
const schema = require('../../schema/Economy-Schema');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "tip",
    description: "Send a tip to your friend",
    dmOnly: false,
    guildOnly: true,
    cooldown: 30,
    group: "Economy",
    requiresDatabase: true,
    clientPermissions: [],
    permissions: [],
    options: [
      {
        name: "user",
        description: "The user you want to tip",
        type: 6, // USER
        required: true
      }
    ]
  },
  async execute(client, interaction) {
    let tipper;
    let Friend;
    
    try {
      tipper = await schema.findOne({
        userID: interaction.user.id,
      });
      if (!tipper) {
        tipper = await schema.create({
          userID: interaction.user.id,
        });
      }
    } catch (err) {
      interaction.reply({
        content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name }),
        ephemeral: true
      });
      return client.logDetailedError({
        error: err,
        eventType: "DATABASE_ERR",
        interaction: interaction
      });
    }
    
    const now = Date.now();
    const quest = tipper.progress.quests?.find(x => x.id == 4);
    let Box = quest?.current;
    
    if (tipper.tips.timestamp !== 0 && tipper.tips.timestamp - now > 0) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_TIP_COOLDOWN", interaction.guild?.id, {
          username: interaction.user.tag,
          time: moment.duration(tipper.tips.timestamp - now).format('H [hours,] m [minutes, and] s [seconds]')
        }),
        ephemeral: true
      });
    }
    
    const member = interaction.options.getMember("user");
    
    if (!member) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_TIP_USER_NOT_FOUND", interaction.guild?.id, {
          username: interaction.user.tag
        }),
        ephemeral: true
      });
    } else if (member.id === interaction.user.id) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_TIP_SELF", interaction.guild?.id, {
          username: interaction.user.tag
        }),
        ephemeral: true
      });
    } else if (member.user.bot) {
      return interaction.reply({
        content: client.language.getString("ECONOMY_TIP_BOT", interaction.guild?.id, {
          username: interaction.user.tag
        }),
        ephemeral: true
      });
    }
    
    try {
      Friend = await schema.findOne({
        userID: member.id
      });
      if (!Friend) {
        Friend = await schema.create({
          userID: member.id
        });
      }
    } catch (err) {
      interaction.reply({
        content: client.language.getString("ERR_DB", interaction.guild?.id, { error: err.name }),
        ephemeral: true
      });
      return client.logDetailedError({
        error: err,
        eventType: "DATABASE_ERR",
        interaction: interaction
      });
    }
    
    // Update quest progress
    if (quest?.current < quest?.progress) {
      Box++;
      await schema.findOneAndUpdate(
        { userID: interaction.user.id, "progress.quests.id": 4 }, 
        { $inc: { "progress.quests.$.current": 1 } }
      );
    }
    
    if (Box && Box == quest?.progress && !quest?.received) {
      tipper.credits += Math.floor(quest.reward);
      await schema.findOneAndUpdate(
        { userID: interaction.user.id, "progress.quests.id": 4 }, 
        { $set: { "progress.quests.$.received": true } }
      );
      tipper.progress.completed++;
      await tipper.save();
      interaction.channel.send({
        content: client.language.getString("ECONOMY_QUEST_REWARD", interaction.guild?.id, { 
          reward: quest.reward 
        })
      });
    }
    
    tipper.tips.timestamp = now + 432e5; // 12 hours
    tipper.tips.given++;
    Friend.tips.received++;
    
    try {
      await Promise.all([Friend.save(), tipper.save()]);
      interaction.reply({
        content: client.language.getString("ECONOMY_TIP_SUCCESS", interaction.guild?.id, {
          username: interaction.user.tag,
          target: member.user.tag
        })
      });
    } catch (err) {
      interaction.reply({
        content: client.language.getString("ECONOMY_DB_SAVE_ERROR", interaction.guild?.id, { error: err.name }),
        ephemeral: true
      });
    }
  },
}; 