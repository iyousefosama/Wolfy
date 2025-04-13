const discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const schema = require('../../schema/Economy-Schema')
const moment = require("moment");
const market = require('../../assets/json/market.json');

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "daily",
    description: "Get your daily reward!",
    dmOnly: false,
    guildOnly: false,
    cooldown: 0,
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
    const now = Date.now();
    const duration = Math.floor(86400000);

    if (data.timer.daily.timeout > now) {
      const embed = new discord.EmbedBuilder()
        .setTitle(client.language.getString("ECONOMY_DAILY_ALREADY_TITLE", interaction.guild?.id))
        .setDescription(
          client.language.getString("ECONOMY_DAILY_ALREADY_DESC", interaction.guild?.id, {
            username: interaction.user.tag,
            time: moment.duration(data.timer.daily.timeout - now, "milliseconds")
              .format("H [hours,] m [minutes, and] s [seconds]")
          })
        )
        .setFooter({
          text: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({
            dynamic: true,
            size: 2048,
          }),
        })
        .setColor("Red");
      interaction.reply({ embeds: [embed] });
    } else {
      let moneyget = Math.floor(500);
      const previousStreak = data.streak.current;
      const rewardables = market.filter((x) => ![1, 6].includes(x.id));
      const item = rewardables[Math.floor(Math.random() * rewardables.length)];
      (streakreset = false), (itemreward = false);
      const quest = data.progress.quests?.find((x) => x.id == 8);
      let Box = quest?.current;

      if (data.streak.timestamp + 864e5 < now) {
        data.streak.current = 1;
        streakreset = true;
      }

      if (!streakreset) {
        data.streak.current++;
        if (!(data.streak.current % 10)) {
          itemreward = true;
          const old = data.profile.inventory.find((x) => x.id === item.id);
          if (old) {
            //Do nothing..
          } else {
            data.profile.inventory.push({
              id: item.id,
            });
          }
        }
      }

      if (data.streak.alltime < data.streak.current) {
        data.streak.alltime = data.streak.current;
      }

      data.streak.timestamp = now + 72e6;
      const amount = moneyget + 30 * data.streak.current;

      if (quest?.current < quest?.progress) {
        Box++;
        await schema.findOneAndUpdate(
          { userID: interaction.user.id, "progress.quests.id": 8 },
          { $inc: { "progress.quests.$.current": 1 } }
        );
      }
      if (Box && Box == quest?.progress && !quest?.received) {
        data.credits += Math.floor(quest.reward);
        await schema.findOneAndUpdate(
          { userID: interaction.user.id, "progress.quests.id": 8 },
          { $set: { "progress.quests.$.received": true } }
        );
        data.progress.completed++;
        interaction.channel.send({
          content: client.language.getString("ECONOMY_QUEST_REWARD", interaction.guild?.id, { 
            reward: quest.reward 
          }),
        });
      }
      data.timer.daily.timeout = Date.now() + duration;
      data.credits += Math.floor(amount);
      await data
        .save()
        .then(() => {
          const embed = new discord.EmbedBuilder()
            .setTitle(client.language.getString("ECONOMY_DAILY_CLAIMED_TITLE", interaction.guild?.id))
            .setDescription(
              client.language.getString("ECONOMY_DAILY_CLAIMED_DESC", interaction.guild?.id, {
                username: interaction.user.tag,
                amount: Math.floor(amount),
                item_reward: itemreward 
                  ? client.language.getString("ECONOMY_DAILY_ITEM_REWARD", interaction.guild?.id, {
                      item_name: item.name,
                      item_desc: item.description
                    })
                  : "",
                streak_status: streakreset
                  ? client.language.getString("ECONOMY_DAILY_STREAK_LOST", interaction.guild?.id)
                  : client.language.getString("ECONOMY_DAILY_STREAK_CURRENT", interaction.guild?.id, {
                      streak: data.streak.current
                    })
              })
            )
            .setFooter({
              text: client.language.getString("ECONOMY_DAILY_FOOTER", interaction.guild?.id),
              iconURL: interaction.user.displayAvatarURL({
                dynamic: true,
                size: 2048,
              }),
            })
            .setColor("#E6CEA0");
          interaction.reply({ embeds: [embed] });
        })
        .catch((err) =>
          interaction.reply({
            content: client.language.getString("ECONOMY_DB_SAVE_ERROR", interaction.guild?.id, { 
              error: err.message 
            })
          })
        );
    }
  },
};
