const discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const schema = require('../../schema/Economy-Schema')
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const { colors } = require('../../util/constants/constants');

const market = require('../../assets/json/market.json');

dayjs.extend(duration);

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
        content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
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
        .setColor(colors.ERROR)
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setTitle(`🪙 Daily already Claimed!`)
        .setDescription(
          `❌ **${interaction.user.tag}**, You already **claimed** your daily reward!\n\n⚠️ Your daily will reset in ${dayjs.duration(data.timer.daily.timeout - now, "milliseconds").format("H [hours,] m [minutes, and] s [seconds]")}`
        )
        .setFooter({
          text: `Requested by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL({
            dynamic: true,
            size: 2048,
          }),
        })
        .setTimestamp()
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
          content: `✅ You received: 💰 ${quest.reward} from this command quest.`,
        });
      }
      data.timer.daily.timeout = Date.now() + duration;
      data.credits += Math.floor(amount);
      await data
        .save()
        .then(() => {
          const embed = new discord.EmbedBuilder()
            .setColor(colors.ECONOMY)
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTitle(`🪙 Claimed daily!`)
            .setDescription(
              `💰 **${interaction.user.tag}**, You received **${Math.floor(amount)}** from daily reward!${itemreward ? `\n✅ You received: **${item.name} - ${item.description}** from daily rewards.` : ""}${streakreset ? `\n⚠️ **Streak Lost**: You haven't got your succeeding daily reward.` : `\n🔥 Current Daily Streak (x${data.streak.current})`}`
            )
            .setFooter({
              text: `Requested by ${interaction.user.username}`,
              iconURL: interaction.user.displayAvatarURL({
                dynamic: true,
                size: 2048,
              }),
            })
            .setTimestamp()
          interaction.reply({ embeds: [embed] });
        })
        .catch((err) =>
          interaction.reply({
            content: `❌ [DATABASE_ERR]: Unable to save the document to the database. Please try again later! ${err.message}`
          })
        );
    }
  },
};
